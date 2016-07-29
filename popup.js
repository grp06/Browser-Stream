
var config = {
    apiKey: "AIzaSyBZtw9sDtZKhI5Q6w--kwulEpv6d8UPUwo",
    authDomain: "search-feed-35574.firebaseapp.com",
    databaseURL: "https://search-feed-35574.firebaseio.com",
    storageBucket: "search-feed-35574.appspot.com",
};

firebase.initializeApp(config);


function initApp() {
    console.log('app initi')
    // Listen for auth state changes.
    // [START authstatelistener]
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            console.log('user exists')
            // User is signed in.
            var displayName = user.displayName;
            var email = user.email;
            var emailVerified = user.emailVerified;
            var photoUrl = user.photoURL;
            var isAnonymous = user.isAnonymous;
            var uid = user.uid;
            var refreshToken = user.refreshToken;
            var providerData = user.providerData;

            window.localStorage.setItem("uid", uid);
            localStorage.setItem("email", email);
            localStorage.setItem("displayName", displayName);
            localStorage.setItem("photoUrl", photoUrl);
            localStorage.setItem("refreshToken", refreshToken);
            localStorage.setItem("userIsAuthenticated", true);

            chrome.runtime.onMessage.addListener(
              function(request, sender, sendResponse) {
                console.log(sender.tab ?
                            "from a content script:" + sender.tab.url :
                            "from the extension");
                if (request.greeting == "hello")
                  sendResponse({farewell: "goodbye"});
              });

     


            console.log('hiiii')


            chrome.runtime.sendMessage({
                message: user
            }, function(response) {
                // console.log(response.farewell);
            });

            console.log('sdfsdf')


        } else {
            // Let's try to get a Google auth token programmatically.
            startAuth(false);
            // [START_EXCLUDE]
            document.getElementById('quickstart-account-details').textContent = 'null';
            localStorage.setItem("userIsAuthenticated", false)

        }
    });
    // [END authstatelistener]
    document.getElementById('quickstart-button').addEventListener('click', startSignIn, false);
}

/**
 * Start the auth flow and authorizes to Firebase.
 * @param{boolean} interactive True if the OAuth flow should request with an interactive mode.
 */
function startAuth(interactive) {
    // Request an OAuth token from the Chrome Identity API.
    chrome.identity.getAuthToken({
        interactive: !!interactive
    }, function(token) {
        if (chrome.runtime.lastError && !interactive) {
            console.log('It was not possible to get a token programmatically.');
            // Show the sign-in button
            document.getElementById('quickstart-button').disabled = false;
        } else if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError);
        } else if (token) {
            // Authrorize Firebase with the OAuth Access Token.
            var credential = firebase.auth.GoogleAuthProvider.credential(null, token);
            firebase.auth().signInWithCredential(credential).catch(function(error) {
                // The OAuth token might have been invalidated. Lets' remove it from cache.
                if (error.code === 'auth/invalid-credential') {
                    chrome.identity.removeCachedAuthToken({
                        token: token
                    }, function() {
                        startAuth(interactive);
                    });
                }
            });
        } else {
            console.error('The OAuth Token was null');
        }
    });
}

function change() {
    var elem = document.getElementById("button-1");
    var publicBrowsing = localStorage.publicBrowsing;
    var publicStatus = document.getElementById('public-status')

    if (elem.value == "Browse Privately") {
      elem.value = "Browse Publicly";
      localStorage.setItem("publicBrowsing", false);
      publicStatus.innerHTML = '';
      publicStatus.innerHTML = 'Currently Browsing Privately';
      publicStatus.className = "red"

      console.log('localStorage public browsing is false')
    } else {
      elem.value = "Browse Privately";
      localStorage.setItem("publicBrowsing", true);
      publicStatus.innerHTML = '';
      publicStatus.innerHTML = 'Currently Browsing Publicly';
      publicStatus.className = "green"
      console.log('localStorage public browsing is true')

    }

}


function startSignIn() {
    document.getElementById('quickstart-button').disabled = true;
    startAuth(true);
}

window.onload = function() {
    var url = window.location.href;
    console.log('url is ', url)
    initApp();

    var publicBrowsing = localStorage.publicBrowsing;
    var elem = document.getElementById("button-1");
    var publicStatus = document.getElementById('public-status')
    if(publicBrowsing == "true"){
      elem.value = "Browse Privately";
      var text = document.createTextNode('Currently Browsing Publicly');
      publicStatus.appendChild(text);
      publicStatus.className = "green"

    } else {
      elem.value = "Browse Publicly";
      var text = document.createTextNode('Currently Browsing Privately');
      publicStatus.appendChild(text);
      publicStatus.className = "red"

    }
    document.getElementById('button-1').addEventListener('click', change, false);



};