function initialiseProfileDrawingView() {
    $('.profile_pic_display').on('click', (e) => {
        modalView.openModal($('#drawing_view'), $('#drawing_view_veil'), '100%').then(() => {
            var canvasContainer = $('#drawing_view .canvas_container');
            var containerWidth = canvasContainer.width();
            var containerHeight = canvasContainer.height();

            if(containerHeight > containerWidth) {
                $('#drawing_canvas').width(containerWidth);
                $('#drawing_canvas').height(containerWidth);
            } else {
                $('#drawing_canvas').width(containerHeight);
                $('#drawing_canvas').height(containerHeight);
            }

            $('#drawing_canvas').css('display', 'inline-block');
        });
    });

    $('#drawing_view .closeNavbar').on('click', (e) => {
        modalView.closeModal($('#drawing_view'), $('#drawing_view_veil'));
    })

    $('#drawing_view_veil').on('click', (e) => {
        modalView.closeModal($('#drawing_view'), $('#drawing_view_veil'));
    });
}