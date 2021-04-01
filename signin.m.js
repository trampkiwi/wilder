var veil;
var navBar;

$(function() {
    veil = $('.veil');
    navBar = $('.navBar');

    $('#openNavbar').on('click', () => {
        veil.css('display', 'block');
        veil.css('background-color', 'rgba(0, 0, 0, 0.5)');
        navBar.css('height', '70%');
    });

    $('#closeNavbar').on('click', () => {
        veil.css('background-color', 'rgba(0, 0, 0, 0)');
        veil.on('transitionend', () => {
            veil.css('display', 'none');
        })
        navBar.css('height', '0');
    });
});