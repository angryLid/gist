(async function(recollect = false) {
    const today = new Date()
    const dateString = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`

    if(!localStorage.getItem(dateString) || recollect){
        collect()
    }

    const animeList = JSON.parse(localStorage.getItem(dateString))
    const parser = new DOMParser()
    for(const [index, anime] of animeList.entries()){
        if(localStorage.getItem(anime[0])){
            continue
        }
        fetch(anime[0])
            .then(r => r.text())
            .then(html => {
                const doc = parser.parseFromString(html, "text/html")
                const score = +doc.querySelector("#panelInterestWrapper .global_score .number").innerText
                const votes = +doc.querySelector("#panelInterestWrapper #ChartWarpper small span").innerText
                localStorage.setItem(anime[0], `${score},${votes}`)
            })
        await new Promise(resolve => setTimeout(resolve, 1000 *( 1 + index % 3)))
    }

    for(let i = 0; i < animeList.length; i ++){
        [animeList[i][3], animeList[i][4]] = localStorage.getItem(animeList[i][0]).split(',')
    }
    localStorage.setItem(dateString, JSON.stringify(animeList))
    downloadFile('name, score, votes\n' + animeList.map(a => `${a[1]}, ${a[3]}, ${a[4]}\n`).join(""), `bgm.csv`);
    function downloadFile(content, fileName) {
        const blob = new Blob([content], { type: "text/csv",});
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }
    function collect () {
        const days = document.querySelectorAll("#colunmSingle .week .coverList")
        const animeList = []
        Array.from(days).forEach(day => {
            const links = day.querySelectorAll("li p a")
            let name = ''
            Array.from(links).forEach((link, index) => {
                if(index % 2 === 0){
                    name = link.innerText
                } else {
                    const tuple = name 
                        ?[link.href, name, link.innerText]
                        :[link.href, link.innerText, name]
                    animeList.push(tuple)
                }
            })
        })

        localStorage.setItem(dateString, JSON.stringify(animeList))
    }
    
})(true)
