// 唤醒脚本 - 每隔5分钟向服务器发送请求，防止Render服务器休眠
const axios = require('axios');

// 服务器地址
const SERVER_URL = 'https://c-piqm.onrender.com';
// 唤醒间隔（毫秒） - 5分钟
const WAKEUP_INTERVAL = 5 * 60 * 1000;

// 唤醒函数
async function wakeupServer() {
    try {
        const response = await axios.get(SERVER_URL, {
            timeout: 30000 // 30秒超时
        });
        console.log(`[${new Date().toLocaleString('zh-CN')}] ✅ 唤醒成功 - 状态码: ${response.status}`);
    } catch (error) {
        console.error(`[${new Date().toLocaleString('zh-CN')}] ❌ 唤醒失败:`, error.message);
    }
}

// 立即执行一次唤醒
wakeupServer();

// 设置定时唤醒
setInterval(wakeupServer, WAKEUP_INTERVAL);

console.log(`
🚀 唤醒脚本已启动
⏰ 每隔5分钟唤醒服务器
🌐 目标服务器: ${SERVER_URL}
`);
