window.onload = function () {

    chrome.storage.sync.get(['rent', 'income', 'savings', 'mode'], function (result) {
        for (var i in Object.keys(result)) {
            document.getElementById(Object.keys(result)[i]).value = result[Object.keys(result)[i]]
        }
    });


    document.getElementById("saveButton").addEventListener("click", function () {
        chrome.storage.sync.set({ income: document.getElementById("income").value }, function () {
            console.log("Income Changed");
        });
        chrome.storage.sync.set({ rent: document.getElementById("rent").value }, function () {
            console.log("Rent Changed");
        });
        chrome.storage.sync.set({ savings: document.getElementById("savings").value }, function () {
            console.log("Saving Goal Changed");
        });
        chrome.storage.sync.set({ mode: document.getElementById("mode").value }, function () {
            console.log("Mode changed");
        })
        document.getElementById("container").appendChild(document.createElement("p")).textContent = "Saved"
    })
}
    
