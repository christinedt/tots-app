$(document).ready(function(){
    var selfTotSettings = {},
        hue,
        $inputHue = $('#inputHue'),
        $inputConfidence = $('#inputConfidence'),
        $inputSensitivity = $('#inputSensitivity'),
        $inputSociability = $('#inputSociability'),
        $inputs = $(".form-input");

    $inputHue.on('click', function(){
        hue = "hsl(" + $inputHue.val() + ", 100%, 50%)";

        $inputHue.css('background-color', hue);
        console.log($inputHue.val());
    });

    $("#submit").click(function(){
        selfTotSettings = {
            'personality': $inputHue.val(),
            'confidence': $inputConfidence.val(),
            'sensitivity': $inputSensitivity.val(),
            'sociability': $inputSociability.val()
        }

        console.log(selfTotSettings);

        $.post('/load', {selfTotSettings: selfTotSettings}, function(data){        
            if(data==='done'){
                window.location.href="/sketch";
            }
        });
    });
});