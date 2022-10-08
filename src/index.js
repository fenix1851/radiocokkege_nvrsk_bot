process
 .on('unhandledRejection', (reason, p) => {
    console.log(`Unhandled Rejection at Promise: ${reason}`);
 })
 .on('uncaughtException', err => {
    console.log(`Uncaught Exception thrown: ${err}`);
 });

require('dotenv').config();

const { BOT_TOKEN, TEST_TOKEN, MONGODB_URI, ADMIN_ID } = process.env;
const {Telegraf, Scenes: {Stage}} = require('telegraf')

const {MongoClient} = require('mongodb')
const {session} = require('telegraf-session-mongodb')

const fs = require('fs')
const fsp = fs.promises;