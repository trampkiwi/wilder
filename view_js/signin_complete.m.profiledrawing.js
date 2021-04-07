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
        var sampleButton = $(e.target);
        sampleButton.attr('src', '/Assets/sample_colour_white.png');
        sampleButton.css('background-color', 'black');
    });

    cvsElem.on('touchstart', (e) => {
        cvsOffset = cvsElem.get(0).getBoundingClientRect();
        console.log(cvsOffset);
        cvsOffX = cvsOffset.x;
        cvsOffY = cvsOffset.y;

        ctx.lineWidth = 5;
        ctx.strokeStyle = $('.current_colour').css('background-color');

        var drawCallback = function(ev) {
            ev.preventDefault();

            console.log(cvsOffX);
            console.log(ev.touches[0].pageX);

            touchX = ev.touches[0].pageX - cvsOffX;
            touchY = ev.touches[0].pageY - cvsOffY;
            console.log(`(${touchX}, ${touchY})`);
            
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
    });
}