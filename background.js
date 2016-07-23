var rootRef = new Firebase("https://search-feed-35574.firebaseio.com/");

if (localStorage.userIsAuthenticated) {
    rootRef.once('value', function(snapshot) {
        if (snapshot.hasChild('publicLinks')) {
            console.log('publicLinks already created')
        } else {
            publicLinksRef = rootRef.child('publicLinks')
            publicLinksRef.set(0);
            console.log('public links just got made')
        }
    })
    console.log('user is authenticaled')
    chrome.runtime.onMessage.addListener(
        //listen for messages
        function(request, sender, sendResponse) {
            //url is coming in from a content script, use localStorage.uid to make database call
            if (request.url) {
                console.log('message coming from content script')
                var uid = localStorage.uid;
                var url = request.url;

                var userRef = rootRef.child(uid);
                var linksRef = userRef.child('visitedLinks');

                linksRef.push(url)

                var publicLinksRef = rootRef.child('publicLinks');
                publicLinksRef.push(url);




                //otherwise, we're getting a message from popup.js, meaning they clicked it again, or they've signed in for the first time
            } else {
                console.log('message coming from popup')

                //here we're passing in all the data from the person's Google user account
                var googleUID = request.accountData.uid
                request.accountData.visitedLinks = 0;
               
                rootRef.once('value', function(snapshot) {
                    if (snapshot.hasChild(googleUID)) {
                        //user has authenticated before, they just happened to click the popup again
                        console.log('already authenticated, you just clicked the popup again')
                    } else {
                        console.log('users first DB entry');
                        //if they're not in the database yet, we need to push userObject to the DB
                        //and push their current url to the publicLinks array
                        childRef = rootRef.child(googleUID);
                        childRef.set(request.accountData)
                    }
                })
            }

            //figure out if this user has entries in the DB already
            //just push the link information onto the "links" node of the db object
            //if not, push a ref (to the right place)
            // console.log(sender)
        });
} else {
    console.log('user isnt authenticated')
}