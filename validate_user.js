var db = firebase.database();

// Only logged in and 'allowed' users can access the dummy document.

db.ref('/user_validation_dummy').once('value').then(() => {
    // Do nothing
}).catch((err) => { // If error occurs
    if(err.code == 'permission-denied') { // Current login is invalid.
        window.location.replace('/invalid_user.m.html'); // Redirect to invalid user page.
    }
});