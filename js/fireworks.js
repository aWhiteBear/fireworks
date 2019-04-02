const canvas = document.getElementById('canvasNode');
const ctx = canvas.getContext('2d');
const canvasWidth = canvas.width;
const canvasHeight = canvas.height;

class FlyingMonkey{
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
class Firework {
    constructor(x,y,speedX,speedY){
        this.x = x;
        this.y = y;
        this.speedX = speedX;
        this.speedY = speedY;
        this.opacity = 1;
        this.count = 100;
        this.AllFireworks = [];
        for(let i=0;i<this.count;i++){
            let r = Math.floor(Math.random()*256), g = Math.floor(Math.random()*256) , b =Math.floor(Math.random()*256);
            this.AllFireworks.push({r,g,b,x:this.x,y:this.y,speedX:this.speedX,speedY:this.speedY})
            this.createFirework(i,r,g,b);
        }
    }
    createFirework(i,r,g,b){
        ctx.beginPath();
        ctx.save();
        // ctx.globalCompositeOperation = 'lighter';
        ctx.fillStyle = `rgba(${r},${g},${b},${this.opacity})`;
        ctx.arc(this.x , this.y ,6,0,2 * Math.PI);
        ctx.fill();
        ctx.restore();
        ctx.closePath();
    }
}

let arrFlyingMonkey = [];
let arrFirework = [];
class Start{
    constructor(x,y,speedX,speedY,arr,ClassName){
        arr.push(this);
        this.x = x;
        this.y = y;
        this.speedX = speedX;
        this.speedY = speedY;
        this.ClassName = ClassName;
        this.begin();
    }
    begin(){
        this.y = this.y - this.speedY/60; // 60是帧数
        this.x = this.x - this.speedX/60;
        this.speedY = this.speedY - 3;
        new this.ClassName(this.x, this.y, this.speedX, this.speedY);
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
                new Start(item.x,item.y,Math.random()*300,Math.random()*200,arrFirework,Firework);
            }
        });
        arrFirework.forEach((item,i)=>{
            for(let i=0;i<item.AllFireworks.length;i++){
                new Start(item.x,item.y,Math.random()*300,Math.random()*200,arrFirework,Firework)
            }
        });
        arrFirework.forEach((item,i)=>{
            for(let i=0;i<item.AllFireworks.length;i++){
                new Start(item.x,item.y,Math.random()*300,Math.random()*200,arrFirework,Firework)
            }
            item.begin();
        });
        requestAnimationFrame(this.draw);
    }
}
new AllStart();
new Start(canvasWidth/2,canvasHeight-100,0,300,arrFlyingMonkey,FlyingMonkey);
new Start(100,canvasHeight-100,0,400,arrFlyingMonkey,FlyingMonkey);