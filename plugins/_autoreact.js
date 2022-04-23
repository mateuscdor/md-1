let handler = async (m, { conn }) => {
	let emot = conn.pickRandom(["🗿", "👍", "💨", "🩱", "🐷", "🐒", "🌝", "💩", "👻", "🔥", "🖕"])
    conn.sendMessage(m.chat, {
    	react: {
    		text: emot,
    		key: m.key
    	}
    })	
}
handler.customPrefix = /(bile?k|ban?h|cum?|knt?l|y?|mmk|wibu|pantek|pepek)/i
handler.command = new RegExp

module.exports = handler
