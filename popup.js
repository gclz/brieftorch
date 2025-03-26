// Function to check for cached summary when popup opens
function loadCachedSummary() {
  chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
    const currentUrl = tabs[0].url;
    const outputEl = document.getElementById("output");

    chrome.storage.local.get(['summaries'], function(result) {
      const summaries = result.summaries || {};
      if (summaries[currentUrl]) {
        outputEl.className = '';
        outputEl.innerHTML = summaries[currentUrl];
      }
    });
  });
}

// Load cached summary when popup opens
document.addEventListener('DOMContentLoaded', loadCachedSummary);

//Coordinates extraction → summary → display.
document.getElementById("go").onclick = () => {
  const outputEl = document.getElementById("output");
  outputEl.className = 'loading';
  outputEl.innerHTML = "Summarizing...";
  
  chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
    const currentUrl = tabs[0].url;

    // Generate new summary
    chrome.tabs.sendMessage(
      tabs[0].id,
      { action: "extract" },
      (response) => {
        if (!response) {
          outputEl.className = '';
          outputEl.innerHTML = "Error: Could not extract text from page";
          return;
        }

        const { text } = response;
        if (!text) {
          outputEl.className = '';
          outputEl.innerHTML = "Error: No text found on page";
          return;
        }

        chrome.runtime.sendMessage(
          { action: "summarize", text },
          (response) => {
            outputEl.className = '';
            
            if (chrome.runtime.lastError) {
              outputEl.innerHTML = `Error: ${chrome.runtime.lastError.message}`;
              return;
            }
            
            if (response?.error) {
              outputEl.innerHTML = `Error: ${response.error}`;
            } else if (response?.summary) {
              // Clean up extra newlines and add spacing between sections
              const cleanedSummary = response.summary
                .replace(/\n\s*\n\s*\n/g, '\n\n')
                .replace(/(\*\*[^*]+:\*\*)/g, '\n$1\n')
                .trim();

              // Convert markdown to HTML
              try {
                const htmlContent = marked.parse(cleanedSummary, {
                  breaks: true,
                  gfm: true
                });
                outputEl.innerHTML = htmlContent;

                // Save the summary for this URL
                chrome.storage.local.get(['summaries'], function(result) {
                  const summaries = result.summaries || {};
                  summaries[currentUrl] = htmlContent;
                  chrome.storage.local.set({ summaries: summaries }, () => {
                    console.log('Summary saved for:', currentUrl);
                  });
                });

              } catch (e) {
                outputEl.innerHTML = cleanedSummary;
              }
            } else {
              outputEl.innerHTML = "Error: Invalid response from summarizer";
            }
          }
        );
      }
    );
  });
};