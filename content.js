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
    var goodTagRegex = /span|strong/i
    // if textContent matches regex - disclude containers of any kind scripts and images
    if (dollarRegex.test(elem.innerText) && !badTagRegex.test(elem.tagName) && (goodTagRegex.test(elem.tagName) || elem.childElementCount == 0)) {
        // get price and convert to number
        for ( var i in elem.innerText.match(dollarRegexAll)){
            var cost = elem.innerText.match(dollarRegexAll)[i];
            var costInt = cost.replace("$", "");
            // sync.get needs is async and element needs to be changed inside method
            chrome.storage.sync.get(['income'], function (result) {
                var wage = result.income / WEEKS / HOURS;
                var converted = (Math.floor(costInt / wage) + " hours, " + Math.floor(costInt % wage * 60 / wage) + " minutes");
                elem.innerText = elem.innerText.replace(cost, converted);
                })
            }
        } else if(altRegex.test(elem.innerText) && !badTRegex.test(elem.tagName) && (goodTagRegex.test(elem.tagName) ||  elem.childElementCount == 0)) {
            
            // get price and convert to number
            for ( var i in elem.innerText.match(altRegexAll)){
                var cost = elem.innerText.match(altRegexAll)[i];
                var costInt = cost.replace("$", "").trim().replace(/\s/, ".");
                // sync.get needs is async and element needs to be changed inside method
                chrome.storage.sync.get(['income'], function (result) {
                    var wage = result.income / WEEKS / HOURS;
                    var converted = (Math.floor(costInt / wage) + " hours, " + Math.floor(costInt % wage * 60 / wage) + " minutes");
                    elem.innerText = elem.innerText.replace(cost, converted);
                    })
                }
            }
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