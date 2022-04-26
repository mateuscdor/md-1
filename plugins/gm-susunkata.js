const fetch = require('node-fetch')
let timeout = 120000
let poin = 500
let handler = async (m, { conn, usedPrefix }) => {
    conn.susunkata = conn.susunkata ? conn.susunkata : {}
    let id = m.chat
    if (id in conn.susunkata) {
        await conn.sendButton(m.chat, 'Masih ada soal belum terjawab di chat ini', wm, 'Bantuan', usedPrefix + 'st', conn.susunkata[id][0])
        throw false
    }
    let src = await (await fetch('https://raw.githubusercontent.com/BochilTeam/database/master/games/susunkata.json')).json()
    let json = src[Math.floor(Math.random() * src.length)]
    let caption = `
${json.soal}
*Tipe: ${json.tipe}*

Timeout *${(timeout / 1000).toFixed(2)} detik*
Ketik ${usedPrefix}st untuk bantuan
Bonus: ${poin} XP
    `.trim()
    conn.susunkata[id] = [
        await conn.sendButtonLoc(m.chat, fla + 'susun kata', caption, wm, 'Bantuan', usedPrefix + 'st', m),
        json, poin,
        setTimeout(async () => {
            if (conn.susunkata[id]) await conn.sendButton(m.chat, `Waktu habis!\nJawabannya adalah *${json.jawaban}*`, wm, 'Susun Kata', '.susunkata', conn.susunkata[id][0])
            delete conn.susunkata[id]
        }, timeout)
    ]
}
handler.help = ['susunkata']
handler.tags = ['game']
handler.command = /^susunkata/i

module.exports = handler
