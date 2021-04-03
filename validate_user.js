// This code should be imported after firebase.auth and firebase.firestore.

var db = firebase.firestore();
var validationRef = db.collection('user_validation_dummy').doc('dummy'); // Only logged in and 'allowed' users can access this document.

validationRef.get().then(() => {
    // Do nothing
}).catch((error) => {
    if(error.code == 'permission-denied') { // Current login is invalid.
        window.location.replace('/invalid_user.m.html'); // Redirect to invalid user page.
    }
});