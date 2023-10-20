chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action === "getBookmarks") {
        chrome.bookmarks.getTree(function (bookmarkTreeNodes) {
            // Process the bookmark data and send it back to the content script
            sendResponse({ bookmarks: bookmarkTreeNodes });
        });

        return true;
    }
});
