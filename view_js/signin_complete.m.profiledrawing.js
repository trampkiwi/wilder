function initialiseProfileDrawingView() {
    $('.profile_pic_display').on('click', (e) => {
        modalView.openModal($('#drawing_view'), $('#drawing_view_veil'), '100%');
    });

    $('#drawing_view .closeNavbar').on('click', (e) => {
        modalView.closeModal($('#drawing_view'), $('#drawing_view_veil'));
    })

    $('#drawing_view_veil').on('click', (e) => {
        modalView.closeModal($('#drawing_view'), $('#drawing_view_veil'));
    });
}