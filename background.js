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
<<<<<<< HEAD
        var url = request.url;
        var title = request.title;
        var favicon = 'https://plus.google.com/_/favicon?domain=';
        var faviconUrl = favicon + url;
        var timestamp = Date.now();
        var negTimestamp = -timestamp;
=======
        console.log('message incoming! where is it from?')
        if (request.greeting == "hello") {

            var uid = localStorage.uid;
            sendResponse({
                farewell: uid
            });
        }
>>>>>>> c79db5cf372282360a607d96b915f81a25482c9e

        console.log('request = ', request)

        if (request.newUser == "true") {
            //if clickedLinks isn't in the DB yet, instantiate it
<<<<<<< HEAD
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
=======
            clickedLinksRef.once('value', function(snapshot) {
                if (!snapshot.val()) {
                    clickedLinksRef.push('www.google.com');
                    console.log('clickedlinks created')
                }
            })
            //check to see if that UID is a key under "users"

            var uid = localStorage.uid;
>>>>>>> c79db5cf372282360a607d96b915f81a25482c9e
            localStorage.setItem('uid', uid)
            localStorage.setItem('photoUrl', photoUrl)
            localStorage.setItem('email', email)
            localStorage.setItem('displayName', displayName)
            localStorage.setItem('newUser', 'false');

<<<<<<< HEAD
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

=======
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
>>>>>>> c79db5cf372282360a607d96b915f81a25482c9e
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

<<<<<<< HEAD
=======
        //     })
>>>>>>> c79db5cf372282360a607d96b915f81a25482c9e


        // }


<<<<<<< HEAD

=======
>>>>>>> c79db5cf372282360a607d96b915f81a25482c9e
    }, false);