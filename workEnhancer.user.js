// ==UserScript==
// @name         Work Enhancer
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  try to take over the world!
// @author       You
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        GM_openInTab
// @match        http://qa-yapi.xsl.link/*
// @match        https://jira.xingshulin.com/*
// @match        https://lanhuapp.com/*
// @match        https://code.xingshulin.com/*
// @match        https://xingshulin.worktile.com/*
// @match        https://qa-xhcp.xingshulin.com/*

// ==/UserScript==

(function () {
    "use strict";
    if(location.href.includes("qa-xhcp.xingshulin.com")){
        window.addEventListener("keydown", (event) => {
            const { ctrlKey, shiftKey, code, metaKey } = event
            if ((metaKey || ctrlKey) && shiftKey && code === "Digit2") {
                GM_openInTab (location.href.replace("https://qa-xhcp.xingshulin.com/apps", "http://localhost:3000"));
            }
        })
    }
    const config = {
        fontFamily: "Cascadia Code",
    }
    const siteDict = {
        // "qa-yapi.xsl.link": "API",
        "jira.xingshulin.com": "Bug",
        "lanhuapp.com": "原型",
        "code.xingshulin.com": "代码",
        "xingshulin.worktile.com": "排期",
    }

    const iconDict = {
        "qa-yapi.xsl.link":"",
        "jira.xingshulin.com": "🐞",
        "lanhuapp.com": "🎨",
        //"code.xingshulin.com": "代码",
        "xingshulin.worktile.com": "🗓",
    }
    setInterval(() => {
        const host = window.location.host
        if(siteDict[host] && !document.title.startsWith(siteDict[host])){
            document.title = `${siteDict[host]} (${document.title})`
          }
        if(iconDict[host]){
            changeFavicon(iconDict[host]);
        }

    }, 2000)


    if(window.location.host.match(/^qa-yapi.xsl.link$/)){
        GM_addStyle(`.ant-table{
              font-family: "${config.fontFamily}" !important;
            }
            `)

        GM_addStyle(`
        .ant-layout{
              font-family: "${config.fontFamily}" !important;
            }`)
    }
    if(window.location.host.match(/^xingshulin.worktile.com$/)){
        setTimeout( function() {
            // this function runs when the DOM is ready, i.e. when the document has been parsed
            const menu = document.body.querySelector(".nav-body")
            const style = "color:#fff;font-weight:700;"
            menu.insertAdjacentHTML("beforeend",`<p style="color:#fff" >
            <a style="${style}" href="https://xingshulin.worktile.com/mission/projects/60346a003500ff08647660ce">新版病历夹</a></p>
            <p style="color:#fff"><a style="${style}" href="https://xingshulin.worktile.com/mission/my/directed">我的任务</a></p>
            `)
        }, 2000);

    }


    function changeFavicon(text) {
        const canvas = document.createElement('canvas');
        canvas.height = 64;
        canvas.width = 64;
        const ctx = canvas.getContext('2d');
        ctx.font = '64px serif';
        ctx.fillText(text, 0, 64);

        const link = document.createElement('link');
        const oldLinks = document.querySelectorAll('link[rel="shortcut icon"]');
        oldLinks.forEach(e => e.parentNode.removeChild(e));
        link.id = 'dynamic-favicon';
        link.rel = 'shortcut icon';
        link.href = canvas.toDataURL();
        document.head.appendChild(link);
    }


    function GM_addStyle(css) {
        const style =
              document.getElementById("GM_addStyleBy8626") ||
              (function () {
                  const style = document.createElement("style");
                  style.id = "GM_addStyleBy8626";
                  document.head.appendChild(style);
                  return style;
              })();
        const sheet = style.sheet;
        sheet.insertRule(css, (sheet.rules || sheet.cssRules || []).length);
    }

    const redirectMapping = {
        ['qa-xhcp.xingshulin.com']() {
            const button = {}
            button.onclick = function () {
                const href = location.href.replace('https:\/\/qa-xhcp.xingshulin.com\/apps', 'http://localhost:3000')
                GM_openInTab(href)
            }
            button.onclick();

            //document.querySelector("header > div > div").insertAdjacentElement("afterend", button)
        }
    }

    let waitingKey = false;

    document.body.addEventListener('keydown', function(e) {

        if( e.key === "d") {
            if(waitingKey) {
                redirectMapping[location.host]?.()
            }else {
                waitingKey = true
                setTimeout(() => {
                    waitingKey = false
                }, 200)

            }
        }

    })


})();
