const extBtn = document.createElement("div");
const overlay = document.createElement("div");

function addCloseButton() {
    const closeBtn = document.createElement("button");
    closeBtn.textContent = 'Close';
    closeBtn.style.position = 'absolute';
    closeBtn.style.top = '2px';
    closeBtn.style.right = '2px';
    closeBtn.style.fontSize = '10px';
    closeBtn.addEventListener('click', onCloseClick);
    overlay.appendChild(closeBtn);
}

function buildBookmarksTree(bookmarkNodes) {
    const bookmarksList = document.createElement("ul");
    bookmarksList.classList.add("bookmark-list");
    bookmarksList.style.padding = '0';
    bookmarksList.style.margin = '0 0 0 15px';

    bookmarkNodes.forEach((bookmarkNode) => {
        const listItem = document.createElement("li");
        listItem.style.margin = '7px 0';

        if (bookmarkNode.url) {
            // If it's a bookmark (has a URL), create a link
            const link = document.createElement("a");
            link.textContent = bookmarkNode.title;
            link.href = bookmarkNode.url;
            listItem.appendChild(link);
        } else if (bookmarkNode.children) {
            // If it's a folder (has children), recursively build a nested list
            const folderTitle = document.createElement("span");
            folderTitle.textContent = bookmarkNode.title;
            listItem.appendChild(folderTitle);

            const nestedList = buildBookmarksTree(bookmarkNode.children);
            listItem.appendChild(nestedList);
        }

        bookmarksList.appendChild(listItem);
    });

    return bookmarksList;
}

// Function to fetch and display all bookmarks
function fetchAndDisplayBookmarks() {
    chrome.runtime.sendMessage({ action: "getBookmarks" }, function (response) {
        if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError);
            return;
        }
        const bookmarkTreeNodes = response.bookmarks;
        const rootBookmarkNode = bookmarkTreeNodes[0];
        const bookmarksList = buildBookmarksTree(rootBookmarkNode.children);

        if (overlay) {
            overlay.appendChild(bookmarksList);
        }
    });
}

function onCloseClick(evt) {
    extBtn.style.display = "block";
    overlay.style.display = "none";
}

function onToogleClick(evt) {
    fetchAndDisplayBookmarks();
    extBtn.style.display = "none";
    overlay.style.display = "block";
}

extBtn.addEventListener("click", onToogleClick);
extBtn.textContent = "B";
extBtn.style.width = "30px";
extBtn.style.height = "30px";
extBtn.style.background = "rgba(100,200,250,0.7)";
extBtn.style.position = "absolute";
extBtn.style.top = "2px";
extBtn.style.left = "2px";
extBtn.style.zIndex = "1000";
document.body.appendChild(extBtn);

overlay.style.width = "600px";
overlay.style.height = "100%";
overlay.style.background = "rgba(20,22,25,0.9)";
overlay.style.color = "#ffffff";
overlay.style.fontSize = "12px";
overlay.style.position = "absolute";
overlay.style.top = "2px";
overlay.style.left = "2px";
overlay.style.zIndex = "1000";
overlay.style.display = "none";
overlay.style.overflow = "scroll";
addCloseButton();
document.body.appendChild(overlay);
