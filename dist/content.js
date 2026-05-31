(() => {
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };

  // src/content/content-script.ts
  var require_content_script = __commonJS({
    "src/content/content-script.ts"() {
      function extractPageSignals() {
        const signals = {
          url: window.location.href,
          title: document.title,
          hasPasswordField: !!document.querySelector('input[type="password"]'),
          hasLoginForm: !!document.querySelector("form"),
          links: Array.from(document.querySelectorAll("a[href]")).map((a) => a.href).filter((href) => href.startsWith("http")).slice(0, 10),
          pageText: document.body.innerText.slice(0, 1e3)
        };
        return signals;
      }
      chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
        if (msg.type === "SCAN_PAGE") {
          sendResponse(extractPageSignals());
        }
        return true;
      });
    }
  });
  require_content_script();
})();
