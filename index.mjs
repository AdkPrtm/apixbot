import makeWASocket, { DisconnectReason, makeInMemoryStore, useMultiFileAuthState, Browsers } from '@adiwajshing/baileys'
import { Boom } from '@hapi/boom'
import chalk from 'chalk'
import moment from 'moment'
import pino from 'pino'
import handleMsg from './handleMsg.mjs'
import * as dotenv from 'dotenv'
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config()

import express from 'express'
import cookieParser from 'cookie-parser'
import logger from 'morgan'
const port = process.env.PORT || 3000
import indexRouter from './routes/index.js'
import resiRouter from './routes/resi.js'
import notificationRouter from './routes/notification.js'
import exportRouter from './routes/export.js'

const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys')
const color = (text, color) => {
    return !color ? chalk.green(text) : color.startsWith('#') ? chalk.hex(color)(text) : chalk.keyword(color)(text);
};
const msgRetryCounterMap = {}

const store = makeInMemoryStore({ logger: pino().child({ level: 'silent', stream: 'store' }) })
store.readFromFile('./db/baileys_store_multi.json')

setInterval(() => {
    store.writeToFile('./db/baileys_store_multi.json')
}, 10_000)

global.store = store

var app = express();
let sock

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

async function connectToWhatsApp() {
    sock = makeWASocket.default({
        auth: state,
        printQRInTerminal: true,
        browser: Browsers.ubuntu('Chrome'),
        logger: pino({ level: 'silent' }),
        msgRetryCounterMap,
    })
    
    sock.ev.on('creds.update', saveCreds)
    
    sock.ev.on('connection.update', async (update) => {

        const { connection, lastDisconnect } = update;
        if (connection === 'connecting') {
            console.log(color('[SYS]', '#009FFF'), color(moment().format('DD/MM/YY HH:mm:ss'), '#A1FFCE'), color(`TitipItci is Authenticating...`, '#f12711'));
        } else if (connection === 'close') {
            const log = msg => console.log(color('[SYS]', '#009FFF'), color(moment().format('DD/MM/YY HH:mm:ss'), '#A1FFCE'), color(msg, '#f64f59'));
            const statusCode = new Boom(lastDisconnect?.error)?.output.statusCode;

            console.log(lastDisconnect.error);
            if (statusCode === DisconnectReason.badSession) { log(`Bad session file, delete ${session} and run again`); connectToWhatsApp(); }
            else if (statusCode === DisconnectReason.connectionClosed) { log('Connection closed, reconnecting....'); connectToWhatsApp() }
            else if (statusCode === DisconnectReason.connectionLost) { log('Connection lost, reconnecting....'); connectToWhatsApp() }
            else if (statusCode === DisconnectReason.connectionReplaced) { log('Connection Replaced, Another New Session Opened, Please Close Current Session First'); process.exit() }
            else if (statusCode === DisconnectReason.loggedOut) { log(`Device Logged Out, Please Delete ${session} and Scan Again.`); process.exit(); }
            else if (statusCode === DisconnectReason.restartRequired) { log('Restart required, restarting...'); connectToWhatsApp(); }
            else if (statusCode === DisconnectReason.timedOut) { log('Connection timedOut, reconnecting...'); connectToWhatsApp(); }
            else {
                console.log(lastDisconnect.error); connectToWhatsApp()
            }
        } else if (connection === 'open') {
            console.log(color('[SYS]', '#009FFF'), color(moment().format('DD/MM/YY HH:mm:ss'), '#A1FFCE'), color(`TitipItci is now Connected...`, '#38ef7d'));
        }
    });
    sock.ev.on('call', async () => {

    })
    sock.ev.on('messages.upsert', async (messages) => {
        const type = messages.type
        const message = messages.messages[0]
        if (message.key && message.key.remoteJid == "status@broadcast") return;
        if (type === 'notify') {
            if (!message.conversation) {
                handleMsg(sock, message)
            }
        }
    })
}

app.use('/', indexRouter);
app.use('/resi', function (req, res, next) {
    req.sock = sock
    next()
}, resiRouter);
app.use('/notification', notificationRouter)
app.use('/export', exportRouter)

// run in main file
connectToWhatsApp().catch(() => connectToWhatsApp());

app.listen(port, () => {
    console.log('Server on listening', port)
})

export default app