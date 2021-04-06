var cvsElem;
var ctx;
var hasInitialised = false;

function initialiseProfileDrawingView() {
    $('.profile_pic_display').on('click', (e) => {
        modalView.openModal($('#drawing_view'), $('#drawing_view_veil'), '100%').then(() => {
            if(!hasInitialised) {
                var canvasContainer = $('#drawing_view .canvas_container');
                var containerWidth = canvasContainer.width();
                var containerHeight = canvasContainer.height();

                cvsElem = $('#drawing_canvas');

                if(containerHeight > containerWidth) {
                    cvsElem.width(containerWidth);
                    cvsElem.height(containerWidth);
                } else {
                    cvsElem.width(containerHeight);
                    cvsElem.height(containerHeight);
                }

                cvsElem.css('display', 'inline-block');

                ctx = cvsElem.get(0).getContext('2d');

                ctx.fillStyle = '#ffffff';
                ctx.fillRect(0, 0, cvsElem.width(), cvsElem.width());

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
}