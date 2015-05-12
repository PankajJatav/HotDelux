'use strict';
define(['config/config', 'items'], function(config, items){

	var Server = function(){

	};

	Server.prototype.spin = function(){
		var generated = [[],[],[]];
		var sum = 0;
		for (var i = 0; i < items.list.length; i++){
			sum+=config.probabilities[items.list[i]];
		}
		for (i = 0; i < 3; i++){
			for (var k = 0; k < 3; k++){
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
		console.log('server has generated: ', generated);
		return generated;
	};

	var server = new Server();
	return server;
});