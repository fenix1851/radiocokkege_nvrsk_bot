const cherio = require('cherio');
const fsp = require('fs').promises

async function main(){
    const html = await fsp.readFile('./src/data/shedule.html')
    const $ = cherio.load(html)
    const tables = $('table[class=MsoNormalTable]')
    tables.each((idx,table)=>{
        const tds = $(table).find('td')
    })
    console.log(groups)
}

main()