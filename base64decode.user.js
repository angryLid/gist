// ==UserScript==
// @name         base64 decode
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://*.v2ex.com/t/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=v2ex.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    const decode = () => {
        const targetElement = document.querySelectorAll(".reply_content")

        Array.from(targetElement).forEach(item =>{
            const secret = item.innerText.match(/[a-zA-Z0-9\/\+]{10,}={0,2}/g)
            if(!secret){
                return
            }

            secret.forEach(a => {
                try {
                    item.insertAdjacentHTML("beforeend", `<br/><a style="color:#369" target="_blank" href="${atob(a)}">${atob(a)}</a>`)
                }catch{
                }
            })
        })
    }
    decode()
    window.$$decode = decode
})();
