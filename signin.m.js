var veil;
var navBar;

$(function() {
    veil = $('.veil');
    navBar = $('.navBar');
});

function openNavbar() {
    veil.css('display', 'block');
    veil.css('background-color', 'rgba(0, 0, 0, 0.5)');
    navBar.css('height', '70%');
}

function closeNavbar () {
    veil.css('background-color', 'rgba(0, 0, 0, 0)');
    veil.on('transitionend', () => {
        veil.css('display', 'none');
    })
    navBar.css('height', '0');
}