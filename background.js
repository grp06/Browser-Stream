console.log('this is background.js');

chrome.runtime.onInstalled.addListener(function (object) {
    chrome.tabs.create({url: "http://jamilaskitchen.com/"}, function (tab) {
        console.log("New tab launched with http://jamilaskitchen.com/");
    });
});

var rootRef = new Firebase("https://search-feed-35574.firebaseio.com/");


// Create a callback which logs the current auth state
function authDataCallback(authData) {
    if (authData.token) {
        console.log('user is authenticated');
    } else {
        console.log('user isnt authenticated');
    }
}
// Register the callback to be fired every time auth state changes
rootRef.onAuth(authDataCallback);