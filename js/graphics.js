'use strict';
define(function(){
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

	return graphics;
})