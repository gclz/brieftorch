//Coordinates extraction → summary → display.
document.getElementById("go").onclick = () => {
  console.log("Summarize button clicked"); // Debug log
  
  document.getElementById("output").innerText = "Processing...";
  
  chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
    console.log("Sending extract message to tab"); // Debug log
    
    chrome.tabs.sendMessage(
      tabs[0].id,
      { action: "extract" },
      (response) => {
        console.log("Received response from content script:", response); // Debug log
        
        if (!response) {
          document.getElementById("output").innerText = "Error: No response from page";
          return;
        }

        if (response.error) {
          document.getElementById("output").innerText = `Error: ${response.error}`;
          return;
        }

        console.log("Sending text to background for summarization"); // Debug log
        chrome.runtime.sendMessage(
          { action: "summarize", text: response.text },
          (summaryResponse) => {
            console.log("Received summary response:", summaryResponse); // Debug log
            
            if (summaryResponse?.error) {
              document.getElementById("output").innerText = `Error: ${summaryResponse.error}`;
            } else if (summaryResponse?.summary) {
              document.getElementById("output").innerText = summaryResponse.summary;
            } else {
              document.getElementById("output").innerText = "Error: Invalid response from summarizer";
            }
          }
        );
      }
    );
  });
};