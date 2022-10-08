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