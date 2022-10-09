require('dotenv').config()

const cherio = require('cherio');
const fsp = require('fs').promises
const axios = require('axios')

const {
    MONGODB_URI,
    ADMIN_ID
} = process.env;
const {
    MongoClient
} = require('mongodb')

module.exports = () => async () => {
    // get shedule from site
    const responce = await axios.get('https://www.novkrp.ru/raspisanie.htm')
    const html = responce['data']

    // load html to parser
    const $ = cherio.load(html)

    // get tables
    const tables = $('table[class=MsoNormalTable]')
    const groups = {}
    // iterate over tables to get all groups data
    tables.each((tableIdx, table) => {
        const ps = $('p[class=MsoNormal]')
        let date = ''
        for(let i = 0; i < ps.length; i++){
            const p = ps[i]
            const text = $(p).text()
            if(text.search(/\d/) != -1){
                date = text.replace(/\n/g, ' ')
                break
            }
        }

        const trs = $(table).find('tr')
        const groupsFromTable = $(trs[0])
        const tds = groupsFromTable.find('td')
        tds.each((tdIdx, td) => {
            let classes = {}
            trs.each((trIndex, tr) => {
                const collegeClass = $($(tr).find('td')[tdIdx]).find('p')

                if (collegeClass.length == 2) {
                    // console.log($(collegeClass[0]).text().includes('.'))
                    if ($(collegeClass[1]).text().search(/\d/) != -1 && !$(collegeClass[0]).text().includes('.')) {
                        classes[trIndex] = {
                            name: $(collegeClass[0]).text().replace(/\n/g, ''),
                            room: $(collegeClass[1]).text().replace(/\n/g, '').split('.')[1],
                        }
                    }
                    else if($(collegeClass[0]).text().includes('.')){
                        classes[trIndex] = {
                            name: $(collegeClass[0]).text().replace(/\n/g, '').split(' ').slice(0,3).join(' '),
                            teacher: $(collegeClass[0]).text().replace(/\n/g, '').split(' ').slice(4,7).join(' '),
                            room: $(collegeClass[1]).text().replace(/\n/g, ''),
                        }
                        // console.log(classes[trIndex])
                    }
                     else {
                        classes[trIndex] = {
                            name: $(collegeClass[0]).text().replace(/\n/g, ''),
                            teacher: $(collegeClass[1]).text().replace(/\n/g, ''),
                        }
                    }
                    // console.log(classes[trIndex])
                } else if (collegeClass.length == 3) {
                    classes[trIndex] = {
                        name: $(collegeClass[0]).text().replace(/\n/g, ''),
                        room: $(collegeClass[2]).text().replace(/\n/g, '').split('.')[1],
                        teacher: $(collegeClass[1]).text().replace(/\n/g, ''),
                    }
                } else if (collegeClass.length == 4) {
                    if ($(collegeClass[3]).text().length == 1) {
                        // console.log(1)
                        classes[trIndex] = {
                            name: $(collegeClass[0]).text().replace(/\n/g, ''),
                            room: $(collegeClass[2]).text().replace(/\n/g, '').split('.')[1],
                            teacher: $(collegeClass[1]).text().replace(/\n/g, ''),
                        }
                    } else if ($(collegeClass[2]).text().includes('.') && !$(collegeClass[3]).text().includes(',')) {
                        // console.log(2)
                        classes[trIndex] = {
                            name: $(collegeClass[0]).text().replace(/\n/g, ''),
                            room: $(collegeClass[3]).text().replace(/\n/g, '').split('.')[1],
                            teacher: [$(collegeClass[1]).text(), $(collegeClass[2]).text()].join(' '),
                        }
                    } else {
                        classes[trIndex] = {
                            name: $(collegeClass[0]).text().replace(/\n/g, ''),
                            room1: $(collegeClass[3]).text().replace(/\n/g, '').split(',')[0].split('.')[1],
                            room2: $(collegeClass[3]).text().replace(/\n/g, '').split(',')[1],
                            teacher1: $(collegeClass[1]).text().replace(/\n/g, ' '),
                            teacher2: $(collegeClass[2]).text().replace(/\n/g, ' '),
                        }
                    }
                } else if (collegeClass.length == 5) {
                    if ($(collegeClass[3]).text().replace(/\n/g, '').split(',')[0].split('.')[1]) {
                        classes[trIndex] = {
                            name: $(collegeClass[0]).text().replace(/\n/g, ''),
                            room1: $(collegeClass[3]).text().replace(/\n/g, '').split(',')[0].split('.')[1],
                            room2: $(collegeClass[4]).text().replace(/\n/g, ''),
                            teacher1: $(collegeClass[1]).text().replace(/\n/g, ' '),
                            teacher2: $(collegeClass[2]).text().replace(/\n/g, ' '),
                        }
                    } else if ($(collegeClass[4]).text().replace(/\n/g, '').split('.')[1] != undefined) {
                        classes[trIndex] = {
                            name: $(collegeClass[0]).text().replace(/\n/g, ''),
                            room1: $(collegeClass[4]).text().replace(/\n/g, '').split('.')[1].split(',')[0],
                            room2: $(collegeClass[4]).text().replace(/\n/g, '').split('.')[1].split(',')[1],
                            teacher1: $(collegeClass[1]).text().replace(/\n/g, ' '),
                            teacher2: $(collegeClass[2]).text().replace(/\n/g, ' '),
                        }
                    } else {
                        classes[trIndex] = {
                            name: $(collegeClass[0]).text().replace(/\n/g, ''),
                            room1: $(collegeClass[4]).text().replace(/\n/g, '').split(',')[0],
                            room2: $(collegeClass[4]).text().replace(/\n/g, '').split(',')[1],
                            teacher1: $(collegeClass[1]).text().replace(/\n/g, ' '),
                            teacher2: $(collegeClass[2]).text().replace(/\n/g, ' '),
                        }

                    }
                } else if (collegeClass.length == 6) {
                    classes[trIndex] = {
                        name: $(collegeClass[0]).text().replace(/\n/g, ''),
                        room1: $(collegeClass[3]).text().replace(/\n/g, '').split('.')[1],
                        room2: $(collegeClass[4]).text().replace(/\n/g, ''),
                        teacher1: $(collegeClass[1]).text().replace(/\n/g, ' '),
                        teacher2: $(collegeClass[2]).text().replace(/\n/g, ' '),
                    }
                } else {
                    if (collegeClass.length > 1) {
                        console.log(collegeClass.length)
                        console.log($(collegeClass).text())
                    }
                }

            })
            let groupName = $(td).text().split('\n')[1].slice(2)
            if(groupName.replace(/\s/g, '')){
                objectToDb = {
                    date: date,
                    groupName: groupName,
                    tableIndex: tableIdx,
                    tdIdx: tdIdx,
                    classes: classes
                }
                updateMongoData(objectToDb)}
                else(console.log('empty'))
                // console.log(objectToDb)
            })
    })
}
const updateMongoData = async function (objectToDb) {
    const db = (await MongoClient.connect(MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })).db();
    // if(!await db.shedule.deleteOne()){
    //     db.createCollection('shedule')
    // }
    await db.collection('shedule').deleteOne({
        groupName: objectToDb.groupName
    })
    await db.collection('shedule').insertOne(objectToDb)
    // console.log('updated')
}