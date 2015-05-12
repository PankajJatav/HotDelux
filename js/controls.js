'use strict';
define(['canvas','game','reels'],function(view, game, reels){
	var controls = {};
	var game, reels;
	require(['game', 'reels'], function(rGame, rReels){
		game = rGame;
		reels = rReels;
	});
	controls.el = document.getElementById('controls'); 					//Setting up the control-div
	controls.el.set = function(){
		controls.el.style.width = view.canvas0.offsetWidth + 'px'; 
		controls.el.style.height = 0.16 * view.canvas0.offsetWidth + 'px';
		controls.el.style.bottom = view.canvas0.getBoundingClientRect().bottom - view.canvas0.offsetWidth + 'px';
		controls.el.style.left = view.canvas0.getBoundingClientRect().left + 'px';
		controls.el.style.fontSize = 0.05 * view.canvas0.offsetWidth + 'px';
	};
	controls.i = {
		autoplay: document.getElementById('autoplay'),
		betIncrease: document.getElementById('bet-increase'),
		betDecrease: document.getElementById('bet-decrease'),
		start: document.getElementById('start'),
		playtable: document.getElementById('playtable')
	};
		//Clicks:
	controls.i.start.onclick = function(){
		if (game.active && game.credit.val > 0){
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
	};

	return controls;
})