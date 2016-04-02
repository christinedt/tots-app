$(document).ready(function(){
    var selfTotSettings = {},
        hue,
        $inputHue = $('#inputHue'),
        $inputConfidence = $('#inputConfidence'),
        $inputSensitivity = $('#inputSensitivity'),
        $inputSociability = $('#inputSociability'),
        $inputs = $(".form-input");

    $inputHue.on('input', function(){
        hue = "hsl(" + $inputHue.val() + ", 100%, 50%)";

        $inputHue.css('background-color', hue);
        console.log($inputHue.val());
        selfTotSettings.personality = $inputHue.val()/360 * 255;
    });

    $("#submit").click(function(){
        selfTotSettings = {
            'personality': $inputHue.val()/360 * 255,
            'confidence': $inputConfidence.val(),
            'sensitivity': $inputSensitivity.val(),
            'sociability': $inputSociability.val()
        }

        console.log(selfTotSettings);

        $.post('/load', {selfTotSettings: selfTotSettings}, function(data){        
            if(data==='done'){

                // fade to black
                $('.black-screen').addClass('visible').animate({ opacity: 1 }, 1000, 'swing', function(){

                    // go to the first screen
                    window.location.href="/looking";
                });

            }
        });
    });
});