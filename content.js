const WEEKS = 52
const HOURS = 40


//function that changes element monetary values if it contains any
convertMoney = function (elem) {
    //reg exp for monetary values
    var dollarRegex = /\$[0-9]+(\.[0-9][0-9])?/
    var dollarRegexAll = /\$[0-9]+(\.[0-9][0-9])?/g
    var altRegex = /\$\s[0-9]+(\s[0-9][0-9])?/
    var altRegexAll = /\$\s[0-9]+(\s[0-9][0-9])?/g
    var badTagRegex = /img|script/i
    

    // if textContent matches regex - disclude containers of any kind scripts and images
    if ((dollarRegex.test(elem.innerText) || altRegex.test(elem.innerText)) && !badTagRegex.test(elem.tagName) && childrenAreText(elem)) {
        var replacements = {};//use object to keep track of values if multiple
        // get price and convert to number
        if (dollarRegex.test(elem.innerText)) {
            for (var i in elem.innerText.match(dollarRegexAll)) {//loop through all matches in element
                var cost = elem.innerText.match(dollarRegexAll)[i];
                var costInt = cost.replace("$", "") ;
                replacements[cost] = costInt;
            }
        } else {
            for (var i in elem.innerText.match(altRegexAll)) {//loop through all matches in element
                var cost = elem.innerText.match(altRegexAll)[i];
                var costInt = cost.replace("$", "").trim().replace(/\s/, ".");
                replacements[cost] = costInt;
            }
        }
        
        // sync.get needs is async and element needs to be changed inside method
        chrome.storage.sync.get(['income'], function (result) {
            for (var i in Object.keys(replacements)) {
                var cost = Object.keys(replacements)[i];
                var costInt = replacements[cost];
                var wage = result.income / WEEKS / HOURS;
                var converted = (Math.floor(costInt / wage) + " hours, " + Math.floor(costInt % wage * 60 / wage) + " minutes");
                elem.innerText = elem.innerText.replace(cost, converted);
            }
        })
    } 
}

//checks if element inner text can be replaced based on child node tags
const childrenAreText = function (elem) {
    var goodTagRegex = /span|strong/i;
    if (elem.childElementCount == 0) {//0 children good
        return true
    };
    if (!goodTagRegex.test(elem.tagName)) {//must have good tag
        return false
    };

    var checker = true;//set outside var to true -check children with foreach
    elem.childNodes.forEach((child) => {//children have good tags
        if (!goodTagRegex.test(child.tagName)) { checker = false }
    })
    return checker;
}



//map all elements to convert monetary values within
const convertElements = function (node) {
    if (node.hasChildNodes()){
        var allElements = node.getElementsByTagName("*")
        for (var i = 0; i < allElements.length; i++) {
            convertMoney(allElements[i]);
        }
    }else{
        convertMoney(node);
    }
}



// create Mutation Observer to change dynamically added elements' monetary value
//https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver/MutationObserver
var observerOptions = {
    childList: true,
    subtree: true
}
//create observer with callback function to convert newly added nodes
var observer = new MutationObserver(function (mutationRecord, observer) {
    mutationRecord.forEach(function (mutation) {
        var addedNodes = mutation.addedNodes
        if (addedNodes) {
            addedNodes.forEach(node => convertElements(node))
        }
    })   
})

//set observer to listen
observer.observe(document.body, observerOptions)


//run conversion function once on first load on whole page
convertElements(document.body)