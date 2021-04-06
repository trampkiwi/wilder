// ------------- Colour picker code ----------------

var currentRegHSLuv = [0, 0, 0]; // Current colour that the colour selector is in, in HSLuv.

function regulariseHSLuv(Hsluv) {
    var modHsluv = [...Hsluv];
    modHsluv[0] = modHsluv[0] / 360 * 100;
    return modHsluv;
}

function recoverHSLuv(modHsluv) {
    var Hsluv = [...modHsluv];
    Hsluv[0] = Hsluv[0] / 100 * 360;
    return Hsluv;
}

// Updaate colour slider appearance based on currentHSLuv

function updateColourView(currentRegHSL) {
    $('#colour_display').css('background-color', hsluv.Hsluv.hsluvToHex(recoverHSLuv(currentRegHSL)));

    $('.colour_slider').each((i, slider) => {
        var sliderElem = $(slider);

        var gradientStr = 'linear-gradient(to right,';

        for(var j = 0; j <= 20; j++) {
            var gradRegHSL = [...currentRegHSL];
            gradRegHSL[i] = j / 20 * 100;

            gradientStr = gradientStr + hsluv.Hsluv.hsluvToHex(recoverHSLuv(gradRegHSL)) + ',';
        }

        gradientStr = gradientStr.substring(0, gradientStr.length - 1) + ')';
        
        sliderElem.css('background', gradientStr);

        var sliderHandle = sliderElem.find('.slider_handle');

        sliderHandle.css('left', ($(window).width() * currentRegHSL[i] / 100 - 14.5).toString() + 'px');
    });

    if(currentRegHSL[2] > 50) {
        $('.navBar .closeNavbar').css('color', 'black');
    } else {
        $('.navBar .closeNavbar').css('color', 'white');
    }
}

// Initiate colour picker

function initialiseColourView(barElem) {
    currentRegHSLuv = barElem.attr('colour_reg_hsluv').split(',').map(x => +x);

    $('.colour_slider').on('touchstart', (e, esupp) => {
        if(typeof e.pageX == 'undefined') { e = esupp; e.target = $(esupp.target).parent().get(); }

        var sliderElem = $(e.target);
        
        var moveCallback = (ev) => {
            ev.preventDefault();
            currentRegHSLuv[sliderElem.attr('id')] = ev.pageX / $(window).width() * 100;
            updateColourView(currentRegHSLuv);
            
            if(ev.pageX < 0 || ev.pageX > $(window).width()) { $(window).off('touchmove'); }

            barElem.attr('colour_reg_hsluv', currentRegHSLuv.toString());
            barElem.css('background-color', hsluv.Hsluv.hsluvToHex(recoverHSLuv(currentRegHSLuv)));
        };

        $(window).on('touchmove', moveCallback);

        moveCallback(e);
    });

    $('.slider_handle').on('touchstart', (e) => {
        e.preventDefault();
        $(e.target).parent().trigger('touchstart', e);
    })

    $(window).on('touchend', (ev) => {
        $(window).off('touchmove');
    });

    updateColourView(currentRegHSLuv);
}