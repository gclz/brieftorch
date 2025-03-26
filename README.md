# BriefTorch 🔥

BriefTorch is a Chrome extension that uses AI to generate concise, structured summaries of web pages. It leverages OpenAI's GPT models to analyze page content and provide key insights in an easy-to-read format.

## Features

- 🚀 One-click page summarization
- 📝 Structured summaries with main points, key findings, and implications
- 💾 Automatic caching of summaries for previously visited pages
- ⚙️ Configurable settings including:
  - Custom OpenAI API key
  - Model selection (GPT-3.5-Turbo, GPT-4)
  - Custom API endpoint support
- 🎯 Smart text extraction from various page layouts
- 📱 Clean, responsive popup interface

## Installation

1. Clone this repository or download the source code
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked" and select the extension directory

## Configuration

1. Click the extension icon and select "Options" (or right-click and choose "Options")
2. Enter your OpenAI API key
3. Select your preferred model
4. (Optional) Configure a custom API endpoint
5. Click "Save"

## Usage

1. Navigate to any webpage you want to summarize
2. Click the BriefTorch icon in your browser toolbar
3. Click "Summarize Page"
4. View the structured summary with:
   - Main Points
   - Key Findings
   - Implications

## Technical Details

- Built with vanilla JavaScript
- Uses the OpenAI Chat Completions API
- Implements intelligent text chunking for long pages
- Supports Markdown rendering for formatted output
- Handles various webpage layouts through multiple selector strategies

## Privacy & Security

- API keys are stored locally in Chrome storage
- No data is collected or stored externally
- All processing happens through your personal OpenAI API key

## Development

The extension consists of several key components:
- `background.js`: Handles API communication and text processing
- `content.js`: Manages webpage text extraction
- `popup.js`: Controls the user interface
- `options.js`: Handles extension configuration

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.