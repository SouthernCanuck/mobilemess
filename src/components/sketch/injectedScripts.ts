export const postMessageScript = (message: {}) => `(function() {
  window.postMessage('${JSON.stringify(message)}');
  true; // note: this is required, or you'll sometimes get silent failures
})()`;

export const localStorageAuthScript = (authKey: string, authValue: string) => `(function() {
  const authValue = window.localStorage.getItem('${authKey}');
  if (!authValue || authValue !== '${authValue}') {
    window.localStorage.setItem('${authKey}', '${authValue}');
    window.ReactNativeWebView.postMessage(JSON.stringify({ localStorage: 'set ${authKey}' }));
  } else {
    window.ReactNativeWebView.postMessage(JSON.stringify({ localStorage: 'already set' }));
  }
  true; // note: this is required, or you'll sometimes get silent failures
})();`;
