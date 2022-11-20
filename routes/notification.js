var express = require('express');
var router = express.Router();
const Validator = require('fastest-validator')

const v = new Validator()
const { Notification } = require('../models');
const jsonFormat = require('../utils/jsonFormat.js');

router.post('/', async (req, res) => {
    const schema = {
        resi: 'string|required',
        nomor_hp: 'number|required',
    }
    const validate = v.validate(req.body, schema)
    if (validate.length) {
        return res.status(400).json(jsonFormat('Failed, Something went wrong',))
    }
    const resiTerdaftar = await Notification.findOne({ where: { resi: req.body.resi } })
    if (resiTerdaftar) {
        return res.status(400).json(jsonFormat('Failed, Data kamu sudah ada dikami nih 🙏'))
    }
    const notification = await Notification.create(req.body)
    return res.status(200).json(jsonFormat('Success, Data berhasil ditambahkan', notification))
})

router.get('/', async (req, res) => {
    let notificationData = await Notification.findAll()

    return res.status(200).json(jsonFormat('Success', notificationData))
})

router.get('/:data', async (req, res) => {
    let notificationData = req.params.data
    let typeData = notificationData.split('')
    if (typeData[0] == '6' && typeData[1] == '2') {
        let dataResult = await Notification.findAll({ where: { nomor_hp: notificationData } })
        if (!dataResult) {
            return res.status(400).json(jsonFormat('Failed, Yah data kamu belum ada dikami 🙏',))
        }
        return res.status(200).json(jsonFormat('Success, Data berhasil didapatkan', dataResult))
    }

    let resiData = await Notification.findAll({ where: { resi: notificationData } })
    if (!resiData) {
        return res.status(400).json(jsonFormat('Failed, Something went wrong',))
    }
    return res.status(200).json(jsonFormat('Success, Data berhasil didapatkan', resiData))
})

// router.put('/:resi', async (req, res) => {
//     let dataParams = req.params.resi
//     let dataResi = await Notification.findOne({ where: { resi: dataParams } })
//     if (!dataResi) {
//         return res.status(400).json(jsonFormat('Failed, Something went wrong'))
//     }    
// })

router.delete('/:resi', async (req, res) => {
    const resi = req.params.resi
    let dataResi = await Notification.findOne({ where: { resi: resi } })
    if (!dataResi) {
        return res.status(400).json(jsonFormat('Failed, Data tidak ditemukan'))
    }
    await dataResi.destroy()
    return res.status(200).json(jsonFormat('Success, Data berhasil dihapus', dataResi))
})


module.exports = router 