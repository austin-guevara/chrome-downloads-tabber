'use strict';

// Disable bottom downloads bar, always
let disableShelf = () => chrome.downloads.setShelfEnabled(false);
chrome.runtime.onInstalled.addListener(disableShelf);
chrome.runtime.onStartup.addListener(disableShelf);

// Variable to store the downloads URL
var downloadsURL = 'chrome://downloads/';

// Take a list of open downloads tabs and make the first one active
function openExisting(downloadTabs) {
    var updateProperties = { "active": true };
    chrome.tabs.update(downloadTabs[0].id, updateProperties, function (tab) { });
}

// Create a new downloads tab
function newDownloadsTab() {
    chrome.tabs.create({
        url: downloadsURL,
        active: true
    });
}

// Fire event for every new download item
// Fire again when the download item has changed
chrome.downloads.onCreated.addListener(function(downloadItem) {
    chrome.downloads.onChanged.addListener(function(certainDownloadItem) {

        // Make sure the download item has a filename
        // Make sure the download item filename is legit
        if (certainDownloadItem.hasOwnProperty('filename')) {
            if (certainDownloadItem.filename.current != "") {

                // Check if a downloads tab exists
                // If so, make it active
                // If not, open a new dowloads tab
                chrome.tabs.query({url: downloadsURL}, function(results) {
                    (results.length > 0) ? openExisting(results) : newDownloadsTab();
                });
            }
        }
    });
});
