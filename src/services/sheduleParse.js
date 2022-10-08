const cherio = require('cherio');
const fsp = require('fs').promises
const axios = require('axios')

async function main(){
    const html = await fsp.readFile('./src/data/shedule.html')
    const htmlRaspisanie = await axios.get('https://www.novkrp.ru/raspisanie.htm')
    console.log(htmlRaspisanie)
    const $ = cherio.load(html)
    const tables = $('table[class=MsoNormalTable]')
    const groups = {}
    tables.each((tableIdx,table)=>{
        const trs = $(table).find('tr')
        const groupsFromTable = $(trs[0])
        const tds = groupsFromTable.find('td')
        tds.each((tdIdx,td)=>{
            let classes = {}
            trs.each((trIndex, tr)=>{
                const collegeClass = $($(tr).find('td')[tdIdx]).text()
                classes[trIndex] = (collegeClass)
            })
            delete classes[0]
                groups[$(td).text()] = {
                    tableIndex: tableIdx,
                    tdIdx: tdIdx,
                    classes: classes
                }
            })
        })
        console.log(groups)
    }


main()

module.exports = main()