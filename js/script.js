});
}

// 检查服务器连接状态
function checkServerStatus() {
    const serverStatus = document.getElementById('server-status');
    if (!serverStatus) return;
    
    // 尝试连接服务器
    fetch('https://c-piqm.onrender.com')
        .then(response => {
            // 连接成功
            serverStatus.classList.remove('offline');
            serverStatus.querySelector('.status-text').textContent = '服务器，连接成功';
        })
        .catch(error => {
            // 连接失败
            serverStatus.classList.add('offline');
            serverStatus.querySelector('.status-text').textContent = '服务器，连接失败';
        });
}

// 页面加载时检查服务器状态
window.addEventListener('load', function() {
    checkServerStatus();
    // 每5秒检查一次服务器状态
    setInterval(checkServerStatus, 5000);
});                showMessage('请先选择一个项目', 'error');
                return;
            }
            
            // 获取当前时间
        const formattedTime = new Date().toLocaleString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        
        // 构建邮件数据
        const emailData = {
            projectName: projectName,
            projectPrice: selectedPrice,
            projectDescription: selectedDescription,
            gameId: gameId,
            gameNumber: gameNumber,
            gameServer: gameServer,
            要求: yaoqiu,
            time: formattedTime
        };
        
        // 检查提交频率
        const submitRecords = JSON.parse(localStorage.getItem('submitRecords') || '[]');
        const currentTime = Date.now();
        const oneMinuteAgo = currentTime - 60 * 1000;
        
        // 过滤出一分钟内的提交记录
        const recentRecords = submitRecords.filter(record => record.time > oneMinuteAgo);
        
        if (recentRecords.length >= 1) {
            showMessage('每分钟只能提交一次订单，请稍后再试', 'error');
            return;
        }
        
        // 添加本次提交记录（无论成功与否都记录）
        recentRecords.push({ time: currentTime });
        localStorage.setItem('submitRecords', JSON.stringify(recentRecords));
        
        // 发送邮件请求
        fetch('https://c-piqm.onrender.com/send-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(emailData)
        })
        .then(response => response.text())
        .then(data => {
            if (data.includes('邮件发送成功')) {
                showPopup('订单提交成功，请注意游戏账号打手邀请提醒，先不要付款，等待打手邀请之后，再问打手哪个收款码是他本人再进行付款');
            } else {
                showMessage('失败，请稍后重试', 'error');
            }
        })
        .catch(error => {
            console.error('发送请求失败:', error);
            showMessage('网络错误，请稍后重试', 'error');
        });
            
            // 重置表单和选中的项目
            setTimeout(() => {
                projectForm.reset();
                selectedProject = '';
            }, 3000);
        });
    }
});

// 显示消息函数
function showMessage(text, type) {
    const messageDiv = document.getElementById('message');
    if (messageDiv) {
        messageDiv.className = type === 'success' ? 'success-message' : 'error-message';
        messageDiv.textContent = text;
        
        // 3秒后隐藏消息
        setTimeout(() => {
            messageDiv.textContent = '';
            messageDiv.className = '';
        }, 3000);
    }
}

// 显示弹窗函数
function showPopup(text) {
    // 创建弹窗元素
    const popup = document.createElement('div');
    popup.className = 'popup-overlay';
    popup.innerHTML = `
        <div class="popup-content">
            <p>${text}</p>
            <button class="btn btn-primary" onclick="this.parentElement.parentElement.remove()">确定</button>
        </div>
    `;
    
    // 添加到页面
    document.body.appendChild(popup);
    
    // 添加弹窗样式
    const style = document.createElement('style');
    style.textContent = `
        .popup-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
        }
        
        .popup-content {
            background-color: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
            text-align: center;
            max-width: 400px;
            width: 90%;
        }
        
        .popup-content p {
            margin-bottom: 20px;
            font-size: 1.2rem;
        }
    `;
    document.head.appendChild(style);
}

// 加入我们表单提交功能
const joinForm = document.getElementById('join-form');
if (joinForm) {
    joinForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const qq = (document.getElementById('qq').value || '无').substring(0, 50);
        const wechat = (document.getElementById('wechat').value || '无').substring(0, 50);
        const other = (document.getElementById('other').value || '无').substring(0, 50);
        const message = (document.getElementById('message').value || '无').substring(0, 50);
        
        // 检查提交频率
        const submitRecords = JSON.parse(localStorage.getItem('joinSubmitRecords') || '[]');
        const currentTime = Date.now();
        const oneMinuteAgo = currentTime - 60 * 1000;
        
        // 过滤出一分钟内的提交记录
        const recentRecords = submitRecords.filter(record => record.time > oneMinuteAgo);
        
        if (recentRecords.length >= 1) {
            showMessage('每分钟只能提交一次，请稍后再试', 'error');
            return;
        }
        
        // 添加本次提交记录（无论成功与否都记录）
        recentRecords.push({ time: currentTime });
        localStorage.setItem('joinSubmitRecords', JSON.stringify(recentRecords));
        
        // 构建邮件数据
        const emailData = {
            type: '加入我们',
            qq: qq,
            wechat: wechat,
            other: other,
            message: message
        };
        
        // 发送邮件请求
        fetch('https://c-piqm.onrender.com/send-join-request', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(emailData)
        })
        .then(response => response.text())
        .then(data => {
            if (data.includes('邮件发送成功')) {
                showPopup('提交成功，我们会尽快与您联系');
            } else {
                showMessage('提交失败，请稍后重试', 'error');
            }
        })
        .catch(error => {
            console.error('发送请求失败:', error);
            showMessage('网络错误，请稍后重试', 'error');
        });
        
        // 重置表单
        setTimeout(() => {
            joinForm.reset();
        }, 3000);
    });
}

// 页面加载动画
window.addEventListener('load', function() {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease-in-out';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// 按钮悬停效果
const buttons = document.querySelectorAll('.btn');
buttons.forEach(btn => {
    btn.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-3px)';
    });
    
    btn.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
    
    // 添加按钮点击涟漪效果
    btn.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');
        
        this.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

// 添加按钮点击涟漪效果的CSS
const style = document.createElement('style');
style.textContent = `
    .btn {
        position: relative;
        overflow: hidden;
    }
    
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: ripple 0.6s linear;
        pointer-events: none;
    }
    
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// 关闭举报弹窗函数
function closeReportPopup() {
    document.getElementById('report-popup').style.display = 'none';
}

// 举报打手表单提交功能
const reportForm = document.getElementById('report-form');
if (reportForm) {
    reportForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const reportContent = (document.getElementById('report-content').value || '无').substring(0, 500);
        
        if (!reportContent || reportContent === '无') {
            showMessage('请输入举报内容', 'error');
            return;
        }
        
        // 检查提交频率
        const submitRecords = JSON.parse(localStorage.getItem('joinSubmitRecords') || '[]');
        const currentTime = Date.now();
        const oneMinuteAgo = currentTime - 60 * 1000;
        
        // 过滤出一分钟内的提交记录
        const recentRecords = submitRecords.filter(record => record.time > oneMinuteAgo);
        
        if (recentRecords.length >= 1) {
            showMessage('每分钟只能提交一次，请稍后再试', 'error');
            return;
        }
        
        // 添加本次提交记录（无论成功与否都记录）
        recentRecords.push({ time: currentTime });
        localStorage.setItem('joinSubmitRecords', JSON.stringify(recentRecords));
        
        // 构建邮件数据
        const emailData = {
            type: '举报打手',
            qq: '无',
            wechat: '无',
            other: '无',
            message: reportContent
        };
        
        // 发送邮件请求
        fetch('https://c-piqm.onrender.com/send-join-request', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(emailData)
        })
        .then(response => response.text())
        .then(data => {
            if (data.includes('邮件发送成功')) {
                showPopup('举报提交成功，我们会尽快处理');
            } else {
                showMessage('提交失败，请稍后重试', 'error');
            }
        })
        .catch(error => {
            console.error('发送请求失败:', error);
            showMessage('网络错误，请稍后重试', 'error');
        });
        
        // 重置表单
        setTimeout(() => {
            reportForm.reset();
        }, 3000);
    });
}

// 检查服务器连接状态
function checkServerStatus() {
    const serverStatus = document.getElementById('server-status');
    if (!serverStatus) return;
    
    // 尝试连接服务器
    fetch('https://c-piqm.onrender.com')
        .then(response => {
            // 连接成功
            serverStatus.classList.remove('offline');
            serverStatus.querySelector('.status-text').textContent = '服务器，连接成功';
        })
        .catch(error => {
            // 连接失败
            serverStatus.classList.add('offline');
            serverStatus.querySelector('.status-text').textContent = '服务器，连接失败';
        });
}

// 页面加载时检查服务器状态
window.addEventListener('load', function() {
    checkServerStatus();
    // 每5秒检查一次服务器状态
    setInterval(checkServerStatus, 5000);
});
