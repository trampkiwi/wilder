$(function() {
    $('#openNavbar').on('click', function() {
        $('.navBar').css('height', '70%');
    });

    $('#closeNavbar').on('click', function() {
        $('.navBar').css('height', '0');
    });
});