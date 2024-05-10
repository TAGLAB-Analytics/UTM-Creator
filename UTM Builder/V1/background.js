chrome.action.onClicked.addListener(function() {
  chrome.tabs.create({ url: 'utm_creator.html' });
});

let count = 0;

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ count });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message === "increment") {
    count++;
    chrome.storage.sync.set({ count }, () => {
      sendResponse({ count });
    });
    return true;  // Will respond asynchronously.
  }
});
