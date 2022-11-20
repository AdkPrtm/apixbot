var express = require('express');
var router = express.Router();
const Validator = require('fastest-validator');
const { textToClientUpdateStatus, textToClientDeliveredPaket } = require('../lib/text.js');

const v = new Validator()
const { Resi, Notification } = require('../models');
const jsonFormat = require('../utils/jsonFormat.js');

router.post('/', async (req, res) => {
    const schema = {
        resi: 'string|required',
        nama: 'string|required',
        status_cod: 'string|required',
        pembayaran_cod: 'number|required',
        fee_cod: 'number|optional',
        lokasi: 'string|required',
        diterima: 'string|optional',
        fee: 'number|optional',
    }
    res.set('Content-Type', 'application/json');
    const validate = v.validate(req.body, schema)
    if (validate.length) {
        return res.status(400).json(jsonFormat('Failed, Something went wrong'))
    }
    if (req.body.lokasi != 'Balikpapan' && req.body.lokasi != 'Itci') {
        return res.status(400).json(jsonFormat('Failed, Something went wrong'))
    }
    const resiTerdaftar = await Resi.findOne({ where: { resi: req.body.resi } })
    if (resiTerdaftar) {
        return res.status(400).json(jsonFormat('Failed, Data telah terdaftar'))
    }
    const notifTerdaftar = await Notification.findOne({ where: { resi: req.body.resi } })
    const resi = await Resi.create(req.body)
    let result = {
        'resi_data': resi,
        'notification_data': notifTerdaftar
    }
    if (notifTerdaftar) {
        const from = notifTerdaftar.nomor_hp
        const sock = req.sock
        await sock.sendMessage(`${from}@s.whatsapp.net`, { text: textToClientUpdateStatus(resi.nama, resi.resi, resi.status_cod, resi.pembayaran_cod, resi.lokasi) })
    }
    return res.status(200).json(jsonFormat('Success, Data berhasil ditambahkan', result))

})

router.get('/', async (req, res) => {
    let limit = 7
    let offset = 0 + (req.body.page - 1) * limit
    let resiData = await Resi.findAndCountAll({
        offset: offset,
        limit: limit,
    })
    let total_page = Math.ceil(resiData.count / limit)
    let result = {
        'resi_data': resiData.rows,
        'current_page': req.body.page,
        'total_page': total_page
    }
    res.set('Content-Type', 'applicaton/json');

    return res.status(200).json(jsonFormat('Success, Data berhasil didapatkan', result))
})

router.get('/:data', async (req, res) => {
    const data = req.params.data

    if (data == 'Balikpapan' || data == 'Itci') {
        let limit = 7
        let offset = 0 + (req.body.page - 1) * limit
        let lokasiData = await Resi.findAndCountAll({
            where: { lokasi: data },
            offset: offset,
            limit: limit,
        })
        if (!lokasiData) {
            return res.status(400).json(jsonFormat('Failed, Data tidak ditemukan'))
        }
        let total_page = Math.ceil(lokasiData.count / limit)
        let result = {
            'resi_data': lokasiData.rows,
            'current_page': req.body.page,
            'total_page': total_page
        }
        return res.status(200).json(jsonFormat('Success, Data berhasil didapatkan', result))
    }

    if (data == 'Ya' || data == 'Tidak') {
        let limit = 7
        let offset = 0 + (req.body.page - 1) * limit
        let codData = await Resi.findAndCountAll({
            offset: offset,
            limit: limit,
            where: { status_cod: data }
        })
        if (!codData) {
            return res.status(400).json(jsonFormat('Failed, Data tidak ditemukan'))
        }
        let total_page = Math.ceil(codData.count / limit)
        let result = {
            'resi_data': codData.rows,
            'current_page': req.body.page,
            'total_page': total_page
        }
        return res.status(200).json(jsonFormat('Success, Data berhasil didapatkan', result))
    }

    if (data == 'Sudah' || data == 'Belum') {
        let limit = 7
        let offset = 0 + (req.body.page - 1) * limit
        let diterimaData = await Resi.findAndCountAll({
            where: { diterima: data },
            offset: offset,
            limit: limit
        })
        if (!diterimaData) {
            return res.status(400).json(jsonFormat('Failed, Data tidak ditemukan'))
        }

        let total_page = Math.ceil(diterimaData.count / limit)
        let result = {
            'resi_data': diterimaData.rows,
            'current_page': req.body.page,
            'total_page': total_page
        }
        return res.status(200).json(jsonFormat('Success, Data berhasil didapatkan', result))
    }

    let reqData = await Resi.findOne({ where: { resi: data } })
    if (!reqData) {
        return res.status(400).json(jsonFormat('Failed, Data tidak ditemukan'))
    }
    return res.status(200).json(jsonFormat('Success, Data berhasil didapatkan', reqData))
})


router.put('/:resi', async (req, res) => {
    const resi = req.params.resi

    let resiData = await Resi.findOne({ where: { resi: resi } })
    res.set('Content-Type', 'applicaton/json');

    if (!resiData) {
        return res.status(400).json(jsonFormat('Failed, Data tidak ditemukan'))
    }
    const sock = req.sock

    const schema = {
        lokasi: 'string|optional',
        diterima: 'string|optional',
        fee: 'number|optional',
        fee_cod: 'number|optional',
    }

    const validate = v.validate(req.body, schema)

    if (validate.length) {
        return res.status(400).json(jsonFormat('Failed, Something went wrong'))
    }

    const notifTerdaftar = await Notification.findOne({ where: { resi: resi } })

    if (req.body.lokasi) {
        if (req.body.lokasi != 'Balikpapan' && req.body.lokasi != 'Itci') {
            return res.status(400).json(jsonFormat('Failed, Something went wrong'))
        }
        resiData = await resiData.update(req.body, { fields: ['lokasi'] })
        let result = {
            'resi_data': resiData,
            'notification_data': notifTerdaftar
        }
        if (notifTerdaftar) {
            const from = notifTerdaftar.nomor_hp
            await sock.sendMessage(`${from}@s.whatsapp.net`, { text: textToClientUpdateStatus(resiData.nama, resiData.resi, resiData.status_cod, resiData.pembayaran_cod, resiData.lokasi) })
        }
        return res.status(200).json(jsonFormat('Success, Data berhasil diupdate', result))
    }
    if (req.body.diterima == 'Sudah') {
        resiData = await resiData.update(req.body, { fields: ['fee_cod', 'fee', 'diterima'] })
        let result = {
            'resi_data': resiData,
            'notification_data': notifTerdaftar
        }
        if (notifTerdaftar) {
            const from = notifTerdaftar.nomor_hp
            await sock.sendMessage(`${from}@s.whatsapp.net`, { text: textToClientDeliveredPaket(resiData.nama, resiData.resi, resiData.status_cod, resiData.pembayaran_cod, resiData.fee_cod, resiData.lokasi, resiData.diterima, resiData.fee) })
            await notifTerdaftar.destroy()
        }
        return res.status(200).json(jsonFormat('Success, Data berhasil diupdate', result))
    }
    return res.status(400).json(jsonFormat('Failed, Something went wrong'))

})

router.delete('/:resi', async (req, res) => {
    const resi = req.params.resi

    let resiData = await Resi.findOne({ where: { resi: resi } })
    if (!resiData) {
        return res.status(400).json(jsonFormat('Failed, Data tidak ditemukan'))
    }

    await resiData.destroy()
    return res.status(200).json(jsonFormat('Success, Delete Data', resiData))
})


module.exports = router;
