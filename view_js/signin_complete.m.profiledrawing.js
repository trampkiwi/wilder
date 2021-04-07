var cvsElem;
var ctx;
var hasInitialised = false;
var isSamplingColour = false;
var prevTouchX = null;
var prevTouchY = null;
var cvsOffset;
var cvsOffX;
var cvsOffY;
var touchX;
var touchY;

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
        $('.sample_colour').css('background-color', 'black');
        $('.sample_colour .black').css('display', 'none');
        $('.sample_colour .white').css('display', 'inline-block');

        isSamplingColour = true;
    });

    cvsElem.on('touchstart', (e) => {
        cvsOffset = cvsElem.get(0).getBoundingClientRect();
        cvsOffX = cvsOffset.x;
        cvsOffY = cvsOffset.y;

        if(!isSamplingColour) {
            ctx.lineWidth = 5;
            ctx.strokeStyle = $('.current_colour').css('background-color');

            var drawCallback = function(ev) {
                ev.preventDefault();

                touchX = ev.touches[0].pageX - cvsOffX;
                touchY = ev.touches[0].pageY - cvsOffY;
                
                if(prevTouchX != null && prevTouchY != null) {
                    ctx.beginPath();
                    ctx.moveTo(prevTouchX * scale, prevTouchY * scale);
                    ctx.lineTo(touchX * scale, touchY * scale);
                    ctx.stroke();
                }

                prevTouchX = touchX;
                prevTouchY = touchY;
            }

            $(window).on('touchend', () => {
                cvsElem.off('touchmove');
                prevTouchX = null;
                prevTouchY = null;
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

                touchX = ev.touches[0].pageX - cvsOffX;
                touchY = ev.touches[0].pageY - cvsOffY;

                var sampledColour = ctx.getImageData(touchX * scale, touchY * scale, 1, 1).data;

                ctx.strokeStyle = `rgb(${sampledColour[0]}, ${sampledColour[1]}, ${sampledColour[2]})`;

                cCElem.attr('colour_reg_hsluv', hsluv.Hsluv.rgbToHsluv(sampledColour));
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