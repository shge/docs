$(function() {
  // 自動クラス生成
  $('pre > code:not(.no-highlight)').addClass('prettyprint');
  $('h1').addClass('page-header');
  $('table:not(.no-table)').addClass('table table-striped table-condensed');
  $('input:not(.no-input)').addClass('form-control');
  $('button:not(.no-btn)').addClass('btn');

  // 目次生成
  $('#toc').tocify({
    scrollTo: 50,
    extendPage: false,
    selectors: 'h1',
    theme: 'jqueryui'
  });

  // スクロールアニメーション
    $('.tocify-item').click(function(){
  var speed = 500;
    var target = $(this)[0].dataset.unique;
    var position = $('div[name="' + target + '"]').next().offset().top - 55;
    $("html, body").animate({scrollTop: position}, speed, 'swing');
    return false;
  });

  // ボタンのfocus
  $('button').on('focus', function () {
      $(this).on('mouseout', function () {
        $(this)[0].blur();
      });
  });

  // メニュー読み込み
  $('#menu').html((function () {/*<li class="dropdown">
  <a href="#" class="dropdown-toggle" data-toggle="dropdown">プログラミング <span class="caret"></span></a>
  <ul class="dropdown-menu">
    <li><a href="ruby.html">Ruby</a>
    <li><a href="rails.html">Ruby on Rails</a>
    <li><a href="shell.html">Shell</a>
    <li><a href="php.html">PHP</a>
    <li><a href="basic.html">BASIC</a>
  </ul>
<li class="dropdown">
  <a href="#" class="dropdown-toggle" data-toggle="dropdown">Web <span class="caret"></span></a>
  <ul class="dropdown-menu">
    <li><a href="html.html">HTML</a>
    <li><a href="canvas.html">HTML5 Canvas</a>
    <li><a href="css.html">CSS</a>
    <li><a href="javascript.html">JavaScript</a>
    <li><a href="jquery.html">jQuery</a>
    <li><a href="jqueryui.html">jQueryUI</a>
    <li><a href="coffeescript.html">CoffeeScript</a>
  </ul>
<li class="dropdown">
  <a href="#" class="dropdown-toggle" data-toggle="dropdown">ツール <span class="caret"></span></a>
  <ul class="dropdown-menu">
    <li><a href="git.html">Git</a>
    <li><a href="markdown.html">Markdown</a>
    <li><a href="mysql.html">MySQL</a>
    <li><a href="sqlite.html">SQLite</a>
    <li><a href="sublimetext.html">Sublime Text</a>
    <li><a href="vagrant.html">Vagrant</a>
    <li><a href="vim.html">Vim</a>
    <li><a href="tool.html">ツール</a>
  </ul>
<li class="dropdown">
  <a href="#" class="dropdown-toggle" data-toggle="dropdown">その他 <span class="caret"></span></a>
  <ul class="dropdown-menu">
    <li><a href="regex.html">正規表現</a>
    <li><a href="english.html">英語</a>
    <li><a href="number.html">数字</a>
  </ul>
  <script async src="https://www.googletagmanager.com/gtag/js?id=UA-117094943-1"></script>
  <script>function gtag(){dataLayer.push(arguments)}window.dataLayer=window.dataLayer||[],gtag("js",new Date),gtag("config","UA-117094943-1");</script>*/}).toString().match(/\/\*([^]*)\*\//)[1]);

  // シンタックスハイライト
  prettyPrint();

  $('body > .container').append('<p>© 2019 shge.github.io  <a href="/terms.html">利用規約・プライバシー</a>');

});
