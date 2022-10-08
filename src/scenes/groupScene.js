const {Scenes: {BaseScene}} = require('telegraf')

const groupScene = new BaseScene('weekdays')
const groupKeyboard = require('../keyboards/groups')
weekdays.enter((ctx)=>{
    ctx.tg.deleteMessage(ctx.chat.id, ctx.update.callback_query.message.message_id)
    ctx.tg.sendMessage(ctx.chat.id, 'Выберите группу недели:', {reply_markup: groupKeyboard})

    weekdays.action(/.+$/, (ctx)=>{
        var userAction = ctx.match[0]
        ctx.session.group = userAction
        ctx.scene.leave('groupScene')
        ctx.scene.enter('shedule')
    })
})

module.exports = groupScene