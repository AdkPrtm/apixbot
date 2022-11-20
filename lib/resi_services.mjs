import { textServerError, textFetchDataFailed, textToClientUpdateStatus } from "./text.mjs"
import { fetchJson } from '../utils/fetcher.mjs'
import { server } from "./helper.mjs"

const CekResi = (pushname, data) => new Promise((resolve, reject) => {
    try {
        fetchJson(`${server}/resi/${data}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        })
            .then((result) => {
                const splitResult = result.message.split(', ')
                if (splitResult[0] == 'Failed') {
                    return resolve(textFetchDataFailed(pushname, splitResult[1]))
                }
                const { resi, nama, status_cod, pembayaran_cod, lokasi } = result.data
                resolve(textToClientUpdateStatus(pushname, nama, resi, status_cod, pembayaran_cod, lokasi))
            }).catch((err) => {
                resolve(textServerError(pushname))
                reject(err)
            })
    } catch (error) {
        resolve(textServerError(pushname))
    }
})

const DeleteResi = (pushname, data) => new Promise((resolve, reject) => {
    fetchJson(`${server}/resi/${data}`, {
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

const InputResi = (pushname, data) => new Promise((resolve, reject) => {
    fetchJson(`${server}/resi/`, {
        method: 'POST',
        body: data,
        headers: { 'Content-Type': 'application/json' }
    })
        .then((result) => {
            const splitResult = result.message.split(', ')
            if (splitResult[0] == 'Failed') {
                return resolve(textFetchDataFailed(pushname, splitResult[1]))
            }
            const { resi, nama, status_cod, pembayaran_cod, lokasi, createdAt } = result.data.resi_data
            const resultText = `Hi, ${pushname}! 👋️\nData yang kamu masukkan sudah dicatat nih\n
📮 Status Notication
├ Resi: ${resi}
├ Nama: ${nama}
├ Status COD: ${status_cod}
├ Pembayaran COD: Rp ${pembayaran_cod}
├ Lokasi: ${lokasi}
└ Dibuat pada : ${createdAt.slice(0, 10)}\n
Hope you have a great day!✨`
            resolve(resultText)
        }).catch((err) => {
            resolve(textServerError(pushname))
            reject(err)
        })
})

const UpdateResi = (pushname, resi, body) => new Promise((resolve, reject) => {
    try {
        fetchJson(`${server}/resi/${resi}`, {
            method: 'PUT',
            body: body,
            headers: { 'Content-Type': 'application/json' }
        })
            .then((result) => {
                const splitResult = result.message.split(', ')
                if (splitResult[0] == 'Failed') {
                    return resolve(textFetchDataFailed(pushname, splitResult[1]))
                }
                const { nama, lokasi, status_cod, pembayaran_cod, fee_cod, diterima, fee, updatedAt } = result.data.resi_data
                const resultText = `Hi, ${pushname}! 👋️\nData yang kamu masukkan sudah ada catat nih\n
📮 Status Update
├ Resi: ${resi}
├ Nama: ${nama}
├ Status COD: ${status_cod}
├ Pembayaran COD: Rp ${pembayaran_cod}
├ Fee COD: Rp ${fee_cod}
├ Lokasi: ${lokasi}
├ Diterima: ${diterima}
├ Fee: Rp ${fee}
└ Diupdate pada : ${updatedAt.slice(0, 10)}\n
Hope you have a great day!✨`
                resolve(resultText)
            }).catch((err) => {
                resolve(textServerError(pushname))
                reject(err)
            })
    } catch (error) {
        resolve(textServerError(pushname))
    }
})

export { CekResi, DeleteResi, InputResi, UpdateResi }