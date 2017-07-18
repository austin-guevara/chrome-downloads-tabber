// Variable to store the downloads URL
var downloadsURL = 'chrome://downloads/';

// Disable the bottom bar
function disableShelf() {
    chrome.downloads.setShelfEnabled(false);
}

function openExisting(downloadTabs) {
    var updateProperties = { "active": true };
    chrome.tabs.update(downloadTabs[0].id, updateProperties, function (tab) { });
}

function newDownloadsTab() {
    // Create a new downloads tab
    chrome.tabs.create({
        url: downloadsURL,
        active: true
    });
}

chrome.downloads.onCreated.addListener(function(downloadItem) {
    chrome.downloads.onChanged.addListener(function(certainDownloadItem) {
        console.log(certainDownloadItem);
        // Disable tab bar at the bottom of the window
        disableShelf();

        chrome.tabs.query({url: downloadsURL}, function(results) {
            (results.length > 0) ? openExisting(results) : newDownloadsTab();
        });
    });
});
