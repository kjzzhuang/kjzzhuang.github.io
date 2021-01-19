function HideShow(){
	if(document.getElementById("instruction")){
		var instruction = document.getElementById("instruction");
		if (instruction.style.display === "none") {
			instruction.style.display = "block";
		} else {
			instruction.style.display = "none";
		}
	}else{
		var empty = document.getElementById("empty");
		empty.innerHTML = "不想知道就算了，哼哼"
	}
}

function Delete(){
	var instruction = document.getElementById("instruction");
	instruction.parentNode.removeChild(instruction);
    return false;
}

function Introo(){
	　window.open ('湊一下.html') 


}

$(document).ready(function () {
	var person = prompt("君の名は？", "");

	if (person != null) {
		document.getElementById("player_name").innerHTML =
			"嗨 " + person + "! 歡迎進入台大校園，在此您有機會遇見各種台大npc哦!";
	}
	/**
	* Global variables
	*/
	var completed = 0,
		imgHeight = 1100,
		posArr = [
			0, 		//結婚哥
			275, 	//水源阿伯
			550, 	//中閔
			825, 	//貓叫
			1100, 	//結婚哥
			1375, 	//水源阿伯
			1650, 	//中閔
			1925, 	//貓叫
		];

	var win = [];
	win[0] = win[1100] = 1;
	win[275] = win[1375] = 2;
	win[550] = win[1650] = 3;
	win[825] = win[1925] = 4;

	/**
	* @class Slot
	* @constructor
	*/
	function Slot(el, max, step) {
		this.speed = 0; //speed of the slot at any point of time
		this.step = step; //speed will increase at this rate
		this.si = null; //holds setInterval object for the given slot
		this.el = el; //dom element of the slot
		this.maxSpeed = max; //max speed this slot can have
		this.pos = null; //final position of the slot	
		if (el == '#slot2') {
			$(el).pan({
				fps: 30,
				dir: 'up'
			});
		} else {
			$(el).pan({
				fps: 30,
				dir: 'down'
			});
		}
		$(el).spStop();
	}

	/**
	* @method start
	* Starts a slot
	*/
	Slot.prototype.start = function () {
		var _this = this;
		$(_this.el).addClass('motion');
		$(_this.el).spStart();
		_this.si = window.setInterval(function () {
			if (_this.speed < _this.maxSpeed) {
				_this.speed += _this.step;
				$(_this.el).spSpeed(_this.speed);
			}
		}, 100);
	};

	/**
	* @method stop
	* Stops a slot
	*/
	Slot.prototype.stop = function () {
		var _this = this,
			limit = 30;
		clearInterval(_this.si);
		_this.si = window.setInterval(function () {
			if (_this.speed > limit) {
				_this.speed -= _this.step;
				$(_this.el).spSpeed(_this.speed);
			}
			if (_this.speed <= limit) {
				_this.finalPos(_this.el);
				$(_this.el).spSpeed(0);
				$(_this.el).spStop();
				clearInterval(_this.si);
				$(_this.el).removeClass('motion');
				_this.speed = 0;
			}
		}, 100);
	};

	/**
	* @method finalPos
	* Finds the final position of the slot
	*/
	Slot.prototype.finalPos = function () {
		var el = this.el,
			el_id,
			pos,
			posMin = 2000000000,
			best,
			bgPos,
			i,
			j,
			k;

		el_id = $(el).attr('id');
		//pos = $(el).css('background-position'); //for some unknown reason, this does not work in IE
		pos = document.getElementById(el_id).style.backgroundPosition;
		pos = pos.split(' ')[1];
		pos = parseInt(pos, 10);

		for (i = 0; i < posArr.length; i++) {
			for (j = 0; ; j++) {
				k = posArr[i] + (imgHeight * j);
				if (k > pos) {
					if ((k - pos) < posMin) {
						posMin = k - pos;
						best = k;
						this.pos = posArr[i]; //update the final position of the slot
					}
					break;
				}
			}
		}

		best += imgHeight + 4;
		bgPos = "0 " + best + "px";
		$(el).animate({
			backgroundPosition: "(" + bgPos + ")"
		}, {
			duration: 200,
			complete: function () {
				completed++;
			}
		});
	};

	/**
	* @method reset
	* Reset a slot to initial state
	*/
	Slot.prototype.reset = function () {
		var el_id = $(this.el).attr('id');
		$._spritely.instances[el_id].t = 0;
		$(this.el).css('background-position', '0px 4px');
		this.speed = 0;
		completed = 0;
		$('#result').html('');
	};

	function enableControl() {
		$('#control').attr("disabled", false);
	}

	function disableControl() {
		$('#control').attr("disabled", true);
	}

	function printResult() {
		var res;
		
		if (win[a.pos] === win[b.pos]) {
			if(1){
				res = person + ",恭喜你遇見求婚哥，若能答應他的請求，便能看見求婚哥欣喜若狂！";
			}
			else if(2){
				res = person + ",恭喜你遇見水源阿伯，請至水源拖吊場認領您的腳踏車。";
			}
			else if(3){
				res = person + "，恭喜您遇見管爺，管爺將發給您畢業證書，讓您提前登出台大！";
			}
			else if(4){
				res = person + "，恭喜您遇見貓叫阿嬤，若跟他一起學貓叫，將獲得貓叫阿嬤的白眼乙次。";
			}

		} else {
			res = person + "您沒有遇見任何npc...不要沮喪，也許是好事呢";
		}
		$('#result').html(res);
	}

	//create slot objects
	var a = new Slot('#slot1', 30, 1),
		b = new Slot('#slot2', 45, 2);

	/**
	* Slot machine controller
	*/

	$('#start').click(function () {
		var x;
		a.start();
		b.start();

		disableControl(); //disable control until the slots reach max speed

		//check every 100ms if slots have reached max speed 
		//if so, enable the control
		x = window.setInterval(function () {
			if (a.speed >= a.maxSpeed && b.speed >= b.maxSpeed) {
				enableControl();
				window.clearInterval(x);
			}
		}, 100);
	});


	$('#stop').click(function () {
		var x;
		a.stop();
		b.stop();
		disableControl(); //disable control until the slots stop

		//check every 100ms if slots have stopped
		//if so, enable the control
		x = window.setInterval(function () {
			if (a.speed === 0 && b.speed === 0) {
				enableControl();
				window.clearInterval(x);
				printResult();
			}
		}, 100);
	}
	);


});
