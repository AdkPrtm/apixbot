var express = require('express');
var router = express.Router();
const { Resi } = require('../models');
const Op = require('../models').Sequelize.Op
const jsonFormat = require('../utils/jsonFormat.js');
const excelJS = require('exceljs')

router.get('/:date', async (req, res) => {
    const mentahanDate = req.params.date
    const splitDate = mentahanDate.split('|')
    const fromDate = splitDate[0] + ' 00:00:00'
    const toDate = splitDate[1] + ' 23:59:50'

    let resiData = await Resi.findAll({
        where: {
            updatedAt: {
                [Op.between]: [fromDate, toDate]
            }
        }
    })

    const workbook = new excelJS.Workbook()
    const worksheet = workbook.addWorksheet(`Sheet1`)
    worksheet.columns = [
        { header: "Resi", key: "resi", width: 20 },
        { header: "Nama", key: "nama", width: 18 },
        { header: "Status Cod", key: "status_cod", width: 12 },
        { header: "Pembayaran COD", key: "pembayaran_cod", width: 18 },
        { header: "Fee COD", key: "fee_cod", width: 18 },
        { header: "Lokasi", key: "lokasi", width: 12 },
        { header: "Diterima", key: "diterima", width: 10 },
        { header: "Fee", key: "fee", width: 17 },
        { header: "Dibuat Pada", key: "createdAt", width: 16 },
        { header: "Diupdate Pada", key: "updatedAt", width: 16 },
    ]

    let totalCOD = 0
    let totalFeeCOD = 0
    let totalFee = 0

    resiData.forEach((resi) => {
        worksheet.addRow(resi)
        totalCOD += resi.pembayaran_cod
        totalFeeCOD += resi.fee_cod
        totalFee += resi.fee
    })
    worksheet.addRow({ nama: 'Total', pembayaran_cod: totalCOD, fee_cod: totalFeeCOD, fee: totalFee })
    worksheet.getRow(1).eachCell((cell) => {
        cell.font = { bold: true }
    })
    const length = resiData.length
    worksheet.getRow(length + 2).eachCell((cell) => {
        cell.font = { bold: true }
    })
    worksheet.getColumn('D').numFmt = '"Rp "#,##0.00;'
    worksheet.getColumn('E').numFmt = '"Rp "#,##0.00;'
    worksheet.getColumn('H').numFmt = '"Rp "#,##0.00;'
    res.setHeader(
        "content-type",
        "application/vnd.openxmlformats-officedocument.spreadsheatml.sheet"
    )

    res.setHeader("content-disposition", `attachment; filename=${fromDate}-${toDate}.xlsx`)
    return workbook.xlsx.write(res).then(() => { res.status(200) })

    // return res.status(200).json(jsonFormat('Success', resiData))
})


module.exports = router;
