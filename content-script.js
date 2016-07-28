var url = window.location.href;
console.log('url is ', url)


chrome.runtime.sendMessage({
	url: url,
	title: document.title
}, function(response) {
  // console.log(response.farewell);
});


chrome.runtime.sendMessage({greeting: "hello"}, function(response) {
  localStorage.setItem('uid', response.farewell)

});

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