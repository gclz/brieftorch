//Coordinates extraction → summary → display.
document.getElementById("go").onclick = () => {
  chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
    chrome.tabs.sendMessage(
      tabs[0].id,
      { action: "extract" },
      ({ text }) => {
        chrome.runtime.sendMessage(
          { action: "summarize", text },
          ({ summary }) => {
            document.getElementById("output").innerText = summary;
          }
        );
      }
    );
  });
};
