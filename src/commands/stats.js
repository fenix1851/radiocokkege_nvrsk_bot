const { MONGODB_URI, ADMIN_ID } = process.env;
const { MongoClient } = require('mongodb')

module.exports = () => async (ctx)=>{
    const db = (await MongoClient.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })).db();
    var userCount = 0
    const users = await db.collection('sessions').find({}).toArray()
    users.forEach((user) => {
        userCount++
    })
    ctx.reply(`Всего пользователей: ${userCount}`)
}