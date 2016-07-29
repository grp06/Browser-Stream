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

publicLinksRef.on('child_added', function(childSnapshot, prevChildKey) {
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

    siteBlock.style.opacity = 0;
    var steps = 0;
        var timer = setInterval(function() {
            steps++;
            siteBlock.style.opacity = 0.1 * steps;
            if(steps >= 10) {
                clearInterval(timer);
                timer = undefined;
            }
        }, 50);

    container.insertBefore(siteBlock, firstElement)


    var deleteButton = document.createElement('i');
    deleteButton.className = "delete-button fa fa-times fa-3";
    deleteButton.setAttribute("aria-hidden", true)
    deleteButton.setAttribute("key", key)
    if (valueUid == myUid) {
        siteBlock.appendChild(deleteButton);
    }

});

//counts the number of records in publicLinks and appends it to the dom
ref.child("publicLinks").on("value", function(snapshot) {
    console.log('publinks snapshot here', snapshot.val())
    var snap = snapshot.val();
    for (key in snap) {
        totalLinks++;

    }
    var totalLinksSpan = document.getElementById('total-links');
    totalLinksSpan.innerHTML = totalLinks;
    totalLinks = 0;
})

//counts the number of records in publicLinks and appends it to the dom


ref.child("clickedLinks").on("value", function(childSnapshot) {
    console.log('something changed')
    var snap = childSnapshot.val();
    for (key in snap) {
        totalClicks++;
    }

    var totalClicksSpan = document.getElementById('total-clicks');
    totalClicksSpan.innerHTML = totalClicks;
    totalClicks = 0;
})


window.onload = function() {






window.setTimeout(function(){


    var list = document.querySelectorAll(".site-block");
    // var deleteButton = list.childNodes[2];


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
},1000)




}
