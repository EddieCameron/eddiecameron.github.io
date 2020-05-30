function addRandomGif(gifs) {
    const gif = gifs[Math.floor(Math.random() * gifs.length)];

    const gifcontainer = document.getElementById("gifholder");

    var posx = Math.random() * (gifcontainer.offsetWidth )
    var posy = Math.random() * (gifcontainer.offsetHeight )

    const gifelement = new Image();

    gifelement.onload = function() {
        gifelement.style.left = ( posx - this.width * 0.5 ) + "px";
        gifelement.style.top = ( posy - this.height * 0.5 ) + "px";
    }
    
    gifelement.src = gif.url;
    gifelement.className = "gif"
    gifcontainer.appendChild(gifelement);

    setTimeout(() => {
        gifelement.remove();
    }, 60 * 1000 );
}

(async function () {
    const giffetch = await fetch("https://gifxit.herokuapp.com/picksomegifs")
    if (giffetch.ok) {
        const gifs = await giffetch.json();
        setInterval(() => {
            addRandomGif(gifs);
        }, 250);
    }
}());
