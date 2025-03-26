document.addEventListener('DOMContentLoaded', () => {
    // Load saved settings
    chrome.storage.local.get(['openai_key', 'use_custom_endpoint', 'api_endpoint'], function(result) {
      if (result.openai_key) {
        document.getElementById('apiKey').value = result.openai_key;
      }
      if (result.use_custom_endpoint) {
        document.getElementById('useCustomEndpoint').checked = true;
        document.getElementById('endpointGroup').style.display = 'block';
      }
      if (result.api_endpoint) {
        document.getElementById('apiEndpoint').value = result.api_endpoint;
      }
    });
  
    // Toggle custom endpoint input
    document.getElementById('useCustomEndpoint').addEventListener('change', function(e) {
      document.getElementById('endpointGroup').style.display = 
        e.target.checked ? 'block' : 'none';
    });
  
    // Save settings
    document.getElementById('save').addEventListener('click', () => {
      const apiKey = document.getElementById('apiKey').value;
      const useCustomEndpoint = document.getElementById('useCustomEndpoint').checked;
      const apiEndpoint = document.getElementById('apiEndpoint').value;
  
      chrome.storage.local.set({
        openai_key: apiKey,
        use_custom_endpoint: useCustomEndpoint,
        api_endpoint: apiEndpoint
      }, function() {
        alert('Settings saved!');
      });
    });
  });