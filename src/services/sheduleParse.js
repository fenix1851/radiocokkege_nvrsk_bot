const cherio = require('cherio');
const fsp = require('fs').promises

async function main(){
    const html = await fsp.readFile('./src/data/shedule.html')
    const $ = cherio.load(html)
    const tables = $('table[class=MsoNormalTable]')
    console.log(tables.length)
    const groups = {}
    for(let table in tables){
        const firstRow = table('tr')[0]
        const groupsColumns = firstRow('td')
        for(let column in groupsColumns){
            groups[column.text()] = {}
        }
    }
    console.log(groups)
}

main()