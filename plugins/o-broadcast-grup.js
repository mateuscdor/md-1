let handler  = async (m, { conn, text }) => {
  let chats = Object.keys(await conn.chats)
  let groups = chats.filter(id => id.endsWith('@g.us'))
  conn.reply(m.chat, `_Mengirim pesan broadcast ke ${groups.length} group_`, m)
  for (let id of groups) {
       let bcbg = 'https://telegra.ph/file/f7fe66cfd5ea59061e641.png'
       await conn.delay(1500)
       await conn.send2ButtonImg(id, bcbg, text.trim(), wm, 'Menu', '.menu', 'Owner', '.owner')
     }
  m.reply('*Broadcast To group selesai*')
}
handler.help = ['broadcastgroup','bcgc'].map(v => v + ' <teks>')
handler.tags = ['owner']
handler.command = /^(broadcast|bc)(group|grup|gc)$/i
handler.owner = true
handler.mods = false
handler.premium = false
handler.group = false
handler.private = false

handler.admin = false
handler.botAdmin = false

handler.fail = null

module.exports = handler

const more = String.fromCharCode(8206)
const readMore = more.repeat(4001)

const randomID = length => require('crypto').randomBytes(Math.ceil(length * .5)).toString('hex').slice(0, length)
