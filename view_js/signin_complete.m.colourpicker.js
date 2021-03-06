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

        sliderHandle.css('left', ($(window).width() * currentRegHSL[i] / 100 - 7.5).toString() + 'px');
    });

    if(currentRegHSL[2] > 50) {
        $('#colour_picker .closeNavbar').css('color', 'black');
        $('.colour_slider').css('border-color', 'black');
        $('.slider_handle').css('border-color', 'black');
    } else {
        $('#colour_picker .closeNavbar').css('color', 'white');
        $('.colour_slider').css('border-color', 'white');
        $('.slider_handle').css('border-color', 'white');
    }
}

// Initiate colour picker

function initialiseColourView(barElem) {
    currentRegHSLuv = barElem.attr('colour_reg_hsluv').split(',').map(x => +x);
    prevRegHSLuv = [...currentRegHSLuv];

    $('.colour_slider').on('touchstart', (e, esupp) => {
        if(typeof e.touches == 'undefined') { e = esupp; e.target = $(esupp.target).parent().get(); }

        var sliderElem = $(e.target);
        
        var moveCallback = (ev) => {
            var t = ev.touches[0];

            ev.preventDefault();
            currentRegHSLuv[sliderElem.attr('id')] = t.pageX / $(window).width() * 100;
            updateColourView(currentRegHSLuv);
            
            if(t.pageX < 0 || t.pageX > $(window).width()) { $(window).off('touchmove'); }

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

    $('.slider_handle').on('mousedown', (e) => {
        e.preventDefault();
        $(e.target).parent().trigger('mousedown', e);
    })

    $(window).on('mouseup', (ev) => {
        $(window).off('mousemove');
    });

    updateColourView(currentRegHSLuv);
}

function addPastColour(regHsl) {
    $('.current_colour').after(`
        <input type="button" class="past_colour" colour_reg_hsluv="${regHsl.toString()}"
            style="background-color: ${hsluv.Hsluv.hsluvToHex(recoverHSLuv(regHsl))}"></div>
    `);

    var pastColourBoxes = $('.past_colour');

    if(pastColourBoxes.length > 6) {
        pastColourBoxes[pastColourBoxes.length - 1].remove();
    }

    pastColourBoxes.eq(0).on('click', (e) => {
        var cCElem = $('.current_colour');
        var cRegHsl = cCElem.attr('colour_reg_hsluv').split(',').map((v) => {
            return parseFloat(v);
        });
        var clickedElem = $(e.target);
        var clickedRegHsl = clickedElem.attr('colour_reg_hsluv').split(',').map((v) => {
            return parseFloat(v);
        });

        if(cRegHsl[0] != clickedRegHsl[0] || cRegHsl[1] != clickedRegHsl[1] || cRegHsl[2] != clickedRegHsl[2]) {
            // Swap current colour with clicked colour

            clickedElem.attr('colour_reg_hsluv', cRegHsl.toString());
            clickedElem.css('background-color', hsluv.Hsluv.hsluvToHex(recoverHSLuv(cRegHsl)));

            cCElem.attr('colour_reg_hsluv', clickedRegHsl.toString());
            cCElem.css('background-color', hsluv.Hsluv.hsluvToHex(recoverHSLuv(clickedRegHsl)));
        }
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

            $('#colour_picker .closeNavbar').on('click', colourPickerClosed);

            $('#colour_picker_veil').on('click', colourPickerClosed);
        });
    });

    var colourPickerClosed = function() {
        $('#colour_picker .closeNavbar').off('click');
        $('#colour_picker_veil').off('click');

        $(window).off('touchmove');
        $('.colour_slider').off('touchstart');
        $('.slider_handle').off('touchstart');

        if(prevRegHSLuv[0] != currentRegHSLuv[0] || prevRegHSLuv[1] != currentRegHSLuv[1] || prevRegHSLuv[2] != currentRegHSLuv[2]) { // a bit messy!
            addPastColour(prevRegHSLuv);
        }

        modalView.closeModal($('#colour_picker'), $('#colour_picker_veil'));
    };
}