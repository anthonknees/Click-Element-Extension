chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ enabled: false });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'start') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const currentTab = tabs[0];
      const tabId = currentTab.id.toString();
      chrome.storage.sync.set({ [tabId]: true });
      chrome.tabs.sendMessage(currentTab.id, { action: 'start' });
    });
  } else if (message.action === 'stop') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const currentTab = tabs[0];
      const tabId = currentTab.id.toString();
      chrome.storage.sync.set({ [tabId]: false });
    });
  }
});