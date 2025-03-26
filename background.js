//Handles chunking + OpenAI API calls.
const OPENAI_KEY = "<YOUR_API_KEY>";

async function summarize(text) {
  const endpoint = "https://api.openai.com/v1/chat/completions";
  const payload = {
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: `Summarize key topics:\n\n${text}` }],
    max_tokens: 250
  };
  const resp = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${OPENAI_KEY}`
    },
    body: JSON.stringify(payload)
  });
  return (await resp.json()).choices[0].message.content;
}

chrome.runtime.onMessage.addListener(async (msg, sender, sendResponse) => {
  if (msg.action === "summarize") {
    const chunks = [];
    for (let i = 0; i < msg.text.length; i += 3000) {
      chunks.push(msg.text.slice(i, i + 3000));
    }
    const summaries = await Promise.all(chunks.map(summarize));
    sendResponse({ summary: summaries.join("\n\n") });
  }
  return true;
});
