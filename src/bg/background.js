// Variable to store the downloads URL
var downloadsURL = 'chrome://downloads/';

// Prevent repeated downloads opens
var justOpened = false;
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

function checkDownloadsAlreadyOpen() {

    // If the tabs query returns a match, set isOpen to true.
    chrome.tabs.query({url: downloadsURL}, function(results) {
        if (results.length >= 1) {
            isOpen = true;
        } else {
            isOpen = false;
        }
    });
}

chrome.downloads.onCreated.addListener(function(tab) {
    // Disable tab bar at the bottom of the window
    disableShelf();

    // Update the already open status
    checkDownloadsAlreadyOpen();

    // Open new downloads tab if one does not exist already
    if (!isOpen && justOpened == false) {
        openDownloads();
    } else {
        chrome.tabs.query({ url: downloadsURL }, function (results) {
            if (results.length > 0) {
                var updateProperties = { "active": true };
                chrome.tabs.update(results[0].id, updateProperties, function (tab) { });
            }
        });
    }

    // Prevent repeated downloads opens
    justOpened = true;
    setTimeout(function(){ justOpened = false; }, 3000);
});
