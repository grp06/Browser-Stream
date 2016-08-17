firebase.initializeApp(config);
var ref = new Firebase("https://search-feed-35574.firebaseio.com/");
var totalLinks = 0;
var totalClicks = 0;
var clickedLinksRef = ref.child('clickedLinks');
var publicLinksRef = ref.child('publicLinks');
var usersRef = ref.child("users");
var provider = new firebase.auth.GoogleAuthProvider();
var showProfile;
var profileOpen = true;



if (localStorage.oauthToken == 'null') {
    console.log('oauthToken is null, you must have logged out')
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

            if(localStorage.oauthToken == undefined){
              localStorage.setItem('newUser', "true");
              console.log('localStorage tells me that weve not seen you in these parts')

            } else {
              localStorage.setItem('newUser', "false");
              console.log('localStorage tells me that youve been here before')


            }

            localStorage.setItem('oauthToken', token);
            localStorage.setItem('uid', uid);
            localStorage.setItem('photoUrl', photoUrl);
            localStorage.setItem('loggedOut', 'false');
            localStorage.setItem('email', email);
            localStorage.setItem('displayName', displayName);
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
        // console.log('myUid is ', myUid)
    } else {
        console.log('no uid available')
    }


    container = document.getElementById('container')

    var anonymousPublicButton = document.createElement('div');
    anonymousPublicButton.innerHTML = "Anonymous Public Links";
    anonymousPublicButton.className = "anonymous-public-links selected";
    anonymousPublicButton.addEventListener('click', showPublicLinks, null);

    var peopleImFollowingButton = document.createElement('div');
    peopleImFollowingButton.innerHTML = "People I\'m following";
    peopleImFollowingButton.className = "people-im-following";

    peopleImFollowingButton.addEventListener('click', showPeopleImFollowing, null);

    var me = document.createElement('div');
    me.innerHTML = "Me";
    me.className = "me";
    me.setAttribute('data', myUid)
    me.addEventListener('click', showMe, null);

    function showMe(e) {
        me.className = "me selected"
        localStorage.setItem('anonymous', 'false');

        anonymousPublicButton.className = "anonymous-public-links"
        peopleImFollowingButton.className = "people-im-following"


        var siteBlocks = document.getElementsByClassName('site-block');
        var userUid = document.getElementsByClassName('prof-pic');
        //cycle through all site blocks

        for (var i = 0; i < userUid.length; i++) {

            //grab the uid of user in current site block
            var testUid = userUid[i].getAttribute('data')

            if (testUid == myUid) {
                userUid[i].style.display = "block"
                siteBlocks[i].style.display = "flex"
                userUid[i].addEventListener('click', showProfile, null)

            } else {
                siteBlocks[i].style.display = "none"

            }
        }
    }


    function showPeopleImFollowing() {
        localStorage.setItem('anonymous', 'false');
        peopleImFollowingButton.className = "people-im-following selected"
        anonymousPublicButton.className = "anonymous-public-links"
        me.className = "me"

        var siteBlocks = document.getElementsByClassName('site-block');
        var profPic = document.getElementsByClassName('prof-pic');

        var imFollowing = {};
        ref.child('users').child(myUid).child('following').once('value', function(snap) {
            snap.forEach(function(babysnap) {
                imFollowing[babysnap.key()] = true;
            })

            console.log('imFollowing = ', imFollowing)





            var userUid = document.getElementsByClassName('prof-pic');
            //cycle through all site blocks
            for (var i = 0; i < userUid.length; i++) {

                //grab the uid of user in current site block
                var testUid = userUid[i].getAttribute('data')

                if (imFollowing.hasOwnProperty(testUid)) {
                    userUid[i].style.display = "block"
                    siteBlocks[i].style.display = "flex"
                } else {
                    siteBlocks[i].style.display = "none"
                    userUid[i].style.display = "none"


                }
            }


        })

    }

    function showPublicLinks() {
        localStorage.setItem('anonymous', 'true');

        anonymousPublicButton.className = "anonymous-public-links selected"
        peopleImFollowingButton.className = "people-im-following"
        me.className = "me"


        var siteBlocks = document.getElementsByClassName('site-block');
        var userUid = document.getElementsByClassName('prof-pic');
        //cycle through all site blocks
        for (var i = 0; i < userUid.length; i++) {


            userUid[i].style.display = "none"
            siteBlocks[i].style.display = "flex"

        }
    }


    var buttonsContainer = document.createElement('div');
    buttonsContainer.className = "buttons-container";
    buttonsContainer.appendChild(anonymousPublicButton)
    buttonsContainer.appendChild(peopleImFollowingButton)
    buttonsContainer.appendChild(me)

    container.appendChild(buttonsContainer)


    var appendSiteBlocks = function(snapshot) {
        var profPic;
        var container;
        var mainAppend = function() {


            var publicLinksKey = snapshot.key();
            var snapshotVal = snapshot.val();

            var timestamp = snapshotVal.timestamp;
            var niceTime = moment(timestamp).fromNow()

            var shortenedTitle = snapshotVal.title.split('').splice(0, 85).join('');
            var timeAgo = moment("20111031", "YYYYMMDD").fromNow()
            var firstElement = document.getElementsByClassName('site-block')[0];

            container = document.getElementById('container')
            var siteBlock = document.createElement('div');
            var leftSide = document.createElement('div');
            profPic = document.createElement('div');
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
            if (localStorage.tab == "public") {
                profPic.className = "prof-pic";
                var siteBlocks = document.getElementsByClassName('site-block');
                var userUid = document.getElementsByClassName('prof-pic');
                //cycle through all site blocks
                for (var i = 0; i < userUid.length; i++) {


                    userUid[i].style.display = "none"
                    siteBlocks[i].style.display = "flex"

                }
            } else if (localStorage.tab == "following") {
                profPic.className = "prof-pic-show";
                var userUid = document.getElementsByClassName('prof-pic');
                for (var i = 0; i < userUid.length; i++) {
                    console.log(userUid.getAttribute('data'))
                    if (userUid.getAttribute('data') == myUid) {
                        userUid[i].style.display = "none"
                        siteBlocks[i].style.display = "none"

                    }


                }




            } else {
                profPic.className = "prof-pic";

            }
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
        }
        mainAppend();


        profPic.addEventListener('click', showProfile, false);

        showProfile = function(e) {


            var existingProfilePage = document.getElementsByClassName('profile-page')[0];
            var existingProfileLinks = document.getElementsByClassName('profile-links-container')[0];

            var container = document.getElementById('container')
            if (existingProfilePage) {
                container.removeChild(existingProfilePage)
                container.removeChild(existingProfileLinks);
                console.log('removed')
            }

            window.scrollTo(0, 0)
            var key = this.getAttribute('data')

            var siteBlocks = document.getElementsByClassName('site-block')

            for (var i = 0; i < siteBlocks.length; i++) {
                siteBlocks[i].style.visibility = 'hidden';
            }

            var createProfileBox = function() {
                usersRef.child(key).once('value', function(snap) {
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
                    followingButton.setAttribute("data", key)

                    var followingButtonText = document.createTextNode('Follow');

                    // ref.child('users').child(myUid).child('requests').once('value', function(snap){
                    //   var isRequested = false
                    //   snap.forEach(function(babysnap){
                    //     if(babysnap.key() == key){
                    //       console.log('this user is has been requested,button should look different');
                    //       isRequested = true;
                    //       return;
                    //     } else {
                    //       console.log('still looking for a key in the "requests" object that matches this profiles Uid... keep looking')
                    //     }
                    //   })
                    // })
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

                    var requestsRef = ref.child('users').child(key).child('requests');
                    requestsRef.once('value', function(snap) {
                        snap.forEach(function(babysnap) {
                            console.log('babysnap.key() = ', babysnap.key())
                            if (babysnap.key() == myUid) {
                                followingButton.innerHTML = "requested";
                                followingButton.style.backgroundColor = "grey"
                                followingButton.disabled = "true"
                            }
                        })
                    })


                    var linkDisplay = document.getElementsByClassName('links-number')[0];
                    console.log('linkDisplay =', linkDisplay)
                    var linkCount = 0;

                    publicLinksRef.on('value', function(snapshot) {
                        snapshot.forEach(function(childSnapshot) {
                            var childSnapshotVal = childSnapshot.val();
                            if (childSnapshotVal.uid === key) {
                                linkCount++;
                                linkDisplay.innerHTML = linkCount;

                            }
                        })
                    })

                    var followingRef = ref.child('users').child(myUid).child('following');
                    followingRef.once('value', function(snap) {
                        snap.forEach(function(childsnap) {
                            if (childsnap.key() == key) {


                                followingButton.innerHTML = "unfollow";
                                followingButton.className = "unfollow";
                                // var hisFollowers = ref.child('users').child(key).child('followers');
                                // var myFollowing = ref.child('users').child(myUid).child('following');

                                // hisFollowers.once('value', function(snap) {

                                //     hisFollowers.child(myUid).remove()
                                // })
                                // myFollowing.once('value', function(snap) {

                                //     myFollowing.child(key).remove()
                                // })

                                followingButton.style.backgroundColor = "#d9534f"

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
            }

            createProfileBox();


            var appendProfileLinks = function() {
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

            appendProfileLinks();


        }

    }

    var signInSection = document.getElementById('sign-in-section');
    signInSection.classList.add('hidden')




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
        var theirUid = e.target.getAttribute('data');
        console.log('theirUid = ', theirUid)


        var followingButton = document.getElementsByClassName('following-button')[0]
        var unfollow0 = document.getElementsByClassName('unfollow')[0]
        var unfollow1 = document.getElementsByClassName('unfollow')[1]

        if (followingButton) {
            followingButton.innerHTML = "requested";
            followingButton.style.backgroundColor = "grey"
            followingButton.disabled = "true"
            var requestsRef = ref.child('users').child(theirUid).child('requests');
            requestsRef.child(myUid).set('true')

            function FindByAttributeValue(attribute, value) {
                var All = document.getElementsByTagName('*');
                for (var i = 0; i < All.length; i++) {
                    if (All[i].getAttribute(attribute) == value) {
                        return All[i];
                    }
                }
            }
            var requestFollow = FindByAttributeValue("handle", theirUid)
            console.log(requestFollow)



            requestFollow.innerHTML = "requested";
            requestFollow.style.backgroundColor = "grey"
            requestFollow.disabled = "true"
        } else {
            console.log('change text to follow')
            unfollow0.innerHTML = "Follow";
            unfollow0.style.backgroundColor = "#5cb85c"
            unfollow0.className = "request-follow"
            unfollow1.innerHTML = "Follow";
            unfollow1.style.backgroundColor = "#5cb85c"
            unfollow1.className = "request-follow"
        }



    }


    window.onload = function() {
        localStorage.setItem('anonymous', 'true');

        var followUser;
        var unfollowUser;
        document.getElementById('sign-out').addEventListener('click', signOut, false);
        var help = document.createElement('i')
        help.className = "help fa fa-question fa-3x";
        help.setAttribute("aria-hidden", true);
        var topNav = document.getElementsByClassName('top-nav')[0]

        help.addEventListener('click', showHelpBox, null)

        topNav.appendChild(help)

        function showHelpBox() {
            var helpBox = document.createElement('div');
            helpBox.className = "help-box"
            var tip1 = document.createTextNode('To browse privately, click the yellow B up in the Toolbar and click "Browse Privately" ')
            var br = document.createElement('br')
            var br2 = document.createElement('br')
            var tip2 = document.createTextNode('Click a profile picture to see only that users\' browsing history');
            var tip3 = document.createTextNode('Contact: gpickett00@gmail.com');
            var br3 = document.createElement('br')
            var br4 = document.createElement('br')
            helpBox.appendChild(tip1)
            helpBox.appendChild(br)
            helpBox.appendChild(br2)
            helpBox.appendChild(tip2)
            helpBox.appendChild(br3)
            helpBox.appendChild(br4)
            helpBox.appendChild(tip3)
            topNav.appendChild(helpBox)

            window.setTimeout(function() {
                topNav.removeChild(helpBox)
            }, 10000)
        }

        var requests = function() {


            ref.child('users').child(myUid).child('requests').once('value', function(snapshot) {
                var totalRequests = 0;
                snapshot.forEach(function(childSnapshot) {
                    totalRequests++
                })

                console.log('totalRequests = ', totalRequests)
                if (totalRequests > 0) {
                    var requestsBox = document.createElement('div');
                    requestsBox.className = "requests-box";
                    var topNav = document.getElementsByClassName('top-nav')[0];
                    var requestsTitle = document.createElement('h3');
                    requestsTitle.innerHTML = "Follow Requests";
                    requestsBox.appendChild(requestsTitle)
                    topNav.appendChild(requestsBox);




                    //take a look at what users are in my requests array
                    ref.child('users').child(myUid).child('requests').once('value', function(snapshot) {
                        var snapKey = snapshot.key()
                        var snapVal = snapshot.val();
                        //and for each one create a profpic/name/approve button
                        //first lets loop through each object on the requests object
                        snapshot.forEach(function(babysnap) {
                            console.log('babysnap.val() = ', babysnap.val())
                            var key = babysnap.key();
                            console.log('key = ', key)
                            //requests object only has a key (their UID) and value(true)
                            //so we need to grab their key and do a quick query, then produce the divs
                            ref.child('users').child(key).once('value', function(snap) {
                                var snapval = snap.val();
                                var name = document.createElement('div');
                                name.innerHTML = snapval.displayName;
                                name.className = "requesters-name"
                                requestsBox.appendChild(name)
                                var profPic = document.createElement('img');
                                profPic.src = snapval.photoUrl;
                                requestsBox.appendChild(profPic)
                                profPic.setAttribute('data', snapval.uid)

                                var approve = document.createElement('button');
                                approve.className = "approve-button"
                                approve.innerHTML = "Approve Request";

                                function approveRequest() {
                                    var followersRef = ref.child('users').child(myUid).child('followers')
                                    var followingRef = ref.child('users').child(key).child('following')
                                    followersRef.child(key).set("true");
                                    followingRef.child(myUid).set("true");

                                    topNav.removeChild(requestsBox)

                                    ref.child('users').child(myUid).child('requests').child(key).remove()



                                }
                                approve.addEventListener('click', approveRequest, null);
                                requestsBox.appendChild(approve)
                                var ignore = document.createElement('button');
                                ignore.className = "ignore-button";
                                ignore.innerHTML = "Ignore Request"
                                ignore.addEventListener('click', ignoreRequest, null)
                                requestsBox.appendChild(ignore);

                                function ignoreRequest() {
                                    //clear out this users item from the requests field
                                    console.log('bout to ignore')

                                    ref.child('users').child(myUid).child('requests').child(snapval.uid).remove();
                                    topNav.removeChild(requestsBox)
                                }




                            })
                        })
                    })





                }
            })
        }

        requests();

        var usersToFollow = function() {
            ref.child('users').once('value', function(snapshot) {
                //go through all users and print them out
                snapshot.forEach(function(childSnapshot) {
                    var childSnapshot = childSnapshot.val();
                    var name = childSnapshot.displayName;
                    var photoUrl = childSnapshot.photoUrl

                    var myUid = localStorage.uid;
                    var theirUid = childSnapshot.uid;
                    var alreadyFollowing = false;
                    //if its me, skip
                    if (childSnapshot.uid == myUid) {
                        console.log('do nothing');
                    } else {
                        //otherwise, lets go inspect properties of each user
                        for (key in childSnapshot.followers) {
                            if (key == myUid) {

                                alreadyFollowing = true;
                                break;
                            } else {
                                alreadyFollowing = false;

                            }
                        }


                        if (alreadyFollowing) {
                            if (name.length == 0) {
                                console.log('no name available')
                            } else {

                                var utfList = document.getElementsByClassName('utf-list')[0];
                                var nameDiv = document.createElement('div');
                                nameDiv.className = "name-div";
                                nameDiv.innerHTML = name;
                                utfList.appendChild(nameDiv);
                                var profPic = document.createElement('img');
                                profPic.src = photoUrl;
                                profPic.setAttribute("data", theirUid)

                                profPic.addEventListener('click', showProfile, false);

                                utfList.appendChild(profPic);
                                var unfollow = document.createElement('button');
                                unfollow.className = "unfollow";
                                unfollow.innerHTML = "unfollow";

                                unfollowUser = function() {
                                    console.log('unfollowing')
                                    var hisFollowers = ref.child('users').child(theirUid).child('followers');
                                    var myFollowing = ref.child('users').child(myUid).child('following');
                                    unfollow.className = "request-follow";
                                    unfollow.innerHTML = "follow";
                                    unfollow.disabled = "true"
                                    hisFollowers.once('value', function(snap) {

                                        hisFollowers.child(myUid).remove()
                                    })
                                    myFollowing.once('value', function(snap) {

                                        myFollowing.child(theirUid).remove()
                                    })
                                }
                                unfollow.addEventListener('click', unfollowUser, false);
                                utfList.appendChild(unfollow)
                            }
                        } else {
                            if (name.length == 0) {
                                console.log('no name available')
                            } else {
                                var utfList = document.getElementsByClassName('utf-list')[0];
                                var nameDiv = document.createElement('div');
                                nameDiv.className = "name-div";
                                nameDiv.innerHTML = name;
                                utfList.appendChild(nameDiv);
                                var profPic = document.createElement('img');
                                profPic.src = photoUrl;
                                profPic.setAttribute("data", theirUid)
                                profPic.addEventListener('click', showProfile, false);

                                utfList.appendChild(profPic);
                                var requestFollow = document.createElement('button');
                                requestFollow.className = "request-follow";
                                requestFollow.innerHTML = "Follow";
                                requestFollow.setAttribute("handle", theirUid)

                                //if I've already requested them
                                var myRequestedUid = ref.child('users').child(theirUid).child('requests')

                                myRequestedUid.once('value', function(snap) {
                                    console.log(snap.key())
                                    if (snap.val() == 0) {
                                        console.log('doing nothing, no requests pending')
                                    } else {
                                        snap.forEach(function(babysnap) {
                                            var key = babysnap.key();
                                            if (key == myUid) {
                                                requestFollow.innerHTML = "requested";
                                                requestFollow.style.backgroundColor = "grey"
                                                requestFollow.disabled = "true"
                                            }
                                        })
                                    }

                                })

                                followUser = function() {

                                    var requestsRef = ref.child('users').child(theirUid).child('requests');
                                    // var myRequestsRef = ref.child('users').child(myUid).child('requests');

                                    requestsRef.child(myUid).set('true')
                                    // myRequestsRef.child(myUid).set('true')

                                    requestFollow.innerHTML = "requested";
                                    requestFollow.style.backgroundColor = "grey"
                                    requestFollow.disabled = "true";

                                    var profileFollowButton = document.getElementsByClassName('following-button')[0];

                                    if (profileFollowButton) {
                                        profileFollowButton.innerHTML = "requested";
                                        profileFollowButton.style.backgroundColor = "grey"
                                        profileFollowButton.disabled = "true"
                                    } else {
                                        console.log('profile isn\'t open, not gonna change the button')
                                    }



                                }
                                requestFollow.addEventListener('click', followUser, false)

                                utfList.appendChild(requestFollow)


                            }
                        }
                    }



                })
            })

        }
        usersToFollow();



        function signOut() {
            firebase.auth().signOut().then(function() {
                localStorage.setItem('displayName', "");
                localStorage.setItem('email', "");
                localStorage.setItem('loggedOut', "true");
                localStorage.setItem('uid', "");
                localStorage.setItem('photoUrl', "");
                localStorage.setItem('newUser', "false");
                localStorage.setItem('oauthToken', null);
                console.log('localStorage.displayName = ', localStorage.displayName)
                console.log('localStorage.email = ', localStorage.email)
                console.log('localStorage.loggedOut = ', localStorage.loggedOut)
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