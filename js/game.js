'use strict';
define (['config/config', 'controls', 'canvas', 'graphics'], function(config, controls, view, graphics){
	var reels;
	require(['reels'], function(that){
		reels = that;
	});
	var game = {
		credit: {
			val: config.openingCapital,
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
					this.val++;
				}
			},
			decrease: function(){
				if (this.val !== 1){
					this.val--;
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
		playtable: {
			interval: '',
			shown: false,
			show: function(){
				if(!this.shown){
					this.shown = true;
					var offset = 1;
					var factor = config.renderResolution/1000;
					this.interval = setInterval(function(){
						if (offset <= 700 * factor){
							view.layer1.drawImage(graphics.playtable, 0, 0, 1000, offset * factor , 0, 150 * factor, 1000 * factor, offset);
							offset+=10;
						} else {
							clearInterval(game.playtable.interval);
						}
					}, 10);
				} else {
					this.shown = false;
					view.layer1.clearRect(0,0, config.renderResolution, config.renderResolution);
				}
			}
		}
	};
	return game;
});