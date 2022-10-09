const { Scenes: { BaseScene } } = require('telegraf')
const distribution = new BaseScene('distribution');

const { MONGODB_URI, ADMIN_ID } = process.env;
const { MongoClient } = require('mongodb')

distribution.enter(async (ctx) => {
    // console.log(await db)
    const db = (await MongoClient.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })).db();
    var userCount = 0
    const users = await db.collection('sessions').find({}).toArray()
    users.forEach((user) => {
        userCount++
    })
    ctx.reply(`Всего пользователей: ${userCount}, что хотете отправить?`)
    console.log(userCount)
    distribution.on('message', (ctx) => {
        ctx.scene.state['text'] = ctx.message.text;
        ctx.reply('Вы уверены, может быть /cancle ??? если вы уверены, то /resume')
    })
})
distribution.command('cancle', (ctx) => {
    return ctx.scene.leave('distribution')
})
distribution.command('resume', async (ctx) => {
    const db = (await MongoClient.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })).db();
    const users = await db.collection('sessions').find({}).toArray()
    text = ctx.scene.state.text
    console.log(text)
    if (text != 'Отмена' && text != '0') {
        var distributionCount = 0
        users.forEach((user) => {
            distributionCount++
            ctx.telegram.sendMessage(user.data.userId, text)
        })
        return ctx.scene.leave(
            ctx.reply(`Рассылка отправлена ${distributionCount} пользователям`)
        )
    }
    else {
        ctx.reply('Рассылка не отправлена, введена команда отмены рассылки')
        ctx.scene.leave()
    }
})

module.exports = distribution