window.onload = function(){
	var consts = {
		reelLength: 80,
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
		console.log(controls.style.width, controls.style.height, controls.style.bottom, controls.style.left);
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
		if (game.active === true){
			reels.compose();
			reels.revolve();
		}	
	}
	controls.o = {
		credit: document.getElementById('credit'),
		betPerLine: document.getElementById('bet-per-line'),
		bet: document.getElementById('bet'),
	}

	var game = {
		credit: {
			val: 1000,
			refresh: function(){
				controls.o.credit.innerHtml = this.val;
			},
		},
		active: true,
		bet: {
			val: function(){
				return this.betPerLine * 5;
			},
			refresh:function(){
				controls.o.bet.innerHtml = this.val();
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
				if (this.val !== 0){
					this.val--
				}
			},
			refresh: function(){
				controls.o.betPerLine.innerHtml = this.val;
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
				reels.offset = (consts.reelLength - 3) * 200;
				game.render();
			}
		},
		reset: function(){
			this.credit.val = 1000;
			this.betPerLine.val = 1
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
		list: ['xs','lemons','cherries','oranges','plums','bars','stars','sevens','playtable'],
		xs : new Image(),
		lemons : new Image(),
		cherries : new Image(),
		oranges : new Image(),
		plums : new Image(),
		bars : new Image(),
		stars : new Image(),
		sevens : new Image(),
		playtable : new Image()
	};

	graphics.xs.src = 'img/xs.png';
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
		list: ['xs','lemons','cherries','oranges','plums','bars','stars','sevens'],
		cost: {
			xs: 5,
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
			xs: false
		},
		render: function(item, reel, y){
			//console.log(graphics[item], reel, y);		
			view.layer1.drawImage(graphics[item], 100 + (reel - 1) * consts.itemWidth + (reel - 1) * 25, y); // y: 165 - 1; 375 - 2; 565 - 3	
		}
	};

	reels = {
		blur: 0,
		sequence: [[],[],[]],
		offset: 1,
		generate: function(){
			var generated = [[],[],[]];
			for (var i = 0; i < 3; i++){
				for (k = 0; k < consts.reelLength; k++){
					var rand = Math.floor(Math.random() * 70);
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

						case (rand >= 69 && rand < 70):
						generated[i][k] = 7;
						break;
					}
				}
			};
			console.log(generated);
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
			reels.offset = 1;
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
			for (var k = 0; k < this.sequence[0].length; k++){
				console.log(k,': ', this.sequence[0][k],this.sequence[1][k],this.sequence[2][k]);
				if (k === this.sequence[0].length - 1){
					console.log('--------------------------------------');
				}
			};
		},
		revolve: function(){
			var interval;
			var fore = true;
			game.active = false;
			var range = (reels.sequence[0].length - 3) * 200;
			interval = setInterval(function(){
				//console.log(reels.offset, (reels.sequence[0].length - 3) * 200);
				if (reels.offset < range) {
					
					if (reels.offset < range/2 && fore === true){
						reels.offset+= Math.pow(reels.offset, 1/2);
					}
					else {
						fore = false;
						reels.offset+= Math.pow(range - reels.offset, 1/2);
						//console.log(reels.offset);
					}
				} else {
					clearInterval(interval);
					game.active = true;
				}
			}, 15)
			
		},
		render: function(){
			view.layer1.clearRect(0,0,1000,1000);
			for (var i = 0; i < 3; i++){
				for(var k = 0; k < reels.sequence[i].length; k++){
					items.render(items.list[reels.sequence[i][k]], i + 1, 200 - reels.offset + k * 200);

				}
			};
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

