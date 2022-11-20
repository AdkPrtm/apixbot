const textToClientUpdateStatus = (pushname, resi, status_cod, pembayaran_cod, lokasi) => {
    return `Hi, ${pushname}! 👋️\nData yang kamu masukan sedang diupdate nih\n
📮 Status Notication
├ Resi: ${resi}
├ Nama: ${pushname}
├ Status COD: ${status_cod}
├ Pembayaran COD: Rp ${pembayaran_cod}
└ Lokasi: ${lokasi}\n

NOTE: Jika status lokasi paket telah di Itci bearti sudah bisa diambil ya.
Hope you have a great day!✨`
}

const textToClientDeliveredPaket = (pushname, resi, status_cod, pembayaran_cod, fee_cod, lokasi, status, fee) => {
    return `Hi, ${pushname}! 👋️\nPaket kamu telah diambil ya\n
📮 Status Notication
├ Resi: ${resi}
├ Nama: ${pushname}
├ Status COD: ${status_cod}
├ Pembayaran COD: Rp ${pembayaran_cod}
├ Fee COD: Rp ${fee_cod}
├ Lokasi: ${lokasi}
├ Status: ${status} diterima
└ Fee Jastip: Rp ${fee}\n

NOTE: Jika status lokasi paket telah di Itci bearti sudah bisa diambil ya.
Hope you have a great day!✨`
}

module.exports = {
    textToClientUpdateStatus,
    textToClientDeliveredPaket
}