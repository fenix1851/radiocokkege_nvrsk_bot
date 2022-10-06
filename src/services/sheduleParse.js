const cherio = require('cherio');
const fsp = require('fs').promises

async function main(){
    const html = await fsp.readFile('./src/data/shedule.html')
    const $ = cherio.load(html)
    const tables = $('table[class=MsoNormalTable]')
    console.log(tables)
    const groups = {}
    // for(let table in tables){
    //     table = $(table)
    //     const firstRow = table[0]
    //     console.log(firstRow)
    //     const groupsColumns = firstRow('td')
    //     for(let column in groupsColumns){
    //         column = cherio.load(column)
    //         groups[column.text()] = {}
    //     }
    // }
    console.log(groups)
}

main()