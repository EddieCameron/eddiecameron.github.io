$( function() {
    fillTitleText( $( "#titleText>p" ) );
} );

var minLinesToName = 3;
var maxLinesToName = 3;
var minLinesToDesc = 1;
var maxLinesToDesc = 3;

var specialWords = [
    { text: "eddie cameron" },
    { text: "i make games with a computer" },
    { text: "available for hire" },
    { text: "eddie@eddiecameron.fun", link: "mailto:eddie@eddiecameron.fun" },
    { text: "twitter", link: "https://twitter.com/eddiecameron" },
    { text: "itch.io", link: "https://eddiecameron.itch.io" },
    { text: "github", link: "https://github.com/EddieCameron" }
];

var charsPerLine;
var linesToAvoid = [];
var nameLineIdx, descLineIdx, totalLines;

function fillTitleText( titleText ) {
    // find width of line in chars
    titleText.text( getGarbageChars( 1 ) );
    var titleHeight = titleText.height();
    for ( charsPerLine = 2; charsPerLine < 1000; charsPerLine++ ) {
        titleText.text( titleText.text() + getGarbageChars( 1 ) );
        if ( titleText.height() > titleHeight )
            break; // must have wrapped
    }
    console.log( charsPerLine );
        
    // line template
    var line = $( "<span></span>" );
    line.text(getGarbageChars(charsPerLine));
    line.append( "<br/>" );

    titleText.text( "" );

    // lines to name
    var linesToName = getRandomInt(minLinesToName, maxLinesToName) - 1;
    for ( var i = 0; i < linesToName; i++ )
        line.clone().text(getGarbageChars(charsPerLine)).append("<br/>").appendTo(titleText);
    
    var lineIdx = linesToName;
    for (let i = 0; i < specialWords.length; i++) {
        const specialWord = specialWords[i];
        
        var charsBeforeWord;
        if (i == 0)
            charsBeforeWord = getRandomInt(8, charsPerLine - specialWord.text.length - 28);
        else if (i == 1)
            charsBeforeWord = getRandomInt(28, charsPerLine - specialWord.text.length - 28);
        else
            charsBeforeWord = getRandomInt(8, charsPerLine - specialWord.text.length - 8);
            
        linesToAvoid.push(lineIdx);
        lineIdx++;

        var nameLine = $("<span></span>");
        nameLine.text(getGarbageChars(charsBeforeWord));  // prefix

        if (specialWord.link == null)
            nameLine.append("<span style='color: #DC574E'>" + specialWord.text + "</span>");    // word
        else
            nameLine.append("<a href=" + specialWord.link + ">" + specialWord.text + "</a>");    // link
            
        nameLine.append(line.clone().text( getGarbageChars(charsPerLine - charsBeforeWord - specialWord.text.length)));
        nameLine.append("<br/>");

        nameLine.appendTo(titleText);

        // append lines afterwards
        var postLines = getRandomInt(minLinesToDesc, maxLinesToDesc);
        for (let postLine = 0; postLine < postLines; postLine++)
            line.clone().text(getGarbageChars(charsPerLine)).append("<br/>").appendTo(titleText);
        lineIdx += postLines;
    }

    // text to end of page
    var pageHeight = $(document).height;
    var extraLines = 0;
    for ( var extraLines = 0; extraLines < 100; extraLines++ ) {
        line.clone().text( getGarbageChars( charsPerLine ) ).append("<br/>").appendTo( titleText );
        if ( titleText.height > pageHeight )
            break;
    }
    totalLines = lineIdx + extraLines;
    
    // disable wrap
    titleText.css( "white-space", "nowrap" );
    
    // add char scrambler...later
    setInterval(swapGarbageCharacter, 2, titleText);
}

function swapGarbageCharacter( titleText ) {
    var lineToSwap;
    var sanityCount = 0;
    do {
        sanityCount++;
        if (sanityCount > 100)
            return;
        
        lineToSwap = getRandomInt(0, totalLines);
    } while ( linesToAvoid.includes( lineToSwap ) )
    
    var charToSwap = getRandomInt(0, charsPerLine);

    var lineElement = titleText.children().eq(lineToSwap);
    var lineText = lineElement.text();


    lineText = lineText.substr(0, charToSwap) + getGarbageChars(1) + lineText.slice(charToSwap + 1);
    lineElement.text(lineText);
    lineElement.append( "<br/>")
}

function getGarbageChars( count ) {
    var toRet = "";
    for ( var i = 0; i < count; i++ )
        toRet += String.fromCharCode( getRandomInt( 33, 64 ) );
    
    return toRet;
}

/**
 * Returns a random integer between min (inclusive) and max (inclusive)
 * Using Math.round() will give you a non-uniform distribution!
 */
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}