// Content script — runs on every page
// Scans for suspicious signals and can report back to the popup

function extractPageSignals() {
  const signals = {
    url: window.location.href,
    title: document.title,
    hasPasswordField: !!document.querySelector('input[type="password"]'),
    hasLoginForm: !!document.querySelector('form'),
    links: Array.from(document.querySelectorAll('a[href]'))
      .map(a => (a as HTMLAnchorElement).href)
      .filter(href => href.startsWith('http'))
      .slice(0, 10),
    pageText: document.body.innerText.slice(0, 1000),
  }
  return signals
}

// Listen for requests from the popup
chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg.type === 'SCAN_PAGE') {
    sendResponse(extractPageSignals())
  }
  return true
})