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

// -------------- profile setup view --------------

// Initialising function for the profile setup view.

function initialiseProfileSetup() {
    // Set profile picture to some random example.

    $('.profile_container').css('background-image', `url("/Assets/profile_pic_ex${Math.floor(Math.random() * 5 + 1)}.jpg")`);

    initialiseProfileDrawingView();

    initialiseColourPicker();
}

// -----------------------------------------------


// Check user status

firebase.auth().onAuthStateChanged(function(user) {
    if (user) { // User is signed in
        // Check if user is approved: The following query only returns a valid read if the user is approved.

        var db = firebase.database();

        var uid = firebase.auth().currentUser.uid;

        db.ref('/users/' + uid).once('value').then((snapShot) => { // User is approved.

            var dat = snapShot.val();
            
            if(dat == null) { // User has not registered before.

                // Display 'last step' in registration
                $('#registerLastStep').css('display', 'block');

                initialiseProfileSetup();

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

$(() => {
    $('#confirm_signup_complete').on('click', () => {
        var userNameText = $('#user_displayname').val();
        var profilePicURI = $('.profile_pic_display').attr('src');
        var warningText = $('#signup_warning');

        if(typeof profilePicURI == 'undefined') {
            warningText.html('Please check if you have set your profile picture.');
        } else if(userNameText == '') {
            warningText.html('Please check if you have put in your user name.');
        } else {
            warningText.html('');

            var db = firebase.database();

            var currentUser = firebase.auth().currentUser;

            console.log(currentUser);

            // First attempt to upload profile image

            var profilePicPath = `public_content/${currentUser.uid}/profilePic.jpg`;

            var storageRef = firebase.storage().ref();
            var profilePicRef = storageRef.child(profilePicPath);

            try {
                // Attempt to put the image file to firebase storage
                await profilePicRef.putString(profilePicURI, 'data_url');

                var now = Date.now();

                // Attempt to create the user profile in realtime database
                await db.ref(`users/${currentUser.uid}`).set({
                    created: now,
                    last_modified: now,
                    profile_picture_storage_ref: profilePicPath
                });

                // Attempt to update user information
                await currentUser.updateProfile({ displayName: userNameText });

                // Reload the page to show signin complete page.
                location.reload();
            } catch (error) {
                warningText.html(error.message);

                throw error;
            }
        }        
    });
});
