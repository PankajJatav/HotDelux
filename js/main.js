window.onload = function(){

	//RAF---------------------------------------------------------------------------------------------

	(function() {
	 	var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
		window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
		window.requestAnimationFrame = requestAnimationFrame;
	})();

	//Config------------------------------------------------------------------------------------------
	
	config = {
		reelLength:15,
		renderResolution: 800,
		probabilities: {
			lemons : 20,
			cherries : 20,
			oranges : 20,
			plums : 20,
			bars : 10,
			stars : 5,
			sevens : 2
		}
	};

	//View--------------------------------------------------------------------------------------------
	
	view = {
		canvas0: document.getElementById('canvas-0'),
		canvas1: document.getElementById('canvas-1'),
		layer0 : document.getElementById('canvas-0').getContext('2d'),
		layer1 : document.getElementById('canvas-1').getContext('2d')
	};

	view.canvas0.width = config.renderResolution;
	view.canvas0.height = view.canvas0.width;
	view.canvas1.width = view.canvas0.width;
	view.canvas1.height = view.canvas0.height

	view.layer1.shadowColor = '#222';
    view.layer1.shadowBlur = 0;
    view.layer1.shadowOffsetX = 0;
    view.layer1.strokeStyle = '#04756f';

	//controls----------------------------------------------------------------------------------------
	
	controls = document.getElementById('controls'); 
	controls.set = function(){
		controls.style.width = view.canvas0.offsetWidth + 'px'; 
		controls.style.height = 0.16 * view.canvas0.offsetWidth + 'px';
		controls.style.bottom = view.canvas0.getBoundingClientRect().bottom - view.canvas0.offsetWidth + 'px';
		controls.style.left = view.canvas0.getBoundingClientRect().left + 'px';
		controls.style.fontSize = 0.05 * view.canvas0.offsetWidth + 'px';
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
			game.credit.change(- bet);
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
		
	};
	controls.i.playtable.onclick = function(){
		game.playtable.show();
	}
	controls.o = {
		credit: document.getElementById('credit'),
		betPerLine: document.getElementById('bet-per-line'),
		bet: document.getElementById('bet'),
	}

	//Game-------------------------------------------------------------------------------------------
	
	game = {
		credit: {
			val: 1000,
			refresh: function(){
				controls.o.credit.innerHTML = game.credit.val;
			},
			change: function(d){
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
				reels.offset[0] = ((config.reelLength - 3) * 200);
				reels.offset[1] = ((config.reelLength - 3) * 200);
				reels.offset[2] = ((config.reelLength - 3) * 200);
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
		},
		playtable: {
			interval: '',
			shown: false,
			show: function(){
				console.log('dsfsdf');
				if(!this.shown){
					this.shown = true;
					var offset = 1;
					factor = config.renderResolution/1000;
					this.interval = setInterval(function(){
						if (offset <= 700 * factor){
							view.layer1.drawImage(graphics.playtable, 0, 0, 1000, offset * factor * 2, 0, 150 * factor, 1000 * factor, offset);
							offset+=10
						} else {
							clearInterval(game.playtable.interval);
						}
					}, 10)
				} else {
					this.shown = false;
					view.layer1.clearRect(0,0, config.renderResolution, config.renderResolution)
				}
			}
		}
	};
	
	//Images---------------------------------------------------------------------------------------------
	
	graphics = {	
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

	Object.size = function(obj) {
	    var size = 0, key;
	    for (key in obj) {
	        if (obj.hasOwnProperty(key)) size++;
	    }
	    return size;
	};

	var imageCount = Object.size(graphics);
	var imagesLoaded = 0;
	for(var i = 0; i < imageCount - 1; i++){
	    graphics[graphics.list[i]].onload = function(){
	        imagesLoaded++;
	        if(imagesLoaded == imageCount - 1){
	        	console.log('Images are loaded');
	            game.start();
	        }
	    }
	};

	//Items---------------------------------------------------------------------------------------------
	
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
			var factor = config.renderResolution/1000;
			view.layer0.drawImage(graphics[item], 100 * factor + (reel - 1) * 250 * factor + (reel - 1) * 25 * factor, y * factor, 250 * factor, 200 * factor); // y: 165 - 1; 375 - 2; 565 - 3	
		},
		getProbability : function(item, upper){
			var limit = config.probabilities[item];
			for (var i = 0; i < items.list.indexOf(item); i++){
				limit+=config.probabilities[items.list[i]];
			}
			if (upper === false){
				limit-=config.probabilities[item];
			};
			return limit;
		}
	};

	//Reels---------------------------------------------------------------------------------------------
	
	reels = {
		blur: 0,
		lines: {
			interval: '',
			matched: false,
			check: function(){
				matched = [];
				var bet = game.betPerLine.val;
				var actual = reels.getActual();
				if (actual[0][0] === actual[1][0] && actual[0][0] === actual[2][0]){
					matched.push(5);
					game.credit.change(bet * items.cost[items.list[actual[0][0]]]);
				}
				if (actual[0][0] === actual[1][1] && actual[0][0] === actual[2][2]){
					matched.push(4);
					game.credit.change(bet * items.cost[items.list[actual[0][0]]]);
				}
				if (actual[0][1] === actual[1][1] && actual[0][1] === actual[2][1]){
					matched.push(3);
					game.credit.change(bet * items.cost[items.list[actual[0][1]]]);
				}
				if (actual[0][2] === actual[1][1] && actual[0][2] === actual[2][0]){
					matched.push(2);
					game.credit.change(bet * items.cost[items.list[actual[0][2]]]);
				}
				if (actual[0][2] === actual[1][2] && actual[0][2] === actual[2][2]){
					matched.push(1);
					game.credit.change(bet * items.cost[items.list[actual[0][2]]]);
				};	

				if (matched.length == 0){
					matched = false;
				};
				this.matched = matched;
				return matched;
			},
			render: function(){
				var factor = config.renderResolution/1000;
				view.layer1.shadowOffsetY = 4 * factor;
				if (this.matched.indexOf(1) > -1 ){
					view.layer1.beginPath();
				    view.layer1.moveTo(100 * factor, 350 * factor);
				    view.layer1.lineTo(895 * factor, 350 * factor);
				    view.layer1.lineWidth = 15 * factor;
				    view.layer1.stroke();
				};
				if (this.matched.indexOf(2) > -1 ){
					view.layer1.beginPath();
				    view.layer1.moveTo(100 * factor, 250 * factor);
				    view.layer1.lineTo(200 * factor, 250 * factor);
				    view.layer1.lineTo(795 * factor, 750 * factor);
				    view.layer1.lineTo(895 * factor, 750 * factor);
				    view.layer1.lineJoin = 'bevel';
				    view.layer1.lineWidth = 15 * factor;
				    view.layer1.stroke();
				};
				if (this.matched.indexOf(3) > -1 ){
					view.layer1.beginPath();
				    view.layer1.moveTo(100 * factor, 500 * factor);
				    view.layer1.lineTo(895 * factor, 500 * factor);
				    view.layer1.lineWidth = 15 * factor;
				    view.layer1.stroke();
				};
				if (this.matched.indexOf(4) > -1 ){
					view.layer1.beginPath();
				    view.layer1.moveTo(100 * factor, 750 * factor);
				    view.layer1.lineTo(200 * factor, 750 * factor);
				    view.layer1.lineTo(795 * factor, 250 * factor);
				    view.layer1.lineTo(895 * factor, 250 * factor);
				    view.layer1.lineWidth = 15 * factor;
				    view.layer1.stroke();
				};
				if (this.matched.indexOf(5) > -1 ){
					view.layer1.beginPath();
				    view.layer1.moveTo(100 * factor, 650 * factor);
				    view.layer1.lineTo(895 * factor, 650 * factor);
				    view.layer1.lineWidth = 15 * factor;
				    view.layer1.stroke();
				};
			}
		},
		sequence: [[],[],[]],
		offset: [],
		generate: function(){
			var generated = [[],[],[]];
			var sum = 0;
			for (var i = 0; i < items.list.length; i++){
				sum+=config.probabilities[items.list[i]];
				console.log(i, items.getProbability(items.list[i], false), items.getProbability(items.list[i], true) )
			};
			console.log(sum);
			for (var i = 0; i < 3; i++){
				for (k = 0; k < config.reelLength; k++){
					var rand = Math.floor(Math.random() * sum);
					switch (true) {
						case (rand >= items.getProbability(items.list[0], false) && rand < items.getProbability(items.list[0], true)):
						generated[i][k] = 0;
						break;

						case (rand >= items.getProbability(items.list[1], false) && rand < items.getProbability(items.list[1], true)):
						generated[i][k] = 1;
						break;

						case (rand >= items.getProbability(items.list[2], false) && rand < items.getProbability(items.list[2], true)):
						generated[i][k] = 2;
						break;

						case (rand >= items.getProbability(items.list[3], false) && rand < items.getProbability(items.list[3], true)):
						generated[i][k] = 3;
						break;

						case (rand >= items.getProbability(items.list[4], false) && rand < items.getProbability(items.list[4], true)):
						generated[i][k] = 4;
						break;

						case (rand >= items.getProbability(items.list[5], false) && rand < items.getProbability(items.list[5], true)):
						generated[i][k] = 5;
						break;

						case (rand >= items.getProbability(items.list[6], false) && rand <= items.getProbability(items.list[6], true)):
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
		},
		revolve: function(){
			var interval;
			var fore = [true, true, true];
			reels.matched = false;
			clearInterval(reels.lines.interval);
			view.layer1.clearRect(0,0,1000,1000);
			game.active = false;
			var range = (reels.sequence[0].length - 3) * 200;
			interval = setInterval(function(){
				//console.log(reels.offset[0], reels.offset[1], reels.offset[2]);
				if (reels.offset[0] < range || reels.offset[1] < range || reels.offset[2] < range) {
					for (var i = 0; i < 3; i++){
						//console.log(reels.offset[i], (reels.sequence[0].length - 3) * 200);
						if (reels.offset[i] < range/2 && fore[i]){
							reels.offset[i]+= Math.pow(reels.offset[i], 1/1.8);
						}
						else if (reels.offset[i] >= range/2 && reels.offset[i] < range) {
							fore[i] = false;
							reels.offset[i]+= Math.pow(range - reels.offset[i], 1/(1.6 + (i+1) * 0.2));
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
			}, 10)
			
		},
		render: function(){
			view.layer0.clearRect(0,0, config.renderResolution, config.renderResolution);
			for (var i = 0; i < 3; i++){
				for(var k = reels.sequence[i].length - 1; k >=0 ; k--){
					//console.log(i, k, reels.sequence[i][k], items.list[reels.sequence[i][k]]);
					items.render(items.list[reels.sequence[i][k]], i + 1, 600 + reels.offset[i] - k * 200);

				}
			};
		}
	};
	
	requestAnimationFrame(game.render);
}

