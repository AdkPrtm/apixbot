const textServerError = (pushname) => {
	return `Hi, ${pushname} 
Wahh serpertinya server kita sedang error nih, Silahkan hubungi admin sesuai keperluan kamu ya 😉.
Admin Bpp : https://api.whatsapp.com/send/?phone=62895704388968&text=Hallo,%20Saya%20mau%20bertanya%20kak
Admin Itci : https://api.whatsapp.com/send/?phone=6282255295340&text=Hallo,%20Saya%20mau%20bertanya%20kak

Note :
Maaf atas pengalaman tidak enak saat memakai bot ini ya. 
Terimakasih 🙌.
`
}

const textFetchDataFailed = (pushname, message) => {
	return `Hi, ${pushname} 👋️ 
${message}.
Mohon dicek ulang datanya yaa, Terimakasih 🙌.

NOTE : Aktifkan notifikasi status paket kamu, agar bisa memantau dimana paket kamu sekarang, cek menu untuk panduannya ya.
`
}
const textAbout = (pushname) => {
	return `Hi, ${pushname} mau tau apa itu Titip Itci ?\n
Titip itci adalah jasa titip barang belanjaan yang berasal dari e-commerse baik lazada, shopee, tokped dll. Selain ecommerce, barang dari olshop instagram, facebook juga bisa loh. Pokoknya kami menerima paket dari toko online maupun offline yaa 😁.
Tujuan dari jasa ini untuk membantu kalian warga ITCI (Tanjung-KM12) dalam membeli barang tersebut dengan biaya ongkir yang lebih murah.\n
Kenapa ongkirnya lebih hemat/murah ?
Karena kalian akan mengirim barang kealamat kami yang berada dibalikpapan. Ongkir ke balikpapan tentu lebih hemat ketimbang ongkir ke ITCI. Barang kalian tentunya akan kami bawa ke itci dengan ongkos kirim yang murah, kisaran 10-20K saja, tergantung ukuran dan berat barang kalian. Jadi bakal lebih hemat ❤️.

JIka membutuhkan informasi lainnya bisa langsung pc admin ya, pilih salah satu admin dibawah ini.`
}

const textMenu = (pushname) => {
	return `Hi, ${pushname}! 👋️
Berikut adalah beberapa fitur yang ada pada bot ini!✨

1. /resi [nomor resi]
Untuk mengecek telah sampai manakah paket kamu 
Contoh : /resi JPxxx123

2. /notif [nomor resi]
Untuk menyalakan notifikasi jika paket kamu telah berada di Balikpapan ataupun di Itci 
Contoh : /notif JPxxx123

2. /penggunaan
Untuk kalian yang masih bingung gimanasih cara memakai jasa titip itci ini, boleh pakai perintah ini yaa.

3. /cs 
Customer Service atau cs ini digunakan untuk melakukan kontak langsung dengan admin yaa.

4. /tentang
Untuk melihat apasih sebenarnya Titip_Itci ini.


Hope you have a great day!✨`
}

const textOwner = (pushname) => {
	return `Hi, ${pushname} 
Owner dari titip itci terbagi dua orang ya 😉.
Admin Bpp : https://api.whatsapp.com/send/?phone=62895704388968
Admin Itci : https://api.whatsapp.com/send/?phone=6282255295340

Terimakasih 🙌.
`
}

const textPenggunaan = (pushname) => {
	return `Hi, ${pushname} mau tau cara penggunaan Titip Itci ya?\n 
Berikut ialah cara penggunaan Jasa Titip ITCI
1. Hubungi admin melalui dm/wa nomor admin silahkah 'cs' ya pada bot ini.
2. Admin akan memberikan alamat.
3. Konfirmasi jika telah melakukan pemesanan barang.
4. Konfirmasi nomor resi jika sudah tersedia.
5. Menunggu notifikasi ecommerce, jadi jika ada notifikasi barang sudah diterima silahkan cek resi menggunakan bot ini.
6. Cek resi lagi menggunakan bot ini untuk melihat apakah resi sudah di ITCI atau masih dibalikpapan.


JIka membutuhkan informasi lainnya bisa langsung pc admin.
`
}

const textCustomerService = (pushname) => {
	return `Hi, ${pushname} 
Silahkan hubungi admin sesuai keperluan kamu ya 😉.

Note :
Bagi yang ingin bertanya terkait barang sudah diterima namun dibot belum tersedia. Bisa menghubungi admin bpp ya. 
Terimakasih 🙌. semoga membantu ❤️
`
}

const textAdmin = (pushname) => {
	return `Hi, ${pushname} 
Berikut adalah perintah khusus admin yaa

1. /input [Resi] [Status COD] [Pembayaran COD] [Lokasi] [Nama Paket] atau contoh
/input [Resi] [Ya/Tidak] [0-100000] [Balikpapan/Itci] [Nama Paket]

Perintah ini digunakan untuk memasukan resi pada bot ini, nama kota hanya bisa menggunakan balikpapan atau itci.
	
Penggunaan COD : /input JPXXXXJSJJD Ya 120000 Balikpapan Nur Madia 
Penggunaan Non COD : /input JPXXXXJSJJD Tidak 0 Balikpapan Nur Madia 

NOTE: PENEMPATAN SETIAP DATA WAJIB DI PERHATIKAN YA KARNA MENGGUNAKAN INDEX ARRAY!!!

2. /update [Resi] [Balikpapan/Itci]
Perintah ini digunakan untuk mengupdate posisi resi posisi paket, nama kota hanya bisa menggunakan Balikpapan atau Itci.
Penggunaan : /update JPXXXXJSJJD Itci

3. /update [Resi] [Sudah/Belum] [Fee COD] [Fee]
Perintah ini digunakan untuk mengupdate status pengambilan resi paket beserta harga fee.
Penggunaan : /update JPXXXXJSJJD Sudah 12000 8000

3. /delete [Resi]
Perintah ini digunakan untuk menghapus resi ketika salah memasukan resi atau typo
Penggunaan : /delete JP123

4. /export [Tanggal Awal] [Tanggal Akhir]
Perintah ini digunakan untuk melihat hasil laporan berupa data excel
Penggunaan : /export 2022-10-04 2022-10-10
`
}

const textToClientUpdateStatus = (pushname, nama, resi, status_cod, pembayaran_cod, lokasi) => {
	return `Hi, ${pushname}! 👋️\nData yang kamu masukan sedang diupdate nih\n
📮 Status Notication
├ Resi: ${resi}
├ Nama: ${nama}
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

export {
	textServerError,
	textFetchDataFailed,
	textAbout,
	textMenu,
	textOwner,
	textPenggunaan,
	textCustomerService,
	textAdmin,
	textToClientUpdateStatus,
	textToClientDeliveredPaket
}
