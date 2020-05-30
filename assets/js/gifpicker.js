function addRandomGif(gifs) {
    const gif = gifs[Math.floor(Math.random() * gifs.length)];

    const gifcontainer = document.getElementById("gifholder");

    var posx = Math.random() * (gifcontainer.offsetWidth )
    var posy = Math.random() * (gifcontainer.offsetHeight )

    const gifelement = new Image();
    gifelement.src = gif.url;
    gifelement.className = "gif"
    gifelement.style.left = posx + "px";
    gifelement.style.top = posy + "px";
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
        }, 500);
    }
}());
