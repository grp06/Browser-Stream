var url = window.location.href;
var title = document.title;
// console.log('CONTENT SCRIPT');
// console.log('URL is ', url)

var displayName = localStorage.displayName;
var email = localStorage.email;
var newUser = localStorage.newUser;
var oauthToken = localStorage.oauthToken;
var photoUrl = localStorage.photoUrl;
var uid = localStorage.uid;

// console.log('localStorage.displayName = ', displayName)
// console.log('localStorage.email = ', email)
console.log('localStorage.newUser = ', newUser)
// console.log('localStorage.oauthToken = ', oauthToken)
// console.log('localStorage.photoUrl = ', photoUrl)

// console.log('localStorage.uid = ', localStorage.uid)
if (email == "") {
    console.log('we must have pressed LOGOUT')

    chrome.runtime.sendMessage({
        loggedOut: "true"
    }, function(response) {
        // console.log(response.farewell);
    });


} else if (newUser == "true" && oauthToken != "null") {
    console.log('page completed loading, we just got authenticated')
    chrome.runtime.sendMessage({
        url: url,
        title: document.title,
        oauthToken: oauthToken,
        uid: uid,
        photoUrl: photoUrl,
        email: email,
        displayName: displayName,
        newUser: 'true'
    }, function(response) {
        // console.log(response.farewell);
    });

    localStorage.setItem('newUser', 'false');
} else if (oauthToken == "null") {
    console.log('oauthToken === null')
    console.log('oauthToken = ', oauthToken)
    localStorage.setItem("newUser", "")

} else {
    console.log('we have a valid title and we arent a new user')
    chrome.runtime.sendMessage({
        url: url,
        title: title,
        newUser: "false"
    }, function(response) {
        // console.log(response.farewell);
    });


}




// chrome.runtime.sendMessage({greeting: "hello"}, function(response) {

// 	console.log('content script receiving UID from background and its ', response.farewell)
//   localStorage.setItem('uid', response.farewell)
//   console.log('I think weve received the response, lets set localstorage')
// });

// chrome.tabs.query({active:true,currentWindow:true},function(tabs){
//   //tabs is an array even if there is only one result
//   var message = "stuff goes here";
//   chrome.tabs.sendMessage(tabs[0].id,message,function(response){
//     //in case you want a response
//   });
// });




//chrome.tabs.onUpdated.addListener(function callback)
//when a tab is updated, check to see if the user is authenticated?









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