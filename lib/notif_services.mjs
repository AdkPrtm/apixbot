import { textServerError, textFetchDataFailed } from "./text.mjs"
import { fetchJson } from '../utils/fetcher.mjs'
import { server } from "./helper.mjs"

const InputNotif = (pushname, data) => new Promise((resolve, reject) => {
    fetchJson(`${server}/notification/`, {
        method: 'POST',
        body: data,
        headers: { 'Content-Type': 'application/json' }
    })
        .then((result) => {
            const splitResult = result.message.split(', ')
            if (splitResult[0] == 'Failed') {
                return resolve(textFetchDataFailed(pushname, splitResult[1]))
            }
            const { resi, nomor_hp, createdAt } = result.data
            const resultText = `Hi, ${pushname}! 👋️\nData yang kamu masukkan sudah ada catat nih\n
📮 Status Notication
├ Resi: ${resi}
├ Nomor Hp: ${nomor_hp}
└ Dibuat pada : ${createdAt.slice(0, 10)}\n
Hope you have a great day!✨`
            resolve(resultText)
        }).catch((err) => {
            resolve(textServerError(pushname))
            reject(err)
        })
})

const DeleteNotif = (pushname, data) => new Promise((resolve, reject) => {
    fetchJson(`${server}/notification/${data}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
    })
        .then((result) => {
            const splitResult = result.message.split(', ')
            if (splitResult[0] == 'Failed') {
                return resolve(textFetchDataFailed(pushname, splitResult[1]))
            }
            const { updatedAt } = result.data
            const resultText = `Hi, ${pushname}! 👋️\nData yang kamu masukkan sudah berhasil diproses nih\n
📮 Status Notication
├ Resi: ${data}
└ Dihapus pada : ${updatedAt.slice(0, 10)}\n
Hope you have a great day!✨`
            resolve(resultText)
        }).catch((err) => {
            resolve(textServerError(pushname))
            reject(err)
        })
})

const GetNotifByNumber = (pushname, data) => new Promise((resolve, reject) => {
    fetchJson(`${server}/notification/${data}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    })
        .then((result) => {
            const splitResult = result.message.split(', ')
            if (splitResult[0] == 'Failed') {
                return resolve(textFetchDataFailed(pushname, splitResult[1]))
            }
            resolve(result.data)
        }).catch((err) => {
            resolve(textServerError(pushname))
            reject(err)
        })
})

export {
    InputNotif,
    GetNotifByNumber,
    DeleteNotif
}