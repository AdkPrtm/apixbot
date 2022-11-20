import makeWASocket, { DisconnectReason, BufferJSON, useMultiFileAuthState, Browsers } from '@adiwajshing/baileys'
import { Boom } from '@hapi/boom'
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
        syncFullHistory: false,
    })
    sock.ev.on('creds.update', saveCreds)
    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update
        if (connection === 'close') {
            const shouldReconnect = (lastDisconnect.error = Boom)?.output?.statusCode !== DisconnectReason.loggedOut
            console.log('connection closed due to ', lastDisconnect.error, ', reconnecting ', shouldReconnect)
            // reconnect if not logged out
            if (shouldReconnect) {
                connectToWhatsApp()
            }
        } else if (connection === 'open') {
            console.log('opened connection')
        }
    })
    sock.ev.on('call', async () => {

    })
    sock.ev.on('messages.upsert', async (messages) => {
        const type = messages.type
        const message = messages.messages[0]
        if (message.key && message.key.remoteJid == "status@broadcast") return;
        if (type === 'notify') {
            handleMsg(sock, message)
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
connectToWhatsApp()

app.listen(port, () => {
    console.log('Server on listening', port)
})

export default app