require('dotenv').config();
const {MONGODB_URI} = process.env;
const {MongoClient} = require('mongodb')

const groupKeyboard = {
    inline_keyboard: [
    [
        {text: '1-О-1',callback_data: '1-О-1'},
        {text: '1-О-2', callback_data: '1-О-2'},
        {text: '1-ОТ-1', callback_data: '1-ОТ-1'},
        {text: '1-ОТ-2', callback_data: '1-ОТ-2'},
        {text: '1-ОТ-3', callback_data: '1-ОТ-3'},
    ]
]
}

async function main() {
    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    const db = client.db();
    const collection = db.collection('shedule');
    const groups = await collection.find().toArray();
    const groupsList = []
    for(let i = 0; i < groups.length; i++){
        groupsList.push(groups[i].groupName)
    }
    for(let i = 0; i < groupsList.length; i++){
        if(i%5 === 0){
            console.log(`{text: '${groupsList[i]}', callback_data: '${groupsList[i]}'},`)
        }
    }
}
main()