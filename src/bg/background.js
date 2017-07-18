// Variable to store the downloads URL
var downloadsURL = 'chrome://downloads/';

// Prevent repeated downloads opens
// var justOpened = false;
var isOpen = false;

// Disable the bottom bar
function disableShelf() {
    chrome.downloads.setShelfEnabled(false);
}

function openDownloads() {
    // Create a new downloads tab
    chrome.tabs.create({
        url: downloadsURL,
        active: true
    });
}

// function checkDownloadsAlreadyOpen() {
//     // If the tabs query returns a match, set isOpen to true.
//     chrome.tabs.query({url: downloadsURL}, function(results) {
//         if (results.length >= 1) {
//             isOpen = true;
//         } else {
//             isOpen = false;
//         }
//     });
// }

chrome.downloads.onCreated.addListener(function(downloadItem) {
    chrome.downloads.onChanged.addListener(function(certainDownloadItem) {
        // Disable tab bar at the bottom of the window
        disableShelf();

        // Update the already open status
        // checkDownloadsAlreadyOpen();
        // If the tabs query returns a match, set isOpen to true.
        chrome.tabs.query({url: downloadsURL}, function(results) {
            if (results.length > 0) {
                isOpen = true;
                console.log('DOWNLOADS IS OPEN.');
            } else {
                isOpen = false;
                console.log('DOWNLOADS NOT ALREADY OPEN.');
            }
        });

        // Open new downloads tab if one does not exist already
        if (isOpen) {
            console.log('TRY OPENING EXISTING');
            chrome.tabs.query({ url: downloadsURL }, function (results) {
                if (results.length > 0) {
                    var updateProperties = { "active": true };
                    chrome.tabs.update(results[0].id, updateProperties, function (tab) { });
                }
            });
        } else {
            openDownloads();
            console.log('I OPENED A TAB.');
        }

        // Prevent repeated downloads opens
        // justOpened = true;
        // setTimeout(function(){ justOpened = false; }, 3000);
    });
});
