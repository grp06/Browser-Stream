console.log('config = ', config)

firebase.initializeApp(config);

var provider = new firebase.auth.GoogleAuthProvider();

if (localStorage.oauthToken == 'null') {
    console.log('no oauthToken, youre gonna see the signin button')
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

            if (displayName == null) {
                displayName = ''
            }

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

        siteBlock.appendChild(leftSide);
        siteBlock.appendChild(rightSide);

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

            usersRef.child(key).once('value', function(snap) {
                console.log('snap.val() = ', snap.val());

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
                var calculatedFollowers = 0
                usersRef.child(key).child('followers').once('value', function(babysnap) {

                    var babysnapVal = babysnap.val();
                    for (snap in babysnapVal) {
                        console.log('a follower is here')

                        calculatedFollowers++
                    }
                    followersNumber.innerHTML = calculatedFollowers

                })

                var followersTextDiv = document.createElement('div');
                var followersText = document.createTextNode('Followers');
                followersTextDiv.appendChild(followersText);

                var following = document.createElement('div');
                var followingNumber = document.createElement('div');
                var calculatedFollowing = 0;
                usersRef.child(myUid).child('following').once('value', function(babysnap) {

                    var babysnapVal = babysnap.val();
                    for (snap in babysnapVal) {
                        console.log(' followingis here')

                        calculatedFollowing++
                    }
                    followingNumber.innerHTML = calculatedFollowing

                })
                var followingTextDiv = document.createElement('div');
                var followingText = document.createTextNode('Following');
                followingTextDiv.appendChild(followingText);

                var followingButtonDiv = document.createElement('div');
                var followingButton = document.createElement('button');
                followingButton.setAttribute("data", snapshotValUid)

                var followingButtonText = document.createTextNode('Follow');
                followingButton.appendChild(followingButtonText);

                profilePage.className = "profile-page";

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


                    snapshot.forEach(function(childSnapshot) {
                        var childSnapshotVal = childSnapshot.val();
                        if (childSnapshotVal.uid === key) {
                            window.setTimeout(function() {
                                linkCount++;

                                linkDisplay.innerHTML = linkCount;

                            }, 300)

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
                snapshot.forEach(function(childSnapshot) {
                    var childSnapshotVal = childSnapshot.val()
                    if (childSnapshotVal.uid === key) {
                        // linkDisplay.innerHTML = linkCount;
                        var displayName = childSnapshotVal.displayName;
                        var faviconUrl = childSnapshotVal.faviconUrl;
                        var title = childSnapshotVal.title;
                        var title = title.split('').splice(0, 85).join('');

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
        //them
        var userToFollow = e.target.getAttribute('data');
        //go into users/them/followers and push myUid
        var addToFollowersRef = ref.child('users').child(userToFollow).child('followers')
            //go into users/myUid/following and push userToFollow
        var addToFollowingRef = ref.child('users').child(myUid).child('following');

        addToFollowersRef.once('value', function(snapshot) {
            var followingThem = false


            if (userToFollow == myUid) {
                console.log('you cant be added to your own followers list!');
                followingThem = true;
            } else if (snapshot.val() === 0) {
                addToFollowersRef.child(myUid).set("true");
                followingThem = true;
                console.log('followers array was empty before, now youre the first follower')
            } else {
                //loop through the UIDs of their followers and make sure youre not following them already
                snapshot.forEach(function(childSnapshot) {
                    if (childSnapshot.val() == myUid) {
                        console.log('already following')
                        followingThem = true;
                        return
                    } else {
                        followingThem = false;
                    }
                })
            }
            if (!followingThem) {
                console.log('weve checked all UIDs in their "followers" array and my UID isnt there, lets push my UID')
                console.log('test1111')

                addToFollowersRef.child(myUid).set("true");
            }
        })

        addToFollowingRef.once('value', function(snap) {
            var addedToMyFollowing = false

            if (userToFollow == myUid) {
                console.log('you cant be added to your own following list!');
                addedToMyFollowing = true;
            } else if (snap.val() === 0) {
                addToFollowingRef.child(userToFollow).set("true");
                addedToMyFollowing = true;
                console.log('following array was empty before, now hes the first on my following')
            } else {
                //loop through all the UIDs of people I'm following and make sure I'm not already following them
                snap.forEach(function(childSnapshot) {
                    if (childSnapshot.val() == userToFollow) {
                        console.log('already following')
                        addedToMyFollowing = true;
                        return
                    } else {
                        addedToMyFollowing = false;
                    }
                })
            }
            if (!addedToMyFollowing) {
                console.log('weve checked all UIDs in my "following" array and their uid isnt there, lets push their uid');
                console.log('test222')
                addToFollowingRef.child(userToFollow).set("true");
            }
        })
    }


    window.onload = function() {
        document.getElementById('sign-out').addEventListener('click', signOut, false);

        function signOut() {
            firebase.auth().signOut().then(function() {
                localStorage.setItem('displayName', "");
                localStorage.setItem('email', "");
                localStorage.setItem('uid', "");
                localStorage.setItem('photoUrl', "");
                localStorage.setItem('newUser', "");
                localStorage.setItem('oauthToken', null);
                console.log('localStorage.displayName = ', localStorage.displayName)
                console.log('localStorage.email = ', localStorage.email)
                console.log('localStorage.uid = ', localStorage.uid)
                console.log('localStorage.photoUrl = ', localStorage.photoUrl)
                console.log('localStorage.newUser = ', localStorage.newUser)
                console.log('localStorage.oauthToken = ', localStorage.oauthToken)

                console.log('signOut sucessful')
                window.location.reload(true)
            }, function(error) {
                console.log(error)
            });
        }




    }
}