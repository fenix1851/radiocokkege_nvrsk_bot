require('dotenv').config()

const cherio = require('cherio');
const fsp = require('fs').promises
const axios = require('axios')

const { MONGODB_URI, ADMIN_ID } = process.env;
const { MongoClient } = require('mongodb')

async function main(){
    // get shedule from site
    const responce = await axios.get('https://www.novkrp.ru/raspisanie.htm')
    const html = responce['data']

    // load html to parser
    const $ = cherio.load(html)

    // get tables
    const tables = $('table[class=MsoNormalTable]')
    const groups = {}
    // iterate over tables to get all groups data
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
                name = $(td).text().split('\n')[1].slice(2)
                objectToDb = {
                    name: name,
                    tableIndex: tableIdx,
                    tdIdx: tdIdx,
                    classes: classes
                }
                updateMongoData(objectToDb)
            })
        })
    
}
const updateMongoData = async function(objectToDb){
    const db = (await MongoClient.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })).db();
    // if(!await db.shedule.deleteOne()){
    //     db.createCollection('shedule')
    // }
    await db.collection('shedule').deleteOne({name:objectToDb.name})
    await db.collection('shedule').inserOne(objectToDb)
}

main()

module.exports = main()