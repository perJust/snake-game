var wrapper = document.getElementById('wrapper');
var ul = document.getElementsByTagName('ul');
var li = ul[0].getElementsByTagName('li');
var btn = document.getElementsByClassName('btn');
var gameover = document.getElementsByClassName('gameover');
var close = gameover[0].getElementsByClassName('close');
var score = wrapper.getElementsByClassName('score');
this.len = li.length;

function init() {
	this.loc = [['header',30,0],['body',20,0],['body',10,0],['body',0,0]];	
	for(var i = 0;i<this.len;i++){
		li[i].style.left = this.loc[i][1] + 'px';
		li[i].style.top =  this.loc[i][2]+ 'px';
	}
	this.liW = this.li[0].offsetWidth;
	this.liH = this.li[0].offsetHeight;
	this.ulW = this.ul[0].offsetWidth;
	this.ulH = this.ul[0].offsetHeight;
	this.speedL = 10;
	this.speedT = 0;
	this.initDrect = 'right';//除了right方向，其他方向方法设计有问题
	// this.dre = 1;
	this.run = [];
	this.runHead = [];
	this.concatLeft = 0;
	this.concatTop = 0;
	this.gameControlBoolean = true;
	this.runLimitLeft = parseInt(this.ul[0].offsetWidth) - 10;
	this.runLimitTop = parseInt(this.ul[0].offsetHeight) - 10;
	this.newFood = null;
	this.foodLeft = 0;
	this.foodTop = 0;
	this.grade = 0;
	score[0].innerHTML = 0;//初始化分数
	document.addEventListener('keydown',drect,false);
}
init();
runInit();

var drectJug = {	//这一步是存的上下左右对应的相对值，即left的keyCode为37,但是对应的值为right的keyCode值
	"left":39,
	"top":40,
	"right":37,
	"down":38,
}
function move() {
	var  L = this.run[0][0] + this.speedL;
	var  T = this.run[0][1] + this.speedT;
	this.runHead.push(L);
	this.runHead.push(T);
	this.runLeft = L;
	this.runTop = T;

	this.runSecondLeft = this.run[1][0];//这两步保存第一节body的值，用于赋予食物被吃时的瞬间给值
	this.runSecondTop = this.run[1][1];

	this.run.map(function (data,ind){
		this.li[ind].style.left = data[0] +'px';
		this.li[ind].style.top = data[1] +'px';
	});
	this.run.splice(this.run.length-1,1);
	this.run.unshift(this.runHead);
	this.runHead = [];
}
function runInit() {
	this.run = this.loc.map((val) => {
		var run = [];
		run.push(val[1]);
		run.push(val[2]);
		return run
	});
	randomFood();
}
function foodInit() {
	// this.newFood.style.backgroundColor = "";		
	var len = li.length;
	if(len>4){
		for(var i = len-1;i>=4;i--){ //从外往里删，因为下面是实时更新的，一旦从内往外删，最后就会找不到元素而报错
			ul[0].removeChild(ul[0].childNodes[i]);//childNodes是表示所有子节点，还包括文本节点回车符，所以html写在一起了
													//有任何的回车符，空格都算文本节点，还有注释节点
		} //除了这种父级销毁子级li的方法，还可以自我销毁，使用remove方法
		  //li[i].remove()
	}
}
function runAdd() {
	var m = [];
	// m.push(this.foodLeft);//有bug
	// m.push(this.foodTop);
	m.push(this.runSecondLeft); //为啥不保存食物本身的坐标给run，因为runLimitCheck中判断head是否触碰到body时，如果保存事物本身的坐标，那么判断语句一定得出结论head碰到了body，因为当食物被吃的一瞬间，食物坐标就是和head坐标一样
	m.push(this.runSecondTop);
	this.run.push(m);
}
function drect(e) {
	// console.log(e.which);
	var event = e || window.event;
	var key = e.keyCode == drectJug[window.initDrect]?null:e.keyCode; //判断按下的键与上一次的方向相反，相反的话就不做处理为null
	switch(key){
	case 37:window.speedL=-10;window.speedT=0;window.initDrect="left";break;
	case 38:window.speedL=0;window.speedT=-10;window.initDrect="top";break;
	case 39:window.speedL=10;window.speedT=0;window.initDrect="right";break;
	case 40:window.speedL=0;window.speedT=10;window.initDrect="down";break;
	default :;
	}
	// console.log(this.speedT);//undefined
}
function runLimitCheck() {
	//判断是否碰到边界
	if (this.runLeft>this.runLimitLeft||this.runTop>this.runLimitTop||this.runLeft<0||this.runTop<0) {
		gradeBoard();
	};

	//判断是否吃到食物
	if(this.runLeft == this.foodLeft&&this.runTop == this.foodTop){
		this.newFood.style.backgroundColor = "";
		// var m = ["body"];
		// m.push(this.foodLeft);
		// m.push(this.foodTop);
		// this.loc.push(m);
		runAdd();
		randomFood();
		getGrade(score[0],true);
	}

	//判断head是否碰到body
	this.run.map((val,ind) => {
		// console.log(ind,'12123123');
		if(ind == 0){
			this.concatLeft = val[0],this.concatTop = val[1];
		}
		if(ind > 3){ //写在这里的bug，就是因为刚吃到食物时，食物的坐标和head一样，导致立即弹出框结束
			var jug = val[0] == this.concatLeft?(val[1] == this.concatTop?true:false):false;
			if(jug){
				gradeBoard();
			}
		}
	});
}
function pauseGame() {
	window.clearInterval(window.action);
	document.removeEventListener('keydown',drect,false);	
}
function removeBtnEvent(argument) {
	btn[0].removeEventListener('click',gameControl,false);
	btn[1].removeEventListener('click',restartGame,false);
}

function reInit() {
	foodInit();
	init();
	runInit();
	// window.gameControlBoolean = false;
	// btn[0].innerHTML = '暂停游戏';
	// window.clearInterval(window.action);
	// window.action = window.setInterval(game,100);
	gameToggle(this.gameControlBoolean);
}
function gameToggle(state) {
	if(state){
		window.clearInterval(window.action);
		document.addEventListener('keydown',drect,false);	
		window.gameControlBoolean = false;
		window.action = window.setInterval(game,100);
		btn[0].innerHTML = '暂停游戏';
	} else {
		pauseGame();
		window.gameControlBoolean = true;
		btn[0].innerHTML = '开始游戏';
	}
}
function gameControl() {
	gameToggle(window.gameControlBoolean);
}
function restartGame() {
	reInit();
}
function randomFood() {
	this.newFood = document.createElement('li');
	this.foodLeft = Math.floor(Math.random()*this.ulW/this.liW)*this.liW;
	this.foodTop = Math.floor(Math.random()*this.ulH/this.liH)*this.liH;
	ul[0].appendChild(this.newFood);
	this.newFood.style.left = this.foodLeft + "px";
	this.newFood.style.top = this.foodTop + "px";
	this.newFood.style.backgroundColor = "red";
}
function getGrade(elem,bool) { //多一位参数用来增加条件，什么时候可以加分数后再读取，什么时候不用加分数只是读取分数
	if(bool){
		this.grade ++;
		elem.innerHTML = this.grade;		
	}else{
		elem.innerHTML = this.grade;			
	}
}
function gradeBoard() {
	this.gameover[0].style.display = 'block';
	pauseGame();
	removeBtnEvent();
	getGrade(score[1],false);
}

function game() {
	move();
	runLimitCheck();
}
// var action = window.setInterval(game,100);

close[0].addEventListener('click',function(e){
	var  event = e|| window.event;
	event.stopPropagation();
	window.gameover[0].style.display = 'none';
	reInit();
	btn[0].addEventListener('click',gameControl,false);
	btn[1].addEventListener('click',restartGame,false);
},false);

btn[0].addEventListener('click',gameControl,false);
btn[1].addEventListener('click',restartGame,false);