chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ enabledTabs: {} });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const currentTab = tabs[0];
    const tabId = currentTab.id.toString();

    chrome.storage.sync.get(['enabledTabs'], (data) => {
      const enabledTabs = data.enabledTabs || {};

      if (message.action === 'start') {
        enabledTabs[tabId] = true;
        chrome.storage.sync.set({ enabledTabs });
        chrome.tabs.sendMessage(currentTab.id, { action: 'start' });
      } else if (message.action === 'stop') {
        delete enabledTabs[tabId];
        chrome.storage.sync.set({ enabledTabs });
      }
    });
  });
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete') {
    chrome.storage.sync.get(['enabledTabs'], (data) => {
      const enabledTabs = data.enabledTabs || {};
      if (enabledTabs[tabId.toString()]) {
        chrome.tabs.sendMessage(tabId, { action: 'start' });
      }
    });
  }
});