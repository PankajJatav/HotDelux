'use strict';
define(['config/config'], function(config){
	var view = {
		canvas0: document.getElementById('canvas-0'),
		canvas1: document.getElementById('canvas-1'),
		layer0 : document.getElementById('canvas-0').getContext('2d'), 						 //Reels
		layer1 : document.getElementById('canvas-1').getContext('2d') 						 //Lines
	};

	view.canvas0.width = config.renderResolution;
	view.canvas0.height = config.renderResolution;
	view.canvas1.width = config.renderResolution;
	view.canvas1.height = config.renderResolution;
	view.layer1.shadowColor = '#222';
    view.layer1.shadowBlur = 0;
    view.layer1.shadowOffsetX = 0;
    view.layer1.strokeStyle = '#04756f';

    return view;
})