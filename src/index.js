process
 .on('unhandledRejection', (reason, p) => {
    console.log(`Unhandled Rejection at Promise: ${reason}`);
 })
 .on('uncaughtException', err => {
    console.log(`Uncaught Exception thrown: ${err}`);
 });

require('dotenv').config();

const { TEST_TOKEN, MONGODB_URI, ADMIN_ID } = process.env;
const {Telegraf, Scenes: {Stage}} = require('telegraf')

const {MongoClient} = require('mongodb')
const {session} = require('telegraf-session-mongodb')

const fsp = require('fs').promises;

// commands
const start = require('./commands/start')
const stats = require('./commands/stats')

// scenes especially fro this bot 
const groupScene = require('./scenes/groupScene')
const sheduleScene = require('./scenes/shedule')

// required scenes
const donateScene = require('./scenes/donate')
const distributionScene = require('./scenes/distribution')
const settingsScene = require('./scenes/settings')

// services 
const sheduleParse = require('./services/sheduleParse');

setInterval(sheduleParse(), 3600000)

const init = async (bot) =>{
    const stage = new Stage([
        groupScene,  
        sheduleScene,  
        // donateScene, 
        distributionScene, 
        // settingsScene,
    ]);
    const db = (await MongoClient.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })).db();
    bot.use(session(db));
    bot.use(stage.middleware())

    bot.command('start', (ctx)=>{
        ctx.session.userId = ctx.from.id
        ctx.scene.enter('groupScene')
    })
    bot.command('stats', stats())

    bot.command('updateShedule', sheduleParse())
    bot.command('settings',(ctx)=>ctx.scene.enter('settings'))
    
    bot.command('distribution', (ctx, db)=>{
        console.log(ctx.session.userId)
        if(ctx.session.userId == ADMIN_ID){
            ctx.scene.enter('distribution')
        }
        else{
            return ctx.reply('У вас нет прав доступа для пользования этой коммандой!')
        }
    })
    
    // default scene values
    bot.action(/[A-z]+$/, (ctx) => {
        var userAction = ctx.match[0]
        //console.log(userAction)
        switch (userAction){
            case 'changeSettings':
                ctx.scene.enter('settings')
                break
            case 'supportAuthor':
                ctx.scene.enter('donate')
                break
        }
    })
    return bot
}

init(new Telegraf(TEST_TOKEN, { polling: true }), process.env).
then(async(bot)=> {
    await bot.launch()
    console.log(`Launched ${new Date}`)
})

module.exports = init