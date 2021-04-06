// ------------- Colour picker code ----------------

var currentRegHSLuv = [-1, -1, -1]; // Current colour that the colour selector is in, in HSLuv.
var prevRegHSLuv = [-1, -1, -1];

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

        sliderHandle.css('left', ($(window).width() * currentRegHSL[i] / 100 - 13.5).toString() + 'px');
    });

    if(currentRegHSL[2] > 50) {
        $('#colour_picker .closeNavbar').css('color', 'black');
    } else {
        $('#colour_picker .closeNavbar').css('color', 'white');
    }
}

// Initiate colour picker

function initialiseColourView(barElem) {
    currentRegHSLuv = barElem.attr('colour_reg_hsluv').split(',').map(x => +x);
    prevRegHSLuv = [...currentRegHSLuv];

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

function addPastColour(regHsl) {
    $('.current_colour').after(`
        <div class="past_colour" colour_reg_hsluv="${regHsl.toString()}"
            style="background-color: ${hsluv.Hsluv.hsluvToHex(recoverHSLuv(regHsl))}"></div>
    `);

    var pastColourBoxes = $('.past_colour');

    if(pastColourBoxes.length > 6) {
        pastColourBoxes[pastColourBoxes.length - 1].remove();
    }

    pastColourBoxes.eq(0).on('click', (e) => {
        var cCElem = $('.current_colour');
        var cRegHsl = cCElem.attr('colour_reg_hsluv');
        var clickedRegHsl = $(e.target).attr('colour_reg_hsluv');

        cCElem.attr('colour_reg_hsluv', clickedRegHsl);
        cCElem.css('background-color', hsluv.Hsluv.hsluvToHex(recoverHSLuv(clickedRegHsl)));
        addPastColour(cRegHsl);
    });
}


function initialiseColourPicker() {
    $('.pick_colour').each((i, e) => {
        var elem = $(e);

        var colour_hsluv = [Math.random() * 360, Math.random() * 100, Math.random() * 100];

        elem.css('background-color', hsluv.Hsluv.hsluvToHex(colour_hsluv));
        elem.attr('colour_reg_hsluv', regulariseHSLuv(colour_hsluv).toString());

        elem.on('click', (ev) => {
            modalView.openModal($('#colour_picker'), $('#colour_picker_veil'), '70%');

            initialiseColourView($(ev.target));
        });
    });

    var colourPickerClosed = function() {
        modalView.closeModal($('#colour_picker'), $('#colour_picker_veil'));
        $(window).off('touchmove');
        $('.colour_slider').off('touchstart');
        $('.slider_handle').off('touchstart');

        if(prevRegHSLuv[0] != currentRegHSLuv[0] || prevRegHSLuv[1] != currentRegHSLuv[1] || prevRegHSLuv[2] != currentRegHSLuv[2]) { // a bit messy!
            addPastColour(prevRegHSLuv);
        }
    };

    $('#colour_picker .closeNavbar').on('click', colourPickerClosed);

    $('#colour_picker_veil').on('click', colourPickerClosed);
}