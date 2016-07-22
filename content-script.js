var url = window.location.href;
console.log('url is ', url)

var rootRef = new Firebase("https://search-feed-35574.firebaseio.com/");



//upon installing the extension, prompt the user to sign into google
//once authenticated, on every page refresh, we should push the URL to the DB

//chrome.tabs.onUpdated.addListener(function callback)
//when a tab is updated, check to see if the user is authenticated?

// chrome.runtime.onMessage.addListener(
//     function(request, sender, sendResponse) {

//         request.accountData.url = url;
//         rootRef.push(request)
//         //figure out if this user has entries in the DB already
//         //just push the link information onto the "links" node of the db object
//         //if not, push a ref (to the right place)
//     });



// {
//     databaseId: {
//         uid: {
//             email: 'gpickett00@gmail.com',
//             photoUrl: 'https://lh3.googleusercontent.com/-1jmbT0mcSg0/AAAAAAAAAAI/AAAAAAAAA0s/PgBab-QXC4E/s96-c/photo.jpg',
//             links: [{
//                 date: 1042825710842,
//                 url: 'www.google.com',
//                 votes: 0,
//                 private: false
//             }, {
//                 date: 1042121710842,
//                 url: 'www.facebook.com',
//                 votes: 0,
//                 private: true
//             }, {
//                 date: 1042414710842,
//                 url: 'www.imgur.com',
//                 votes: 0,
//                 private: false
//             }]

//         }
//     },
//     {
//         uid: {
//             email: 'gpickett00@gmail.com',
//             photoUrl: 'https://lh3.googleusercontent.com/-1jmbT0mcSg0/AAAAAAAAAAI/AAAAAAAAA0s/PgBab-QXC4E/s96-c/photo.jpg',
//             links: [{
//                 date: 1042825710842,
//                 url: 'www.google.com',
//                 votes: 0,
//                 private: false
//             }, {
//                 date: 1042121710842,
//                 url: 'www.facebook.com',
//                 votes: 0,
//                 private: true
//             }, {
//                 date: 1042414710842,
//                 url: 'www.imgur.com',
//                 votes: 0,
//                 private: false
//             }]

//         }
//     }
// }