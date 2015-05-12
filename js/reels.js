'use strict';
define(['items', 'config/config', 'canvas', 'game', 'server'], function(items, config, view, game, server){
	var reels = {
		//blur: 0,
		lines: {
			interval: '',
			matched: false,
			check: function(){
				var matched = [];
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
				}

				if (matched.length === 0){
					matched = false;
				}
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
				}
				if (this.matched.indexOf(2) > -1 ){
					view.layer1.beginPath();
				    view.layer1.moveTo(100 * factor, 250 * factor);
				    view.layer1.lineTo(200 * factor, 250 * factor);
				    view.layer1.lineTo(795 * factor, 750 * factor);
				    view.layer1.lineTo(895 * factor, 750 * factor);
				    view.layer1.lineJoin = 'bevel';
				    view.layer1.lineWidth = 15 * factor;
				    view.layer1.stroke();
				}
				if (this.matched.indexOf(3) > -1 ){
					view.layer1.beginPath();
				    view.layer1.moveTo(100 * factor, 500 * factor);
				    view.layer1.lineTo(895 * factor, 500 * factor);
				    view.layer1.lineWidth = 15 * factor;
				    view.layer1.stroke();
				}
				if (this.matched.indexOf(4) > -1 ){
					view.layer1.beginPath();
				    view.layer1.moveTo(100 * factor, 750 * factor);
				    view.layer1.lineTo(200 * factor, 750 * factor);
				    view.layer1.lineTo(795 * factor, 250 * factor);
				    view.layer1.lineTo(895 * factor, 250 * factor);
				    view.layer1.lineJoin = 'bevel';
				    view.layer1.lineWidth = 15 * factor;
				    view.layer1.stroke();
				}
				if (this.matched.indexOf(5) > -1 ){
					view.layer1.beginPath();
				    view.layer1.moveTo(100 * factor, 650 * factor);
				    view.layer1.lineTo(895 * factor, 650 * factor);
				    view.layer1.lineWidth = 15 * factor;
				    view.layer1.stroke();
				} 
			}
		},
		sequence: [[],[],[]],
		offset: [(config.reelLength - 3) * 200, (config.reelLength - 3) * 200, (config.reelLength - 3) * 200],
		generate: function(){
			var generated = [[],[],[]];
			var sum = 0;
			for (var i = 0; i < items.list.length; i++){
				sum+=config.probabilities[items.list[i]];
				//console.log(i, items.getProbability(items.list[i], false), items.getProbability(items.list[i], true) )
			}
			//console.log(config)
			for (i = 0; i < 3; i++){
				for (var k = 0; k < config.reelsLength; k++){
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
			}
			//console.log(generated);
			return generated;
		},
		getActual: function(){
		//console.log('getting actual');
			var actual = [[],[],[]];
			for (var i = 0; i < 3; i++){
				for (var k = this.sequence[i].length - 1; k >= this.sequence[i].length -3; k--){
					actual[i][k - (this.sequence[i].length -3)] = this.sequence[i][k];
				}
			}
			return actual;
		},
		compose: function(){
			console.log('_________________________________________________');
			reels.offset = [1,1,1];
			var i,k;
			var sequence = [[],[],[]];
			var attachable = this.generate();
			console.log('Locally generated items are', attachable);
			var actual = this.getActual();
			console.log('Actual items are', actual);
			var fromServer = server.spin();
			console.log('Accepted from server: ', fromServer);
			if (this.sequence[0].length !== 0){
				for (i = 0; i < 3; i++){
					for (k = 0; k < actual[i].length; k++){
						sequence[i].push(actual[i][k]);
					}
				}
				for (i = 0; i < 3; i++){
					for (k = 0; k < attachable[i].length; k++){
						sequence[i].push(attachable[i][k]);
					}
				}
			} else {
				sequence = attachable;
	
			}
			for (i = 0; i < 3; i++){
				for (k = 2; k >=0; k--){
					sequence[i].push(fromServer[i][k]);
				}
			}
			this.sequence = sequence;
			console.log('Resulted sequence is ', this.sequence);
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
							reels.offset[i]+= Math.pow(reels.offset[i], 1/1.6);
						}
						else if (reels.offset[i] >= range/2 && reels.offset[i] < range) {
							fore[i] = false;
							reels.offset[i]+= Math.pow(range - reels.offset[i], 1/(1.4 + (i+1) * 0.2));
							//console.log(reels.offset);
						} else if (reels.offset[i] >= range){
							reels.offset[i] = range;
						}
					}
				} else {
					clearInterval(interval);
					if (reels.lines.check() !== false){
						reels.lines.render();
					}
					game.active = true;
				}
			}, 15);
		},
		render: function(){
			//console.log('acting reels.render');
			view.layer0.clearRect(0,0, config.renderResolution, config.renderResolution);
			for (var i = 0; i < 3; i++){
				for(var k = reels.sequence[i].length - 1; k >=0 ; k--){
					//console.log(this.offset);
					window.hotdelux.items.render(items.list[reels.sequence[i][k]], i + 1, 600 + this.offset[i] - k * 200);

				}
			}
		}
	};

	return reels;
});