// Content script — no imports allowed
(function() {
  function extractPageSignals() {
    return {
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
  }

  chrome.runtime.onMessage.addListener((msg: any, _sender: any, sendResponse: any) => {
    if (msg.type === 'SCAN_PAGE') {
      sendResponse(extractPageSignals())
    }
    return true
  })
})();