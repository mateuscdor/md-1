let handler = async (m, { conn, isOwner, text, isAdmin }) => {
  let who
  if (m.isGroup) {
    if (!(isAdmin || isOwner)) return dfail('admin', m, conn)
    if (isOwner) who = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text ? text.replace(/[^0-9]/g, '') + '@s.whatsapp.net' : m.chat
    else who = m.chat
  } else {
    if (!isOwner) return dfail('owner', m, conn)
    who = text ? text.replace(/[^0-9]/g, '') + '@s.whatsapp.net' : m.chat
  }

  try {
    if (who.endsWith('g.us')) global.db.data.chats[who].isBanned = true
    else global.db.data.users[who].banned = true
    m.reply(`Berhasil Ban! ${await conn.user.name} tidak aktif dichat ${await conn.getName(who) == undefined ? 'ini' : await conn.getName(who)}.`)
  } catch (e) {
    throw `nomor tidak ada didatabase!`
  }
}
handler.help = ['ban']
handler.tags = ['owner', 'group']
handler.command = /^ban(chat)?$/i

module.exports = handler
