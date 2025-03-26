//Handles chunking + OpenAI API calls.
let OPENAI_KEY = "";

// Initialize API key from storage
chrome.storage.local.get(['openai_key'], function(result) {
  OPENAI_KEY = result.openai_key;
});

async function summarize(text, isFinalSummary = false) {
  if (!OPENAI_KEY) {
    throw new Error("Please set your OpenAI API key in the extension options");
  }

  const endpoint = "https://api.openai.com/v1/chat/completions";
  
  // Different prompts for initial chunking vs final summary
  const prompt = isFinalSummary ? 
    `Combine and synthesize these summaries into a single coherent summary. Remove any redundancies and organize the key points:

${text}` :
    `Analyze and summarize the main points from this text. Focus on:
- Core arguments and insights
- Key findings or conclusions
- Important supporting evidence
- Any significant implications

Text to analyze:
${text}`;

  const payload = {
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: "You are a skilled analyst focused on extracting key insights. Present your summary in bullet points, focusing on the main arguments, key findings, and important conclusions. Be concise but comprehensive."
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
        // Split text into 3000 character chunks
        const chunks = [];
        for (let i = 0; i < msg.text.length; i += 3000) {
          chunks.push(msg.text.slice(i, i + 3000));
        }

        // Get initial summaries for each chunk
        const chunkSummaries = await Promise.all(chunks.map(chunk => summarize(chunk)));
        
        // If we only have one chunk, return its summary
        if (chunkSummaries.length === 1) {
          sendResponse({ summary: chunkSummaries[0] });
          return;
        }

        // Combine all summaries into one and get a final summary
        const combinedSummaries = chunkSummaries.join("\n\n");
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