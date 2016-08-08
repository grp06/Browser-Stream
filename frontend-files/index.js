var config = {
    apiKey: "AIzaSyBZtw9sDtZKhI5Q6w--kwulEpv6d8UPUwo",
    authDomain: "search-feed-35574.firebaseapp.com",
    databaseURL: "https://search-feed-35574.firebaseio.com",
    storageBucket: "search-feed-35574.appspot.com",
};

firebase.initializeApp(config);

var provider = new firebase.auth.GoogleAuthProvider();

if (localStorage.oauthToken == 'null') {
    console.log('no oauthToken, gonna sign in then set some localStorage')
    var topNav = document.querySelectorAll('.top-nav');
    topNav[0].classList.add('hidden')
    var container = document.getElementById('container');
    container.classList.add('hidden');

    function signIn() {
        firebase.auth().signInWithPopup(provider).then(function(result) {
            var token = result.credential.idToken;
            var user = result.user;
            var uid = user.uid;
            var photoUrl = user.providerData[0].photoURL;
            var email = user.providerData[0].email;
            var displayName = user.providerData[0].displayName;

            localStorage.setItem('oauthToken', token);
            localStorage.setItem('uid', uid);
            localStorage.setItem('photoUrl', photoUrl);
            localStorage.setItem('email', email);
            localStorage.setItem('displayName', displayName);
            localStorage.setItem('newUser', "true");
            console.log('signed in and local storage set, gonna force a reload')

            window.location.reload(true)
        }).catch(function(error) {
            var errorCode = error.code;
            var errorMessage = error.message;
            var email = error.email;
            var credential = error.credential;
        });
    }

    window.onload = function() {
        console.log('loaded')
        document.getElementById('sign-in').addEventListener('click', signIn, false);
    }

} else {

    if (localStorage.uid) {
        var myUid = localStorage.uid;
        console.log('myUid is ', myUid)
    } else {
        console.log('no uid available')
    }

    var signInSection = document.getElementById('sign-in-section');
    signInSection.classList.add('hidden')
    var ref = new Firebase("https://search-feed-35574.firebaseio.com/");
    var totalLinks = 0;
    var totalClicks = 0;
    var clickedLinksRef = ref.child('clickedLinks');
    var publicLinksRef = ref.child('publicLinks');



    publicLinksRef.limitToLast(100).on('child_added', function(childSnapshot, prevChildKey) {
        console.log('child added!')
        var value = childSnapshot.val();
        console.log('value = ', value)
        var key = childSnapshot.key();

        var timestamp = value.timestamp;
        var niceTime = moment(timestamp).fromNow()
        var shortenedTitle = value.title.split('').splice(0, 85).join('');
        var timeAgo = moment("20111031", "YYYYMMDD").fromNow()
        var firstElement = document.getElementsByClassName('site-block')[0];

        var container = document.getElementById('container')
        var siteBlock = document.createElement('div');
        var leftSide = document.createElement('div');
        var profPic = document.createElement('div');
        var profImg = document.createElement('img')
        var rightSide = document.createElement('div');
        var favicon = document.createElement('div');
        var favImg = document.createElement('img');
        var siteTitle = document.createElement('div');
        var siteLink = document.createElement('a');
        var linkText = document.createTextNode(shortenedTitle);
        var timePosted = document.createElement('div');
        var time = document.createTextNode(niceTime)
        var valueUid = value.uid;

        siteBlock.className = "site-block";
        leftSide.className = "left-side";
        profPic.className = "prof-pic";
        profPic.setAttribute("data", valueUid)
        rightSide.className = "right-side";
        favicon.className = "favicon";
        siteTitle.className = "site-title";
        timePosted.className = "time-posted";

        profImg.src = value.photoUrl;
        favImg.src = value.faviconUrl;
        siteLink.href = value.url;

        profPic.appendChild(profImg);
        leftSide.appendChild(profPic);
        rightSide.appendChild(favicon);
        favicon.appendChild(favImg);
        siteLink.appendChild(linkText)
        siteTitle.appendChild(siteLink);
        rightSide.appendChild(siteTitle)
        timePosted.appendChild(time);
        rightSide.appendChild(timePosted)

        siteBlock.appendChild(leftSide);
        siteBlock.appendChild(rightSide);

        // siteBlock.style.opacity = 0;
        // var steps = 0;
        // var timer = setInterval(function() {
        //     steps++;
        //     siteBlock.style.opacity = 0.1 * steps;
        //     if (steps >= 10) {
        //         clearInterval(timer);
        //         timer = undefined;
        //     }
        // }, 50);

        container.insertBefore(siteBlock, firstElement)

        var deleteButton = document.createElement('i');
        deleteButton.className = "delete-button fa fa-times fa-3";
        deleteButton.setAttribute("aria-hidden", true)
        deleteButton.setAttribute("key", key)
        if (valueUid == myUid) {
            siteBlock.appendChild(deleteButton);
        }
    });

    ref.child("publicLinks").on("value", function(snapshot) {
        var snap = snapshot.val();
        for (key in snap) {
            totalLinks++;
        }
        var totalLinksSpan = document.getElementById('total-links');
        totalLinksSpan.innerHTML = totalLinks;
        totalLinks = 0;
    })

    ref.child("clickedLinks").on("value", function(childSnapshot) {
        var snap = childSnapshot.val();
        for (key in snap) {
            totalClicks++;
        }

        var totalClicksSpan = document.getElementById('total-clicks');
        totalClicksSpan.innerHTML = totalClicks;
        totalClicks = 0;
    })


    window.onload = function() {
        document.getElementById('sign-out').addEventListener('click', signOut, false);

        function signOut() {
            firebase.auth().signOut().then(function() {
                localStorage.setItem('oauthToken', null);
                localStorage.setItem('newUser', "true");
                console.log('localStorage.oauthToken = ', localStorage.oauthToken)
                console.log('signOut sucessful')
                window.location.reload(true)
            }, function(error) {
                console.log(error)
            });
        }

        window.setTimeout(function() {

            var list = document.querySelectorAll(".site-block");

            var length = list.length;
            for (var i = 0; i < length; i++) {
                list[i].addEventListener('click', pushClickedLink, false);
            }

            function pushClickedLink(e) {
                e.preventDefault();
                clickedLinksRef.once('value', function(snapshot) {
                    var url = e.target.href
                    if (e.target.href) {
                        console.log('clicked a link')
                        clickedLinksRef.push(url);
                        window.location = url;
                    }
                })
            }

            var deleteButton = document.querySelectorAll(".delete-button");
            for (var i = 0; i < deleteButton.length; i++) {
                deleteButton[i].addEventListener('click', deleteRecord, false);
            }

            function deleteRecord(e) {
                console.log('hi')
                var key = e.target.getAttribute('key');

                var publicLinksRef = ref.child("publicLinks")
                publicLinksRef.child(key).remove();
                e.target.parentNode.className = "disappear"

            }

            var profPic = document.querySelectorAll(".prof-pic");



            for (var i = 0; i < profPic.length; i++) {
                profPic[i].addEventListener('click', showProfile, false);
            }

            function showProfile(e) {
                var key = this.getAttribute('data')
                console.log(key)
                var userRef = ref.child("users");
                userRef.child(key).once("value", function(childSnapshot) {
                    var userObject = childSnapshot.val();
                    var userLinks = userObject.visitedLinks;
                    console.log(userLinks)
                })

            }

        }, 6000)
    }
}