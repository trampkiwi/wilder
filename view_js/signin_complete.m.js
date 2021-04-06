const wm = new WeakMap();

// TODO:
/*
    - detect new user by checking if user item exists in database.
        - if new user, initiate user profile drawing routine.
            - then show full signin complete page with tutorials option visible
        - if not new user, show full signin complete page with tutorials option invisible
*/


// Tutorial routine init callback: the state of being in a tutorial is stored in the sessionStorage item 'isInTutorial',
// which can either be 'true' or 'false'. (string)

function beginTutorialAndGoToExplore() {
    window.sessionStorage.setItem
}

// Signout function. Attached to #signout from the html.

function signout() {
    firebase.auth().signOut().then(() => {
        window.location.replace('/index.m.html');
    });
}

// ------------- Colour picker code ----------------

var isDragging = false;

var currentRegHSLuv = [0, 0, 0]; // Current colour that the colour selector is in, in HSLuv.

function regulariseHSLuv(Hsluv) {
    var modHsluv = [...Hsluv];
    modHsluv[0] = modHsluv[0] / 360 * 100;
    return modHsluv;
}

function recoverHSLuv(modHsluv) {
    var Hsluv = [...modHsluv];
    Hsluv[0] = Hsluv[0] / 100 * 360;
    return Hsluv;
}

// Updaate colour slider appearance based on currentHSLuv

function updateColourView(currentRegHSL) {
    $('#colour_display').css('background-color', hsluv.Hsluv.hsluvToHex(recoverHSLuv(currentRegHSL)));

    $('.colour_slider').each((i, slider) => {
        var sliderElem = $(slider);

        var gradientStr = 'linear-gradient(to right,';

        for(var j = 0; j <= 20; j++) {
            var gradRegHSL = [...currentRegHSL];
            gradRegHSL[i] = j / 20 * 100;

            gradientStr = gradientStr + hsluv.Hsluv.hsluvToHex(recoverHSLuv(gradRegHSL)) + ',';
        }

        gradientStr = gradientStr.substring(0, gradientStr.length - 1) + ')';
        
        sliderElem.css('background', gradientStr);

        var sliderHandle = sliderElem.find('.slider_handle');

        sliderHandle.css('left', ($(window).width() * currentRegHSL[i] / 100 - 14.5).toString() + 'px');
    });
}

// Initiate colour picker

function initialiseColourView(barElem) {
    currentRegHSLuv = barElem.attr('colour_reg_hsluv').split(',').map(x => +x);

    if(currentRegHSLuv[2] > 50) {
        $('#closeNavbar').css('color', 'black');
    } else {
        $('#closeNavbar').css('color', 'white');
    }

    $('.colour_slider').on('touchstart', (e, esupp) => {
        if(typeof e.pageX == 'undefined') { e = esupp; e.target = $(esupp.target).parent().get(); }

        var sliderElem = $(e.target);
        
        var moveCallback = (ev) => {
            ev.preventDefault();
            currentRegHSLuv[sliderElem.attr('id')] = ev.pageX / $(window).width() * 100;
            updateColourView(currentRegHSLuv);
            
            if(ev.pageX < 0 || ev.pageX > $(window).width()) { $(window).off('touchmove'); }

            barElem.attr('colour_reg_hsluv', currentRegHSLuv.toString());
            barElem.css('background-color', hsluv.Hsluv.hsluvToHex(recoverHSLuv(currentRegHSLuv)));
        };

        $(window).on('touchmove', moveCallback);

        moveCallback(e);
    });

    $('.slider_handle').on('touchstart', (e) => {
        e.preventDefault();
        $(e.target).parent().trigger('touchstart', e);
    })

    $(window).on('touchend', (ev) => {
        $(window).off('touchmove');
    });

    updateColourView(currentRegHSLuv);
}

// Check user status

/*
firebase.auth().onAuthStateChanged(function(user) {
    if (user) { // User is signed in
        // Check if user is approved: The following query only returns a valid read if the user is approved.

        var db = firebase.database();

        var uid = firebase.auth().currentUser.uid;

        db.ref('/users/' + uid).once('value').then((snapShot) => { // User is approved.

            var dat = snapShot.val();
            console.log(dat);
            
            if(dat == null) { // User has not registered before.

                // Display 'last step' in registration
                $('#registerLastStep').css('display', 'block');

            } else { // User has registered before.
                // Show page content bar tutorial options
                $('#registerCompleteContent').css('display', 'block');
            }
            
        }).catch((err) => { // If error occurs
            if(err.code == 'PERMISSION_DENIED') { // User is not approved.
                window.location.replace('/invalid_user.m.html'); // Redirect to invalid user page.
            }
        });
    } else { // User is not signed in: erroneous state
        window.location.replace('/');
    }
});
*/

// Init

$(() => {

    // TODO: these should all be in the dat == null clause in the onAuthStateChanged function above.

    $('.pick_colour').each((i, e) => {
        var elem = $(e);

        var colour_hsluv = [Math.random() * 360, Math.random() * 100, Math.random() * 100];

        elem.css('background-color', hsluv.Hsluv.hsluvToHex(colour_hsluv));
        elem.attr('colour_reg_hsluv', regulariseHSLuv(colour_hsluv).toString());

        elem.on('click', (ev) => {
            modalView.openModal($('.navBar'), $('.veil'), '70%');

            initialiseColourView($(ev.target));
        });
    });

    $('#closeNavbar').on('click', (e) => {
        modalView.closeModal($('.navBar'), $('.veil'));
        $(window).off('touchmove');
        $('.colour_slider').off('touchstart');
        $('.slider_handle').off('touchstart');
    })

    $('.veil').on('click', (e) => {
        modalView.closeModal($('.navBar'), $('.veil'));
        $(window).off('touchmove');
        $('.colour_slider').off('touchstart');
        $('.slider_handle').off('touchstart');
    });
});
