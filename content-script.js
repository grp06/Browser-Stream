var url = window.location.href;
console.log('url is ', url)

chrome.runtime.sendMessage({url: url}, function(response) {
  // console.log(response.farewell);
});






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