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
    chrome.storage.sync.set({ mode: "time" }, function () {
        console.log("Mode set")
    });
});


