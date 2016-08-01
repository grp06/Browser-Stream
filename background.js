var rootRef = new Firebase("https://search-feed-35574.firebaseio.com/");
var usersRef = rootRef.child('users');
var publicLinksRef = rootRef.child('publicLinks');
var clickedLinksRef = rootRef.child('clickedLinks');
console.log('background script');

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
        console.log('message incoming! where is it from?')
        if (request.greeting == "hello") {

            var uid = localStorage.uid;
            sendResponse({
                farewell: uid
            });
        }

        if (request.url) {
            console.log('message coming from content script')
            var url = request.url;

            //if clickedLinks isn't in the DB yet, instantiate it
            clickedLinksRef.once('value', function(snapshot) {
                if (!snapshot.val()) {
                    clickedLinksRef.push('www.google.com');
                    console.log('clickedlinks created')
                }
            })
            //check to see if that UID is a key under "users"

            var uid = localStorage.uid;
            localStorage.setItem('uid', uid)
            var uidRef = usersRef.child(uid);

            usersRef.once('value', function(snapshot) {
                //when the page reloads, content script runs
                //if the user is already in the DB and publicBrowsing is enabled
                //lets go make a DB insert
                if (snapshot.hasChild(uid) && localStorage.publicBrowsing == "true") {
                    var url = request.url;
                    var title = request.title;
                    var displayName = localStorage.displayName
                    var email = localStorage.email
                    var photoUrl = localStorage.photoUrl
                    var favicon = 'https://plus.google.com/_/favicon?domain=';
                    var faviconUrl = favicon + url;
                    var timestamp = Date.now();
                    var negTimestamp = -timestamp;

                    // chrome.runtime.sendMessage({
                    //     greeting: "hello"
                    // }, function(response) {
                    //     console.log(response.farewell);
                    // });

                    var publicLinksRef = rootRef.child('publicLinks');

                    if (title == "") {
                        console.log('Empty title. We don\'t insert these guys');
                    } else {
                        var publicBrowsing = true;
                        publicLinksRef.push({
                            url, uid, title, displayName, email, photoUrl, faviconUrl, timestamp, negTimestamp, publicBrowsing
                        });

                        visitedLinksRef = uidRef.child('visitedLinks')

                        visitedLinksRef.push({
                            url, uid, title, displayName, email, photoUrl, faviconUrl, timestamp, negTimestamp, publicBrowsing
                        })
                    }



                } else {
                    console.log('uid is not there or public browsing isnt enabled, no DB insert')
                }
            })

            //otherwise, we're getting a message from popup.js, meaning they clicked it again, or they've signed in for the first time
        }

        // if (thing) {
        //     console.log('message coming from popup')
        //     console.log('message = ', message)
        //     var uid = localStorage.uid
        //     request.message.visitedLinks = 0;
        //     console.log('request.message = ', request.message)
        //     var userObject = {};
        //     userObject = request.message

        //     usersRef.once('value', function(snapshot) {
        //         if (!snapshot.hasChild(uid)) {
        //             var uniqueIdRef = usersRef.child(uid);
        //             uniqueIdRef.set(userObject)
        //             console.log("userObject = ", userObject)
        //             console.log('popup was clicked an no UID was found so we inserted your profile and data')
        //         } else {
        //             console.log('already in db')
        //         }

        //     })


        // }


    }, false);