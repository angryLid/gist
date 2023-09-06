// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://genshinvoice.top/v2/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=genshinvoice.top
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';
    window.$$constructor = Function.prototype.constructor
    Function.prototype.constructor = function() {
        if(arguments && typeof arguments[0] === "string"){
            if(arguments[0] === "debugger"){
                return
            }
        }
        return window.$$constructor.apply(this, arguments)
    }
})();
