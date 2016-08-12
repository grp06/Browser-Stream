

firebase.initializeApp(config);


function initApp() {

    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            var displayName = user.displayName;
            var email = user.email;
            var emailVerified = user.emailVerified;
            var photoURL = user.photoURL;
            var isAnonymous = user.isAnonymous;
            var uid = user.uid;
            var refreshToken = user.refreshToken;
            var providerData = user.providerData;
            // [START_EXCLUDE]
            document.getElementById('quickstart-sign-in-status').textContent = 'Signed in';
            document.getElementById('quickstart-account-details').textContent = JSON.stringify({
                displayName: displayName,
                email: email,
                emailVerified: emailVerified,
                photoURL: photoURL,
                isAnonymous: isAnonymous,
                uid: uid,
                refreshToken: refreshToken,
                providerData: providerData
            }, null, '  ');
        } else {
            startAuth(false);
            document.getElementById('quickstart-sign-in-status').textContent = 'Signed out';
            document.getElementById('quickstart-account-details').textContent = 'null';
        }
    });
}


function startAuth(interactive) {
    console.log('starting auth')
    chrome.identity.getAuthToken({
        interactive: !!interactive
    }, function(token) {
        console.log('we have a token ', token)
        if (chrome.runtime.lastError && !interactive) {
            console.log('It was not possible to get a token programmatically.');
        } else if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError);
        } else if (token) {
            authToken = token;
            var credential = firebase.auth.GoogleAuthProvider.credential(null, token);
            console.log('credential variable is = ', credential)
            firebase.auth().signInWithCredential(credential).catch(function(error) {
                if (error.code === 'auth/invalid-credential') {
                    chrome.identity.removeCachedAuthToken({
                        token: token
                    }, function() {
                        startAuth(interactive);
                    });
                } else {
                    console.log('we have a good token and good credentials')
                }
            });
        } else {
            console.error('The OAuth Token was null');
        }
    });
}


function redirect() {
    console.log('about to redirect')
    var url = 'http://pickettg.me/browser-stream'

    chrome.tabs.create({
        url: url
    })



}

function signOut() {
  firebase.auth().signOut().then(function() {
   localStorage.setItem('oauthToken', null);
   console.log('localStorage.oauthToken = ' , localStorage.oauthToken)
   localStorage.setItem('userIsAuthenticated', false);
    console.log('signOut sucessful')
  }, function(error) {
    console.log(error)
  });
}

function change() {
    var elem = document.getElementById("button-1");
    var publicBrowsing = localStorage.publicBrowsing;
    var publicStatus = document.getElementById('public-status')
    console.log('click')


    if (publicBrowsing == "true") {
        elem.value = "Browse Publicly"
        elem.innerHTML = "Browse Publicly"
    

        localStorage.setItem("publicBrowsing", false);
        publicStatus.innerHTML = '';
        publicStatus.innerHTML = 'Currently Browsing Privately';
        publicStatus.className = "red"

    } else {
        elem.value = "Browse Privately"
        elem.innerHTML = "Browse Privately"

        localStorage.setItem("publicBrowsing", true);
        publicStatus.innerHTML = '';
        publicStatus.innerHTML = 'Currently Browsing Publicly';
        publicStatus.className = "green"

    }

}

window.onload = function() {
console.log('load')

    
    var publicBrowsing = localStorage.publicBrowsing;
    // var elem = document.getElementById("button-1");
    var publicStatus = document.getElementById('public-status');

    if (publicBrowsing == "true") {
        // elem.value = "Browse Privately"

        // elem.innerHTML = "Browse Privately"
        var text = document.createTextNode('Currently Browsing Publicly');
        publicStatus.appendChild(text);
        publicStatus.className = "green"

    } else {
      // elem.value = "Browse Publicly"

      //   elem.innerHTML = "Browse Publicly";
        var text = document.createTextNode('Currently Browsing Privately');
        publicStatus.appendChild(text);
        publicStatus.className = "red"

    }
    document.getElementById('button-1').addEventListener('click', change, false);

};