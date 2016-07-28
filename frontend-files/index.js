var onloadTimestamp;
var ref = new Firebase("https://search-feed-35574.firebaseio.com/");
var lastLoaded;
var totalLinks = 0;
var totalClicks = 0;
var clickedLinksRef = ref.child('clickedLinks');

setInterval(function() {
    ref.child("publicLinks").limitToLast(50).once("value", function(snapshot) {

        //create an empty result object
        var result = {};
        //current = all public links 
        var current = snapshot.val();

        for (key in current) {
            if (lastLoaded.hasOwnProperty(key)) {

            } else {
                result[key] = current[key];
            }
        }

        console.log('result = ', result)

        for (key in result) {

            var value = result[key]

            if (value.title == "") {
                console.log('empty title')
            } else {

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

                siteBlock.className = "site-block";
                leftSide.className = "left-side";
                profPic.className = "prof-pic";
                rightSide.className = "right-side";
                favicon.className = "favicon";
                siteTitle.className = "site-title";
                timePosted.className = "time-posted";

                profImg.src = value.photoUrl;
                favImg.src = value.faviconUrl;
                siteLink.href = value.url;

                container.insertBefore(siteBlock, firstElement)

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

                siteBlock.addEventListener('click', pushClickedLink, false);

                function pushClickedLink(e) {
                  e.preventDefault()

                    clickedLinksRef.once('value', function(snapshot) {
                      var url = e.target.href
                      if(e.target.href){
                        console.log('clicked a link')
                        clickedLinksRef.push(url);
                        window.location = url;

                      } else {
                        console.log('e.target = ', e.target)
                      }
                    })
                }
            }
        }

        lastLoaded = current;
        //counts the number of records in publicLinks and appends it to the dom

        ref.child("publicLinks").once("value", function(snapshot) {
            var snap = snapshot.val();

            for (key in snap) {
                totalLinks++;

            }

            console.log('total links = ', totalLinks);
            var totalLinksSpan = document.getElementById('total-links');
            var linksNumber = document.createTextNode(totalLinks);


            totalLinksSpan.removeChild(totalLinksSpan.childNodes[0])

            totalLinksSpan.appendChild(linksNumber)
            // console.log(totalLinksSpan)
            // console.log(totalLinksSpan.classList)
            totalLinks = 0;

        })



    }, function(errorObject) {
        console.log("The read failed: " + errorObject.code);
    });
}, 2000)


window.onload = function() {

    ref.child("publicLinks").limitToLast(50).once("value", function(snapshot) {

            lastLoaded = snapshot.val();
            //retrieve initial data and print it to the screen
            snapshot.forEach(function(childSnapshot) {


                var value = childSnapshot.val();

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

                siteBlock.className = "site-block";
                leftSide.className = "left-side";
                profPic.className = "prof-pic";
                rightSide.className = "right-side";
                favicon.className = "favicon";
                siteTitle.className = "site-title";
                timePosted.className = "time-posted";

                profImg.src = value.photoUrl;
                favImg.src = value.faviconUrl;
                siteLink.href = value.url;

                container.insertBefore(siteBlock, firstElement)

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


            })

            //counts the number of records in publicLinks and appends it to the dom
            ref.child("publicLinks").once("value", function(snapshot) {
                var snap = snapshot.val();
                for (key in snap) {
                    totalLinks++;

                }
                var totalLinksSpan = document.getElementById('total-links');
                var linksNumber = document.createTextNode(totalLinks);
                totalLinksSpan.appendChild(linksNumber)
                totalLinks = 0;
            })

            //counts the number of records in publicLinks and appends it to the dom
            ref.child("clickedLinks").once("value", function(snapshot) {
                var snap = snapshot.val();
                for (key in snap) {
                    totalClicks++;

                }
                var totalClicksSpan = document.getElementById('total-clicks');
                var clicksNumber = document.createTextNode(totalClicks);
                totalClicksSpan.appendChild(clicksNumber)
                totalClicks = 0;
            })

            var list = document.querySelectorAll(".site-block");
            var length = list.length;
            for (var i = 0; i < length; i++) {
                list[i].addEventListener('click', pushClickedLink, false);
            }

            function pushClickedLink(e) {
              e.preventDefault();
                clickedLinksRef.once('value', function(snapshot) {
                  var url = e.target.href
                  if(e.target.href){
                    console.log('clicked a link')
                    clickedLinksRef.push(url);
                    window.location = url;
                  } else {
                    console.log('e.target = ', e.target)
                  }
                })

            }



        },
        function(errorObject) {
            console.log("The read failed: " + errorObject.code);
        });

}