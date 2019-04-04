const canvas = document.getElementById('canvasNode');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const CANVAS_WIDTH = canvas.width;
const CANVAS_HEIGHT = canvas.height;
const GRAVITATIONAL = 2.5; // 重力系数
const AIR_RESISTANCE = 1; // 空气阻力
const EVERY_FIREWORK_TIME = 3; // 每个烟花的持续时间，单位：秒
const FRAME = 60;

class FlyingMonkey{ // 窜天猴，发射升空的，目前只能垂直发射
    constructor(x,y,speedX,speedY){
        this.x = x;
        this.y = y;
        this.speedX = speedX;
        this.speedY = speedY;
        this.opacity = 1;
        this.count = 50;
        for(let i=0;i<this.count;i++){
            this.createCircle(i);
        }
    }
    createCircle(i) {
        ctx.beginPath();
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        ctx.fillStyle = `rgba(245,123,63,${this.opacity})`;
        // ctx.strokeStyle = `rgba(0,0,0,${this.opacity})`;
        ctx.arc(this.x + (Math.random()-0.5) * i/10 + i/this.count * this.speedX, this.y + i/this.count * this.speedY ,8 - (6 * i/this.count),0,2 * Math.PI);
        ctx.fill();
        ctx.restore();
        ctx.closePath();
    }
}

class Firework { // 烟花，爆炸的
    constructor(x,y,speedX,speedY){
        this.x = x;
        this.y = y;
        this.speedX = speedX;
        this.speedY = speedY;
        this.opacity = 1;
        this.count = 500;
        this.AllFireworks = [];

        this.createAllFirework();
        Launch.arrFirework.push(this);
    }
    createAllFirework(){
        let r = Math.floor(Math.random()*256), g = Math.floor(Math.random()*256) , b =Math.floor(Math.random()*256);
        for(let i=0;i<this.count;i++){
            this.AllFireworks.push({
                r,g,b,
                x:this.x,
                y:this.y,
                opacity:1,
                speedX:this.speedX * i/this.count*10 *(Math.random()-0.5),
                speedY:this.speedY * i/this.count*10 *(Math.random()-0.5)
            });
        }
        this.updateAllFirework();
    }
    updateAllFirework(){
        for(let i=0;i<this.AllFireworks.length;i++){
            let {r,g,b,x,y,speedX,speedY,opacity} = this.AllFireworks[i];
            this.AllFireworks[i].y = y - speedY/FRAME;
            this.AllFireworks[i].x = x - speedX/FRAME;
            this.AllFireworks[i].opacity = opacity - 1/ FRAME / EVERY_FIREWORK_TIME;
            this.AllFireworks[i].speedY = speedY - GRAVITATIONAL;
            if(Math.abs(speedX)>3/FRAME) { // 速度<= 3/FRAME 认为停止了
                this.AllFireworks[i].speedX = speedX - (speedX>0?AIR_RESISTANCE:(AIR_RESISTANCE*(-1)));
            } else {
                this.AllFireworks[i].speedX = 0;
            }
            ctx.beginPath();
            ctx.save();
            ctx.globalCompositeOperation = 'lighter';
            ctx.fillStyle = `rgba(${r},${g},${b},${this.AllFireworks[i].opacity})`;
            ctx.arc(this.AllFireworks[i].x , this.AllFireworks[i].y  ,2,0,2 * Math.PI);
            ctx.fill();
            ctx.restore();
            ctx.closePath();
        }
    }
}

class Start{
    constructor(x,y,speedX,speedY){
        Launch.arrFlyingMonkey.push(this);
        this.x = x;
        this.y = y;
        this.speedX = speedX;
        this.speedY = speedY;
        this.begin();
    }
    begin(){
        this.y = this.y - this.speedY/FRAME;
        this.x = this.x - this.speedX/FRAME;
        this.speedY = this.speedY - GRAVITATIONAL;
        new FlyingMonkey(this.x, this.y, this.speedX, this.speedY);
    }
}

class Launch{ // 发射
    constructor(){
        this.fps=0;
        this.sum=0;// 帧数计数器 60帧一循环
        this.draw = this.draw.bind(this);
        this.draw();
    }
    draw(){
        ctx.clearRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
        this.updateFps();
        Launch.arrFlyingMonkey.forEach((item,i)=>{
            item.begin();
            if(item.speedY < 0){
                Launch.arrFlyingMonkey.splice(i,1);
                new Firework(item.x,item.y,7*7,5*7); // 烟花宽高比：7:5
            }
        });
        Launch.arrFirework.forEach((item,i)=>{
            item.updateAllFirework();
        });
        if(Launch.arrFirework.length>5){ // 清理arrFirework，避免占用过多内存，其实还可以通过 EVERY_FIREWORK_TIME 和 Launch.timer 更及时清理。length > EVERY_FIREWORK_TIME/Launch.timer
            Launch.arrFirework.shift();
        }
        requestAnimationFrame(this.draw);
    }
    updateFps(){
        if(this.sum++>=60){
            this.sum = 0;
            let nowTime = new Date().getTime();
            this.fps = 60/(nowTime - Launch.lastTime) *1000;
            Launch.lastTime = nowTime;
        }
        ctx.save();
        ctx.fillStyle = 'red';
        ctx.font="20px Arial";
        ctx.fillText(`FPS: ${~~this.fps}`,CANVAS_WIDTH - 100,50);
        ctx.restore();
    }
}
/** 添加Launch静态属性*/
Launch.arrFlyingMonkey = [];
Launch.arrFirework = [];
Launch.timer = setInterval(()=>{
    new Start(CANVAS_WIDTH * (Math.random() * 0.8 + 0.1),CANVAS_HEIGHT * 0.9,0,300 *(Math.random()*0.5 + 1));
},1500);
Launch.lastTime = new Date().getTime();

new Launch();


window.onfocus = function() {
    clearInterval(Launch.timer);
    Launch.timer = setInterval(()=>{
        new Start(CANVAS_WIDTH * (Math.random() * 0.8 + 0.1),CANVAS_HEIGHT * 0.9,0,300 *(Math.random()*0.5 + 1));
    },1500);
};
window.onblur = function() {
    clearInterval(Launch.timer);
};
