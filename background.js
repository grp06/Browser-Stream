var rootRef = new Firebase("https://search-feed-35574.firebaseio.com/");
var usersRef = rootRef.child('users');
var publicLinksRef = rootRef.child('publicLinks');
var clickedLinksRef = rootRef.child('clickedLinks');
console.log('background script');
console.log('localStorage ', localStorage)

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

        console.log('request = ', request)

        if (request.newUser == "true") {
            //if clickedLinks isn't in the DB yet, instantiate it
            // clickedLinksRef.once('value', function(snapshot) {
            //     if (!snapshot.val()) {
            //         clickedLinksRef.push('www.google.com');
            //         console.log('clickedlinks created')
            //     }
            // })

            console.log('BG SCRIPT: We just got authenticated, need to make initial DB insert for the user and visitedLinks')

            console.log('and we should push to publicLinks')

            var oauthToken = request.oauthToken;
            var uid = request.uid;
            var photoUrl = request.photoUrl;
            var email = request.email;
            var displayName = request.displayName;
            console.log('oauthToken = ', oauthToken)
            console.log('uid = ', uid)
            console.log('photoUrl = ', photoUrl)
            console.log('email = ', email)
            console.log('displayName = ', displayName)


            localStorage.setItem('oauthToken', oauthToken)
            localStorage.setItem('uid', uid)
            localStorage.setItem('photoUrl', photoUrl)
            localStorage.setItem('email', email)
            localStorage.setItem('displayName', displayName)
            localStorage.setItem('newUser', 'false');

            request.visitedLinks = 0;
            request.followers = 0;
            console.log('request = ', request)

            var userObject = {};
            userObject[uid] = request;

            usersRef.set(userObject);
            var uidRef = usersRef.child(uid);

            var visitedLinksRef = uidRef.child('visitedLinks')

            //check to see if that UID is a key under "users"
            //&& localStorage.publicBrowsing == "true"
            if (localStorage.publicBrowsing === "true") {
                console.log('public browsing is true and this IS our first insert')

                var publicBrowsing = true;
                publicLinksRef.push({
                    url, uid, title, displayName, email, photoUrl, faviconUrl, timestamp, negTimestamp, publicBrowsing
                });

                visitedLinksRef.push({
                    url, uid, title, displayName, email, photoUrl, faviconUrl, timestamp, negTimestamp, publicBrowsing
                })
            } else {
                console.log('public browsing is false, so youre not gonna make URL inserts')
            }




        } else {
            console.log('BG SCRIPT: weve already been authenticated, just push to visitedLinks and publicLinks')

            var oauthToken = localStorage.getItem('oauthToken')
            var uid = localStorage.getItem('uid')
            var photoUrl = localStorage.getItem('photoUrl')
            var email = localStorage.getItem('email')
            var displayName = localStorage.getItem('displayName')
            var newUser = localStorage.getItem('newUser');
            console.log('oauthToken = ', oauthToken)
            console.log('uid = ', uid)
            console.log('photoUrl = ', photoUrl)
            console.log('email = ', email)
            console.log('displayName = ', displayName)
            console.log('newUser = ', newUser)

            var uidRef = usersRef.child(uid);
            var visitedLinksRef = uidRef.child('visitedLinks')

            if (localStorage.publicBrowsing === "true") {
                console.log('public browsing is true and this isnt our first insert')
                var publicBrowsing = true;
                publicLinksRef.push({
                    url, uid, title, displayName, email, photoUrl, faviconUrl, timestamp, negTimestamp, publicBrowsing
                });

                visitedLinksRef.push({
                    url, uid, title, displayName, email, photoUrl, faviconUrl, timestamp, negTimestamp, publicBrowsing
                })
            } else {
                console.log('public browsing is false, so youre not gonna make URL inserts')
            }

        }







    }, false);