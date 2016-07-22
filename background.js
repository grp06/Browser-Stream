
// chrome.runtime.onInstalled.addListener(function (object) {
//     chrome.tabs.create({url: "http://jamilaskitchen.com/"}, function (tab) {
//         console.log("New tab launched with http://jamilaskitchen.com/");
//     });
// });

var rootRef = new Firebase("https://search-feed-35574.firebaseio.com/");


// Create a callback which logs the current auth state
if(localStorage.userIsAuthenticated){
	console.log('user is authenticated');
	chrome.runtime.onMessage.addListener(
	    function(request, sender, sendResponse) {
	    		//here we're passing in all the data from the person's Google user account
	    		var googleUID = request.accountData.uid
	    		//then we make a new object with the key as their google UID and the value all the account data
	    		var userObject = {};
	    		var value = request.accountData
	    		userObject[googleUID] = value;
	    		console.log(googleUID)
	    		rootRef.once('value', function(snapshot){
	    			if(snapshot.hasChild(googleUID)){
	    				console.log(snapshot)
	    				console.log(googleUID)
	    				console.log('already in database, lets just push the url to the account url bit to the public links array')
	    			} else {
	    				console.log('not in database, lets insert the whole users object and push url to the public links array')
	    			}
	    		})
	        // rootRef.set(userObject)
	        //figure out if this user has entries in the DB already
	        //just push the link information onto the "links" node of the db object
	        //if not, push a ref (to the right place)
	        // console.log(sender)
	    });
} else {
	console.log('user isnt authenticated')
}

