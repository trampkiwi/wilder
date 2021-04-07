var cvsElem;
var ctx;
var hasInitialised = false;
var isSamplingColour = false;

var pPrevTouch = { x: null, y: null };
var prevTouch = { x: null, y: null };
var cvsOffset;
var cvsOffsetCoords = {};
var touchCoords = {};

var scale; // Device pixel ratio

function initialiseProfileDrawingView() {
    cvsElem = $('#drawing_canvas');

    $('.profile_pic_display').on('click', (e) => {
        modalView.openModal($('#drawing_view'), $('#drawing_view_veil'), '100%').then(() => {
            if(!hasInitialised) {
                var canvasContainer = $('#drawing_view .canvas_container');
                var containerWidth = canvasContainer.width();
                var containerHeight = canvasContainer.height();

                scale = window.devicePixelRatio;

                if(containerHeight > containerWidth) {
                    cvsElem.css('width', containerWidth);
                    cvsElem.css('height', containerWidth);

                    cvsElem.attr('width', containerWidth * scale);
                    cvsElem.attr('height', containerWidth * scale);
                } else {
                    cvsElem.css('width', containerHeight);
                    cvsElem.css('height', containerHeight);

                    cvsElem.attr('width', containerHeight * scale);
                    cvsElem.attr('height', containerHeight * scale);
                }

                cvsElem.css('display', 'inline-block');

                ctx = cvsElem.get(0).getContext('2d');

                ctx.fillStyle = '#ffffff';
                ctx.fillRect(0, 0, cvsElem.attr('width'), cvsElem.attr('height'));

                hasInitialised = true;
            }
        });
    });

    $('#drawing_view .closeNavbar').on('click', (e) => {
        modalView.closeModal($('#drawing_view'), $('#drawing_view_veil'));
    })

    $('#drawing_view_veil').on('click', (e) => {
        modalView.closeModal($('#drawing_view'), $('#drawing_view_veil'));
    });

    $('.sample_colour').on('click', (e) => {
        if(!isSamplingColour) { // If view is not currently in sampling mode
            $('.sample_colour').css('background-color', 'black');
            $('.sample_colour .black').css('display', 'none');
            $('.sample_colour .white').css('display', 'inline-block');

            isSamplingColour = true;
        } else {
            $('.sample_colour').css('background-color', 'rgba(0, 0, 0, 0)');
            $('.sample_colour .black').css('display', 'inline-block');
            $('.sample_colour .white').css('display', 'none');

            isSamplingColour = false;
        }
    });

    cvsElem.on('touchstart', (e) => {
        cvsOffset = cvsElem.get(0).getBoundingClientRect();
        cvsOffsetCoords.x = cvsOffset.x;
        cvsOffsetCoords.y = cvsOffset.y;

        if(!isSamplingColour) {
            ctx.lineWidth = 15;
            ctx.lineJoin = 'round';
            ctx.lineCap = 'round';
            ctx.strokeStyle = $('.current_colour').css('background-color');

            var drawCallback = function(ev) {
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

            $(window).on('touchend', () => {
                cvsElem.off('touchmove');
                prevTouch.x = null;
                prevTouch.y = null;
                pPrevTouch.x = null;
                pPrevTouch.y = null;
            });
    
            cvsElem.on('touchmove', drawCallback);
            drawCallback(e);
        } else {
            var cCElem = $('.current_colour');
            var cRegHsl = cCElem.attr('colour_reg_hsluv').split(',').map((v) => {
                return parseFloat(v);
            });
            addPastColour(cRegHsl);         

            var sampleColourCallback = function(ev) {
                ev.preventDefault();

                touchCoords.x = ev.touches[0].pageX - cvsOffsetCoords.x;
                touchCoords.y = ev.touches[0].pageY - cvsOffsetCoords.y;

                var sampledColour = ctx.getImageData(touchCoords.x * scale, touchCoords.y * scale, 1, 1).data;

                var sampledColourReg = [];

                for(var i = 0; i < 3; i++) { sampledColourReg.push(sampledColour[i] / 255); }

                console.log(sampledColour);
                console.log(sampledColourReg);

                ctx.strokeStyle = `rgb(${sampledColour[0]}, ${sampledColour[1]}, ${sampledColour[2]})`;

                cCElem.attr('colour_reg_hsluv', regulariseHSLuv(hsluv.Hsluv.rgbToHsluv(sampledColourReg)).toString());
                cCElem.css('background-color', `rgb(${sampledColour[0]}, ${sampledColour[1]}, ${sampledColour[2]})`);
            }

            $(window).on('touchend', () => {
                cvsElem.off('touchmove');

                $('.sample_colour').css('background-color', 'rgba(0, 0, 0, 0)');
                $('.sample_colour .black').css('display', 'inline-block');
                $('.sample_colour .white').css('display', 'none');

                isSamplingColour = false;
            });

            cvsElem.on('touchmove', sampleColourCallback);
            sampleColourCallback(e);
        }

        
    });
}