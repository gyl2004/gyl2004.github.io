class Snowflake {
    constructor() {
        this.element = document.createElement('div');
        this.element.className = 'snowflake';
        this.element.innerHTML = ['❅', '❆', '❄', '✻', '✼', '❉', '❋'][Math.floor(Math.random() * 7)];
        this.reset();
    }

    reset() {
        const startPosition = Math.random() * window.innerWidth;
        const animationDuration = 3 + Math.random() * 4;
        const size = 0.8 + Math.random() * 1.2;
        
        this.element.style.left = `${startPosition}px`;
        this.element.style.fontSize = `${size}em`;
        this.element.style.opacity = 0.7 + Math.random() * 0.3;

        const fallDistance = window.innerHeight + 100;
        const swayAmount = 50 + Math.random() * 100;
        
        this.element.animate([
            { 
                transform: 'translate(0, -10px) rotate(0deg)',
                offset: 0 
            },
            { 
                transform: `translate(${swayAmount}px, ${fallDistance * 0.5}px) rotate(180deg)`,
                offset: 0.5 
            },
            { 
                transform: `translate(0, ${fallDistance}px) rotate(360deg)`,
                offset: 1 
            }
        ], {
            duration: animationDuration * 1000,
            easing: 'linear',
            iterations: 1
        }).onfinish = () => this.reset();
    }
}

// 在style.css中添加摆动动画
const styleSheet = document.createElement('style');
styleSheet.textContent = `
    @keyframes sway {
        0%, 100% { transform: translateX(0); }
        50% { transform: translateX(30px); }
    }
`;
document.head.appendChild(styleSheet);

class SnowfallEffect {
    constructor(count = 100) {
        this.snowflakes = [];
        this.container = document.getElementById('snowflakes-container');
        
        for (let i = 0; i < count; i++) {
            setTimeout(() => {
                this.createSnowflake();
            }, i * 100);
        }
    }

    createSnowflake() {
        const snowflake = new Snowflake();
        this.container.appendChild(snowflake.element);
        this.snowflakes.push(snowflake);
    }
}

class LuckyDraw {
    constructor() {
        // 学生名单（示例）
        this.students = [
            // 这里添加实际的学生名单
            "刘炎平","袁锦骋","杨文俊","张江涛","刘绍鹏","杨子豪","游雨文",
"吴梓骞","罗宇航","鄢圣博","罗安鑫","黄尚","罗锦程","熊子浩",
"叶翰宇","饶夏葳","杨子贤","熊永胜","徐辰","章毅明","熊铭洋","金笃豪",
"漆睿贤","胡弘亮","丁嘉康","龚良宇","陈俊豪","曾志豪","周鸿浩",
"蔡细军","宋华睿","聂子成","聂佳康","杨令烨","周栢蓬","辜锦炫",
"黄佳晨","李谈","周芸然","江雪","鄢文佳","毛可馨","邹亦可",
"徐滟琳","屈璐丰","胡梦瑶","陈昕宇","范佳","徐梓涵2","张奕憬",
"胡思绮"
        ];
        
        this.isDrawing = false;
        this.drawInterval = null;
        
        this.initElements();
        this.bindEvents();
        this.initVideoControl();
        this.drumrollAudio = document.getElementById('drumroll');
        this.successAudio = document.getElementById('success');
    }

    initElements() {
        this.startBtn = document.getElementById('start-btn');
        this.nameDisplay = document.getElementById('selected-name');
    }

    bindEvents() {
        this.startBtn.addEventListener('click', () => this.toggleDraw());
    }

    toggleDraw() {
        if (this.isDrawing) {
            this.stopDraw();
        } else {
            this.startDraw();
        }
    }

    startDraw() {
        this.isDrawing = true;
        this.startBtn.textContent = '停止';
        this.startBtn.classList.add('drawing');
        
        // 播放滚动音效
        this.drumrollAudio.currentTime = 0;
        this.drumrollAudio.play();
        
        this.drawInterval = setInterval(() => {
            const randomIndex = Math.floor(Math.random() * this.students.length);
            this.nameDisplay.textContent = this.students[randomIndex];
        }, 50);
    }

    stopDraw() {
        this.isDrawing = false;
        this.startBtn.textContent = '开始抽取';
        this.startBtn.classList.remove('drawing');
        clearInterval(this.drawInterval);
        
        // 停止滚动音效
        this.drumrollAudio.pause();
        
        // 播放成功音效
        this.successAudio.currentTime = 0;
        this.successAudio.play();
        
        // 添加结果动画
        this.nameDisplay.classList.add('selected');
        setTimeout(() => {
            this.nameDisplay.classList.remove('selected');
        }, 1000);

        // 创建粒子效果
        this.createParticles();
    }

    initVideoControl() {
        const videoBtn = document.getElementById('video-btn');
        const videoPlayer = document.querySelector('.video-player');
        const videoOverlay = document.querySelector('.video-overlay');
        const closeBtn = document.querySelector('.close-video');
        const video = document.getElementById('bg-video');

        videoBtn.addEventListener('click', () => {
            videoPlayer.style.display = 'block';
            videoOverlay.style.display = 'block';
            video.play();
            // 添加动画效果
            requestAnimationFrame(() => {
                videoPlayer.style.opacity = '1';
                videoOverlay.style.opacity = '1';
            });
        });

        const closeVideo = () => {
            videoPlayer.style.display = 'none';
            videoOverlay.style.display = 'none';
            video.pause();
        };

        closeBtn.addEventListener('click', closeVideo);
        videoOverlay.addEventListener('click', closeVideo); // 点击遮罩层也可以关闭视频
    }

    createParticles() {
        const particleCount = 30;
        const colors = ['#FFD700', '#FFA500', '#FF4500', '#FF0000'];
        const nameRect = this.nameDisplay.getBoundingClientRect();

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            document.body.appendChild(particle);

            const color = colors[Math.floor(Math.random() * colors.length)];
            const size = Math.random() * 10 + 5;
            const startX = nameRect.left + nameRect.width / 2;
            const startY = nameRect.top + nameRect.height / 2;

            particle.style.cssText = `
                position: fixed;
                width: ${size}px;
                height: ${size}px;
                background: ${color};
                border-radius: 50%;
                pointer-events: none;
                z-index: 1000;
            `;

            const angle = (Math.random() * 360 * Math.PI) / 180;
            const velocity = Math.random() * 100 + 50;
            const animation = particle.animate([
                {
                    transform: `translate(${startX}px, ${startY}px) scale(0)`,
                    opacity: 1
                },
                {
                    transform: `translate(${startX + Math.cos(angle) * velocity}px, 
                               ${startY + Math.sin(angle) * velocity}px) scale(1)`,
                    opacity: 0
                }
            ], {
                duration: 1000,
                easing: 'cubic-bezier(0, .9, .57, 1)',
                delay: Math.random() * 200
            });

            animation.onfinish = () => particle.remove();
        }
    }
}

// 初始化抽奖系统
document.addEventListener('DOMContentLoaded', () => {
    const luckyDraw = new LuckyDraw();
    const snowfall = new SnowfallEffect(100);

    window.addEventListener('resize', () => {
        snowfall.snowflakes.forEach(snowflake => snowflake.reset());
    });
}); 
