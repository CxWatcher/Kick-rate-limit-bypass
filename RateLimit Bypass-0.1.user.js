// ==UserScript==
// @name         RateLimit Bypass
// @namespace    RishiSunak
// @version      0.1
// @description  Send custom requests when emote buttons are clicked
// @author       You
// @match        https://kick.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';


    const authToken = 'Bearer YOUR_AUTH_TOKEN_HERE'; // Replace 'YOUR_AUTH_TOKEN_HERE' with your actual token
    const xsrfToken = 'YOUR_XSRF_TOKEN_HERE'; // Replace 'YOUR_XSRF_TOKEN_HERE' with your actual XSRF token

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
                throw new Error('Failed to send request');
            }
            console.log('Request sent successfully');
        }).catch(error => {
            console.error('Error sending request:', error);
        });
    }

    function attachEventListeners(chatId) {
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