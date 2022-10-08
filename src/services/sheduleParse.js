const cherio = require('cherio');
const fsp = require('fs').promises
const axios = require('axios')

async function main(){
    // const html = await fsp.readFile('./src/data/shedule.html')
    const responce = await axios.get('https://www.novkrp.ru/raspisanie.htm')
    const html = responce['data']
    
    // console.log(data)+
    const $ = cherio.load(html)
    const tables = $('table[class=MsoNormalTable]')
    const groups = {}
    console.log(tables.length)
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
                groups[$(td).text().split('\n')[1].slice(2)] = {
                    tableIndex: tableIdx,
                    tdIdx: tdIdx,
                    classes: classes
                }
            })
        })
        // console.log(groups)
    }
    console.log(groups['4-М-3'])


main()

module.exports = main()