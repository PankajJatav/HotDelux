'use strict';
define(['config/config', 'graphics', 'canvas'], function(config, graphics, view){
	var items = {
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
			var factor = config.renderResolution/1000;
			view.layer0.drawImage(graphics[item], 100 * factor + (reel - 1) * 250 * factor + (reel - 1) * 25 * factor, y * factor, 250 * factor, 200 * factor); // y: 165 - 1; 375 - 2; 565 - 3	
		},
		getProbability: function(item, upper){
			var limit = config.probabilities[item];
			for (var i = 0; i < items.list.indexOf(item); i++){
				limit+=config.probabilities[items.list[i]];
			}
			if (upper === false){
				limit-=config.probabilities[item];
			}
			return limit;
		}
	};

	return items;
});