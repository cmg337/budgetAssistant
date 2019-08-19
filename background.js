// set default values in chrome storage for user variables on first load
chrome.runtime.onInstalled.addListener(function () {
    chrome.storage.sync.set({income: 50000}, function () {
        console.log("Default Income set");
        });
    chrome.storage.sync.set({rent: 1000}, function () {
        console.log("Default Rent and Utilities set");
        });
    chrome.storage.sync.set({ savings: 10000 }, function () {
        console.log("Default Savings Goal set");
    });
});
//listener for webpage load to convert monetary values
document.onload = function () {
    document.body.getElementsByTagName("*").map(e => convertMoney(e))
}
//function that changes element monetary values if it contains any
convertMoney = function (elem) {
    //reg exp for monetary values
    re = /$[0-9\.]*/
    // if textContent matches
    if (re.match(elem.textContent)) {
        elem.textContent = elem.textContent.replace(re, "test")
    }
}

