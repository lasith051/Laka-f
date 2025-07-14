const fetch = require("node-fetch");
const si = require("../locales/si.json");
const en = require("../locales/en.json");

async function handleExchangeCommand(sock, msg, currency) {
    const lang = "si"; // You can make this dynamic later
    const text = lang === "si" ? si : en;

    try {
        const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${currency}`);
        const data = await response.json();
        const lkr = data.rates["LKR"];
        await sock.sendMessage(msg.key.remoteJid, {
            text: `${text.currency_rate}: ${currency} = ${lkr} LKR`,
        });
    } catch (err) {
        await sock.sendMessage(msg.key.remoteJid, {
            text: text.error,
        });
    }
}

module.exports = { handleExchangeCommand };
