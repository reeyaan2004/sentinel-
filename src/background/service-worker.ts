// Service worker for Sentinel extension
// Handles badge updates and alarm-based monitoring
declare const chrome: any

chrome.runtime.onInstalled.addListener(() => {
  chrome.alarms.create('monitor-check', { periodInMinutes: 1 })
  chrome.action.setBadgeBackgroundColor({ color: '#00C8FF' })
})

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'monitor-check') {
    chrome.storage.local.get(['monitorEmail', 'lastBreachCount'], (data) => {
      if (!data.monitorEmail) return
      // Badge shows S for Sentinel when monitoring is active
      chrome.action.setBadgeText({ text: 'ON' })
    })
  }
})

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg.type === 'SET_BADGE_THREAT') {
    chrome.action.setBadgeText({ text: '!' })
    chrome.action.setBadgeBackgroundColor({ color: '#FF4D6D' })
    sendResponse({ ok: true })
  }
  if (msg.type === 'CLEAR_BADGE') {
    chrome.action.setBadgeText({ text: '' })
    sendResponse({ ok: true })
  }
  return true
})