//Handles chunking + OpenAI API calls.
let OPENAI_KEY = "";

// Initialize API key from storage
chrome.storage.local.get(['openai_key'], function(result) {
  console.log("API key loaded:", result.openai_key ? "Yes" : "No"); // Debug log
  OPENAI_KEY = result.openai_key;
});

async function summarize(text) {
  console.log("Summarize function called with text length:", text.length); // Debug log
  
  if (!OPENAI_KEY) {
    throw new Error("Please set your OpenAI API key in the extension options");
  }

  const endpoint = "https://api.openai.com/v1/chat/completions";
  const payload = {
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: `Summarize key topics:\n\n${text}` }],
    max_tokens: 250
  };

  try {
    console.log("Sending request to OpenAI"); // Debug log
    const resp = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_KEY}`
      },
      body: JSON.stringify(payload)
    });
    
    const data = await resp.json();
    console.log("Received response from OpenAI"); // Debug log
    return data.choices[0].message.content;
  } catch (error) {
    console.error("Error in summarize:", error); // Debug log
    throw error;
  }
}

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  console.log("Background received message:", msg.action); // Debug log
  
  if (msg.action === "summarize") {
    console.log("Starting summarization process"); // Debug log
    
    // We need to handle the async response properly
    (async () => {
      try {
        const summary = await summarize(msg.text);
        console.log("Summarization successful"); // Debug log
        sendResponse({ summary });
      } catch (error) {
        console.error("Summarization error:", error); // Debug log
        sendResponse({ error: error.message });
      }
    })();
    
    return true; // Keep the message channel open for the async response
  }
});