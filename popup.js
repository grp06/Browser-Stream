

function change() {
    var elem = document.getElementById("button-1");
    var publicBrowsing = localStorage.publicBrowsing;
    var publicStatus = document.getElementById('public-status')
    console.log('click')


    if (publicBrowsing == "true") {
        elem.value = "Browse Publicly"
        elem.innerHTML = "Browse Publicly"
    

        localStorage.setItem("publicBrowsing", false);
        publicStatus.innerHTML = '';
        publicStatus.innerHTML = 'Currently Browsing Privately';
        publicStatus.className = "red"

    } else {
        elem.value = "Browse Privately"
        elem.innerHTML = "Browse Privately"

        localStorage.setItem("publicBrowsing", true);
        publicStatus.innerHTML = '';
        publicStatus.innerHTML = 'Currently Browsing Publicly';
        publicStatus.className = "green"

    }

}

window.onload = function() {
console.log('load')

    
    var publicBrowsing = localStorage.publicBrowsing;
    // var elem = document.getElementById("button-1");
    var publicStatus = document.getElementById('public-status');

    if (publicBrowsing == "true") {
        // elem.value = "Browse Privately"

        // elem.innerHTML = "Browse Privately"
        var text = document.createTextNode('Currently Browsing Publicly');
        publicStatus.appendChild(text);
        publicStatus.className = "green"

    } else {
      // elem.value = "Browse Publicly"

      //   elem.innerHTML = "Browse Publicly";
        var text = document.createTextNode('Currently Browsing Privately');
        publicStatus.appendChild(text);
        publicStatus.className = "red"

    }
    document.getElementById('button-1').addEventListener('click', change, false);

};