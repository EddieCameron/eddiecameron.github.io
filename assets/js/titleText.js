var specialWords = [
    { text: "eddie cameron", link:"#" },
    { text: "i make games with a computer", link:"#" },
    { text: "available for hire", link:"#" },
    { text: "eddie@eddiecameron.fun", link: "mailto:eddie@eddiecameron.fun" },
    { text: "twitter", link: "https://twitter.com/eddiecameron" },
    { text: "itch.io", link: "https://eddiecameron.itch.io" },
    { text: "github", link: "https://github.com/EddieCameron" }
];

var totalLines = 50
var charsPerLine;
var linesToAvoid = [];
var nameLineIdx, descLineIdx, totalLines;

var linesBeforeFirstInsert = 2
var linesBetweenInserts = 1

var lineGarbage = ""
var charsBeforeInserts = []

function updateCharactersPerLine( element ) {
    element.textContent = "a"
    
    var titleHeight = element.clientHeight;
    console.log(titleHeight);

    for (charsPerLine = 1; charsPerLine < 1000; charsPerLine++) {
        element.appendChild(document.createTextNode(getGarbageChars(1)))
        console.log( element.clientHeight);
        if ( element.clientHeight > titleHeight )
            break; // must have wrapped
    }
    console.log(charsPerLine);
}

function insertIntoText(element, elementToInsert, idx) {
    var charCount = 0
    var n, walk=document.createTreeWalker(element,NodeFilter.SHOW_TEXT,null,false);
    while (n = walk.nextNode()) {
        if (charCount + n.length > idx) {
            if (n.parentNode.tagName != 'A') {
                var splitAt = idx - charCount
                const postlinknode = n.splitText(splitAt)
                element.insertBefore(elementToInsert, postlinknode)
            }
            return
        }
        else {
            charCount += n.length
        }
    }
}

function fillTitleText(titleText) {
    // find width of line in chars
    updateCharactersPerLine( titleText );

    // create garbage
    lineGarbage = getGarbageChars( charsPerLine * totalLines )
    
    titleText.textContent = lineGarbage;

    // indices to add nodes
    var lineIdx = linesBeforeFirstInsert
    for (const insert of specialWords) {
        console.log("inserting line of length " + insert.text.length)

        var buffer = Math.min( Math.round( 0.2 * charsPerLine ), Math.round( ( charsPerLine - insert.text.length ) * .5 ) )        
        var lineInsert = getRandomInt( buffer, charsPerLine - insert.text.length - buffer )
        console.log( "at " + lineInsert )

        charsBeforeInserts.push(lineInsert)
        const insertElement = document.createElement('a')
        insertElement.href = insert.link
        insertElement.textContent = insert.text
        const insertCharIdx = lineIdx * charsPerLine + lineInsert
        insertIntoText(titleText, insertElement, insertCharIdx)
        
        lineIdx++
        lineIdx += linesBetweenInserts
    }
    
    // add char scrambler...later
    setInterval(swapGarbageCharacter, 2, titleText);
}

function swapGarbageCharacter( titleText ) {
    var charToSwap = getRandomInt(0, lineGarbage.length);
    
    var charCount = 0
    var n, walk=document.createTreeWalker(titleText,NodeFilter.SHOW_TEXT,null,false);
    while (n = walk.nextNode()) {
        if (n.parentNode.tagName == 'A')
            continue
        
        if (charCount + n.length > charToSwap) {
            if (n.parentNode.tagName != 'A') {
                var splitAt = charToSwap - charCount
                let sectionString = n.textContent
                sectionString = sectionString.substr(0, splitAt) + getGarbageChars(1) + sectionString.substr(splitAt + 1)
                n.textContent = sectionString
            }
            return
        }
        else {
            charCount += n.length
        }
    }
}

function getGarbageChars( count ) {
    var toRet = "";
    for ( var i = 0; i < count; i++ )
        toRet += String.fromCharCode( getRandomInt( 33, 64 ) );
    
    return toRet;
}

function fillLineWithGarbage(lineIdx) {
    var line = lineContents[lineIdx] ?? ""
    if (line.length < charsPerLine) {
        // fill line with garbage
        line += getGarbageChars( charsPerLine - line.length )
    }
    lineContents[lineIdx] = line
}

/**
 * Returns a random integer between min (inclusive) and max (inclusive)
 * Using Math.round() will give you a non-uniform distribution!
 */
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

fillTitleText(document.getElementById( 'titleText' ) );