const canvas = document.getElementById('canvasNode');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const canvasWidth = canvas.width;
const canvasHeight = canvas.height;
const gravitational = 3; // 重力系数
const airResistance = 1; // 空气阻力
const everyFireworkTime = 3; // 每个烟花的持续时间，单位：秒

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
let arrFirework = [];
let arrFlyingMonkey = [];

class Firework { // 烟花，爆炸的
    constructor(x,y,speedX,speedY){
        this.x = x;
        this.y = y;
        this.speedX = speedX;
        this.speedY = speedY;
        this.opacity = 1;
        this.count = 200;
        this.AllFireworks = [];
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
        this.createAllFirework();
        arrFirework.push(this);
    }
    createAllFirework(){
        for(let i=0;i<this.AllFireworks.length;i++){
            let {r,g,b,x,y,speedX,speedY,opacity} = this.AllFireworks[i];
            this.AllFireworks[i].y = y - speedY/60; // 60是帧数
            this.AllFireworks[i].x = x - speedX/60;
            this.AllFireworks[i].opacity = opacity - 1/60/everyFireworkTime;// 3秒后透明度为0
            this.AllFireworks[i].speedY = speedY - gravitational;
            if(Math.abs(speedX)>3/60) {this.AllFireworks[i].speedX = speedX - (speedX>0?airResistance:(airResistance*(-1)));}
            else {this.AllFireworks[i].speedX = 0;}
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
        arrFlyingMonkey.push(this);
        this.x = x;
        this.y = y;
        this.speedX = speedX;
        this.speedY = speedY;
        this.begin();
    }
    begin(){
        this.y = this.y - this.speedY/60; // 60是帧数
        this.x = this.x - this.speedX/60;
        this.speedY = this.speedY - gravitational;
        new FlyingMonkey(this.x, this.y, this.speedX, this.speedY);
    }
}

class AllStart{
    constructor(){
        this.draw = this.draw.bind(this);
        this.draw();
    }
    draw(){
        ctx.clearRect(0,0,canvasWidth,canvasHeight);
        arrFlyingMonkey.forEach((item,i)=>{
            item.begin();
            if(item.speedY < 0){
                arrFlyingMonkey.splice(i,1);
                new Firework(item.x,item.y,7*6,5*6); // 宽高比：7:5
            }
        });
        arrFirework.forEach((item,i)=>{
            item.createAllFirework();
        });
        if(arrFirework.length>10){ // 清理arrFirework，避免占用过多内存，其实还可以通过everyFireworkTime更及时清理
            arrFirework.shift();
        }
        requestAnimationFrame(this.draw);
    }
}
new AllStart();

let timer;
timer = setInterval(()=>{
        new Start(canvasWidth * (Math.random() * 0.8 + 0.1),canvasHeight-100,0,300 *(Math.random()*0.5 + 1));
    },1500);
window.onfocus = function() {
    timer = setInterval(()=>{
        new Start(canvasWidth * (Math.random() * 0.8 + 0.1),canvasHeight-100,0,300*(Math.random()*0.5 + 1));
    },1500);
};
window.onblur = function() {
    clearInterval(timer);
};
