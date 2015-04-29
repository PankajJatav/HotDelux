window.onload = function(){
	var controls = document.getElementById('controls'); //Позиционирование блока контроля
	controls.set = function(){
		var box = document.getElementById('canvas-0');
		controls.style.width = box.offsetWidth + 'px'; 
		controls.style.height = 0.15 * box.offsetWidth + 'px';
		controls.style.bottom = box.getBoundingClientRect().bottom - box.offsetWidth + 'px';
		controls.style.left = box.getBoundingClientRect().left + 'px';
		controls.style.fontSize = 0.05 * box.offsetWidth + 'px';
		console.log(controls.style.width, controls.style.height, controls.style.bottom, controls.style.left);
	};
	controls.set();
	window.onresize = function(){
		controls.set();
	}
	
	
	var graphics = {	//Графика
		plums : new Image(),
		cherries : new Image(),
		oranges : new Image(),
		lemons : new Image(),
		sevens : new Image(),
		bars : new Image(),
		xs : new Image(),
		stars : new Image(),
		playtable : new Image()
	};

	graphics.plums.src = 'img/plums.png';
	graphics.cherries.src = 'img/cherries.png';
	graphics.oranges.src = 'img/oranges.png';
	graphics.lemons.src = 'img/lemons.png';
	graphics.sevens.src = 'img/sevens.png';
	graphics.bars.src = 'img/bars.png';
	graphics.xs.src = 'img/xs.png';
	graphics.stars.src = 'img/stars.png';
	graphics.playtable.src = 'img/playtable.png';

	var view = {	//слои
		layer1: document.getElementById('canvas-0').getContext('2d'),
		layer2: document.getElementById('canvas-1').getContext('2d')
	};
	items = {
		cost: {
			lemons: 40,
			cherries: 40,
			oranges: 40,
			plums:40,
			sevens: 750,
			stars: 200,
			bars: 100,
			xs: 5
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
		render: function(item, y, reel){
			view.layer1.drawImage(graphics[item], 100 + (reel-1) * 234 + (reel-1) * 40, y);
		}
	}

	var gamer = {
		credit: 1000,
		betPerLine: 1,
		bet: 5,
	};
	items.render('lemons', 165, 1);
	items.render('cherries', 375, 1);
	items.render('oranges', 565, 1);
	items.render('plums', 165, 2);
	items.render('sevens', 375, 2);
	items.render('bars', 565, 2);
	items.render('stars', 165, 3);
	items.render('xs', 375, 3);
	items.render('plums', 565, 3);

}

