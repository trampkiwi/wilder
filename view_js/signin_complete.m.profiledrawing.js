var cvsElem;
var cvsHistoryElem;
var ctx;
var historyCtx;
var hasInitialised = false;
var isSamplingColour = false;
var isFillMode = false;

var cCElem;

var pPrevTouch = { x: null, y: null };
var prevTouch = { x: null, y: null };
var cvsOffset;
var cvsOffsetCoords = {};
var touchCoords = {};

var scale; // Device pixel ratio

function activateSamplingMode() {
    $('.sample_colour').css('background-color', 'rgb(22, 22, 22)');
    $('.sample_colour .black').css('display', 'none');
    $('.sample_colour .white').css('display', 'inline-block');

    isSamplingColour = true;
}

function deactivateSamplingMode() {
    $('.sample_colour').css('background-color', 'rgba(0, 0, 0, 0)');
    $('.sample_colour .black').css('display', 'inline-block');
    $('.sample_colour .white').css('display', 'none');

    isSamplingColour = false;
}

function activateFillMode() {
    $('.flood_fill').css('background-color', 'rgb(22, 22, 22)');
    $('.flood_fill .black').css('display', 'none');
    $('.flood_fill .white').css('display', 'inline-block');

    isFillMode = true;
}

function deactivateFillMode() {
    $('.flood_fill').css('background-color', 'rgba(0, 0, 0, 0)');
    $('.flood_fill .black').css('display', 'inline-block');
    $('.flood_fill .white').css('display', 'none');

    isFillMode = false;
}

function activateBrushSize(elem) {
    $(elem).css('background-color', 'rgb(22, 22, 22)');
    $(elem).children('div').css('background-color', 'white');

    ctx.lineWidth = parseInt($(elem).attr('brush_weight')) * scale;
}

function deactivateBrushSize(elem) {
    $(elem).css('background-color', 'rgba(0, 0, 0, 0)');
    $(elem).children('div').css('background-color', 'rgb(22, 22, 22)');
}

function drawCallback(ev) {
    ev.preventDefault();

    touchCoords.x = ev.touches[0].pageX - cvsOffsetCoords.x;
    touchCoords.y = ev.touches[0].pageY - cvsOffsetCoords.y;

    var pPrevTouchExists = pPrevTouch.x != null && pPrevTouch.y != null;
    var prevTouchExists = prevTouch.x != null & prevTouch.y != null;

    if(pPrevTouchExists) {
        ctx.beginPath();
        ctx.moveTo(pPrevTouch.x * scale, pPrevTouch.y * scale);
        ctx.lineTo(prevTouch.x * scale, prevTouch.y * scale);
        ctx.lineTo(touchCoords.x * scale, touchCoords.y * scale);
        ctx.stroke();
    } else if(prevTouchExists) {
        ctx.beginPath();
        ctx.moveTo(prevTouch.x * scale, prevTouch.y * scale);
        ctx.lineTo(touchCoords.x * scale, touchCoords.y * scale);
        ctx.stroke();
    }

    pPrevTouch.x = prevTouch.x;
    pPrevTouch.y = prevTouch.y;

    prevTouch.x = touchCoords.x;
    prevTouch.y = touchCoords.y;
}

function sampleColourCallback(ev) {
    ev.preventDefault();

    touchCoords.x = ev.touches[0].pageX - cvsOffsetCoords.x;
    touchCoords.y = ev.touches[0].pageY - cvsOffsetCoords.y;

    var sampledColour = ctx.getImageData(touchCoords.x * scale, touchCoords.y * scale, 1, 1).data;
    var sampledColourReg = [];

    for(var i = 0; i < 3; i++) { sampledColourReg.push(sampledColour[i] / 255); }

    ctx.strokeStyle = `rgb(${sampledColour[0]}, ${sampledColour[1]}, ${sampledColour[2]})`;

    cCElem.attr('colour_reg_hsluv', regulariseHSLuv(hsluv.Hsluv.rgbToHsluv(sampledColourReg)).toString());
    

    cCElem.css('background-color', `rgb(${sampledColour[0]}, ${sampledColour[1]}, ${sampledColour[2]})`);
}

function initialiseProfileDrawingView() {
    cvsElem = $('#drawing_canvas');
    cvsHistoryElem = $('#drawing_canvas_history');

    $('.profile_pic_display').on('click', (e) => {
        modalView.openModal($('#drawing_view'), $('#drawing_view_veil'), '100%').then(() => {
            if(!hasInitialised) {
                var canvasContainer = $('#drawing_view .canvas_container');
                var containerWidth = canvasContainer.width();
                var containerHeight = canvasContainer.height();

                scale = window.devicePixelRatio;

                var dimension = Math.min(containerWidth, containerHeight);

                cvsElem.css('width', dimension);
                cvsElem.css('height', dimension);

                cvsElem.attr('width', dimension * scale);
                cvsElem.attr('height', dimension * scale);
                cvsHistoryElem.attr('width', dimension * scale);
                cvsHistoryElem.attr('height', dimension * scale);

                cvsElem.css('display', 'inline-block');

                ctx = cvsElem.get(0).getContext('2d');

                ctx.fillStyle = '#ffffff';
                ctx.fillRect(0, 0, cvsElem.attr('width'), cvsElem.attr('height'));

                ctx.lineJoin = 'round';
                ctx.lineCap = 'round';

                historyCtx = cvsHistoryElem.get(0).getContext('2d');

                historyCtx.fillStyle = '#ffffff';
                historyCtx.fillRect(0, 0, cvsHistoryElem.attr('width'), cvsHistoryElem.attr('height'));

                ctx.lineWidth = 3 * scale;

                hasInitialised = true;
            }
        });
    });

    var closeDrawingViewCallback = function() { // When drawing view is closed
        // Save canvas content to img tag
        $('.profile_pic_display').attr('src', cvsElem.get(0).toDataURL());

        // Close modal
        modalView.closeModal($('#drawing_view'), $('#drawing_view_veil'));
    };

    $('#drawing_view .closeNavbar').on('click', closeDrawingViewCallback);

    $('#drawing_view_veil').on('click', closeDrawingViewCallback);

    $('.sample_colour').on('click', (e) => {
        if(!isSamplingColour) { // If view is not currently in sampling mode
            activateSamplingMode();
            deactivateFillMode();
        } else {
            deactivateSamplingMode();
        }
    });

    $('.flood_fill').on('click', (e) => {
        if(!isFillMode) { // If view is not currently in flood fill mode
            activateFillMode();
            deactivateSamplingMode();
        } else {
            deactivateFillMode();
        }
    });

    $('.undo').on('click', (e) => { // Load state from history canvas
        ctx.drawImage(cvsHistoryElem.get(0), 0, 0);

        deactivateSamplingMode();
        deactivateFillMode();
    });

    $('.brush_size').on('click', (e) => { // When brush size tool is clicked
        $('.brush_size').each((i, elem) => {
            deactivateBrushSize(elem);
        });

        activateBrushSize(e.currentTarget);
    });

    cvsElem.on('touchstart', (e) => {
        cvsOffset = cvsElem.get(0).getBoundingClientRect();
        cvsOffsetCoords.x = cvsOffset.left;
        cvsOffsetCoords.y = cvsOffset.top;

        if(isSamplingColour) { // Sampling mode
            cCElem = $('.current_colour');
            var cRegHsl = cCElem.attr('colour_reg_hsluv').split(',').map((v) => {
                return parseFloat(v);
            });
            addPastColour(cRegHsl);         

            $(window).on('touchend', () => {
                cvsElem.off('touchmove');

                deactivateSamplingMode();
            });

            cvsElem.on('touchmove', sampleColourCallback);
            sampleColourCallback(e);
        } else if(isFillMode) { // Fill mode
            // Save current sate in hidden history canvas

            historyCtx.drawImage(cvsElem.get(0), 0, 0);

            // Clear event handlers

            $(window).off('touchend');
            cvsElem.off('touchmove');

            // Fill canvas

            ctx.fillStyle = $('.current_colour').css('background-color');
            ctx.fillRect(0, 0, cvsElem.attr('width'), cvsElem.attr('height'));

            // Toggle fill mode

            deactivateFillMode();
        } else { // Drawing mode

            // Save current sate in hidden history canvas

            historyCtx.drawImage(cvsElem.get(0), 0, 0);

            // Canvas init

            ctx.strokeStyle = $('.current_colour').css('background-color');

            $(window).on('touchend', () => {
                cvsElem.off('touchmove');

                prevTouch.x = null;
                prevTouch.y = null;
                pPrevTouch.x = null;
                pPrevTouch.y = null;
            });
    
            cvsElem.on('touchmove', drawCallback);
            drawCallback(e);
        }
    });
}