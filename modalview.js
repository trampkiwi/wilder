var modalView = {};

modalView.openModal = function(mv, veil, height) {
    veil.css('display', 'block');
    veil.css('background-color', 'rgba(0, 0, 0, 0.5)');

    mv.css('height', height);

    var body = $('body');

    body.css('top', '-' + body.scrollTop().toString() + 'px');
    body.css('left', '0');
    body.css('position', 'fixed');
};

modalView.closeModal = function(mv, veil) {
    veil.css('background-color', 'rgba(0, 0, 0, 0)');
    veil.on('transitionend', () => {
        veil.css('display', 'none');
    });

    mv.css('height', '0');

    $('body').css('position', 'static');
}