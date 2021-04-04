// Below code is unused currently

/*
function openNavbar() {
    modalView.openModal($('.navBar'), $('.veil'), '70%');
}

function closeNavbar () {
    modalView.closeModal($('.navBar'), $('.veil'));
}
*/

var uiConfig = {
    signInSuccessUrl: 'https://www.wilderecologies.tk/signin_complete.m.html',
    signInOptions: [
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        firebase.auth.EmailAuthProvider.PROVIDER_ID
    ],
    tosUrl: 'https://www.wilderecologies.tk/tos.m.html',
    privacyPolicyUrl: function() {
        window.location.assign('https://www.wilderecologies.tk/privacypolicy.m.html');
    }
};

var ui = new firebaseui.auth.AuthUI(firebase.auth());

ui.start('#firebaseui-auth-container', uiConfig);