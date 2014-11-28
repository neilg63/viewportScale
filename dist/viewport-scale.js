/* viewportScale v0.2 | Author: Neil Gardner, 2014 | License: GPL */
(function($) {

	$.fn.viewportScale = function(units,resizeOn){
		
			var element = this, 
				numEls = 0,
				vhSupported = false,
				ww = 0,
				wh=0,
				wmin=0,
				wmax=0,
				props={},
				unitRgx = new RegExp('\\b(\\d+(\\.\\d+)*)\\s*(v([wh]|max|min))');

			// Fetch window size on initial page load and subsequent resizing
			var gaugeWindowSize = function() {
				// support for ViewportSize plugin
				if (window.viewportSize) {
					ww = window.viewportSize.getWidth();
				} else {
					ww = $(window).outerWidth();
				}
				wh = $(window).outerHeight();
				if (wh > ww) {
					wmax = wh;
					wmin = ww;
				} else {
					wmax = ww;
					wmin = wh;
				}
			}
		
			// Translate percent value to a window-size based pixel unit
			var translatePc = function(pc,wUnit) {
				if ($.isNumeric(pc)) {
					return Math.ceil((pc/100) * wUnit) + 'px';
				}
				return false; 
			}

			// Calculate size based on window height and/or width
			var resetSize = function(){
				var attrs={},prop, u, ws;
				gaugeWindowSize();
				
				for (key in props) {
					prop = props[key];
					ws = false
					if ('none' != prop.unit) {
						switch (prop.unit) {
							case 'vw':
								ws = ww;
								break;
							case 'vh':
								ws = wh;
								break;
							case 'vmax':
								ws = wmax;
								break;
							case 'vmin':
								ws = wmin;
								break;	
						}
						if ($.isNumeric(ws)) {
							attrs[key] = translatePc(prop.num,ws);
						}
					}
				}
				element.css(attrs);
			}
			
			// Match units, vw, vh, vmax or vmin with integer or float numerals
			var matchUnit = function(str) {
				var parts = str.split(','),prop = {unit: 'none',num:null};
				if (str.length>1) {
					var match = str.match(unitRgx);
					if ($.isNumeric(match[1])) {
						switch (match[3]) {
							case 'vw':
							case 'vh':
							case 'vmin':
							case 'vmax':
								prop.unit = match[3];	
								prop.num = match[1] - 0;
								break;
						}
					}
				}
				return prop;
			}
		
			// Set up for all matched elements
			var init = function() {
				numEls = element.length,
				valid = false;
				if (numEls>0) {
					if (typeof units == 'string') {
						units = units.toLowerCase();
						var parts = units.split(','),i=0,prop;
						for (; i < parts.length;i++) {
							if (parts[i].length>1) {
								prop = matchUnit(parts[i]);
								switch (prop.unit) {
									case 'vw':
										props.width = prop;
										valid = true;
										break;
									case 'vh':
										props.height = prop;
										valid = true;
										break;	
								}
							}
						}
					} else if (typeof units == 'object') {
							var strVal,prop;
							for (key in units) {
								strVal = units[key];
								switch (key) {
									case 'width':
									case 'height':
									case 'top':
									case 'bottom':
									case 'left':
									case 'right':
									case 'min-width':
									case 'max-width':
									case 'min-height':
									case 'max-height':
									case 'font-size':
										prop = matchUnit(strVal);	
										if (prop.unit != 'none') {
											props[key] = prop;
											valid = true;
										}
										break;
								}
							}
						}
				}
				if (valid) {
					resetSize();
					if (resizeOn !== false) {
						$(window).on('resize.viewport',resetSize);
					}
				}
			}
			
			// initialise
			init();
			
			// return self for chaining
			return this;
		}
	
})(jQuery);