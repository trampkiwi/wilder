var firebaseDB;

async function initialise() { // called after elements have loaded and firebase user has been recognised
    $('.all_content').css('display', 'block');

    // Set profile button image.
    //$('#profilebutton').attr('src', firebase.auth().currentUser.photoURL);

    // Link up buttons to modal.
    $('#addbutton').on('click', () => {
        modalView.openModal($('#addModal'), $('#veil'), '70%');
    });
    
    $('#veil').on('click', () => {
        modalView.closeModal($('#addModal'), $('#veil'));
    });

    /*$('#closeaddmenu').on('click', () => {
        modalView.closeModal($('#addModal'), $('#veil'));
    })*/

    $('#add_actor').on('click', () => {
        window.location.href="/add_actor.m.html";
    });

    $('#add_interaction').on('click', () => {
        window.location.href="/add_interaction.m.html";
    });

    initialiseMap();
}

// -------------- Check user ---------------

/*firebase.auth().onAuthStateChanged((user) => {
    if(user) { // User logged in
        var firebaseDB = firebase.database();

        var uid = firebase.auth().currentUser.uid;

        firebaseDB.ref('/users/' + uid).once('value').then((snapShot) => { // User is authorised.
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
});*/

$(initialise);