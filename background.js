var rootRef = new Firebase("https://search-feed-35574.firebaseio.com/");
var usersRef = rootRef.child('users');
var publicLinksRef = rootRef.child('publicLinks');
var clickedLinksRef = rootRef.child('clickedLinks');
// console.log('BEGIN BACKGROUND.JS LOCALSTORAGE')
// console.log('localStorage.displayName = ', localStorage.displayName)
// console.log('localStorage.email = ', localStorage.email)
// console.log('localStorage.loggedOut = ', localStorage.loggedOut)
// console.log('localStorage.uid = ', localStorage.uid)
// console.log('localStorage.photoUrl = ', localStorage.photoUrl)
// console.log('localStorage.newUser = ', localStorage.newUser)
// console.log('localStorage.oauthToken = ', localStorage.oauthToken)
// console.log('END BACKGROUND.JS LOCALSTORAGE')

if (!localStorage.first) {
    chrome.tabs.create({
        url: "http://pickettg.me/browser-stream"
    });
    localStorage.first = "true";
}

//make checks to see if users = 0 already
usersRef.once('value', function(snapshot) {
    if (!snapshot.val()) {
        usersRef.set(0);
        console.log('empty users field set ' + Date.now())
    }
})
//checks to see if publicLinks = 0 already
publicLinksRef.once('value', function(snapshot) {
    if (!snapshot.val()) {
        publicLinksRef.set(0);
        console.log('empty publicLinks field set ' + Date.now());
    }
})


chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        var url = request.url;
        var title = request.title;
        var favicon = 'https://plus.google.com/_/favicon?domain=';
        var faviconUrl = favicon + url;
        var timestamp = Date.now();
        var negTimestamp = -timestamp;
        console.log('incoming chrome message')
        console.log('request = ', request)


        if(request.loggedOut == "true"){
          localStorage.setItem('displayName', "");
          localStorage.setItem('email', "");
          localStorage.setItem('uid', "");
          localStorage.setItem('photoUrl', "");
          localStorage.setItem('loggedOut', 'true')
          localStorage.setItem('newUser', "false");
          localStorage.setItem('oauthToken', null);
        } else if (request.newUser == "true") {
            console.log('BG SCRIPT: We just got authenticated, need to make initial DB insert for the user')
            console.log('and we should push to publicLinks')
            var oauthToken = request.oauthToken;
            var uid = request.uid;
            var photoUrl = request.photoUrl;
            var email = request.email;
            var displayName = request.displayName;
            // console.log('displayName = ', displayName)
            // console.log('oauthToken = ', oauthToken)
            // console.log('uid = ', uid)
            // console.log('photoUrl = ', photoUrl)
            // console.log('email = ', email)

            localStorage.setItem('displayName', displayName)
            localStorage.setItem('email', email)
            localStorage.setItem('loggedOut', 'true')
            localStorage.setItem('newUser', 'false');
            localStorage.setItem('oauthToken', oauthToken)
            localStorage.setItem('photoUrl', photoUrl)
            localStorage.setItem('uid', uid)

            request.followers = 0;
            request.following = 0;
            console.log('request = ', request)

            // var userObject = {};
            // userObject = request;

            usersRef.child(uid).set(request)

            // var uidRef = usersRef.child(uid);
            // uidRef.set(userObject);

            //check to see if that UID is a key under "users"
            //&& localStorage.publicBrowsing == "true"
            if (localStorage.publicBrowsing === "true" && request.title != "") {
                console.log('public browsing is true and this IS our first insert')

                var publicBrowsing = true;
                publicLinksRef.push({
                    url, uid, title, displayName, email, photoUrl, faviconUrl, timestamp, negTimestamp, publicBrowsing
                });

            } else {
                console.log('public browsing is false OR the title is empty')
            }




        } else if (localStorage.newUser == ""){
          console.log('newUser is blank, we havent signed in yet');
        }  else {
            console.log('BG SCRIPT: weve already been authenticated, just push to publicLinks')



            if(request.oauthToken){
                console.log('WE HAVE oauthToken');
                var oauthToken = request.oauthToken
                var uid = request.uid
                var photoUrl = request.photoUrl
                var email = request.email
                var displayName = request.displayName
                var newUser = request.newUser;
                localStorage.setItem('displayName', displayName);
                localStorage.setItem('email', email);
                localStorage.setItem('uid', uid);
                localStorage.setItem('photoUrl', photoUrl);
                localStorage.setItem('loggedOut', 'false')
                localStorage.setItem('newUser', "false");
                localStorage.setItem('oauthToken', oauthToken);
            } else {
                console.log('NO oauthToken FOUND')
                var oauthToken = localStorage.oauthToken
                var uid = localStorage.uid
                var photoUrl = localStorage.photoUrl
                var email = localStorage.email
                var displayName = localStorage.displayName
                var newUser = localStorage.newUser;
            }
            // console.log('BEGIN BACKGROUND.JS LOCALSTORAGE')
            // console.log('displayName = ', displayName)
            // console.log('email = ', email)
            // console.log('loggedOut = ', localStorage.loggedOut)
            // console.log('uid = ', uid)
            // console.log('photoUrl = ', photoUrl)
            // console.log('newUser = ', newUser)
            // console.log('oauthToken = ', oauthToken)
            // console.log('END BACKGROUND.JS LOCALSTORAGE')

            // var uidRef = usersRef.child(uid);

            if (localStorage.publicBrowsing === "true" && request.title != "") {
                console.log('public browsing is true and this isnt our first insert')
                var publicBrowsing = true;
                publicLinksRef.push({
                    url, uid, title, displayName, email, photoUrl, faviconUrl, timestamp, negTimestamp, publicBrowsing
                });

        
            } else {
                console.log('public browsing is false OR title is empty')
            }

        }







    }, false);

