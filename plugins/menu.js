let levelling = require('../lib/levelling')
let fs = require('fs')
let path = require('path')
let fetch = require('node-fetch')
let moment = require('moment-timezone')
const defaultMenu = {
  before: `
• Tersisa *%limit Limit*
• Role *%role*
• Level *%level (%exp / %maxexp)* [%xp4levelup]
• %totalexp XP secara Total
• Database: %rtotalreg dari %totalreg

• Tanggal: *%week %weton, %date*
• Tanggal Islam: *%dateIslamic*
• Waktu: *%time*

%readmore`.trim(),
  header: '*</ %category >*',
  body: '-❥ %cmd %islimit %isPremium',
  footer: '',
  after: `Don't spam, if you violate the rules this bot will be blocked!! Thank you`,
}
let handler = async (m, { conn, usedPrefix: _p, args, command }) => {

  let tags
  let teks = `${args[0]}`.toLowerCase()
  let arrayMenu = ['all', 'game', 'xp', 'stiker', 'kerangajaib', 'quotes', 'admin', 'grup', 'premium', 'internet', 'anonymous', 'nulis', 'downloader', 'tools', 'fun', 'database', 'vote', 'quran', 'audio', 'info', 'tanpakategori', 'owner']
  if (!arrayMenu.includes(teks)) teks = '404'
  if (teks == 'all') tags = {
    'main': 'UTAMA',
    'game': 'GAME',
    'rpg': 'RPG',
    'xp': 'Exp & Limit',
    'sticker': 'STICKER',
    'kerang': 'KERANG AJAIB',
    'quotes': 'QUOTES',
    'group': 'GROUPS',
    'premium': 'PREMIUM',
    'internet': 'INTERNET',
    'anonymous': 'ANONYMOUS CHAT',
    'nulis': 'MagerNulis & Logo',
    'downloader': 'DOWNLOADER',
    'tools': 'TOOLS',
    'fun': 'FUN',
    'database': 'DATABASE',
    'vote': 'VOTING',
    'absen': 'ABSEN',
    'quran': 'Al Qur\'an',
    'audio': 'Pengubah Suara',
    'info': 'Info',
    '': 'Tanpa Kategori',
  }
  if (teks == 'game') tags = {
    'game': 'Game',
    'rpg': 'RPG'
  }
  if (teks == 'xp') tags = {
    'xp': 'Exp & Limit'
  }
  if (teks == 'stiker') tags = {
    'sticker': 'Stiker'
  }
  if (teks == 'kerangajaib') tags = {
    'kerang': 'Kerang Ajaib'
  }
  if (teks == 'quotes') tags = {
    'quotes': 'Quotes'
  }
  if (teks == 'grup') tags = {
    'group': 'Grup'
  }
  if (teks == 'premium') tags = {
    'premium': 'Premium'
  }
  if (teks == 'internet') tags = {
    'internet': 'Internet'
  }
  if (teks == 'anonymous') tags = {
    'anonymous': 'Anonymous Chat'
  }
  if (teks == 'nulis') tags = {
    'nulis': 'MagerNulis & Logo'
  }
  if (teks == 'downloader') tags = {
    'downloader': 'Downloader'
  }
  if (teks == 'tools') tags = {
    'tools': 'Tools'
  }
  if (teks == 'fun') tags = {
    'fun': 'Fun'
  }
  if (teks == 'database') tags = {
    'database': 'Database'
  }
  if (teks == 'vote') tags = {
    'vote': 'Voting',
    'absen': 'Absen'
  }
  if (teks == 'quran') tags = {
    'quran': 'Al Qur\'an'
  }
  if (teks == 'audio') tags = {
    'audio': 'Pengubah Suara'
  }
  if (teks == 'info') tags = {
    'info': 'Info'
  }
  if (teks == 'tanpakategori') tags = {
    '': 'Tanpa Kategori'
  }
  if (teks == 'owner') tags = {
    'owner': 'Owner',
    'host': 'Host',
    'advanced': 'Advanced'
  }



  try {
    let package = JSON.parse(await fs.promises.readFile(path.join(__dirname, '../package.json')).catch(_ => '{}'))
    let { exp, limit, age, money, level, role, registered } = global.db.data.users[m.sender]
    let { min, xp, max } = levelling.xpRange(level, global.multiplier)
    let umur = `*${age == '-1' ? 'Belum Daftar*' : age + '* Thn'}`
    let name = registered ? global.db.data.users[m.sender].name : conn.getName(m.sender)
    let d = new Date(new Date + 3600000)
    let locale = 'id'
    // d.getTimeZoneOffset()
    // Offset -420 is 18.00
    // Offset    0 is  0.00
    // Offset  420 is  7.00
    let weton = ['Pahing', 'Pon', 'Wage', 'Kliwon', 'Legi'][Math.floor(d / 84600000) % 5]
    let week = d.toLocaleDateString(locale, { weekday: 'long' })
    let date = d.toLocaleDateString(locale, {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
    let dateIslamic = Intl.DateTimeFormat(locale + '-TN-u-ca-islamic', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(d)
    let time = d.toLocaleTimeString(locale, {
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric'
    })
    let _uptime = process.uptime() * 1000
    let _muptime
    if (process.send) {
      process.send('uptime')
      _muptime = await new Promise(resolve => {
        process.once('message', resolve)
        setTimeout(resolve, 1000)
      }) * 1000
    }
    let muptime = clockString(_muptime)
    let uptime = clockString(_uptime)
    let block = await conn.fetchBlocklist()
    let chatsss = Object.keys(await conn.chats)
    let groupsss = chatsss.filter(id => id.endsWith('@g.us'))
    global.jam = time
    let totalreg = Object.keys(global.db.data.users).length
    let rtotalreg = Object.values(global.db.data.users).filter(user => user.registered == true).length
    let help = Object.values(global.plugins).filter(plugin => !plugin.disabled).map(plugin => {
      return {
        help: Array.isArray(plugin.help) ? plugin.help : [plugin.help],
        tags: Array.isArray(plugin.tags) ? plugin.tags : [plugin.tags],
        prefix: 'customPrefix' in plugin,
        limit: plugin.limit,
        premium: plugin.premium,
        enabled: !plugin.disabled,
      }
    })
    if (teks == '404') {
      let judul = `Hallo ${name}\n\n┌─〔 Status Bot 〕\n├ Aktif selama ${uptime}\n├ *${groupsss.length}* Grup\n├ *${chatsss.length - groupsss.length}* Chat Pribadi\n├ *${Object.keys(global.db.data.users).length}* Pengguna\n├ ${block == undefined ? '*0* Diblokir' : '*' + block.length + '* Diblokir'}\n├ *${Object.entries(global.db.data.chats).filter(chat => chat[1].isBanned).length}* Chat Terbanned\n├ *${Object.entries(global.db.data.users).filter(user => user[1].banned).length}* Pengguna Terbanned\n└───────`.trim()
      const sections = [
      {
        title: 'List Menu ' + namabot,
        rows: [
          { title: 'Semua Perintah', rowId: `${_p}? all` },
          { title: 'Game', rowId: `${_p}? game` },
          { title: 'XP', rowId: `${_p}? xp` },
          { title: 'Stiker', rowId: `${_p}? stiker` },
          { title: 'Kerang Ajaib', rowId: `${_p}? kerangajaib` },
          { title: 'Quotes', rowId: `${_p}? quotes` },
          { title: 'Grup', rowId: `${_p}? grup` },
          { title: 'Premium', rowId: `${_p}? premium` },
          { title: 'Internet', rowId: `${_p}? internet` },
          { title: 'Anonymous', rowId: `${_p}? anonymous` },
          { title: 'Nulis & Logo', rowId: `${_p}? nulis` },
          { title: 'Downloader', rowId: `${_p}? downloader` },
          { title: 'Tools', rowId: `${_p}? tools` },
          { title: 'Fun', rowId: `${_p}? fun`},
          { title: 'Database', rowId: `${_p}? database` },
          { title: 'Vote & Absen', rowId: `${_p}? vote` },
          { title: "Al-Qur\'an", rowId: `${_p}? quran` },
          { title: 'Pengubah Suara', rowId: `${_p}? audio` },
          { title: 'Info', rowId: `${_p}? info` },
          { title: 'Tanpa Kategori', rowId: `${_p}? tanpakategori` },
          { title: 'Owner', rowId: `${_p}? owner` },
        ]
      }
    ]
    const listMessage = {
      text: judul,
      footer: wm,
      mentions: await conn.parseMention(judul),
      title: '',
      buttonText: "Klik Disini",
      sections
    }
    return conn.sendMessage(m.chat, listMessage, { quoted: m, mentions: await conn.parseMention(judul), contextInfo: { forwardingScore: 99999, isForwarded: true }})
    
    }

    let groups = {}
    for (let tag in tags) {
      groups[tag] = []
      for (let plugin of help)
        if (plugin.tags && plugin.tags.includes(tag))
          if (plugin.help) groups[tag].push(plugin)
    }
    conn.menu = conn.menu ? conn.menu : {}
    let before = conn.menu.before || defaultMenu.before
    let header = conn.menu.header || defaultMenu.header
    let body = conn.menu.body || defaultMenu.body
    let footer = conn.menu.footer || defaultMenu.footer
    let after = conn.menu.after || (conn.user.jid == global.conn.user.jid ? '' : `Dipersembahkan oleh https://wa.me/${global.conn.user.jid.split`@`[0]}`) + defaultMenu.after
    let _text = [
      before,
      ...Object.keys(tags).map(tag => {
        return header.replace(/%category/g, tags[tag]) + '\n' + [
          ...help.filter(menu => menu.tags && menu.tags.includes(tag) && menu.help).map(menu => {
            return menu.help.map(help => {
              return body.replace(/%cmd/g, menu.prefix ? help : '%p' + help)
                .replace(/%islimit/g, menu.limit ? '(Limit)' : '')
                .replace(/%isPremium/g, menu.premium ? '(Premium)' : '')
                .trim()
            }).join('\n')
          }),
          footer
        ].join('\n')
      }),
      after
    ].join('\n')
    text = typeof conn.menu == 'string' ? conn.menu : typeof conn.menu == 'object' ? _text : ''
    let replace = {
      '%': '%',
      p: _p, uptime, muptime,
      me: conn.user.name,
      npmname: package.name,
      npmdesc: package.description,
      version: package.version,
      exp: exp - min,
      maxexp: xp,
      totalexp: exp,
      xp4levelup: max - exp <= 0 ? `Siap untuk *${_p}levelup*` : `${max - exp} XP lagi untuk levelup`,
      github: package.homepage ? package.homepage.url || package.homepage : '[unknown github url]',
      level, limit, name, umur, money, age, weton, week, date, dateIslamic, time, totalreg, rtotalreg, role,
      readmore: readMore
    }
    text = text.replace(new RegExp(`%(${Object.keys(replace).sort((a, b) => b.length - a.length).join`|`})`, 'g'), (_, name) => '' + replace[name])
    const logo = await (await fetch("https://telegra.ph/file/c3329d782d82109a37dcd.jpg")).buffer()
    const buttons = [
        { buttonId: `${_p}owner`, buttonText: { displayText: '🏅Owner' }, type: 1 },
        { buttonId: `${_p}tqto`, buttonText: { displayText: '🎖ThanksTo' }, type: 1 },
        { buttonId: `${_p}donasi`, buttonText: { displayText: '🎗  Donasi  🎗' }, type: 1 }
    ]
    const buttonMessage = {
        document: { url: "https://wa.me/6289504585790" },
        mimetype: global.doc,
        fileName: global.ucapan + ` ${name}`,
        fileLength: 887890909999999,
        pageCount: 1234567890123456789012345,
        contextInfo: {
                forwardingScore: 99999,
                isForwarded: true,
                "externalAdReply": {
                    "title": "aktif selama : " + global.u,
                    "body": 'ʙʏ ᴍ ɪᴍᴀᴍ ᴀᴅɪ',
                    "previewType": "VIDEO",
                    "mediaType": 2,
                    "thumbnail": logo,
                   "mediaUrl": 'https://youtu.be/dQw4w9WgXcQ'
                 }
        },
        caption: text.trim(),
        footer: wm,
        buttons: buttons,
        headerType: 1
    }
    return await conn.sendMessage(m.chat, buttonMessage, { quoted: m, ephemeralExpiration: 86400, forwardingScore: 99999, isForwarded: true })
  } catch (e) {
    conn.reply(m.chat, 'Maaf, menu sedang error', m)
    throw e
  }
}
handler.help = ['menu', 'help', '?']
handler.tags = ['main']
handler.command = /^(m(enu)?|help|\?)$/i
handler.owner = false
handler.mods = false
handler.premium = false
handler.group = false
handler.private = false

handler.admin = false
handler.botAdmin = false

handler.fail = null
handler.exp = 3

module.exports = handler

const more = String.fromCharCode(8206)
const readMore = more.repeat(4001)

function clockString(ms) {
  let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000)
  let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60
  let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60
  return [h, m, s].map(v => v.toString().padStart(2, 0)).join(':')
}
function ucapan() {
  const time = moment.tz('Asia/Jakarta').format('HH')
  res = "Selamat dinihari"
  if (time >= 4) {
    res = "Selamat pagi"
  }
  if (time > 10) {
    res = "Selamat siang"
  }
  if (time >= 15) {
    res = "Selamat sore"
  }
  if (time >= 18) {
    res = "Selamat malam"
  }
  return res
}
