document.addEventListener('DOMContentLoaded', function () {
  const toggle = document.getElementById('toggle');

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const currentTab = tabs[0];
    const tabId = currentTab.id.toString();

    chrome.storage.sync.get(['enabledTabs'], function (data) {
      const enabledTabs = data.enabledTabs || {};
      toggle.checked = enabledTabs[tabId] || false;
    });

    toggle.addEventListener('change', function () {
      if (toggle.checked) {
        chrome.runtime.sendMessage({ action: 'start' });
      } else {
        chrome.runtime.sendMessage({ action: 'stop' });
      }
    });
  });
});