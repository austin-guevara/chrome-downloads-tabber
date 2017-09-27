'use strict';

// Disable bottom downloads bar, always
let disableShelf = () => chrome.downloads.setShelfEnabled(false);
chrome.runtime.onInstalled.addListener(disableShelf);
chrome.runtime.onStartup.addListener(disableShelf);

let downloadsURL = 'chrome://downloads/';

var thisGuy = [];

var existingDownloadIds = [];

function openExisting(downloadTabs) {
    var updateProperties = {
        "active": true
    };
    chrome.tabs.update(downloadTabs[0].id, updateProperties, function(tab) {});
}

function newDownloadsTab() {
    chrome.tabs.create({
        url: downloadsURL,
        active: true
    });
}

chrome.downloads.onCreated.addListener(function(downloadItem) {
	chrome.downloads.onChanged.addListener(function(changedDownloadItem) {
		if (changedDownloadItem.hasOwnProperty('filename')
			&& changedDownloadItem.id == downloadItem.id
			&& changedDownloadItem.filename != downloadItem.filename) {
				chrome.tabs.query({
					url: downloadsURL
				}, function(results) {
					(results.length > 0) ? openExisting(results): newDownloadsTab();
				});
			}
	});
});
