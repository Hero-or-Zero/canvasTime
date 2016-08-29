var WINDOW_WIDTH;//=1024;//canvas宽
var WINDOW_HEIGHT;//=768;//canvas高
var RADIUS;//=8;		  //小圆半径
var MARGIN_TOP;// = 60;  //左上角第一个小圆据上边距离
var MARGIN_LEFT;// = 30; //左上角第一个小圆初左边距离

/*倒计时
*
const endTime = new Date(2016,7,29,18,00,00);//截止时间,月份从0开始算
// 距离当前时间一小时
// var endTime = new Date();
// endTime.setTime(endTime.getTime()+3600*1000);
*/
var curShowTimeSeconds= 0;

//存放小球
var balls = [];
//小球颜色
const colors = ["#33b5e5","#09c","#a6c","#93c","#690","#fb3","#f80","#f44","#c00"];

window.onload=function(){

	WINDOW_WIDTH = document.body.clientWidth;
	WINDOW_HEIGHT = document.body.clientHeight;
	console.log(WINDOW_HEIGHT);

	//左右两边空白分别占整个整个宽度的1/10，数字占4/5
	MARGIN_LEFT = Math.round(WINDOW_WIDTH/10);
	RADIUS = Math.round(WINDOW_WIDTH*4/5/108)-1;
	MARGIN_TOP = Math.round(WINDOW_HEIGHT/5);

	var canvas=document.getElementById("canvas");
	var context = canvas.getContext("2d");
	canvas.width=WINDOW_WIDTH;
	canvas.height=WINDOW_HEIGHT;
	
	curShowTimeSeconds= getCurrentShowTimeSeconds();
	setInterval(function(){
		render(context);
		//更新
		update();
	},50);
}
//获取到具体时间的秒
function getCurrentShowTimeSeconds(){
	var curTime = new Date();

	//时钟
	var ret = curTime.getHours()*3600+curTime.getMinutes()*60+curTime.getSeconds();//今天走过多少秒
	/*倒计时
	*
	var ret = endTime.getTime()-curTime.getTime();
	ret = Math.round(ret/1000);
	*/

	return ret >= 0 ? ret : 0;
}

//update
function update() {
	var nextShowTimeSeconds = getCurrentShowTimeSeconds();
	
	var nextHours = parseInt(nextShowTimeSeconds/3600);
	var nextMinutes = parseInt((nextShowTimeSeconds-nextHours*3600)/60);
	var nextSeconds = nextShowTimeSeconds%60;

	var curHours = parseInt(curShowTimeSeconds/3600);
	var curMinutes = parseInt((curShowTimeSeconds-curHours*3600)/60);
	var curSeconds = curShowTimeSeconds%60;

	if(nextSeconds　!= curSeconds) {
		//小时十位数检测
		if(parseInt(curHours/10) != parseInt(nextHours/10)) {
			addBalls(MARGIN_LEFT+0,MARGIN_TOP,parseInt(curHours/10));
		}
		//小时个位数检测
		if(parseInt(curHours%10) != parseInt(nextHours%10)) {
			addBalls(MARGIN_LEFT+15*(RADIUS+1),MARGIN_TOP,parseInt(curHours/10));
		}
		//分钟十位数检测
		if(parseInt(curMinutes/10) != parseInt(nextMinutes/10)) {
			addBalls(MARGIN_LEFT+39*(RADIUS+1),MARGIN_TOP,parseInt(curMinutes/10));
		}
		//分钟个位数检测
		if(parseInt(curMinutes%10) != parseInt(nextMinutes%10)) {
			addBalls(MARGIN_LEFT+54*(RADIUS+1),MARGIN_TOP,parseInt(curMinutes/10));
		}
		//秒钟十位数检测
		if(parseInt(curSeconds/10) != parseInt(nextSeconds　/10)) {
			addBalls(MARGIN_LEFT+78*(RADIUS+1),MARGIN_TOP,parseInt(curSeconds/10));
		}
		//秒钟个位数检测
		if(parseInt(curSeconds%10) != parseInt(nextSeconds　%10)) {
			addBalls(MARGIN_LEFT+93*(RADIUS+1),MARGIN_TOP,parseInt(nextSeconds/10));
		}
		curShowTimeSeconds = nextShowTimeSeconds;
	}

	//更新小球
	updateBalls();
}

function updateBalls() {
	for(var i=0;i<balls.length;i++) {
		balls[i].x += balls[i].vx;
		balls[i].y += balls[i].vy;
		balls[i].vy  += balls[i].g;

		//碰撞检测
		if(balls[i].y >= WINDOW_HEIGHT-RADIUS) {
			balls[i].y = WINDOW_HEIGHT-RADIUS;
			//反弹速度
			balls[i].vy = -balls[i].vy*0.75;
		}
	}

	//删除出去的小球
	var cnt = 0;//记录有多少小球保留在画布中
	for(var i=0;i<balls.length;i++) {
		if(balls[i].x+RADIUS>0&&balls[i].x-RADIUS<WINDOW_WIDTH) {
			balls[cnt++] = balls[i];
		}
	}
	while(balls.length>cnt) {
		balls.pop();
	}
}

//加上彩色小球
function addBalls(x,y,num) {
	for(var i=0;i<digit[num].length;i++) {
		for(var j=0;j<digit[num][i].length;j++) {
			if(digit[num][i][j] == 1) {
				var aBall = {
					x:x+j*2*(RADIUS+1)+(RADIUS+1),
					y:y+i*2*(RADIUS+1)+(RADIUS+1),
					//加速度
					g:1.5+Math.random(),//[1.5,2.5]
					vx:Math.pow(-1,Math.ceil(Math.random()*1000))*4,//{-4,+4}
					vy:-5,
					color:colors[Math.floor(Math.random()*colors.length)],
				};
				balls.push(aBall);
			}
		}
	}
}

function render(cxt) {
	
	//clearRect对矩形空间里的图像进行刷新操作
	cxt.clearRect(0,0,WINDOW_WIDTH,WINDOW_HEIGHT);

	var hours = parseInt(curShowTimeSeconds/3600);
	var minutes = parseInt((curShowTimeSeconds-hours*3600)/60);
	var seconds = curShowTimeSeconds%60;

	//绘制小时
	renderDigit(MARGIN_LEFT,MARGIN_TOP,parseInt(hours/10),cxt);
	//14*(RADIUS+1)正好是一个数字的宽度，为了数字间有距离，所以改为15*
	renderDigit(MARGIN_LEFT+15*(RADIUS+1),MARGIN_TOP,parseInt(hours%10),cxt);
	//num取10，因为digit数组中‘：’的数组下标是10
	renderDigit(MARGIN_LEFT+30*(RADIUS+1),MARGIN_TOP,10,cxt);
	//绘制分钟，因为‘：’宽度，所以是30+9=39
	renderDigit(MARGIN_LEFT+39*(RADIUS+1),MARGIN_TOP,parseInt(minutes/10),cxt);
	renderDigit(MARGIN_LEFT+54*(RADIUS+1),MARGIN_TOP,parseInt(minutes%10),cxt);
	renderDigit(MARGIN_LEFT+69*(RADIUS+1),MARGIN_TOP,10,cxt);
	//绘制秒
	renderDigit(MARGIN_LEFT+78*(RADIUS+1),MARGIN_TOP,parseInt(seconds/10),cxt);
	renderDigit(MARGIN_LEFT+93*(RADIUS+1),MARGIN_TOP,parseInt(seconds%10),cxt);

	//绘制彩色球
	for(var i=0;i<balls.length;i++) {
		cxt.fillStyle = balls[i].color;
		cxt.beginPath();
		cxt.arc(balls[i].x,balls[i].y,RADIUS,0,2*Math.PI,true);
		cxt.closePath();
		cxt.fill();
	}
}

function renderDigit(x,y,num,cxt){
	cxt.fillStyle = "rgb(0,102,153)";
	for(var i=0;i<digit[num].length;i++){
		for(var j=0;j<digit[num][i].length;j++){
			if(digit[num][i][j]==1){
				cxt.beginPath();
				cxt.arc(x+j*2*(RADIUS+1)+(RADIUS+1),y+i*2*(RADIUS+1)+(RADIUS+1),RADIUS,0,2*Math.PI);
				cxt.closePath();

				cxt.fill();
			}
		}
	}
}