//Handles chunking + OpenAI API calls.
let OPENAI_KEY = "";
let USE_CUSTOM_ENDPOINT = false;
let API_ENDPOINT = "https://api.openai.com/v1/chat/completions";

// Initialize settings from storage
chrome.storage.local.get(['openai_key', 'use_custom_endpoint', 'api_endpoint'], function(result) {
  OPENAI_KEY = result.openai_key;
  USE_CUSTOM_ENDPOINT = result.use_custom_endpoint;
  if (USE_CUSTOM_ENDPOINT && result.api_endpoint) {
    API_ENDPOINT = result.api_endpoint;
  }
});

async function summarize(text, isFinalSummary = false) {
  if (!OPENAI_KEY) {
    throw new Error("Please set your OpenAI API key in the extension options");
  }

  const endpoint = API_ENDPOINT;
  
  const prompt = isFinalSummary ? 
    `Synthesize these summaries into a single structured summary using exactly this format:

**Main Points:**
- [Key point 1]
- [Key point 2]
- [Key point 3]

**Key Findings:**
- [Finding 1]
- [Finding 2]
- [Finding 3]

**Implications:**
- [What this means 1]
- [What this means 2]

Text to synthesize:
${text}` :
    `Summarize this text using exactly this format:

**Main Points:**
- [Key point 1]
- [Key point 2]
- [Key point 3]

**Key Findings:**
- [Finding 1]
- [Finding 2]
- [Finding 3]

**Implications:**
- [What this means 1]
- [What this means 2]

Text to analyze:
${text}`;

  const payload = {
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: "You are a precise summarizer. Always use the exact format provided. Be clear and concise. If a section has no relevant information, write 'No specific [points/findings/implications] found in the text.'"
      },
      {
        role: "user",
        content: prompt
      }
    ],
    max_tokens: 500,
    temperature: 0.3
  };

  const resp = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${OPENAI_KEY}`
    },
    body: JSON.stringify(payload)
  });
  const data = await resp.json();
  return data.choices[0].message.content;
}

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === "summarize") {
    // Create an async context and handle the response
    (async () => {
      try {
        const chunks = [];
        for (let i = 0; i < msg.text.length; i += 3000) {
          chunks.push(msg.text.slice(i, i + 3000));
        }
        const summaries = await Promise.all(chunks.map(summarize));
        
        // If we only have one chunk, return its summary
        if (summaries.length === 1) {
          sendResponse({ summary: summaries[0] });
          return;
        }

        // Combine all summaries into one and get a final summary
        const combinedSummaries = summaries.join("\n\n");
        const finalSummary = await summarize(combinedSummaries, true);
        
        sendResponse({ summary: finalSummary });
      } catch (error) {
        console.error('Summarization error:', error);
        sendResponse({ error: error.message });
      }
    })();
    return true; // Keep the message channel open
  }
});