const { twitter } = require('../lib/scrape')

let handler = async (m, { conn, args, usedPrefix, command }) => {
  if (!args[0]) throw `Pengunaan:\n${usedPrefix + command} <url>`
  if (!args[0].match(/(https:\/\/.*twitter.com)/gi)) throw `Url tidak valid!`

  let json = await twitter(args[0]).then(res => {
    return JSON.parse(JSON.stringify(res))
  })
  let pesan = json.data.map((v) => `Link: ${v.url}`).join('\n------------\n')
  m.reply(pesan)
  for (let { url } of json.data)
    conn.sendFile(m.chat, url, 'ig' + (/mp4/i.test(url) ? '.mp4' : '.jpg'), wm, m)

}
handler.help = ['twitter'].map(v => v + ' <url>')
handler.tags = ['downloader']
handler.command = /^twitter$/i

handler.limit = true

module.exports = handler
