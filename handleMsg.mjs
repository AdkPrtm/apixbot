import { textMenu, textCustomerService, textPenggunaan, textAbout, textAdmin, textServerError } from './lib/text.mjs'
import { CekResi, InputResi, UpdateResi, DeleteResi } from './lib/resi_services.mjs';
import { InputNotif, DeleteNotif, GetNotifByNumber } from './lib/notif_services.mjs';
import { isAdmin, server } from './lib/helper.mjs';
import NodeCache from 'node-cache';
const myCache = new NodeCache({ stdTTL: 30 })

async function sleep(ms) {
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });
}
export default async function HandleMsg(sock, message) {
    const noWa = message.key.remoteJid;
    const notifyName = message.pushName
    try {
        //tentukan jenis pesan berbentuk text                
        const pesan = message.message.conversation;

        //tentukan jenis pesan apakah bentuk list
        const responseList = message.message.listResponseMessage;

        //tentukan jenis pesan apakah bentuk button
        const responseButton = message.message.buttonsResponseMessage;
        const responseTemplateButton = message.message.templateButtonReplyMessage

        //tentukan jenis pesan apakah bentuk templateButtonReplyMessage
        //const responseReplyButton = message.message.templateButtonReplyMessage;

        const body = pesan.startsWith('/') ? pesan : ''
        const command = body.slice(1).trim().split(/ +/).shift().toLowerCase()
        const splitPesan = pesan.split(/ +/)
        const args = body.trim().split(/ +/).slice(1)
        const admin = isAdmin.includes(noWa)

        let data
        let dataresult

        const haveSession = myCache.get(`session:${noWa}`)

        if (!haveSession) {
            switch (splitPesan[0].toLowerCase()) {
                case "menu":
                    await sock.readMessages([message.key]);
                    const buttons = [
                        { buttonId: "resi", buttonText: { displayText: 'Cek Resi' }, type: 1 },
                        { buttonId: "notif", buttonText: { displayText: 'Nyalakan Notif' }, type: 1 },
                        { buttonId: "hapus", buttonText: { displayText: 'Hapus Notif' }, type: 1 },
                    ]
                    const buttonInfo = {
                        text: 'Selamat Datang Di Bot Titip Itci 🙌🙌\n\nSilahkan klik menu dibawah ini:',
                        footer: 'created by adk_prtm',
                        buttons: buttons,
                        headerType: 1
                    }
                    return await sock.sendMessage(noWa, buttonInfo, { quoted: message })
                case "info":
                case "informasi":
                    await sock.readMessages([message.key]);
                    const templateButtonsInfo = [
                        { buttonId: "tentang", buttonText: { displayText: 'Tentang' }, type: 2 },
                        { buttonId: "penggunaan", buttonText: { displayText: 'Penggunaan' }, type: 2 },
                        { buttonId: "cs", buttonText: { displayText: 'Customer Service' }, type: 1 },
                    ]

                    const templateMessageInfo = {
                        text: `Hay ${notifyName}, \n\nBerikut Informasi yang dapat kami berikan, silahkan dipilih sesuai kebutuhan kamu.`,
                        footer: 'created by adk_prtm',
                        buttons: templateButtonsInfo
                    }
                    return await sock.sendMessage(noWa, templateMessageInfo)
                case "about":
                case "tentang":
                    await sock.readMessages([message.key]);
                    const templateButtons = [
                        { buttonId: "contactAdminBalikpapan", buttonText: { displayText: 'Admin Balikpapan' }, type: 1 },
                        { buttonId: "contactAdminITCI", buttonText: { displayText: 'Admin ITCI' }, type: 1 },
                    ]

                    const templateMessage = {
                        text: textAbout(notifyName),
                        footer: 'created by adk_prtm',
                        buttons: templateButtons
                    }
                    return await sock.sendMessage(noWa, templateMessage)
                case "penggunaan":
                case "cara":
                    await sock.readMessages([message.key]);
                    const templateButtonsPenggunaan = [
                        { buttonId: "contactAdminBalikpapan", buttonText: { displayText: 'Admin Balikpapan' }, type: 1 },
                        { buttonId: "contactAdminITCI", buttonText: { displayText: 'Admin ITCI' }, type: 1 },
                    ]

                    const templateMessagePenggunaan = {
                        text: textPenggunaan(notifyName),
                        footer: 'created by adk_prtm',
                        buttons: templateButtonsPenggunaan
                    }
                    return await sock.sendMessage(noWa, templateMessagePenggunaan)
                case "cs":
                case "bantuan":
                    await sock.readMessages([message.key]);
                    const templateButtonsCs = [
                        { buttonId: "contactAdminBalikpapan", buttonText: { displayText: 'Admin Balikpapan' }, type: 1 },
                        { buttonId: "contactAdminITCI", buttonText: { displayText: 'Admin ITCI' }, type: 1 },
                    ]

                    const templateMessageCs = {
                        text: textCustomerService(notifyName),
                        footer: 'created by adk_prtm',
                        buttons: templateButtonsCs
                    }
                    return await sock.sendMessage(noWa, templateMessageCs)
                default:
                    break;
            }

            if (responseButton) {
                await sock.readMessages([message.key]);
                if (responseButton.selectedButtonId == "resi") {
                    await sock.sendMessage(noWa, {
                        text: "Masukan Resi Anda"
                    });
                    myCache.set(`session:${noWa}`, {
                        menu: 'resi',
                    })
                } else if (responseButton.selectedButtonId == "notif") {
                    await sock.sendMessage(noWa, {
                        text: "Masukan Resi Anda"
                    });
                    myCache.set(`session:${noWa}`, {
                        menu: 'notif',
                    })
                } else if (responseButton.selectedButtonId == "hapus") {
                    const number = noWa.split('@')[0]
                    const result = await GetNotifByNumber(notifyName, number)
                    if (result.length == 0) {
                        return await sock.sendMessage(noWa, { text: `Hay ${notifyName}, \n\nKamu belum pernah menyalakan notifikasi resi sama sekali nih, aktifkan dulu yaa di menu.` })
                    }
                    const arr = result.map((v, i) => ({ ["title"]: v.resi, ["rowId"]: v.resi }))
                    const sections = [
                        {
                            title: "Daftar Resi",
                            rows: arr
                        }
                    ]

                    const listMessage = {
                        text: "Klik dan pilih salah satu resi yang ingin dihapus dibawah yaa",
                        footer: "created by adk_prtm",
                        title: "Menu Hapus Notifikasi Resi",
                        buttonText: "Daftar Resi Notifikasi Aktif",
                        sections
                    }
                    await sock.sendMessage(noWa, listMessage)
                } else if (responseButton.selectedButtonId == "contactAdminBalikpapan") {
                    const vcard = 'BEGIN:VCARD\n' // metadata of the contact card
                        + 'VERSION:3.0\n'
                        + 'FN:Admin Balikpapan\n' // full name
                        + 'TEL;type=CELL;type=VOICE;waid=62895704388968:+62 895-7043-88968\n' // WhatsApp ID + phone number
                        + 'END:VCARD'
                    await sock.sendMessage(
                        noWa,
                        {
                            contacts: {
                                displayName: 'Admin Balikpapan',
                                contacts: [{ vcard }]
                            }
                        }
                    )
                } else if (responseButton.selectedButtonId == "contactAdminITCI") {
                    const vcard = 'BEGIN:VCARD\n' // metadata of the contact card
                        + 'VERSION:3.0\n'
                        + 'FN:Admin Itci\n' // full name
                        + 'TEL;type=CELL;type=VOICE;waid=6282255295340:+62 822-5529-5340\n' // WhatsApp ID + phone number
                        + 'END:VCARD';
                    await sock.sendMessage(
                        noWa,
                        {
                            contacts: {
                                displayName: 'Admin ITCI',
                                contacts: [{ vcard }]
                            },
                        }
                    )
                } else if (responseButton.selectedButtonId == "cs") {
                    const templateButtonsCs = [
                        { buttonId: "contactAdminBalikpapan", buttonText: { displayText: 'Admin Balikpapan' }, type: 1 },
                        { buttonId: "contactAdminITCI", buttonText: { displayText: 'Admin ITCI' }, type: 1 },
                    ]

                    const templateMessageCs = {
                        text: textCustomerService(notifyName),
                        footer: 'created by adk_prtm',
                        buttons: templateButtonsCs
                    }
                    return await sock.sendMessage(noWa, templateMessageCs)
                } else if (responseButton.selectedButtonId == "penggunaan") {
                    const templateButtonsPenggunaan = [
                        { buttonId: "contactAdminBalikpapan", buttonText: { displayText: 'Admin Balikpapan' }, type: 1 },
                        { buttonId: "contactAdminITCI", buttonText: { displayText: 'Admin ITCI' }, type: 1 },
                    ]

                    const templateMessagePenggunaan = {
                        text: textPenggunaan(notifyName),
                        footer: 'created by adk_prtm',
                        buttons: templateButtonsPenggunaan
                    }
                    return await sock.sendMessage(noWa, templateMessagePenggunaan)
                } else if (responseButton.selectedButtonId == "tentang") {
                    const templateButtons = [
                        { buttonId: "contactAdminBalikpapan", buttonText: { displayText: 'Admin Balikpapan' }, type: 1 },
                        { buttonId: "contactAdminITCI", buttonText: { displayText: 'Admin ITCI' }, type: 1 },
                    ]

                    const templateMessage = {
                        text: textAbout(notifyName),
                        footer: 'created by adk_prtm',
                        buttons: templateButtons
                    }
                    return await sock.sendMessage(noWa, templateMessage)
                } else {
                    await sock.sendMessage(noWa, {
                        text: "Pesan tombol invalid"
                    });
                }
            }
            if (responseList) {
                await sock.readMessages([message.key]);
                if (responseList.title) {
                    dataresult = await DeleteNotif(notifyName, responseList.title.toUpperCase())
                    return await sock.sendMessage(noWa, { text: dataresult })
                }
            }

            if (!admin) return
            switch (command) {
                case 'ping':
                    await sock.sendMessage(noWa, { text: 'Pong' }, { quoted: message })
                    break
                case 'menuAdmin':
                case 'menuadmin':
                    await sock.readMessages([message.key]);
                    return await sock.sendMessage(noWa, { text: textAdmin(notifyName) })
                case 'input':
                case 'masukan':
                    await sock.readMessages([message.key]);
                    if (args.length <= 4) {
                        return await sock.sendMessage(noWa, { text: `Hay ${notifyName}, \n\nGunakan perintah yang benar ya sesuai ketentuan` })
                    }
                    let nama
                    if (args[5] == null) {
                        nama = args[4]
                    } else {
                        nama = args[4] + ' ' + args[5]
                    }
                    data = JSON.stringify({
                        'resi': args[0].toUpperCase(),
                        'status_cod': args[1],
                        'pembayaran_cod': parseInt(args[2]),
                        'lokasi': args[3],
                        'nama': nama
                    })
                    dataresult = await InputResi(notifyName, data)
                    return await sock.sendMessage(noWa, { text: dataresult }, { quoted: message })
                case 'update':
                case 'ubah':
                    await sock.readMessages([message.key]);
                    if (args[0] != 'Itci' && args.length != 4) {
                        return await sock.sendMessage(noWa, { text: `Hay ${notifyName}, \n\nGunakan perintah yang benar ya sesuai ketentuan` })
                    }

                    if (args[0] == 'Itci') {
                        const totalResi = args.length - 2
                        let i = 0
                        while (totalResi >= i) {
                            data = JSON.stringify({
                                'lokasi': args[0]
                            })

                            i++
                            dataresult = await UpdateResi(notifyName, args[i].toUpperCase(), data)
                            await sock.sendMessage(noWa, { text: dataresult })
                            await sleep(2000)
                        }
                        return
                    } else {
                        data = JSON.stringify({
                            'diterima': args[1],
                            'fee_cod': parseInt(args[2]),
                            'fee': parseInt(args[3])

                        })
                        dataresult = await UpdateResi(notifyName, args[0].toUpperCase(), data)
                        return await sock.sendMessage(noWa, { text: dataresult })
                    }
                case 'hapus':
                case 'delete':
                    await sock.readMessages([message.key]);
                    if (args.length != 1) {
                        return await sock.sendMessage(noWa, { text: `Hay ${notifyName}, \n\nGunakan perintah yang benar ya sesuai ketentuan` })
                    }
                    return await DeleteResi(notifyName, args[0].toUpperCase()).then((result) => sock.sendMessage(noWa, { text: result }))
                case 'export':
                case 'data':
                    await sock.readMessages([message.key]);
                    if (args.length != 2) {
                        return await sock.sendMessage(noWa, { text: `Hay ${notifyName}, \n\nGunakan perintah yang benar ya sesuai ketentuan` })
                    }
                    return await sock.sendMessage(
                        noWa, {
                        document: {
                            url: `${server}/export/${args[0]}|${args[1]}`
                        },
                        mimetype: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                        fileName: `Laporan, ${args[0]} sampai ${args[1]}.xlsx`
                    })
                default:
                    break;
            }

        } else {
            if (splitPesan[0] == '/coba' || splitPesan[0] == 'menu' || splitPesan[0] == 'Menu') {
                await sock.readMessages([message.key]);
                myCache.del(`session:${noWa}`)
                return await sock.sendMessage(noWa, { text: `Hay ${notifyName}, \n\nGunakan perintah yang benar ya sesuai ketentuan` })
            }
            if (haveSession.menu == 'resi') {
                await sock.readMessages([message.key]);
                if (splitPesan.length != 1) {
                    return await sock.sendMessage(noWa, { text: `Hay ${notifyName}, \n\nGunakan perintah yang benar ya sesuai ketentuan` })
                }
                myCache.del(`session:${noWa}`)
                return await CekResi(notifyName, splitPesan[0].toUpperCase()).then((result) => sock.sendMessage(noWa, { text: result }))
            }
            if (haveSession.menu == 'notif') {
                await sock.readMessages([message.key]);
                if (splitPesan.length != 1) {
                    return await sock.sendMessage(noWa, { text: `Hay ${notifyName}, \n\nGunakan perintah yang benar ya sesuai ketentuan` })
                }
                const data = JSON.stringify({
                    'resi': splitPesan[0].toUpperCase(),
                    'nomor_hp': parseInt(noWa.slice(0, 13))
                })
                myCache.del(`session:${noWa}`)
                return await InputNotif(notifyName, data).then((result) => sock.sendMessage(noWa, { text: result }))
            }
        }
    } catch (error) {
        console.log(error)
        // return await sock.sendMessage(noWa, { text: textServerError(notifyName) })
    }
}