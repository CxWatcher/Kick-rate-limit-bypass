// ==UserScript==
// @name         RateLimit Bypass
// @namespace    RishiSunak
// @version      0.4
// @description  Bypass the kick ratelimit for emotes and messages
// @author       You
// @match        https://kick.com/*
// @grant        none
// ==/UserScript==
 
(function() {
    'use strict';
 
    function getCookie(name) {
        const cookies = document.cookie.split('; ');
        for (const cookie of cookies) {
            const [cookieName, cookieValue] = cookie.split('=');
            if (cookieName === name) {
                return cookieValue;
            }
        }
        return null;
    }
 
      const authToken = getCookie('XSRF-TOKEN');
      const xsrfToken = decodeURIComponent(authToken);
 
function sendRequest(chatId, emoteNumber, xsrfToken) {
    const headers = {
        'Accept': 'application/json, text/plain, */*',
        'Authorization': authToken,
        'X-Xsrf-Token': xsrfToken,
        'Origin': 'https://kick.com',
        'Referer': 'https://kick.com/nickwhite',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Content-Type': 'application/json'
    };
 
    const url = 'https://kick.com/api/v2/messages/send/' + chatId;
    const jsonData = JSON.stringify({
        'content': `[emote:${emoteNumber}:RishiBypass]`,
        'type': 'message'
    });
 
    fetch(url, {
        method: 'POST',
        headers: headers,
        credentials: 'include',
        body: jsonData
    }).then(response => {
        if (!response.ok) {
            if (response.status === 429) {
                console.log('IP Limit Detected - Change IP to send more emotes');
                createPopup('IP Limit Detected - Change IP to send more emotes');
            } else {
                throw new Error('Failed to send request');
            }
        }
        console.log('Request sent successfully');
    }).catch(error => {
        console.error('Error sending request:', error);
    });
}
 
function createPopup(message) {
    const popup = document.createElement('div');
    popup.textContent = message;
    popup.style.position = 'fixed';
    popup.style.top = '50%';
    popup.style.left = '50%';
    popup.style.transform = 'translate(-50%, -50%)';
    popup.style.padding = '20px';
    popup.style.background = 'red';
    popup.style.color = 'white';
    popup.style.fontFamily = 'Arial, sans-serif';
    popup.style.fontSize = '16px';
    popup.style.zIndex = '9999';
    popup.style.borderRadius = '5px';
 
    document.body.appendChild(popup);
 
    setTimeout(() => {
        document.body.removeChild(popup);
    }, 5000);
}
 
function sendMessage(chatId, message, xsrfToken) {
    const headers = {
        'Accept': 'application/json, text/plain, */*',
        'Authorization': authToken,
        'X-Xsrf-Token': xsrfToken,
        'Origin': 'https://kick.com',
        'Referer': 'https://kick.com/nickwhite',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Content-Type': 'application/json'
    };
 
    const url = 'https://kick.com/api/v2/messages/send/' + chatId;
    const jsonData = JSON.stringify({
        'content': message,
        'type': 'message'
    });
 
    fetch(url, {
        method: 'POST',
        headers: headers,
        credentials: 'include',
        body: jsonData
    }).then(response => {
        if (!response.ok) {
            if (response.status === 429) {
                console.log('IP Limit Detected - Change IP to send more messages');
                createPopup('IP Limit Detected - Change IP to send more messages');
            } else {
                throw new Error('Failed to send request');
            }
        }
        console.log('Message sent successfully');
    }).catch(error => {
        console.error('Error sending message:', error);
    });
}
 
let buttonAdded = false;
 
function attachEventListeners(chatId) {
    setTimeout(() => {
        const emoteItems = document.querySelectorAll('img[src*="/emotes/"]');
        emoteItems.forEach(emote => {
            const clone = emote.cloneNode(true);
            emote.parentNode.replaceChild(clone, emote);
        });
 
        const newEmoteItems = document.querySelectorAll('img[src*="/emotes/"]');
        newEmoteItems.forEach(emote => {
            emote.addEventListener('click', function(event) {
                event.preventDefault();
                event.stopPropagation();
                console.log('Clicked IMG element:', event.target);
                console.log('SRC:', event.target.src);
                const emoteNumber = event.target.src.match(/\/emotes\/(\d+)\/fullsize/)[1];
                console.log('Emote Number:', emoteNumber);
                sendRequest(chatId, emoteNumber, xsrfToken);
                attachEventListeners(chatId);
            });
        });
 
      if (!buttonAdded) {
            setTimeout(() => {
                const newButton = document.createElement('div');
                newButton.setAttribute('data-v-5c8c79cb', '');
                newButton.setAttribute('data-v-b51a7b6d', '');
                newButton.classList.add('quick-emote-item');
                newButton.innerHTML = `<div data-v-5c8c79cb="" class="relative">
                                           <div data-v-5c8c79cb="" class="flex items-center justify-center text-center align-middle h-4 w-4">
                                               <img src="https://i.imgur.com/7caVoug.png" class="w-full object-contain">
                                           </div>
                                       </div>`;
                document.querySelector('.quick-emotes-holder').appendChild(newButton);
                newButton.addEventListener('click', function(event) {
                    event.preventDefault();
                    event.stopPropagation();
                    const messageBox = document.getElementById('message-input');
                    const messageContent = messageBox.textContent.trim();
                    if (messageContent !== '') {
                        sendMessage(chatId, messageContent, xsrfToken);
                    } else {
                        createPopup('Type a message in the text box before clicking this');
                    }
                });
 
                buttonAdded = true;
            }, 1000);
        }
    }, 3000);
}
 
    setTimeout(function() {
        fetch('https://kick.com/api/v2/channels/' + window.location.pathname.split('/').pop(), {
            method: 'GET',
            credentials: 'include'
        }).then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch chat ID');
            }
            return response.json();
        }).then(data => {
            const chatId = data.chatroom && data.chatroom.id ? data.chatroom.id : null;
            if (!chatId) {
                throw new Error('Chat ID not found in response');
            }
            console.log('Chat ID:', chatId);
 
            attachEventListeners(chatId);
        }).catch(error => {
            console.error('Error:', error);
        });
    }, 3000);
 
 
function hideRateLimitMessage() {
    const toastHolder = document.querySelector('.toast-holder');
    if (toastHolder) {
        toastHolder.style.display = 'none';
    }
}
 
function attachHideRateLimitListeners() {
    const observerTarget = document.querySelector('body');
    const observer = new MutationObserver(mutationsList => {
        mutationsList.forEach(mutation => {
            if (mutation.addedNodes.length > 0) {
                mutation.addedNodes.forEach(addedNode => {
                    if (addedNode.nodeType === 1) {
                        if (addedNode.classList && addedNode.classList.contains('toast-holder')) {
                            hideRateLimitMessage();
                        }
                    }
                });
            }
        });
    });
 
    const observerConfig = { childList: true, subtree: true };
    observer.observe(observerTarget, observerConfig);
}
 
 
hideRateLimitMessage();
attachHideRateLimitListeners();
})();
