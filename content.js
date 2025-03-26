//Extracts visible text, sends it to the background worker.
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === "extract") {
    console.log('Content script activated'); // Debug log

    // Try multiple selectors specific to blog posts and articles
    const selectors = [
      'article',
      '.post-content',
      '.content',
      'main',
      '#content',
      '.article',
      'body'  // fallback to grab everything if needed
    ];

    let text = '';
    for (const selector of selectors) {
      const elements = document.querySelectorAll(selector);
      console.log(`Found ${elements.length} elements for selector: ${selector}`); // Debug log
      
      if (elements.length > 0) {
        text = Array.from(elements)
          .map(el => el.innerText)
          .filter(t => t && t.trim().length > 0)
          .join('\n\n');
        
        if (text.length > 0) {
          console.log(`Found text using ${selector}. Length: ${text.length}`); // Debug log
          console.log('Sample:', text.substring(0, 100)); // Debug log
          break;
        }
      }
    }

    if (!text) {
      // Last resort: grab all paragraphs
      const paragraphs = document.querySelectorAll('p');
      console.log(`Found ${paragraphs.length} paragraphs`); // Debug log
      text = Array.from(paragraphs)
        .map(el => el.innerText)
        .filter(t => t && t.trim().length > 0)
        .join('\n\n');
    }

    if (!text || text.trim().length === 0) {
      console.log('No text found after trying all methods'); // Debug log
      sendResponse({ error: "No text found on page" });
    } else {
      console.log(`Sending response with text length: ${text.length}`); // Debug log
      sendResponse({ text: text });
    }
  }
  return true;
});