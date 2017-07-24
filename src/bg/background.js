'use strict';

// Disable bottom downloads bar, always
let disableShelf = () => chrome.downloads.setShelfEnabled(false);
// chrome.runtime.onInstalled.addListener(disableShelf);
// chrome.runtime.onStartup.addListener(disableShelf);

// Variable to store the downloads URL
let downloadsURL = 'chrome://downloads/';

// Existing Download IDs array
var existingDownloadIds = [];

// Take a list of open downloads tabs and make the first one active
function openExisting(downloadTabs) {
    var updateProperties = {
        "active": true
    };
    chrome.tabs.update(downloadTabs[0].id, updateProperties, function(tab) {});
}

// Create a new downloads tab
function newDownloadsTab() {
    chrome.tabs.create({
        url: downloadsURL,
        active: true
    });
}

// Fire event for every new download item that has changed
chrome.downloads.onCreated.addListener(function(downloadItem) {
    // Make sure the download item has a filename + filename is legit + is new
    if (downloadItem.hasOwnProperty('filename') &&
        downloadItem.filename.current != "" &&
        existingDownloadIds.indexOf(downloadItem.id) < 0) {
        // Add it to the existing downloads
        existingDownloadIds.push(downloadItem.id);
		disableShelf();
        // Check if a downloads tab exists; if so, make active; if not, open new
        chrome.tabs.query({
            url: downloadsURL
        }, function(results) {
            (results.length > 0) ? openExisting(results): newDownloadsTab();
        });
    }
});
