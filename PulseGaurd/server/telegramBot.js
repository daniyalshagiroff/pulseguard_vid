// server/telegramBot.js
const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

const TG_TOKEN = process.env.TG_BOT_TOKEN; // BotFather token
const OPS_CHAT_ID = process.env.TG_ALERT_CHAT_ID || null; // your chat/group id
const API_BASE = process.env.PULSEGUARD_API_BASE || 'https://pulseguard.live';
const WEB_BASE = process.env.PULSEGUARD_WEB_BASE || 'https://pulseguard.live';

let bot = null;

if (!TG_TOKEN) {
    console.warn('[tg] TG_BOT_TOKEN not set – Telegram bot disabled');
} else {
    bot = new TelegramBot(TG_TOKEN, {
        polling: true
    });
    console.log('[tg] Bot started with polling');
}

function isAllowedChat(chatId) {
    if (!OPS_CHAT_ID) return true;
    return String(chatId) === String(OPS_CHAT_ID);
}

async function markResolved(incidentId) {
    const url = `${API_BASE}/api/alerts/${encodeURIComponent(incidentId)}`;
    await axios.patch(url, {
        status: 'resolved'
    });
}

async function getIncident(incidentId) {
    const url = `${API_BASE}/api/alerts`;
    const res = await axios.get(url);
    const list = res.data || [];
    return list.find(a => a.id === incidentId) || null;
}

if (bot) {
    bot.onText(/\/start/, (msg) => {
        if (!isAllowedChat(msg.chat.id)) return;
        bot.sendMessage(
            msg.chat.id,
            [
                'PulseGuard bot ready ✅',
                '',
                'Commands:',
                '• `/resolve A-1001` – mark incident as resolved',
                '• `/incident A-1001` – show incident info',
            ].join('\n'), {
                parse_mode: 'Markdown'
            }
        );
    });

    bot.onText(/\/incident\s+([A-Za-z0-9\-]+)/, async (msg, match) => {
        if (!isAllowedChat(msg.chat.id)) return;
        const incidentId = match[1].toUpperCase();
        try {
            const alert = await getIncident(incidentId);
            if (!alert) {
                await bot.sendMessage(msg.chat.id, `❓ Incident ${incidentId} not found`);
                return;
            }

            const text = [
                `📄 *Incident* ${alert.id}`,
                '',
                `Type: ${alert.type}`,
                `Weapon: ${alert.weapon}`,
                `Confidence: ${(alert.confidence || 0).toFixed(2)}`,
                `Status: ${alert.status}`,
                `Time: ${new Date(alert.timestamp).toLocaleString()}`,
            ].join('\n');

            const url = `${WEB_BASE}/incident/${encodeURIComponent(alert.id)}`;

            await bot.sendMessage(msg.chat.id, text, {
                parse_mode: 'Markdown',
                reply_markup: {
                    inline_keyboard: [
                        [{
                            text: '🔎 Open in dashboard',
                            url
                        }],
                    ]
                }
            });
        } catch (e) {
            console.error('[tg] /incident error:', e.message);
            await bot.sendMessage(msg.chat.id, '❌ Failed to fetch incident');
        }
    });

    bot.onText(/\/resolve\s+([A-Za-z0-9\-]+)/, async (msg, match) => {
        if (!isAllowedChat(msg.chat.id)) return;
        const incidentId = match[1].toUpperCase();

        try {
            await markResolved(incidentId);
            await bot.sendMessage(
                msg.chat.id,
                `✅ Incident *${incidentId}* marked as resolved.`, {
                    parse_mode: 'Markdown'
                }
            );
        } catch (e) {
            console.error('[tg] /resolve error:', e.message);
            await bot.sendMessage(
                msg.chat.id,
                `❌ Failed to resolve ${incidentId}: ${e.message}`
            );
        }
    });

    bot.on('callback_query', async (query) => {
        const data = query.data || '';
        const chatId = query.message?.chat?.id;
        if (!chatId || !isAllowedChat(chatId)) {
            await bot.answerCallbackQuery(query.id, {
                text: 'Not allowed for this chat',
                show_alert: true,
            });
            return;
        }

        if (data.startsWith('resolve:')) {
            const incidentId = data.split(':')[1];
            try {
                await markResolved(incidentId);
                await bot.answerCallbackQuery(query.id, {
                    text: `Incident ${incidentId} resolved`,
                    show_alert: false,
                });

                await bot.editMessageReplyMarkup({
                    inline_keyboard: []
                }, {
                    chat_id: query.message.chat.id,
                    message_id: query.message.message_id,
                });

                await bot.sendMessage(chatId, `✅ Incident ${incidentId} completed.`);
            } catch (e) {
                console.error('[tg] callback resolve error:', e.message);
                await bot.answerCallbackQuery(query.id, {
                    text: 'Failed to resolve',
                    show_alert: true,
                });
            }
        }
    });
}

// called from index.js when an alert becomes escalated
async function notifyEscalation(alert) {
    if (!bot) return;

    const chatId = OPS_CHAT_ID;
    if (!chatId) {
        console.warn('[tg] TG_ALERT_CHAT_ID not set – cannot send escalation notification');
        return;
    }

    const text = [
        `🚨 *Escalated incident* ${alert.id}`,
        '',
        `Type: ${alert.type}`,
        `Weapon: ${alert.weapon}`,
        `Confidence: ${(alert.confidence || 0).toFixed(2)}`,
        `Time: ${new Date(alert.timestamp).toLocaleString()}`,
    ].join('\n');

    const incidentUrl = `${WEB_BASE}/incident/${encodeURIComponent(alert.id)}`;

    await bot.sendMessage(chatId, text, {
        parse_mode: 'Markdown',
        reply_markup: {
            inline_keyboard: [
                [{
                        text: '🔎 Open in dashboard',
                        url: incidentUrl
                    },
                    {
                        text: '✅ Mark completed',
                        callback_data: `resolve:${alert.id}`
                    },
                ],
            ],
        },
    });
}

module.exports = {
    bot,
    notifyEscalation,
};