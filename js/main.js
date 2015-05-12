'use strict';
(function(){
	require.config = {
		baseUrl: 'js',
	};

	(function() {
	 	var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
		window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
		window.requestAnimationFrame = requestAnimationFrame;
	})();

	require(['config/config','reels', 'items', 'graphics', 'game', 'controls', 'canvas'], function(config, reels, items, graphics, game, controls, view, utils){
		var hotdelux = {};
		hotdelux = {
			active: true,
			config: config,
			utils: utils,
			reels: reels,
			items: items,
			graphics: graphics,
			game: game,
			controls: controls,
			view: view,
			reset: function(){
				this.reels.offset = [(reels.sequence[0].length - 3) * 200, (reels.sequence[0].length - 3) * 200, (reels.sequence[0].length - 3) * 200];
				this.game.credit.val = config.openingCapital;
				this.game.betPerLine.val = 1;
			},
			start: function(){
				if (this.active === true){
					this.reset();
					this.reels.compose();
					this.reels.offset = [(reels.sequence[0].length - 3) * 200, (reels.sequence[0].length - 3) * 200, (reels.sequence[0].length - 3) * 200];
					this.render();
				}
			},
			render: function(){
				window.hotdelux.reels.render();
				window.hotdelux.game.refresh();
				requestAnimationFrame(window.hotdelux.render);
			},
		};
		window.hotdelux = hotdelux;
		requestAnimationFrame(window.hotdelux.render);
		window.hotdelux.start();
		window.hotdelux.controls.el.set();
		window.onresize = function(){
			window.hotdelux.controls.el.set();
		};
		return hotdelux;
	});
}());
