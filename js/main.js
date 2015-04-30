window.onload = function(){
	var consts = {
		reelLength: 70,
		itemWidth: 250,
	};

	var controls = document.getElementById('controls'); //Позиционирование блока контроля
	controls.set = function(){
		var box = document.getElementById('canvas-0');
		controls.style.width = box.offsetWidth + 'px'; 
		controls.style.height = 0.16 * box.offsetWidth + 'px';
		controls.style.bottom = box.getBoundingClientRect().bottom - box.offsetWidth + 'px';
		controls.style.left = box.getBoundingClientRect().left + 'px';
		controls.style.fontSize = 0.05 * box.offsetWidth + 'px';
	};
	controls.set();
	window.onresize = function(){
		controls.set();
	};
	controls.i = {
		autoplay: document.getElementById('autoplay'),
		betIncrease: document.getElementById('bet-increase'),
		betDecrease: document.getElementById('bet-decrease'),
		start: document.getElementById('start'),
		playtable: document.getElementById('playtable')
	};
	controls.i.start.onclick = function(){
		if (game.active === true && game.credit.val > 0){
			var bet = game.bet.val();
			game.credit.chahge(- bet);
			reels.compose();
			reels.revolve();
		}	
	};
	controls.i.betIncrease.onclick = function(){
		game.betPerLine.increase();
	};
	controls.i.betDecrease.onclick = function(){
		game.betPerLine.decrease();
	};
	controls.i.autoplay.onclick = function(){
		console.log(reels.lines.check());
	};
	controls.o = {
		credit: document.getElementById('credit'),
		betPerLine: document.getElementById('bet-per-line'),
		bet: document.getElementById('bet'),
	}

	var game = {
		credit: {
			val: 1000,
			refresh: function(){
				controls.o.credit.innerHTML = game.credit.val;
			},
			chahge: function(d){
				game.credit.val+=d;	
			}
		},
		active: true,
		bet: {
			val: function(){
				return game.betPerLine.val * 5;
			},
			refresh:function(){
				controls.o.bet.innerHTML = this.val();
			}
		},
		betPerLine: {
			val: 1,
			increase: function(){
				if (this.val !== 10){
					this.val++
				}
			},
			decrease: function(){
				if (this.val !== 1){
					this.val--
				}
			},
			refresh: function(){
				controls.o.betPerLine.innerHTML = this.val;
			}
		},
		refresh: function(){
			this.credit.refresh();
			this.bet.refresh();
			this.betPerLine.refresh();
		},
		start: function(){
			if (this.active === true){
				this.reset();
				reels.compose();
				reels.offset[0] = ((consts.reelLength - 3) * 200);
				reels.offset[1] = ((consts.reelLength - 3) * 200);
				reels.offset[2] = ((consts.reelLength - 3) * 200);
				game.render();
			}
		},
		reset: function(){
			game.credit.val = 1000;
			game.betPerLine.val = 1;
		},
		render: function(){
			reels.render();
			game.refresh();
			requestAnimationFrame(game.render);
		}
	};

	(function() {
	 	var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
		window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
		window.requestAnimationFrame = requestAnimationFrame;
	})();

	

	Object.size = function(obj) {
	    var size = 0, key;
	    for (key in obj) {
	        if (obj.hasOwnProperty(key)) size++;
	    }
	    return size;
	};
	
	var graphics = {	
		list: ['lemons','cherries','oranges','plums','bars','stars','sevens','playtable'],
		lemons : new Image(),
		cherries : new Image(),
		oranges : new Image(),
		plums : new Image(),
		bars : new Image(),
		stars : new Image(),
		sevens : new Image(),
		playtable : new Image()
	};

	graphics.lemons.src = 'img/lemons.png';
	graphics.cherries.src = 'img/cherries.png';
	graphics.oranges.src = 'img/oranges.png';
	graphics.plums.src = 'img/plums.png';
	graphics.bars.src = 'img/bars.png';
	graphics.stars.src = 'img/stars.png';	
	graphics.sevens.src = 'img/sevens.png';
	graphics.playtable.src = 'img/playtable.png';

	var view = {
		layer1: document.getElementById('canvas-0').getContext('2d'),
		layer2: document.getElementById('canvas-1').getContext('2d')
	};
	items = {
		list: ['lemons','cherries','oranges','plums','bars','stars','sevens'],
		cost: {
			lemons: 40,
			cherries: 40,
			oranges: 40,
			plums:40,
			bars: 100,
			stars: 200,
			sevens: 750
		},
		x2: {
			lemons: true,
			cherries: true,
			oranges: true,
			plums:true,
			sevens: false,
			stars: false,
			bars: false,
		},
		render: function(item, reel, y){
			//console.log(graphics[item], reel, y);		
			view.layer1.drawImage(graphics[item], 100 + (reel - 1) * consts.itemWidth + (reel - 1) * 25, y); // y: 165 - 1; 375 - 2; 565 - 3	
		}
	};

	reels = {
		blur: 0,
		lines: {
			matched: false,
			check: function(){
				matched = [];
				var actual = reels.getActual();
				console.log((actual[0][2] == actual[1][1] && actual[0][2] === actual[2][0]));
				if (actual[0][0] === actual[1][0] && actual[0][0] === actual[2][0]){matched.push(5)}
				if (actual[0][0] === actual[1][1] && actual[0][0] === actual[2][2]){matched.push(4)}
				if (actual[0][1] === actual[1][1] && actual[0][1] === actual[2][1]){matched.push(3)}
				if (actual[0][2] === actual[1][1] && actual[0][2] === actual[2][0]){matched.push(2)}
				if (actual[0][2] === actual[1][2] && actual[0][2] === actual[2][2]){matched.push(1)};	

				if (matched.length == 0){
					matched = false;
				};
				this.matched = matched;
				return matched;
			},
			render: function(){
				console.log('im gonna render lines');
				view.layer2.shadowColor = '#000';
			    view.layer2.shadowBlur = 0;
			    view.layer2.shadowOffsetX = 0;
			    view.layer2.shadowOffsetY = 4;
			    view.layer2.strokeStyle = '#04756f';
				if (reels.lines.matched !== false){
					if (this.matched.indexOf(1) > -1 ){
						view.layer2.beginPath();
					    view.layer2.moveTo(100, 350);
					    view.layer2.lineTo(895, 350);
					    view.layer2.lineWidth = 15;
					    view.layer2.stroke();
					};
					if (this.matched.indexOf(2) > -1 ){
						view.layer2.beginPath();
					    view.layer2.moveTo(100, 250);
					    view.layer2.lineTo(200, 250);
					    view.layer2.lineTo(795, 750);
					    view.layer2.lineTo(895, 750);
					    view.layer2.lineJoin = 'bevel';
					    view.layer2.lineWidth = 15;
					    view.layer2.stroke();
					};
					if (this.matched.indexOf(3) > -1 ){
						view.layer2.beginPath();
					    view.layer2.moveTo(100, 500);
					    view.layer2.lineTo(895, 500);
					    view.layer2.lineWidth = 15;
					    view.layer2.stroke();
					};
					if (this.matched.indexOf(4) > -1 ){
						view.layer2.beginPath();
					    view.layer2.moveTo(100, 750);
					    view.layer2.lineTo(200, 750);
					    view.layer2.lineTo(795, 250);
					    view.layer2.lineTo(895, 250);
					    view.layer2.lineWidth = 15;
					    view.layer2.stroke();
					};
					if (this.matched.indexOf(5) > -1 ){
						view.layer2.beginPath();
					    view.layer2.moveTo(100, 650);
					    view.layer2.lineTo(895, 650);
					    view.layer2.lineWidth = 15;
					    view.layer2.stroke();
					};
				}
			}
		},
		sequence: [[],[],[]],
		offset: [],
		generate: function(){
			var generated = [[],[],[]];
			for (var i = 0; i < 3; i++){
				for (k = 0; k < consts.reelLength; k++){
					var rand = Math.floor(Math.random() * 69);
					switch (true) {
						case (rand >=  0 && rand < 20):
						generated[i][k] = 0;
						break;

						case (rand >= 20 && rand < 30):
						generated[i][k] = 1;
						break;

						case (rand >= 30 && rand < 40):
						generated[i][k] = 2;
						break;

						case (rand >= 40 && rand < 50):
						generated[i][k] = 3;
						break;

						case (rand >= 50 && rand < 60):
						generated[i][k] = 4;
						break;

						case (rand >= 60 && rand < 67):
						generated[i][k] = 5;
						break;

						case (rand >= 67 && rand < 69):
						generated[i][k] = 6;
						break;
					}
				}
			};
			//console.log(generated);
			return generated;
		},
		getActual: function(){
			var actual = [[],[],[]]
			for (var i = 0; i < 3; i++){
				for (var k = this.sequence[i].length - 1; k >= this.sequence[i].length -3; k--){
					actual[i][k - (this.sequence[i].length -3)] = this.sequence[i][k];
				}
			};
			return actual;
		},
		compose: function(){
			reels.offset = [1,1,1];
			var attachable = this.generate();
			if (this.sequence[0].length !== 0){
				var actual = this.getActual();
				for (var i = 0; i < 3; i++){
					for (var k = this.sequence[i].length - 1; k >= this.sequence[i].length -3; k--){
						actual[i][k - (this.sequence[i].length -3)] = this.sequence[i][k];
					}
				};
				this.sequence = [[],[],[]];
				for (var i = 0; i < attachable.length; i++){
					for (var k = 0; k < actual[i].length; k++){
						this.sequence[i][k] = actual[i][k]
					}
				}
				for (var i = 0; i < attachable.length; i++){
					for (var k = 3; k < attachable[i].length + 3; k++){
						this.sequence[i][k] = attachable[i][k - 3];
					}
				}
			} else {
				this.sequence = attachable;
			};
			//for (var k = 0; k < this.sequence[0].length; k++){
			//	console.log(k,': ', this.sequence[0][k],this.sequence[1][k],this.sequence[2][k]);
			//	if (k === this.sequence[0].length - 1){
			//		console.log('--------------------------------------');
			//	}
			//};
		},
		revolve: function(){
			var interval;
			var fore = [true, true, true];
			reels.matched = false;
			view.layer2.clearRect(0,0,1000,1000);
			game.active = false;
			var range = (reels.sequence[0].length - 3) * 200;
			interval = setInterval(function(){
				//console.log(reels.offset[0], reels.offset[1], reels.offset[2]);
				if (reels.offset[0] < range || reels.offset[1] < range || reels.offset[2] < range) {
					for (var i = 0; i < 3; i++){
						//console.log(reels.offset[i], (reels.sequence[0].length - 3) * 200);
						if (reels.offset[i] < range/2 && fore[i]){
							reels.offset[i]+= Math.pow(reels.offset[i], 1/(1.7 + (i+1) * 0.1));
						}
						else if (reels.offset[i] >= range/2 && reels.offset[i] < range) {
							fore[i] = false;
							reels.offset[i]+= Math.pow(range - reels.offset[i], 1/(1.7 + (i+1) * 0.1));
							//console.log(reels.offset);
						} else if (reels.offset[i] >= range){
							reels.offset[i] = range
						}
					}
				} else {
					clearInterval(interval);
					if (reels.lines.check() !== false){
						reels.lines.render();
					};	
					game.active = true;
				}
			}, 20)
			
		},
		render: function(){
			view.layer1.clearRect(0,0,1000,1000);
			for (var i = 0; i < 3; i++){
				for(var k = reels.sequence[i].length - 1; k >=0 ; k--){
					items.render(items.list[reels.sequence[i][k]], i + 1, 600 + reels.offset[i] - k * 200);

				}
			};
		}
	};

	reels.offset.set = function(val){
		for (var i = 0; i < this.length; i++){
			this[i] = val;
		}
	};
	

	init = function(){
		game.start();
	};
	

	var imageCount = Object.size(graphics);
	var imagesLoaded = 0;
	for(var i = 0; i < imageCount - 1; i++){
	    graphics[graphics.list[i]].onload = function(){
	        imagesLoaded++;
	        if(imagesLoaded == imageCount - 1){
	        	console.log('Images are loaded');
	            init();
	        }
	    }
	};

	function step(timestamp) {
	  	var progress = timestamp - start;
	  	d.style.left = Math.min(progress/10, 200) + "px";
	  	if (progress < 2000) {
	   
	  }
	}
	requestAnimationFrame(game.render);
}

