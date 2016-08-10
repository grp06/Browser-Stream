var config = {
    apiKey: "AIzaSyBZtw9sDtZKhI5Q6w--kwulEpv6d8UPUwo",
    authDomain: "search-feed-35574.firebaseapp.com",
    databaseURL: "https://search-feed-35574.firebaseio.com",
    storageBucket: "search-feed-35574.appspot.com",
};

firebase.initializeApp(config);

var provider = new firebase.auth.GoogleAuthProvider();

if (localStorage.oauthToken == 'null') {
<<<<<<< HEAD
    console.log('no oauthToken, gonna sign in then set some localStorage')
=======
>>>>>>> c79db5cf372282360a607d96b915f81a25482c9e
    var topNav = document.querySelectorAll('.top-nav');
    topNav[0].classList.add('hidden')
    var container = document.getElementById('container');
    container.classList.add('hidden');

    function signIn() {
        firebase.auth().signInWithPopup(provider).then(function(result) {
            var token = result.credential.idToken;
<<<<<<< HEAD
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
            console.log(error)
        });
    }

    window.onload = function() {
        document.getElementById('sign-in').addEventListener('click', signIn, false);
    }

} else {

    if (localStorage.uid) {
        var myUid = localStorage.uid;
        console.log('myUid is ', myUid)
    } else {
        console.log('no uid available')
    }









    var appendSiteBlocks = function(snapshot) {
        var publicLinksKey = snapshot.key();
        var snapshotVal = snapshot.val();

        var timestamp = snapshotVal.timestamp;
        var niceTime = moment(timestamp).fromNow()

=======
            localStorage.setItem('oauthToken', token)
            var user = result.user;
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
    var signInSection = document.getElementById('sign-in-section');
    signInSection.classList.add('hidden')
    var onloadTimestamp;
    var ref = new Firebase("https://search-feed-35574.firebaseio.com/");
    var lastLoaded;
    var totalLinks = 0;
    var totalClicks = 0;
    var clickedLinksRef = ref.child('clickedLinks');
    var publicLinksRef = ref.child('publicLinks');

    if (localStorage.uid) {
        var myUid = localStorage.uid;
        console.log('myUid is ', myUid)
    } else {
        console.log('no uid available')
    }

    publicLinksRef.limitToLast(100).on('child_added', function(childSnapshot, prevChildKey) {
        console.log('child added!')
        var value = childSnapshot.val();
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
>>>>>>> c79db5cf372282360a607d96b915f81a25482c9e

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

<<<<<<< HEAD
        var shortenedTitle = snapshotVal.title.split('').splice(0, 85).join('');
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
        var snapshotValUid = snapshotVal.uid;

        siteBlock.className = "site-block animated fadeIn";
        leftSide.className = "left-side";
        profPic.className = "prof-pic";
        profPic.setAttribute("data", snapshotValUid)
        rightSide.className = "right-side";
        favicon.className = "favicon";
        siteTitle.className = "site-title";
        timePosted.className = "time-posted";

        profImg.src = snapshotVal.photoUrl;
        favImg.src = snapshotVal.faviconUrl;
        siteLink.href = snapshotVal.url;
        siteLink.id = "site-link";

        profPic.appendChild(profImg);
        leftSide.appendChild(profPic);
        rightSide.appendChild(favicon);
        favicon.appendChild(favImg);
        siteLink.appendChild(linkText)
        siteTitle.appendChild(siteLink);
        rightSide.appendChild(siteTitle)
        timePosted.appendChild(time);
        rightSide.appendChild(timePosted)
        siteBlock.id = snapshot.key();
=======
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
>>>>>>> c79db5cf372282360a607d96b915f81a25482c9e

        siteBlock.appendChild(leftSide);
        siteBlock.appendChild(rightSide);

<<<<<<< HEAD
        container.insertBefore(siteBlock, firstElement)

        var deleteButton = document.createElement('i');
        deleteButton.className = "delete-button fa fa-times fa-3";
        deleteButton.setAttribute("aria-hidden", true)
        deleteButton.setAttribute("publicLinksKey", publicLinksKey);

        //if this is my own post,I should be able to delete it
        if (snapshotValUid == myUid) {
            function deleteRecord(e) {
                console.log('we should delete the proflink too')
                var publicLinksKey = e.target.getAttribute('publicLinksKey');
                console.log('event.target = ', event.target)
                console.log('publicLinksKey = ', publicLinksKey)

                publicLinksRef.child(publicLinksKey).remove();
                e.target.parentNode.className = "disappear"
            }
            siteBlock.appendChild(deleteButton);
            deleteButton.addEventListener('click', deleteRecord, false);
        }

        var list = document.querySelectorAll(".site-block");

        var siteVisit = document.getElementById('site-link');
        siteVisit.addEventListener('click', pushClickedLink, false);

        function pushClickedLink(e) {
            console.log('siteblock clicked')
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

        profPic.addEventListener('click', showProfile, false);

        function showProfile(e) {
            var key = this.getAttribute('data')
            console.log('users profile UID = ', key)

            var siteBlocks = document.getElementsByClassName('site-block')

            for (var i = 0; i < siteBlocks.length; i++) {
                siteBlocks[i].style.visibility = 'hidden';
            }

            usersRef.child(key).once('value', function(snap){
              console.log(snap.val());

              var childSnapshotVal = snap.val();
              var profLink = childSnapshotVal.photoUrl;
              var displayName = childSnapshotVal.displayName;

              var container = document.getElementById('container');

              var profilePage = document.createElement('div');

              var profileContainer = document.createElement('div');
              var ppLeftSide = document.createElement('div');
              var ppProfPic = document.createElement('div');
              var ppProfImg = document.createElement('img');
              ppProfImg.src = profLink;
              var displayNameDiv = document.createElement('div');
              var displayNameText = document.createTextNode(displayName);
              displayNameDiv.appendChild(displayNameText);

              var ppRightSide = document.createElement('div');
              var userStats = document.createElement('div');

              var links = document.createElement('div');
              var linksNumber = document.createElement('div');
              var linksNumberText = document.createTextNode(0);
              linksNumber.appendChild(linksNumberText);
              var linksTextDiv = document.createElement('div');
              var linksText = document.createTextNode('Links');
              linksTextDiv.appendChild(linksText);


              var followers = document.createElement('div');
              var followersNumber = document.createElement('div');
              var followersNumberText = document.createTextNode('0');
              followersNumber.appendChild(followersNumberText);
              var followersTextDiv = document.createElement('div');
              var followersText = document.createTextNode('Followers');
              followersTextDiv.appendChild(followersText);

              var following = document.createElement('div');
              var followingNumber = document.createElement('div');
              var followingNumberText = document.createTextNode('0');
              followingNumber.appendChild(followingNumberText);
              var followingTextDiv = document.createElement('div');
              var followingText = document.createTextNode('Following');
              followingTextDiv.appendChild(followingText);

              var followingButtonDiv = document.createElement('div');
              var followingButton = document.createElement('button');
              followingButton.setAttribute("data", snapshotValUid)

              var followingButtonText = document.createTextNode('Follow');
              followingButton.appendChild(followingButtonText);

              profilePage.className = "profile-page animated fadeIn";

              profileContainer.className = "profile-container";
              ppLeftSide.className = "pp-left-side";
              ppProfPic.className = "pp-prof-pic";
              displayNameDiv.className = "display-name-div";
              ppRightSide.className = "pp-right-side";
              userStats.className = "user-stats";
              links.className = "links";
              linksNumber.className = "links-number";
              linksTextDiv.className = "links-text-div";
              followers.className = "followers";
              followersNumber.className = "followers-number";
              followersTextDiv.className = "followers-text-div";
              following.className = "following";
              followingNumber.className = "following-number";
              followingTextDiv.className = "following-text-div";
              followingButtonDiv.className = "following-button-div";
              followingButton.className = "following-button";
              followingButtonDiv.addEventListener('click', toggleFollow, false);


              container.appendChild(profilePage);


              profilePage.appendChild(profileContainer);
              profileContainer.appendChild(ppLeftSide);
              var closeProfileDiv = document.createElement('div');
              var closeProfileIcon = document.createElement('i');
              var closeText = document.createTextNode('Close');
              closeProfileIcon.className = "close-profile-button fa fa-times fa-3";
              closeProfileDiv.className = "close-profile-div";
              closeProfileDiv.appendChild(closeText);
              closeProfileDiv.appendChild(closeProfileIcon);

              profileContainer.appendChild(closeProfileDiv);
              ppLeftSide.appendChild(displayNameDiv);

              ppLeftSide.appendChild(ppProfPic);
              ppProfPic.appendChild(ppProfImg);
              ppLeftSide.appendChild(followingButtonDiv);

              profileContainer.appendChild(ppRightSide);
              ppRightSide.appendChild(userStats);
              userStats.appendChild(links);
              links.appendChild(linksNumber);
              links.appendChild(linksTextDiv);
              userStats.appendChild(followers);
              followers.appendChild(followersNumber);
              followers.appendChild(followersTextDiv);
              userStats.appendChild(following);
              following.appendChild(followingNumber);
              following.appendChild(followingTextDiv);
              followingButtonDiv.appendChild(followingButton);

              var linkDisplay = document.getElementsByClassName('links-number')[0];
              console.log('linkDisplay =', linkDisplay)
              var linkCount = 0;

              publicLinksRef.on('value', function(snapshot) {


                snapshot.forEach(function(childSnapshot){
                  var childSnapshotVal = childSnapshot.val();
                  if (childSnapshotVal.uid === key) {
                      window.setTimeout(function(){
                        linkCount++;

                        linkDisplay.innerHTML = linkCount;

                      },300)

                    }
                })


                })

              closeProfileDiv.addEventListener('click', closeProfile, false)

              function closeProfile() {
                  var profileLinksContainer = document.getElementsByClassName('profile-links-container')[0];
                  var siteBlocks = document.getElementsByClassName('site-block');
                  container.removeChild(profilePage);
                  container.removeChild(profileLinksContainer);
                  for (var i = 0; i < siteBlocks.length; i++) {
                      siteBlocks[i].style.visibility = "visible"
                  }
              }




            })


            var profileLinksContainer = document.createElement('div');
            profileLinksContainer.className = "profile-links-container animated fadeIn";
            container.appendChild(profileLinksContainer);


            publicLinksRef.orderByChild('negTimestamp').on('value', function(snapshot) {

                console.log('snapshot = ', snapshot.val())









                snapshot.forEach(function(childSnapshot) {


                  var childSnapshotVal = childSnapshot.val()


                   








                    if (childSnapshotVal.uid === key) {
                        // linkDisplay.innerHTML = linkCount;


                        var displayName = childSnapshotVal.displayName;
                        var faviconUrl = childSnapshotVal.faviconUrl;
                        var title = childSnapshotVal.title;
                        var url = childSnapshotVal.url;
                        var timestamp = childSnapshotVal.timestamp;
                        var niceTime = moment(timestamp).fromNow();

                        var ppLinkBox = document.createElement('div');
                        ppLinkBox.className = "pp-link-box";

                        var time = document.createElement('div');
                        var timeText = document.createTextNode(niceTime);
                        time.appendChild(timeText);
                        time.className = "time-posted";

                        var favicon = document.createElement('img');
                        favicon.src = faviconUrl;
                        ppLinkBox.appendChild(favicon);
                        var link = document.createElement('a');
                        link.href = url;
                        link.id = 'site-link';
                        var linkText = document.createTextNode(title);
                        link.appendChild(linkText);
                        ppLinkBox.appendChild(link);
                        ppLinkBox.appendChild(time);

                        profileLinksContainer.appendChild(ppLinkBox)




                    }

                })
            })


        }




        console.log('nodes appended')


    }

    var signInSection = document.getElementById('sign-in-section');
    signInSection.classList.add('hidden')

    var ref = new Firebase("https://search-feed-35574.firebaseio.com/");
    var totalLinks = 0;
    var totalClicks = 0;
    var clickedLinksRef = ref.child('clickedLinks');
    var publicLinksRef = ref.child('publicLinks');
    var usersRef = ref.child("users");






    publicLinksRef.on('child_added', function(snapshot) {

        appendSiteBlocks(snapshot)
    });

    publicLinksRef.on('child_removed', function(snapshot) {

        var itemToRemove = document.getElementById(snapshot.key());

        itemToRemove.remove();
        console.log('item removed')
    });



    publicLinksRef.on("value", function(snapshot) {
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

    function toggleFollow(e) {
        var data = e.target.getAttribute('data');
        console.log(data)



        ref.child('users').child(data).once('value', function(snapshot) {
            console.log(snapshot.val())
        })
    }


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




    }
=======

            for (var i = 0; i < profPic.length; i++) {
                profPic[i].addEventListener('click', showProfile, false);
            }

            function showProfile (e){
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
>>>>>>> c79db5cf372282360a607d96b915f81a25482c9e
}