//Extracts visible text, sends it to the background worker.
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === "extract") {
    const text = Array.from(document.querySelectorAll("p"))
                      .map(el => el.innerText)
                      .join("\n\n");
    sendResponse({ text });
  }
  return true;
});
