const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3000;

// 读取YX.txt文件中的邮箱地址
function getEmailList() {
    try {
        const data = fs.readFileSync('./YX.txt', 'utf8');
        return data.split('\n').filter(email => email.trim() !== '');
    } catch (error) {
        console.error('读取YX.txt文件失败:', error);
        return ['2665997116@qq.com']; // 默认邮箱
    }
}

// 中间件
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 静态文件服务 - 捕获所有HTML文件请求
app.use(express.static('.', {
    setHeaders: function (res, path, stat) {
        if (path.endsWith('.html')) {
            // 记录新的HTML连接
            console.log('📡 新的HTML连接:', path);
        }
    }
}));

// 根路径请求
app.get('/', (req, res) => {
    console.log('📡 新的根路径连接');
    res.sendFile(__dirname + '/welcome.html');
});

// 创建邮件传输器
let transporter;
try {
    // 使用SMTP配置
    transporter = nodemailer.createTransport({
        host: 'smtp.qq.com',
        port: 465,
        secure: true,
        auth: {
            user: 'suizhao_1120@qq.com',
            pass: 'glqptraodcfqccdh'
        }
    });
    
    console.log('邮件传输器创建成功，正在验证...');
    
    // 验证传输器
    transporter.verify((error, success) => {
        if (error) {
            console.error('❌ 传输器验证失败:', error);
            console.error('错误详情:', error.message);
            console.error('错误代码:', error.code);
            console.error('📋 可能的原因：');
            console.error('1. QQ邮箱SMTP服务未开启');
            console.error('2. 授权码不正确或已过期');
            console.error('3. 网络连接问题');
            console.error('4. 风控限制');
            transporter = null;
        } else {
            console.log('✅ 传输器验证成功，可以发送邮件');
            console.log('SMTP配置信息:', {
                host: 'smtp.qq.com',
                port: 465,
                secure: true,
                user: 'suizhao_1120@qq.com'
            });
        }
    });
    
} catch (error) {
    console.error('❌ 邮件传输器创建失败:', error);
    console.error('错误详情:', error.message);
    // 如果创建失败，使用模拟模式
    transporter = null;
}

// 邮件发送路由 - 项目订单
app.post('/send-email', (req, res) => {
    const { projectName, projectPrice, projectDescription, gameId, gameNumber, gameServer, 要求, time } = req.body;
    
    // 读取邮箱列表
    const emailList = getEmailList();
    
    console.log('=============================================');
    console.log('📧 收到订单请求');
    console.log('=============================================');
    console.log('订单详情:', {
        projectName,
        projectPrice,
        projectDescription,
        gameId,
        gameNumber,
        gameServer,
        要求,
        time,
        to: emailList
    });
    console.log('=============================================');
    
    // 检查是否有真实的传输器
    if (transporter) {
        const mailOptions = {
            from: 'suizhao_1120@qq.com',
            to: emailList,
            subject: `俱乐部订单 - ${projectName}`,
            text: `提交时间: ${time}\n项目: ${projectName}\n价格: ${projectPrice}\n订单描述: ${projectDescription}\n游戏ID: ${gameId}\n游戏编号: ${gameNumber}\n游戏区服: ${gameServer}\n其他要求: ${要求}`
        };
        
        console.log('准备发送邮件:', mailOptions);
        
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('❌ 邮件发送失败:', error);
                console.error('错误详情:', error.message);
                console.error('错误代码:', error.code);
                res.status(500).send('邮件发送失败: ' + error.message);
            } else {
                console.log('✅ 邮件已发送:', info.response);
                console.log('邮件ID:', info.messageId);
                res.status(200).send('邮件发送成功');
            }
        });
    } else {
        // 模拟邮件发送
        console.log('⚠️  使用模拟模式发送邮件');
        res.status(200).send('邮件发送成功（模拟）');
    }
});

// 邮件发送路由 - 加入我们
app.post('/send-join-request', (req, res) => {
    const { qq, wechat, other, message } = req.body;
    
    // 读取邮箱列表
    const emailList = getEmailList();
    
    console.log('=============================================');
    console.log('� 收到加入请求');
    console.log('=============================================');
    console.log('加入请求详情:', {
        qq,
        wechat,
        other,
        message,
        to: emailList
    });
    console.log('=============================================');
    
    // 检查是否有真实的传输器
    if (transporter) {
        const mailOptions = {
            from: 'suizhao_1120@qq.com',
            to: emailList,
            subject: '俱乐部加入请求',
            text: `QQ号: ${qq}\n微信号: ${wechat}\n其他联系方式: ${other}\n留言: ${message}`
        };
        
        console.log('准备发送邮件:', mailOptions);
        
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('❌ 邮件发送失败:', error);
                console.error('错误详情:', error.message);
                console.error('错误代码:', error.code);
                res.status(500).send('邮件发送失败: ' + error.message);
            } else {
                console.log('✅ 邮件已发送:', info.response);
                console.log('邮件ID:', info.messageId);
                res.status(200).send('邮件发送成功');
            }
        });
    } else {
        // 模拟邮件发送
        console.log('⚠️  使用模拟模式发送邮件');
        res.status(200).send('邮件发送成功（模拟）');
    }
});

// 邮件发送路由 - 举报打手
app.post('/send-report', (req, res) => {
    const { message } = req.body;
    
    // 读取邮箱列表
    const emailList = getEmailList();
    
    console.log('=============================================');
    console.log('📧 收到举报请求');
    console.log('=============================================');
    console.log('举报请求详情:', {
        message,
        to: emailList
    });
    console.log('=============================================');
    
    // 检查是否有真实的传输器
    if (transporter) {
        const mailOptions = {
            from: 'suizhao_1120@qq.com',
            to: emailList,
            subject: '打手举报通知',
            text: message
        };
        
        console.log('准备发送邮件:', mailOptions);
        
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('❌ 邮件发送失败:', error);
                console.error('错误详情:', error.message);
                console.error('错误代码:', error.code);
                res.status(500).send('邮件发送失败: ' + error.message);
            } else {
                console.log('✅ 邮件已发送:', info.response);
                console.log('邮件ID:', info.messageId);
                res.status(200).send('邮件发送成功');
            }
        });
    } else {
        // 模拟邮件发送
        console.log('⚠️  使用模拟模式发送邮件');
        res.status(200).send('邮件发送成功（模拟）');
    }
});

// 定期验证SMTP连接，防止长时间不使用断开
function verifySMTPConnection() {
    if (transporter) {
        console.log('🔍 定期验证SMTP连接...');
        transporter.verify((error, success) => {
            if (error) {
                console.error('❌ SMTP连接验证失败:', error.message);
                // 重新创建传输器
                try {
                    transporter = nodemailer.createTransport({
                        host: 'smtp.qq.com',
                        port: 465,
                        secure: true,
                        auth: {
                            user: 'suizhao_1120@qq.com',
                            pass: 'glqptraodcfqccdh'
                        }
                    });
                    console.log('🔄 重新创建邮件传输器成功');
                } catch (error) {
                    console.error('❌ 重新创建邮件传输器失败:', error.message);
                    transporter = null;
                }
            } else {
                console.log('✅ SMTP连接验证成功');
            }
        });
    }
}

// 每30分钟验证一次SMTP连接
setInterval(verifySMTPConnection, 30 * 60 * 1000);

// 启动服务器
app.listen(port, () => {
    console.log('=============================================');
    console.log('🚀 服务器启动成功');
    console.log('📡 服务器运行在 https://c-piqm.onrender.com:' + port);
    console.log('⏰ 每30分钟自动验证SMTP连接');
    console.log('=============================================');
});
