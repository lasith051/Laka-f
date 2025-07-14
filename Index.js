require("dotenv").config();
const { default: makeWASocket, useSingleFileAuthState } = require("@whiskeysockets/baileys");
const { handleExchangeCommand } = require("./commands/exchange");
const fs = require("fs");

const { state, saveState } = useSingleFileAuthState("./auth.json");

async function startBot() {
    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: true,
    });

    sock.ev.on("creds.update", saveState);

    sock.ev.on("messages.upsert", async ({ messages }) => {
        const msg = messages[0];
        if (!msg.message || msg.key.fromMe) return;

        const text = msg.message.conversation || msg.message.extendedTextMessage?.text;

        if (text.startsWith("!usd")) {
            await handleExchangeCommand(sock, msg, "USD");
        } else if (text.startsWith("!help")) {
            await sock.sendMessage(msg.key.remoteJid, { text: "Commands:\n!usd – Dollar rate\n!help – Help\n" });
        }
    });
}

startBot();
