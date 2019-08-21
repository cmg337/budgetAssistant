const WEEKS = 52
const HOURS = 40


//function that changes element monetary values if it contains any
convertMoney = function (elem) {
    //reg exp for monetary values
    dollarRegex = /\$[0-9\.]*/
    tagRegex = /img|script/i
    // if textContent matches regex - disclude containers of any kind scripts and images
    if (dollarRegex.test(elem.textContent) && !tagRegex.test(elem.tagName) && elem.children.length == 0) {
        console.log(elem.tagName)
		// get price and convert to number
        var cost = elem.textContent.match(dollarRegex)[0];
        var costInt = cost.replace("$", "");
		// sync.get needs is async and element needs to be changed inside method
        chrome.storage.sync.get(['income'], function (result) {
            var wage = result.income / WEEKS / HOURS;
            var converted = (Math.floor(costInt / wage) + " hours, " + Math.floor(costInt % wage * 60 / wage) + " minutes");
            elem.textContent = elem.textContent.replace(dollarRegex, converted);
			})
        }
}




//map all elements to convert monetary values within
const convertElements = function (node) {
    var allElements = node.getElementsByTagName("*")
    for (var i = 0; i < allElements.length; i++) {
        convertMoney(allElements[i]);
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