// TODO:
/*
    - detect new user by checking if user item exists in database.
        - if new user, initiate user profile drawing routine.
            - then show full signin complete page with tutorials option visible
        - if not new user, show full signin complete page with tutorials option invisible
*/

// Check user status

$(() => {
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) { // User is signed in
            // Check if user is approved: The following query only returns a valid read if the user is approved.

            var db = firebase.database();

            var uid = firebase.auth().currentUser.uid;

            db.ref('/users/' + uid).once('value').then((snapShot) => { // User is approved

                console.log(snapShot.val());
                console.log(snapShot.val().observations['"1"']);
                // Show page content
                $('#content').css('display', 'block');
            }).catch((err) => { // If error occurs
                console.log(err.code);
                if(err.code == 'PERMISSION_DENIED') { // Current login is invalid.
                    window.location.replace('/invalid_user.m.html'); // Redirect to invalid user page.
                }
            });
        } else { // User is not signed in: erroneous state
            window.location.replace('/');
        }
    });
});

// Tutorial routine init callback: the state of being in a tutorial is stored in the sessionStorage item 'isInTutorial',
// which can either be 'true' or 'false'. (string)

function beginTutorialAndGoToExplore() {
    window.sessionStorage.setItem
}


function logout() {
    firebase.auth().signOut().then(() => {
        window.location.replace('/');
    })
}