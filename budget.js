window.onload = function () {

    chrome.storage.sync.get(['rent', 'income', 'savings'], function (result) {
        for (var i = 0; i < 3; i++) {
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
        document.getElementById("container").appendChild(document.createElement("p")).textContent = "Saved"
    })
}
    
