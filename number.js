var rand = 0;

function speak(text) {
  var synthes = new SpeechSynthesisUtterance();
  synthes.text = text;
  synthes.lang = 'en-US';
  speechSynthesis.speak(synthes);
}

function makerand() {
  rand = 1 + Math.floor( Math.random() * 998 );
}

$(function() {             // For Listen

  $('.input').hide();

  $('.btn-start').click(function(){
    $('.btn-start').fadeOut('normal', function(){
      $('.input').show(0, function(){
        $('.input').focus();
        makerand();
        speak(rand);

        $('.input').on("keydown", function(e) {
        	if(e.keyCode === 13) {
            var inputval = $('.input').val();
            if(inputval === ''){
              // Nothing
            } else if(inputval != rand){                    // If wrong
              $('.input').val('');
              speak(rand);
              $('.inputp').addClass('has-error');
            } else {                                        //If correct
              $('.input').val('');
              makerand();
              speak(rand);
              $('.inputp').removeClass('has-error');
            }
        	}
        });

      });
    });
  });

});

$(function() {             // For Speak

  $(document).on("click keydown", function(e) {
  	if(typeof e.keyCode === "undefined" || e.keyCode === 13) {
      if ($('#speak').hasClass('active')) {
        makerand();
        $('.disp').text(rand);
      }
    }
  });


});
