const cherio = require('cherio');
const fsp = require('fs').promises

async function main(){
    const html = await fsp.readFile('./src/data/shedule.html')
    const $ = cherio.load(html)
    const tables = $('table[class=MsoNormalTable]')
    console.log(tables.length)
    const groups = {}
    tables.forEach(table => {
        const firstRow = table('tr')[0]
        const groupsColumns = firstRow('td')
        groupsColumns.forEach(column => {
            groups[column.text()] = {}
        })
        
    });
    console.log(groups)
}

main()