var firebaseDB;

async function initialise() { // called after elements have loaded and firebase user has been recognised
    firebaseDB = firebase.database();

    $('.all_content').css('display', 'block');

    // Set profile button image.
    //$('#profilebutton').attr('src', firebase.auth().currentUser.photoURL);

    initialiseMap();
}

// -------------- Check user ---------------

firebase.auth().onAuthStateChanged((user) => {
    if(user) { // User logged in
        var db = firebase.database();

        var uid = firebase.auth().currentUser.uid;

        db.ref('/users/' + uid).once('value').then((snapShot) => { // User is authorised.
            var dat = snapShot.val();
            
            if(dat == null) { // User has not registered before.
                window.location.replace('/signin_complete.m.html'); // Redirect to signup complete page.
            } else { // User has registered before.
                $(initialise);
            }
        }).catch((err) => { // If error occurs
            if(err.code == 'PERMISSION_DENIED') { // Current login is invalid.
                window.location.replace('/invalid_user.m.html'); // Redirect to invalid user page.
            } else {
                alert(err);
                
                throw err;
            }
        });
    } else { // User not logged in
        window.location.replace('/');
    }
});

$(initialise);