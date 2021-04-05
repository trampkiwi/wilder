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
        console.log(colour_hsluv);

        elem.css('background-color', hsluv.Hsluv.hsluvToHex(colour_hsluv));
        wm.set(elem.get(), colour_hsluv);

        elem.on('click', (e) => {
            modalView.openModal($('.navBar'), $('.veil'), '70%');
        });
    });

    $('#closeNavbar').on('click', (e) => {
        modalView.closeModal($('.navBar'), $('.veil'));
    })

    $('.veil').on('click', (e) => {
        modalView.closeModal($('.navBar'), $('.veil'));
    });
});
