const {Scenes: {BaseScene}} = require('telegraf')

const groupScene = new BaseScene('groupScene')
const groupKeyboard = require('../keyboards/groups')
groupScene.enter((ctx)=>{
    try {
        ctx.tg.deleteMessage(ctx.chat.id, ctx.update.callback_query.message.message_id)
    } catch (error) {
        console.log(error)
    }
    ctx.tg.sendMessage(ctx.chat.id, 'Выберите группу:', {reply_markup: groupKeyboard})

    groupScene.action(/.+$/, (ctx)=>{
        var userAction = ctx.match[0]
        ctx.session.group = userAction
        console.log(ctx.session.group)
        ctx.scene.leave('groupScene')
        ctx.scene.enter('shedule')
    })
})

module.exports = groupScene