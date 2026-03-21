import { callAI, systemPrompt, type Message } from '../utils/api'

chrome.runtime.onInstalled.addListener(() => {
  chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: false })
})

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === 'AI_REQUEST') {
    handleAIRequest(message.payload)
      .then((result) => sendResponse({ success: true, data: result }))
      .catch((err) => sendResponse({ success: false, error: err.message }))
    return true // keep channel open for async
  }

  if (message.type === 'OPEN_SIDEPANEL') {
    chrome.sidePanel.open({ windowId: message.windowId })
    sendResponse({ success: true })
    return false
  }

  if (message.type === 'INJECT_CONTENT') {
    chrome.scripting.executeScript({
      target: { tabId: message.tabId },
      files: ['content.js'],
    })
    sendResponse({ success: true })
    return false
  }
})

async function handleAIRequest(payload: {
  task: string
  userMessage: string
}): Promise<string> {
  const messages: Message[] = [
    systemPrompt(payload.task),
    { role: 'user', content: payload.userMessage },
  ]
  return callAI(messages)
}

export {}
