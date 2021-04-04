// Check if user is logged in
// Temporarily disabled auth check functionality for testing

/*
$(() => {
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) { // User is signed in
            // Check if user is approved: The following query only returns a valid read if the user is approved.

            var db = firebase.database();

            // Only logged in and 'allowed' users can access the dummy document.

            db.ref('/user_validation_dummy').once('value').then(() => { // User is approved

                console.log('safe!');
                // Show page content
                $('#content').css('display', 'block');
            }).catch((err) => { // If error occurs
                if(err.code == 'PERMISSION_DENIED') { // Current login is invalid.
                    window.location.replace('/invalid_user.m.html'); // Redirect to invalid user page.
                }
            });

            $('#user_name').html(user.displayName);
        } else { // User is not signed in: erroneous state
            window.location.replace('/');
        }
    });
});*/

function logout() {
    firebase.auth().signOut().then(() => {
        window.location.replace('/');
    })
}