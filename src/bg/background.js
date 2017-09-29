'use strict';

// Disable bottom downloads bar, always
let disableShelf = () => chrome.downloads.setShelfEnabled(false);
chrome.runtime.onInstalled.addListener(disableShelf);
chrome.runtime.onStartup.addListener(disableShelf);

let downloadsURL = 'chrome://downloads/';

// var existingDownloadIds = [];

var beginDelayFlag = false;

setTimeout(function() {
	beginDelayFlag = true;
}, 10000);

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
	console.log(downloadItem);
	chrome.downloads.onChanged.addListener(function(changedDownloadItem) {
		if (beginDelayFlag
			&& changedDownloadItem.hasOwnProperty('filename')
			&& changedDownloadItem.id == downloadItem.id
			&& changedDownloadItem.filename != downloadItem.filename) {
				console.log(changedDownloadItem);
				chrome.tabs.query({
					url: downloadsURL
				}, function(results) {
					(results.length > 0) ? openExisting(results): newDownloadsTab();
				});
			}
	});
});
