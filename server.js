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
        const emails = data.split('\n').filter(email => email.trim() !== '');
        console.log('读取到的邮箱列表:', emails);
        return emails.length > 0 ? emails : ['2665997116@qq.com'];
    } catch (error) {
        console.error('读取YX.txt文件失败:', error);
        console.log('使用默认邮箱列表');
        return ['2665997116@qq.com']; // 默认邮箱
    }
}

// 中间件
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('.'));

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
            pass: 'wlnudpveossfdfhd'
        },
        tls: {
            rejectUnauthorized: false
        },
        timeout: 60000 // 60秒超时
    });
    
    // 验证传输器
    transporter.verify((error, success) => {
        if (error) {
            console.error('传输器验证失败:', error);
            transporter = null;
        } else {
            console.log('传输器验证成功，可以发送邮件');
        }
    });
    
    console.log('邮件传输器创建成功');
} catch (error) {
    console.error('邮件传输器创建失败:', error);
    // 如果创建失败，使用模拟模式
    transporter = null;
}

// 通用邮件发送函数
function sendEmail(emailOptions, res) {
    console.log('开始发送邮件:', {
        to: emailOptions.to,
        subject: emailOptions.subject,
        text: emailOptions.text.substring(0, 100) + '...' // 只显示前100个字符
    });
    
    if (transporter) {
        transporter.sendMail(emailOptions, (error, info) => {
            if (error) {
                console.error('邮件发送失败:', error);
                res.status(500).send('邮件发送失败: ' + error.message);
            } else {
                console.log('邮件已发送:', info.response);
                res.status(200).send('邮件发送成功');
            }
        });
    } else {
        // 模拟邮件发送
        console.log('使用模拟模式发送邮件');
        res.status(200).send('邮件发送成功（模拟）');
    }
}

// 邮件发送路由 - 项目订单
app.post('/send-email', (req, res) => {
    try {
        const { projectName, projectPrice, projectDescription, gameId, gameNumber, gameServer, 要求, time } = req.body;
        
        // 验证必要参数
        if (!projectName) {
            return res.status(400).send('缺少项目名称');
        }
        
        // 读取邮箱列表
        const emailList = getEmailList();
        
        console.log('收到订单:', {
            projectName,
            gameId,
            gameNumber,
            gameServer,
            要求,
            time,
            to: emailList
        });
        
        const mailOptions = {
            from: 'suizhao_1120@qq.com',
            to: emailList,
            subject: `俱乐部订单 - ${projectName}`,
            text: `提交时间: ${time}\n项目: ${projectName}\n价格: ${projectPrice}\n订单描述: ${projectDescription}\n游戏ID: ${gameId}\n游戏编号: ${gameNumber}\n游戏区服: ${gameServer}\n其他要求: ${要求}\n\n打手抢单规则:\n1. 订单会发到所有人的邮箱里，谁先邀请老板这个单就属于是谁抢的\n2. 可以选择三个人护一个老板，价格进行平均分\n3. 要保留你护航老板的证据，提交给董事长即可给钱\n4. 邀请老板后，请到群聊查看老板是否已经付款\n5. 注意注意，一定要先问老板是否付款\n6. 可以到QQ群内确认，若老板没有发截图，请要求老板加群后发截图\n7. 订单内的翻车单类，若发现老板故意送人头，可在群聊内投诉，董事长验证后可不完单\n8. QQ群号：217891046`
        };
        
        sendEmail(mailOptions, res);
    } catch (error) {
        console.error('订单处理失败:', error);
        res.status(500).send('服务器内部错误: ' + error.message);
    }
});

// 邮件发送路由 - 加入我们和举报打手
app.post('/send-join-request', (req, res) => {
    try {
        const { type, qq, wechat, other, message } = req.body;
        
        // 读取邮箱列表
        const emailList = getEmailList();
        
        console.log('收到请求:', {
            type,
            qq,
            wechat,
            other,
            message,
            to: emailList
        });
        
        // 根据type设置邮件标题
        let subject = '俱乐部加入请求';
        let emailText = `QQ号: ${qq}\n微信号: ${wechat}\n其他联系方式: ${other}\n留言: ${message}`;
        
        console.log('检查type字段:', type);
        
        if (type && type.includes('举报')) {
            subject = '打手举报通知';
            emailText = message;
            console.log('设置为举报邮件:', subject, emailText);
        } else {
            console.log('设置为加入请求邮件:', subject, emailText);
        }
        
        const mailOptions = {
            from: 'suizhao_1120@qq.com',
            to: emailList,
            subject: subject,
            text: emailText
        };
        
        sendEmail(mailOptions, res);
    } catch (error) {
        console.error('请求处理失败:', error);
        res.status(500).send('服务器内部错误: ' + error.message);
    }
});

// 邮件发送路由 - 举报打手
app.post('/send-report', (req, res) => {
    try {
        const { message } = req.body;
        
        // 验证必要参数
        if (!message) {
            return res.status(400).send('缺少举报内容');
        }
        
        // 读取邮箱列表
        const emailList = getEmailList();
        
        console.log('收到举报请求:', {
            message,
            to: emailList
        });
        
        const mailOptions = {
            from: 'suizhao_1120@qq.com',
            to: emailList,
            subject: '打手举报通知',
            text: message
        };
        
        sendEmail(mailOptions, res);
    } catch (error) {
        console.error('举报处理失败:', error);
        res.status(500).send('服务器内部错误: ' + error.message);
    }
});

// 健康检查路由
app.get('/', (req, res) => {
    res.status(200).send('服务器运行正常');
});

// 启动服务器
app.listen(port, () => {
    console.log(`服务器运行在 https://c-piqm.onrender.com:${port}`);
    console.log(`健康检查: https://c-piqm.onrender.com:${port}`);
    console.log('邮件传输器状态:', transporter ? '就绪' : '未就绪（使用模拟模式）');
    console.log('默认邮箱列表:', getEmailList());
});
