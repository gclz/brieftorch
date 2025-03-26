document.getElementById('save').addEventListener('click', () => {
    const apiKey = document.getElementById('apiKey').value;
    chrome.storage.local.set({ openai_key: apiKey }, () => {
      alert('API key saved!');
    });
  });
  
  // Load saved key
  chrome.storage.local.get(['openai_key'], function(result) {
    if (result.openai_key) {
      document.getElementById('apiKey').value = result.openai_key;
    }
  });