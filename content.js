const WEEKS = 52
const HOURS = 40


//function that changes element monetary values if it contains any
convertMoney = function (elem) {
    //reg exp for monetary values
    regex = /\$[0-9\.]*/
    // if textContent matches
    if (regex.test(elem.textContent)) {
		// get price and convert to number
        var cost = elem.textContent.match(regex)[0];
        var costInt = cost.replace("$", "");
		// sync.get needs is async and element needs to be changed inside method
        chrome.storage.sync.get(['income'], function (result) {
            var wage = result.income / WEEKS / HOURS;
            var converted = (Math.floor(costInt / wage) + " hours, " + Math.floor(costInt % wage * 60 / wage) + " minutes");
            elem.textContent = elem.textContent.replace(regex, converted);
			})
        }
}




//map all elements to convert monetary values within
allElements = document.body.getElementsByTagName("span")
for (var i = 0; i < allElements.length; i++) {
    convertMoney(allElements[i]);
}
