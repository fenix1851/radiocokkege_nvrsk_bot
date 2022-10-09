require('dotenv').config();
const {
    MONGODB_URI
} = process.env;
const {
    MongoClient
} = require('mongodb')
const {
    Scenes: {
        BaseScene
    }
} = require('telegraf')


const sheduleScene = new BaseScene('shedule')
sheduleScene.enter(async (ctx) => {
    try {
        ctx.tg.deleteMessage(ctx.chat.id, ctx.update.callback_query.message.message_id)
        const db = (await MongoClient.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })).db();
        const shedule = db.collection('shedule')
        const sheduleData = await shedule.findOne({
            groupName: ctx.session.group
        })
        const groupName = sheduleData.groupName
        const date = sheduleData.date
        const classes = sheduleData.classes
        const classesList = []
        for (let i = 0; i < Object.keys(classes).length; i++) {
            
            const clas = classes[Object.keys(classes)[i]]
            if (!clas.teacher && !clas.teacher1) {
                classesList.push(`
${Object.keys(classes)[i]} пара: 
Занятие: ${clas.name}
Кабинет группы: ${clas.room}
            `)
            } else if (Object.keys(clas).includes('teacher1')) {
                classesList.push(`
${Object.keys(classes)[i]} пара: 
Предмет: ${clas.name}
Кабинет 1 группы: ${clas.room1}
Преподаватель 1 группы: ${clas.teacher1}
Кабинет 2 группы: ${clas.room2}
Преподаватель 2 группы: ${clas.teacher2}
            `)
            } else if (!clas.room && !clas.room1) {
                classesList.push(`
${Object.keys(classes)[i]} пара: 
Занятие: ${clas.name}
Преподаватель: ${clas.teacher}
            `)
            } else {
                classesList.push(`
${Object.keys(classes)[i]} пара: 
Предмет: ${clas.name}
Кабинет: ${clas.room}
Преподаватель: ${clas.teacher}
            `)
            }
            // console.log(classesList)
        }
        // console.log(classesList)
        ctx.tg.sendMessage(ctx.chat.id, `Расписание для группы ${groupName} на ${date}:
        ${classesList.join('\n')}`,  {reply_markup: {inline_keyboard: [[{text: 'Назад', callback_data: 'back'}],[{text: 'Обновить', callback_data: 'shedule'}]]}})
        sheduleScene.action('back', (ctx) => {
            ctx.scene.enter('groupScene')
        })
        sheduleScene.action('shedule', (ctx) => {
            ctx.scene.enter('shedule')
        }
        )
    
    } catch (error) {
        console.log(error)
    }
    

})

module.exports = sheduleScene