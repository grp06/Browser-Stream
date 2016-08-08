var url = window.location.href;
var title = document.title;
console.log('content script firing');

var oauthToken = localStorage.getItem('oauthToken')
var uid = localStorage.getItem('uid')
var photoUrl = localStorage.getItem('photoUrl')
var email = localStorage.getItem('email')
var displayName = localStorage.getItem('displayName')
var newUser = localStorage.getItem('newUser');
console.log('newUser = ', newUser)

if (newUser == "true") {
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
} else if ( title == "") {
	console.log('not a new user, but theres no title')

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