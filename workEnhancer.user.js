// ==UserScript==
// @name         Work Enhancer
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  try to take over the world!
// @author       You
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        GM_openInTab
// @grant        GM_addStyle
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

        if( e.code === "KeyD") {
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

    function calcRelativeDate(){
        const rows = document.querySelectorAll("issuetable-web-component table tbody tr");
        const now = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())
        const t = 86_400_000
        if(!rows) throw new Error("rows is null")

        Array.from(rows).forEach(ele => {
            const slashedDate = ele.querySelector(".duedate").innerText

            const [year, month, day] = [
                slashedDate.slice(0, 4),
                slashedDate.slice(5, 7),
                slashedDate.slice(8, 10),
            ]

            const thisDate = new Date(year, month - 1, day)
            const dict = "周日，周一，周二，周三，周四，周五，周六".split("，")

            let relativeDay = dict[thisDate.getDay()]

            const gap = (now - thisDate) / t


            // 计算当前周的周一和周日
            const today = now
            const oneDay = t
            const input = thisDate
            const dayOfWeek = today.getDay();
            const mondayOffset = (dayOfWeek === 0 ? -6 : 1 - dayOfWeek); // 如果今天是周日(dayOfWeek === 0)，则需要向后调整6天
            const sundayOffset = 7 - dayOfWeek;

            const mondayThisWeek = new Date(today.getTime() + mondayOffset * oneDay);
            const sundayThisWeek = new Date(today.getTime() + sundayOffset * oneDay);

            // 判断本周


            // 计算下周的周一和周日
            const mondayNextWeek = new Date(sundayThisWeek.getTime() + oneDay);
            const sundayNextWeek = new Date(mondayNextWeek.getTime() + 6 * oneDay);

            // 判断下周


            const mondayNNextWeek = new Date(mondayNextWeek.getTime() + oneDay);
            const sundayNNextWeek = new Date(sundayNextWeek.getTime() + 6 * oneDay);

            // 判断下周
            if (input >= mondayThisWeek && input <= sundayThisWeek) {
                relativeDay = '本' + relativeDay;
            }else if (input >= mondayNextWeek && input <= sundayNextWeek) {
                relativeDay = '下' + relativeDay;
            }else if (input >= mondayNNextWeek && input <= sundayNNextWeek) {
                relativeDay = '再下' + relativeDay;
            }

            switch(gap){
                case 0: {
                    relativeDay = "今天"
                    break
                }
                case 1: {
                    relativeDay = "明天"
                    break
                }
                case 2: {
                    relativeDay = "后天"
                    break
                }
            }
            ele.querySelector(".duedate")
                .insertAdjacentHTML("beforeend", `<div>${relativeDay}</div>`)
        })
    }


    function filterMine() {
        const username = document.querySelector('meta[name="ajs-remote-user-fullname"]').content
        const checkbox = document.createElement("input")
        checkbox.type = "checkbox"
        const label = document.createElement("label")
        label.innerText = "只显示我的"
        const attach = document.querySelector("#attachmentmodule")
        const wrapper = document.createElement("div")
        wrapper.insertAdjacentElement("beforeend", label)
        wrapper.insertAdjacentElement("beforeend", checkbox)

        attach.insertAdjacentElement("afterend", wrapper)

        const hide = function (e) {
            e.style.position = 'fixed'
            e.style.top = '-999px'
        }
        const show = function(e) {
            e.style.position = 'static'
        }
        checkbox.onchange = function() {
            const rows = document.querySelectorAll("issuetable-web-component table tbody tr");

            console.log(this)
            Array.from(rows).forEach(ele => {
                const assignee = ele.querySelector(".assignee")
                if(!assignee.innerText.includes(username)){
                    if(this.checked) {
                       hide(ele)
                    }else {
                       show(ele)
                    }
                }
            })

        }

    }

    if(location.href.includes("jira.xingshulin.com/browse")) {
        setTimeout(() => {
            calcRelativeDate()
            filterMine()
        }, 1000)

    }

})();
