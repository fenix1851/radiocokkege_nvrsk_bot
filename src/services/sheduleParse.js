const cherio = require('cherio');
const fsp = require('fs').promises

async function main(){
    const html = await fsp.readFile('./src/data/shedule.html')
    const $ = cherio.load(html)
    const tables = $('table[class=MsoNormalTable]')
    table = $(tables[0])
    tds = table.children('td')
    console.log(tds)
    const groups = {}
    // for(let table in tables){
    //     table = $(table)
    //     firstRow = 
    //     const groupsColumns = firstRow('td')
    //     for(let column in groupsColumns){
    //         column = cherio.load(column)
    //         groups[column.text()] = {}
    //     }
    // }
    console.log(groups)
}

main()