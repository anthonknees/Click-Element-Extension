chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'start') {
    const interval = Math.floor(Math.random() * (22000 - 17000 + 1)) + 17000;
    console.log('Refresh interval set to:', interval); // Debug log

    let timeLeft = interval / 1000; // Convert milliseconds to seconds

    const checkAndClick = () => {
      console.log('Checking for the button...'); // Debug log

      const button = Array.from(document.querySelectorAll('span'))
        .find(el => el.textContent.trim().toLowerCase() === 'join the queue');

      if (button) {
        console.log('Button found, clicking...'); // Debug log
        button.click();
        chrome.runtime.sendMessage({ action: 'stop' });
        clearInterval(refreshInterval);
        clearInterval(countdownInterval);
      } else {
        console.log('Button not found, reloading page...'); // Debug log
        window.location.reload();
      }
    };

    const refreshInterval = setInterval(checkAndClick, interval);

    const countdownInterval = setInterval(() => {
      if (timeLeft > 0) {
        console.log(`Time left until next check: ${timeLeft} seconds`);
        timeLeft--;
      } else {
        clearInterval(countdownInterval);
      }
    }, 1000);
  }
});

// Check if the extension should be started when the content script is loaded
chrome.storage.sync.get(['enabledTabs'], (data) => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const currentTab = tabs[0];
    const tabId = currentTab.id.toString();
    const enabledTabs = data.enabledTabs || {};

    if (enabledTabs[tabId]) {
      chrome.runtime.sendMessage({ action: 'start' });
    }
  });
});