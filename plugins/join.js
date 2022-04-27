let linkRegex = /chat.whatsapp.com\/([0-9A-Za-z]{20,24})/i
let delay = time => new Promise(res => setTimeout(res, time))
let handler = async (m, { conn, text }) => {
    let [_, code] = text.match(linkRegex) || []
    if (!code) throw 'Link Salah'
    let res = await conn.groupAcceptInvite(code)
    conn.reply(m.chat, `Berhasil join ke grup ${await conn.getName(res)}`, m).then(async () => {
        delay(3000)
        var jumlahHari = 86400000 * 1
        var now = new Date() * 1
        global.db.data.chats[m.chat].expired = now + jumlahHari
        if (now < global.db.data.chats[m.chat].expired)
        return conn.reply(res, `*${conn.user.name}* adalah bot whatsapp, diundang oleh @${m.sender.split`@`[0]}\n${conn.user.name} akan keluar otomatis setelah: ${await conn.msToDate(global.db.data.chats[m.chat].expired - now)}`.trim(), null, { mentions: [m.sender] })
    })
}
handler.help = ['joingc <chat.whatsapp.com>']
handler.tags = ['main']

handler.command = /^joingc$/i

handler.limit = true
module.exports = handler 
