var inputCharLimit = function (elem, str){
  $(elem).keypress(function(e) {
    var st = String.fromCharCode(e.which);
    if (str.indexOf(st,0) < 0) return false;
    return true;
  });
};

// テキスト操作
$(function () {

  // クラス追加
  $('#text-manipulation button').addClass('btn-default');

  var prevTxt;

  var getTxt = function () { return $('.input-text').val(); },
      getPw  = function () { return $('.input-password').val(); },
      setTxt = function (i) {
        prevTxt = $('.input-text').val();
        $('.input-text').val(i);
      };

  $('.undo').on('click', function() {
    if (prevTxt !== undefined) {
      setTxt(prevTxt);
      countTxt();
    }
  });

  // String.fromCodePoint非対応ブラウザへの対応
  if (!String.fromCodePoint) {
    var stringFromCharCode = String.fromCharCode;
    var floor = Math.floor;
    var fromCodePoint = function() {
      var MAX_SIZE = 0x4000,
          codeUnits = [],
          index = -1,
          length = arguments.length;
      var highSurrogate, lowSurrogate;
      if (!length) { return ''; }
      var result = '';
      while (++index < length) {
        var codePoint = Number(arguments[index]);
        if ( !isFinite(codePoint) || codePoint < 0 || codePoint > 0x10FFFF || floor(codePoint) != codePoint ) {
          throw RangeError('Invalid code point: ' + codePoint);
        }
        if (codePoint <= 0xFFFF) {
          codeUnits.push(codePoint);
        } else {
          codePoint -= 0x10000;
          highSurrogate = (codePoint >> 10) + 0xD800;
          lowSurrogate = (codePoint % 0x400) + 0xDC00;
          codeUnits.push(highSurrogate, lowSurrogate);
        }
        if (index + 1 == length || codeUnits.length > MAX_SIZE) {
          result += stringFromCharCode.apply(null, codeUnits);
          codeUnits.length = 0;
        }
      }
      return result;
    };
    String.fromCodePoint = fromCodePoint;
  }

  // サロゲートペア・異体字セレクタに対応したlength
  String.prototype.fixed_length = function() {
    var x = this.match(/[\ud800-\udb3f\udb41-\udbff]/g);    // サロゲートペアから異体字セレクタを引いたもの
    if (x !== null) {x = x.length;} else {x = 0;}
    return this.replace(/[\ud800-\udfff\u180b-\u180d\ufe00-\ufe0f]/g, '').length + x;
  };

  // テキストのカウントfunction
  var countTxt = function () {
    var val = getTxt();
    $('.info-length').text('文字数：' + val.fixed_length());
    $('.info-line').text('行数：' + val.split('\n').length);
  };

  // テキストの更新時にカウント
  $('.input-text').on('input', function () {
    countTxt();
  });

  //文字列置換
  $('.replace-str').on('click', function () {
    var replacein = $('.replace-in').val();
    var replaceout = $('.replace-out').val();
    var out = getTxt().split(replacein).join(replaceout);
    setTxt(out);
    countTxt();
  });

  // 空行削除
  $('.empty-del').on('click', function () {
    setTxt(getTxt().replace(/\n\n/g, '\n'));
    countTxt();
  });

  // 改行削除
  $('.return-del').on('click', function () {
    setTxt(getTxt().replace(/\n/g, ''));
    countTxt();
  });

  // 重複行削除
  $('.duplicates-del').on('click', function () {
    var a = getTxt().split('\n');
    var b = a.filter(function (x, i, self) {
      return self.indexOf(x) === i;
    });
    setTxt(b.join('\n'));
    countTxt();
  });

  // 行並べ替え（昇順）
  $('.sort-asc').on('click', function () {
    setTxt(getTxt().split('\n').sort().join('\n'));
  });

  // 行並べ替え（降順）
  $('.sort-desc').on('click', function () {
    setTxt(getTxt().split('\n').sort().reverse().join('\n'));
  });

  // 行シャッフル
  $('.line-shuffle').on('click', function () {
    var array = getTxt().split('\n');
    var n = array.length, t, i;
    while (n) {
      i = Math.floor(Math.random() * n--);
      t = array[n];
      array[n] = array[i];
      array[i] = t;
    }
    setTxt(array.join('\n'));
  });

  // Unicode(\uXXXXXX)
  var uc_e = function(str) {
    // var i = 0, len = str.length, points = '';
    // while (i < len) {
    //   var x = str.charCodeAt(i++);
    //   if (0xD800 <= x && x < 0xDC00) {
    //     var y = str.charCodeAt(i++);
    //     points += '\\u' + (0x10000 + ((x & 0x3FF) << 10) | (y & 0x3FF));
    //   } else {
    //     points += '\\u' + x;
    //   }
    // }
    // return points;
    var code, pref = {1: '\\u000', 2: '\\u00', 3: '\\u0', 4: '\\u'};
    return str.replace(/\W/g, function(c) {
      return pref[(code = c.charCodeAt(0).toString(16)).length] + code;
    });
  };
  var uc_d = function(str) {
    // return unescape(str.replace(/\\u([\d\w]+)/gi, function (match, grp) {
    //   return String.fromCodePoint(parseInt(grp, 10));
    // }));
    return str.replace(/\\u([a-fA-F0-9]{4})/g, function(m0, m1) {
      return String.fromCharCode(parseInt(m1, 16));
    });
  };

  // HTML(&#NNNN;)
  var html_10_e = function(str) {
    var i = 0, len = str.length, points = '';
    while (i < len) {
      var x = str.charCodeAt(i++);
      if (0xD800 <= x && x < 0xDC00) {
        var y = str.charCodeAt(i++);
        points += '&#' + (0x10000 + ((x & 0x3FF) << 10) | (y & 0x3FF)) + ';';
      } else {
        points += '&#' + x + ';';
      }
    }
    return points;
  };
  var html_10_d = function(str) {
    return unescape(str.replace(/&#([\d]{2,7});/g, function (match, grp) {
      return String.fromCodePoint(parseInt(grp, 10));
    }));
  };

  // HTML(&#xXXXXX;)
  var html_16_e = function(str) {
    var i = 0, len = str.length, points = '';
    while (i < len) {
      var x = str.charCodeAt(i++);
      if (0xD800 <= x && x < 0xDC00) {
        var y = str.charCodeAt(i++);
        points += '&#x' + (0x10000 + ((x & 0x3FF) << 10) | (y & 0x3FF)).toString(16) + ';';
      } else {
        points += '&#x' + x.toString(16) + ';';
      }
    }
    return points;
  };
  var html_16_d = function(str) {
    return unescape(str.replace(/&#x([\w]{1,5});/g, function (match, grp) {
      return String.fromCodePoint(parseInt(grp, 16));
    }));
  };

  // HTML(&lt;&gt;&amp;)
  var html_e = function(str) {
    return $('<div>').text(str).html();
  };
  var html_d = function(str) {
    return $('<div>').html(str).text();
  };

  // AES
  $('.aes-e').on('click', function () { setTxt(CryptoJS.AES.encrypt(getTxt(), getPw())); countTxt(); });
  $('.aes-d').on('click', function () { setTxt(CryptoJS.AES.decrypt(getTxt(), getPw()).toString(CryptoJS.enc.Utf8)); countTxt(); });

  // Base64
  $('.b64-e').on('click', function () { setTxt(CryptoJS.enc.Utf8.parse(getTxt()).toString(CryptoJS.enc.Base64)); countTxt(); });
  $('.b64-d').on('click', function () { setTxt(CryptoJS.enc.Base64.parse(getTxt()).toString(CryptoJS.enc.Utf8)); countTxt(); });

  // Hex
  $('.hex-e').on('click', function () { setTxt(CryptoJS.enc.Utf8.parse(getTxt()).toString(CryptoJS.enc.Hex)); countTxt(); });
  $('.hex-d').on('click', function () { setTxt(CryptoJS.enc.Hex.parse(getTxt()).toString(CryptoJS.enc.Utf8)); countTxt(); });

  // Unicode(\uXXXX)
  $('.uc-e').on('click', function () { setTxt(uc_e(getTxt())); countTxt(); });
  $('.uc-d').on('click', function () { setTxt(uc_d(getTxt())); countTxt(); });

  // URL(%xx)
  $('.url-e').on('click', function () { setTxt(encodeURIComponent(getTxt())); countTxt(); });
  $('.url-d').on('click', function () { setTxt(decodeURIComponent(getTxt())); countTxt(); });

  // HTML(&lt;&gt;&amp;)
  $('.html-e').on('click', function () { setTxt(html_e(getTxt())); countTxt(); });
  $('.html-d').on('click', function () { setTxt(html_d(getTxt())); countTxt(); });

  // Punycode
  $('.puny-e').on('click', function () { setTxt('xn--' + punycode.encode(getTxt())); countTxt(); });
  $('.puny-d').on('click', function () { setTxt(punycode.decode(getTxt().replace('xn--', ''))); countTxt(); });

  // HTML10進法(&#NNNNN;)
  $('.html-10-e').on('click', function () { setTxt(html_10_e(getTxt())); countTxt(); });
  $('.html-10-d').on('click', function () { setTxt(html_10_d(getTxt())); countTxt(); });

  // HTML16進法(&#xXXXX;)
  $('.html-16-e').on('click', function () { setTxt(html_16_e(getTxt())); countTxt(); });
  $('.html-16-d').on('click', function () { setTxt(html_16_d(getTxt())); countTxt(); });

  // MD5
  $('.md5-hex-e').on('click', function () { setTxt(CryptoJS.MD5(getTxt())); countTxt(); });
  $('.md5-b64-e').on('click', function () { setTxt(CryptoJS.MD5(getTxt()).toString(CryptoJS.enc.Base64)); countTxt(); });

  // SHA-1
  $('.sha1-hex-e').on('click', function () { setTxt(CryptoJS.SHA1(getTxt())); countTxt(); });
  $('.sha1-b64-e').on('click', function () { setTxt(CryptoJS.SHA1(getTxt()).toString(CryptoJS.enc.Base64)); countTxt(); });

  // SHA-224
  $('.sha224-hex-e').on('click', function () { setTxt(CryptoJS.SHA224(getTxt())); countTxt(); });
  $('.sha224-b64-e').on('click', function () { setTxt(CryptoJS.SHA224(getTxt()).toString(CryptoJS.enc.Base64)); countTxt(); });

  // SHA-256
  $('.sha256-hex-e').on('click', function () { setTxt(CryptoJS.SHA256(getTxt())); countTxt(); });
  $('.sha256-b64-e').on('click', function () { setTxt(CryptoJS.SHA256(getTxt()).toString(CryptoJS.enc.Base64)); countTxt(); });

  // SHA-384
  $('.sha384-hex-e').on('click', function () { setTxt(CryptoJS.SHA384(getTxt())); countTxt(); });
  $('.sha384-b64-e').on('click', function () { setTxt(CryptoJS.SHA384(getTxt()).toString(CryptoJS.enc.Base64)); countTxt(); });

  // SHA-512
  $('.sha512-hex-e').on('click', function () { setTxt(CryptoJS.SHA512(getTxt())); countTxt(); });
  $('.sha512-b64-e').on('click', function () { setTxt(CryptoJS.SHA512(getTxt()).toString(CryptoJS.enc.Base64)); countTxt(); });

  // SHA-3(224)
  $('.sha3-224-hex-e').on('click', function () { setTxt(CryptoJS.SHA3(getTxt(), {outputLength:224})); countTxt(); });
  $('.sha3-224-b64-e').on('click', function () { setTxt(CryptoJS.SHA3(getTxt(), {outputLength:224}).toString(CryptoJS.enc.Base64)); countTxt(); });

  // SHA-3(256)
  $('.sha3-256-hex-e').on('click', function () { setTxt(CryptoJS.SHA3(getTxt(), {outputLength:256})); countTxt(); });
  $('.sha3-256-b64-e').on('click', function () { setTxt(CryptoJS.SHA3(getTxt(), {outputLength:256}).toString(CryptoJS.enc.Base64)); countTxt(); });

  // SHA-3(384)
  $('.sha3-384-hex-e').on('click', function () { setTxt(CryptoJS.SHA3(getTxt(), {outputLength:384})); countTxt(); });
  $('.sha3-384-b64-e').on('click', function () { setTxt(CryptoJS.SHA3(getTxt(), {outputLength:384}).toString(CryptoJS.enc.Base64)); countTxt(); });

  // SHA-3(512)
  $('.sha3-512-hex-e').on('click', function () { setTxt(CryptoJS.SHA3(getTxt())); countTxt(); });
  $('.sha3-512-b64-e').on('click', function () { setTxt(CryptoJS.SHA3(getTxt()).toString(CryptoJS.enc.Base64)); countTxt(); });

});

// 単位換算（バイト/ビット）
$(function() {
  inputCharLimit('.unitconv input', '0123456789.');
  $('.unitconv input').on('input', function() {
    var inputClass   = $(this).attr('class').replace(' form-control', ''),
        inputVal     = $(this).val();
        unitList    = {
          'byte':  8,
          'bit':   1,
          'kib':   8192,
          'mib':   8388608 ,
          'gib':   8589934592,
          'tib':   8796093022208,
          'kb':    8000,
          'mb':    8000000,
          'gb':    8000000000,
          'tb':    8000000000000,
          'kibit': 1024,
          'mibit': 1048576,
          'gibit': 1073741824,
          'tibit': 1099511627776,
          'kbit':  1008,
          'mbit':  1000000,
          'gbit':  1000000000,
          'tbit':  1000000000000
        };
    if (inputVal !== '') {
      var scale = unitList[inputClass];
      var bit   = inputVal * scale;
      for (var key in unitList){
        if (key !== inputClass) {
          $('.unitconv .' + key).val(bit / unitList[key]);
        }
      }
    } else {
      $('.unitconv input').val('');
    }
  });
});

// アスペクト比
$(function() {
  inputCharLimit('.input-height, .input-width, .input-zoom', '0123456789.');
  $(".input-height, .input-width, .input-zoom").on('input', function () {

    // 変数に入れておく
    var input_height = $('.input-height').val(),
        input_width = $('.input-width').val(),
        input_zoom = $('.input-zoom').val();

    // 最大公約数
    var gcd = function (a, b) {
      return (a == b) ? a : gcd(Math.abs(a - b), (a > b) ? b : a);
    };

    // どちらも入っている場合に、解像度 / 最大公約数 = アスペクト比
    if(input_height === '' || input_width === '') {
      $('.current-aspect').val('');
    } else {
      input_gcd = gcd(input_height, input_width);
      $('.current-aspect').text(input_height / input_gcd + "：" + input_width / input_gcd);
    }

    // どちらかしか入っていない場合に、値 * 係数 = もう片方の値
    if( (input_height === '' && input_width === '') || (input_height !== '' && input_width !== '') ){
      $('.16-9-resolution, .4-3-resolution, .3-2-resolution, .golden-ratio, .silver-ratio').text('');
    } else {
      if(input_height !== '') {
        $('.16-9-resolution').text(input_height + '：' + Math.round(input_height / 16 * 9 * 100) / 100);
        $('.4-3-resolution').text(input_height + '：' + Math.round(input_height / 4 * 3 * 100) / 100);
        $('.3-2-resolution').text(input_height + '：' + Math.round(input_height / 3 * 2 * 100) / 100);
        $('.golden-ratio').text(input_height + '：' + Math.round(input_height * 1.618 * 100) / 100);
        $('.silver-ratio').text(input_height + '：' + Math.round(input_height * 1.4142 * 100) / 100);
      } else {
        $('.16-9-resolution').text(Math.round(input_width / 9 * 16 * 100) / 100 + '：' + input_width);
        $('.4-3-resolution').text(Math.round(input_width / 3 * 4 * 100) / 100 + '：' + input_width);
        $('.3-2-resolution').text(Math.round(input_width / 2 * 3 * 100) / 100 + '：' + input_width);
        $('.golden-ratio').text(Math.round(input_width / 1.618 * 100) / 100 + '：' + input_width);
        $('.silver-ratio').text(Math.round(input_width / 1.4142 * 100) / 100 + '：' + input_width);
      }
    }

    // 解像度 * 倍率 = リサイズ後の解像度
    if(input_zoom === '') {
      $('.resized-resolution').text('');
    } else {
      $('.resized-resolution').text(input_height * input_zoom + "：" +input_width * input_zoom);
    }

  });

});

// カラーピッカー
$(function () {
  $(".color").ColorPickerSliders({
    flat: true,
    swatches: false,
    connectedinput: '.color-input'
  });
});

// 2/8/10/16進数変換
$(function() {
  $('.num-conv input').on('input', function() {
    var num = $(this).val();
    if (num !== '') {
      if ($(this).hasClass('binary'))      num = parseInt(num, 2);
      if ($(this).hasClass('octal'))       num = parseInt(num, 8);
      if ($(this).hasClass('decimal'))     num = parseInt(num, 10);
      if ($(this).hasClass('hexadecimal')) num = parseInt(num, 16);
      $('.binary').val(num.toString(2));
      $('.octal').val(num.toString(8));
      $('.decimal').val(num.toString(10));
      $('.hexadecimal').val(num.toString(16));
    } else {
      $('.num-conv input').val('');
    }
  });
  inputCharLimit('.binary', '01');
  inputCharLimit('.octal', '01234567');
  inputCharLimit('.decimal', '0123456789');
  inputCharLimit('.hexadecimal', '0123456789abcdef');
});

// 偏差値計算
$(function() {

  $('.deviation-calc input').on('input', function() {
    var deviation     = $('.deviation').val(),
        std_deviation = $('.std-deviation').val(),
        average       = $('.average').val(),
        score         = $('.score').val();

    if ($('.std-deviation-tab').hasClass('active')) { // 標準偏差
      $('.std-deviation').val( Math.round( (score - average) * 100 / (deviation - 50) ) / 10 );
    } else if ($('.deviation-tab').hasClass('active')) { // 偏差値 ((点数-平均点)/標準偏差*10+50)
        $('.deviation').val( Math.round( ((score - average) / std_deviation * 10 + 50) * 10 ) / 10 );
    } else if ($('.average-tab').hasClass('active')) { // 平均点
      $('.average').val( Math.round( 100 * score - (deviation - 50) * 10 * std_deviation) / 100 );
    } else if ($('.score-tab').hasClass('active')) { // 点数
      $('.score').val( Math.round( std_deviation * (deviation - 50) + (average) * 10 ) / 10 );
    }
  }); // on
});

// User Agent表示
$(function() {
  $('.useragent > button').on('click', function() {
    var ua = {
      "IE6": "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1)",
      "IE7": "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.0)",
      "IE8": "Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.1; Trident/4.0)",
      "IE9": "Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Trident/5.0)",
      "IE10": "Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; Trident/6.0)",
      "IE11": "Mozilla/5.0 (Windows NT 6.3; Trident/7.0; rv:11.0) like Gecko",
      "Chrome": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/37.0.2062.122 Safari/537.36",
      "Firefox": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.9; rv:32.0) Gecko/20100101 Firefox/32.0",
      "Safari": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_5) AppleWebKit/600.1.17 (KHTML, like Gecko) Version/7.1 Safari/537.85.10"
    };
    $('.useragent-result').val( ua[$(this).text()] );
  });
});
