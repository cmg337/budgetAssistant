const WEEKS = 52;
const HOURS = 40;
const MONTHS = 12;


//converts money value and returns desired output
const convertMoney = function (target, field, regex) {
    chrome.storage.sync.get(['income', 'mode', 'savings', 'rent', 'currency'], function (backendData) {
        var replacements = {};//use object to keep track of values if multiple
        // get price and convert to number
        for (var i in target[field].match(regex)) {//loop through all matches in element
            var cost = target[field].match(regex)[i];
            var curRegex = new RegExp("[" + backendData.currency + ",]", "g")
            var costInt = cost.replace(curRegex, "").trim()
            if (!/\./.test(costInt) && /\s/.test(costInt)) {
                costInt = costInt.replace(/\s/g, "");//replace space with decimal if none
            } 
            costInt = costInt.replace(/\s/g, "");//remove spaces
            replacements[cost] = costInt;
        }
        //convert values based on mode
        for (var i in Object.keys(replacements)) {
            var cost = Object.keys(replacements)[i];
            var costInt = replacements[cost];
            var wage = backendData.income / WEEKS / HOURS;
            var expendable = backendData.income - backendData.rent * MONTHS - backendData.savings;
            var expendableWage = expendable / WEEKS / HOURS;
            var converted;
            switch (backendData.mode) {
                case "time":
                    if (costInt / wage > 24) {
                        converted = Math.floor(costInt / wage / 24) + " day(s) " + Math.floor(costInt / wage % 24) + " hr " + Math.floor(costInt % wage * 60 / wage) + " min";
                    } else {
                        converted = Math.floor(costInt / wage) + " hr " + Math.floor(costInt % wage * 60 / wage) + " min";
                    }
                    break;
                case "timeBudget":
                    if (costInt / wage > 24) {
                        converted = Math.floor(costInt / expendableWage / 24) + " day(s) " + Math.floor(costInt / expendableWage % 24) + " hr " + Math.floor(costInt % expendableWage * 60 / expendableWage) + " min";
                    } else {
                        converted = Math.floor(costInt / expendableWage) + " hr " + Math.floor(costInt % expendableWage * 60 / expendableWage) + " min";
                    }
                    break;
                case "week":
                    converted = Math.floor(costInt / (expendable / WEEKS) * 100) + "%";
                    break;
                case "month":
                    converted = Math.floor(costInt / (expendable / MONTHS) * 100) + "%";
                    break; 
            }
            target[field] = target[field].replace(cost, converted);
        }
    })
}
//changes element monetary values if it contains any
const convertElement = function (elem) {
    chrome.storage.sync.get(['currency'], function (backendData) {
        //reg exp for monetary values
        var curRegex = new RegExp(  backendData.currency + "(\s)?[,0-9]+(\s)?(\.)?(\s)?([0-9][0-9])?", "g")
        //avoid targeting these tags
        var badTagRegex = /img|script/i

        //elements with good tags and text children only
        if (!badTagRegex.test(elem.tagName) && childrenAreText(elem)) {
            //check if innertext matches either regex
            if (curRegex.test(elem.innerText) && checkChildrenInnerText(elem, curRegex)) { //check children to not overwrite too much
                convertMoney(elem, "innerText", curRegex);
            }
            // check textContent for hidden elements - innertext will be blank
            else if (curRegex.test(elem.textContent) && checkChildrenInnerText(elem, curRegex)) {
                convertMoney(elem, "textContent", curRegex);
            }
        }
    })
}

// return true if children have tags indicating text only
const childrenAreText = function (elem) {
    var goodTagRegex = /span|strong|^b$/i;
    if (elem.childElementCount == 0) {//0 children good
        return true
    };
    if (!goodTagRegex.test(elem.tagName)) {//must have good tag
        return false
    };
    var checker = true;//set outside var to true -check children with foreach
    elem.childNodes.forEach((child) => {//children have good tags or are text
        if (! (goodTagRegex.test(child.tagName) || child.nodeType == 3)) { checker = false }
    })
    return checker;
}

//returns true if all children fail regex test
const checkChildrenInnerText = function (elem, regex) {
    for (var i in elem.children) {
        regex.test(elem.children[i].innerText);//using regex.test twice fixes bug where duplicate values show on amazon search page
        //this should be investigated later 

        //child has to match regex and be the same match as parent
        if (regex.test(elem.children[i].innerText) && (elem.children[i].innerText).match(regex)[0] == elem.innerText.match(regex)[0]) {
            return false;
        }
    }
    return true;
}



//map all elements to convert monetary values within
const convertElements = function (node) {
    if (node.childElementCount > 0){
        var allElements = node.querySelectorAll("*")
        for (var i = 0; i < allElements.length; i++) {
            convertElement(allElements[i]);
        }
    }else{
        convertElement(node);
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
        convertElements(mutation.target)
    })   
})

//set observer to listen
observer.observe(document.body, observerOptions)


//run conversion function once on first load on whole page
convertElements(document.body)