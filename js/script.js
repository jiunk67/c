// 项目选择功能
document.addEventListener('DOMContentLoaded', function() {
    // 项目选择功能
    const projectItems = document.querySelectorAll('.project-item');
    let selectedProject = '';
    let selectedPrice = '';
    let selectedDescription = '';
    
    if (projectItems.length > 0) {
        projectItems.forEach(item => {
            item.addEventListener('click', function() {
                selectedProject = this.getAttribute('data-project');
                // 获取项目价格
                selectedPrice = this.querySelector('.price').textContent.replace('价格：', '');
                // 获取项目描述
                selectedDescription = this.getAttribute('data-description');
                
                // 滚动到表单
                document.getElementById('order-form').scrollIntoView({ behavior: 'smooth' });
            });
        });
    }
    
    // 表单提交功能
    const projectForm = document.getElementById('project-form');
    if (projectForm) {
        projectForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const projectName = selectedProject;
            const gameId = (document.getElementById('game-id').value || '无').substring(0, 50);
            const gameNumber = (document.getElementById('game-number').value || '无').substring(0, 50);
            const gameServer = document.getElementById('game-server').value || '无';
            const yaoqiu = (document.getElementById('要求').value || '无指定').substring(0, 50);
            
            if (!projectName) {
                showMessage('请先选择一个项目', 'error');
                return;
            }
            
            // 检查提交频率
            const submitRecords = JSON.parse(localStorage.getItem('submitRecords') || '[]');
            const currentTime = Date.now();
            const oneMinuteAgo = currentTime - 60 * 1000;
            
            // 过滤出一分钟内的提交记录
            const recentRecords = submitRecords.filter(record => record.time > oneMinuteAgo);
            
            if (recentRecords.length >= 5) {
                showMessage('提交过于频繁，请一分钟后再试', 'error');
                return;
            }
            
            // 添加本次提交记录
            recentRecords.push({ time: currentTime });
            localStorage.setItem('submitRecords', JSON.stringify(recentRecords));
            
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
                if (data === '邮件发送成功') {
                    showMessage('订单已提交，邮件发送成功', 'success');
                    // 跳转到付款码页面
                    setTimeout(() => {
                        window.location.href = 'payment.html';
                    }, 1500);
                } else {
                    showMessage('邮件发送失败，请稍后重试', 'error');
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
        
        if (recentRecords.length >= 5) {
            showMessage('提交过于频繁，请一分钟后再试', 'error');
            return;
        }
        
        // 添加本次提交记录
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
            if (data === '邮件发送成功') {
                showMessage('提交成功，我们会尽快与您联系', 'success');
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