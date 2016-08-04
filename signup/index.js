


 var config = {
     apiKey: "AIzaSyBZtw9sDtZKhI5Q6w--kwulEpv6d8UPUwo",
     authDomain: "search-feed-35574.firebaseapp.com",
     databaseURL: "https://search-feed-35574.firebaseio.com",
     storageBucket: "search-feed-35574.appspot.com",
 };

 firebase.initializeApp(config);


 var provider = new firebase.auth.GoogleAuthProvider();

 function signIn () {
   console.log('clicked')
   firebase.auth().signInWithPopup(provider).then(function(result) { 
    console.log('result = ', result)
     // This gives you a Google Access Token. You can use it to access the Google API.
     var token = result.credential.idToken;
     localStorage.setItem('oauthToken', token)
     localStorage.setItem('userIsAuthenticated', 'true')
     console.log('localStorage.oauthToken = ' , localStorage.oauthToken)


     // The signed-in user info.
     var user = result.user;
     console.log('user = ', user)
     // ...
   }).catch(function(error) {
     // Handle Errors here.
     var errorCode = error.code;
     console.log('errorCode = ', errorCode)

     var errorMessage = error.message;
     console.log('errorMessage = ', errorMessage)

     // The email of the user's account used.
     var email = error.email;
     console.log('email = ', email)

     // The firebase.auth.AuthCredential type that was used.
     var credential = error.credential;
     console.log('credential = ', credential)

     // ...
   });
 }

 function signOut (){
   firebase.auth().signOut().then(function() {
    localStorage.setItem('oauthToken', null);
    console.log('localStorage.oauthToken = ' , localStorage.oauthToken)

     console.log('signOut sucessful')
   }, function(error) {
     console.log(error)
   });
 }


window.onload = function (){
  console.log('loaded')
  document.getElementById('sign-in').addEventListener('click', signIn, false);
  document.getElementById('sign-out').addEventListener('click', signOut, false);



}
