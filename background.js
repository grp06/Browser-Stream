var rootRef = new Firebase("https://search-feed-35574.firebaseio.com/");
var usersRef = rootRef.child('users');
var publicLinksRef = rootRef.child('publicLinks');
console.log('background script');

if(!localStorage.first){
    chrome.tabs.create({
       url : "http://pickettg.me/browser-stream"
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
        if (request.url) {
            //check to see if that UID is a key under "users"
          
            var uid = localStorage.uid;
            var uidRef = usersRef.child(uid);

            usersRef.once('value', function(snapshot) {
                console.log('snapshot', snapshot.val());
                if (snapshot.hasChild(uid)) {
                    console.log('uid is there');
                    console.log('message coming from content script')
                    var url = request.url;
                    var title = request.title;

                    var displayName = localStorage.displayName
                    var email = localStorage.email
                    var photoUrl = localStorage.photoUrl
                    var favicon = 'https://plus.google.com/_/favicon?domain=';
                    var faviconUrl = favicon + url;
                    var timestamp = Date.now();
                    var negTimestamp = -timestamp;
                    var publicLinksRef = rootRef.child('publicLinks');

                    if (localStorage.publicBrowsing == "true") {
                        console.log('public browsing should be  true and...');
                        console.log('localStorage.publicBrowsing is ', localStorage.publicBrowsing)
                        //insert both but in public make publicBrowsing false
                        if (title == "") {
                            console.log('empty title yo! we gonn skip the insert')
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
                        console.log('public browsing should be  false and...');
                        console.log('localStorage.publicBrowsing is ', localStorage.publicBrowsing)
                        //insert both but in public make publicBrowsing true
                        if (title == "") {
                            console.log('empty title yo! we gonn skip the insert')
                        } else {
                            var publicBrowsing = false;
                            publicLinksRef.push({
                                url, uid, title, displayName, email, photoUrl, faviconUrl, timestamp, negTimestamp, publicBrowsing
                            });

                            visitedLinksRef = uidRef.child('visitedLinks')

                            visitedLinksRef.push({
                                url, uid, title, displayName, email, photoUrl, faviconUrl, timestamp, negTimestamp, publicBrowsing
                            })
                        }
                    }


                } else {
                    console.log('uid is not there')
                }
            })

            //otherwise, we're getting a message from popup.js, meaning they clicked it again, or they've signed in for the first time
        } else {
            console.log('message coming from popup')

            var uid = localStorage.uid
            request.message.visitedLinks = 0;
            console.log('request.message = ', request.message)
            var userObject = {};
            userObject = request.message

            usersRef.once('value', function(snapshot) {
                if (!snapshot.hasChild(uid)) {
                		var uniqueIdRef = usersRef.child(uid);
                		uniqueIdRef.set(userObject)
                    console.log("userObject = ", userObject)
                    console.log('popup was clicked an no UID was found so we inserted your profile and data')
                } else {
                    console.log('already in db')
                }

            })


        }

    }, false);