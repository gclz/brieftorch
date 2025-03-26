//Coordinates extraction → summary → display.
document.getElementById("go").onclick = () => {
  document.getElementById("output").innerText = "Summarizing...";
  
  chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
    chrome.tabs.sendMessage(
      tabs[0].id,
      { action: "extract" },
      (response) => {
        if (!response) {
          document.getElementById("output").innerText = "Error: Could not extract text from page";
          return;
        }

        const { text } = response;
        if (!text) {
          document.getElementById("output").innerText = "Error: No text found on page";
          return;
        }

        chrome.runtime.sendMessage(
          { action: "summarize", text },
          (response) => {
            if (chrome.runtime.lastError) {
              document.getElementById("output").innerText = `Error: ${chrome.runtime.lastError.message}`;
              return;
            }
            
            if (response?.error) {
              document.getElementById("output").innerText = `Error: ${response.error}`;
            } else if (response?.summary) {
              document.getElementById("output").innerText = response.summary;
            } else {
              document.getElementById("output").innerText = "Error: Invalid response from summarizer";
            }
          }
        );
      }
    );
  });
};