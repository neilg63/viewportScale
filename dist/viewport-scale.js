/* viewportScale v0.5.1 | Author: Neil Gardner, 2014 | License: MIT/GPL */
(function($) {

	$.fn.viewportScale = function(units,options){
		
			var element = this, 
				numEls = 0,
				vhSupported = false,
				ww = 0,
				wh=0,
				wmin=0,
				wmax=0,
				props={},
				unitRgx = new RegExp('\\b(\\d+(\\.\\d+)*)\\s*(v([wh]|max|min))'),
				supported = false,
				_gauged = false;
			
			var settings = $.extend({
					resize: true, // respond to window resize / orientation change events
		          detect: 'full', // full | basic | strict full = detect vmax/vmin support, basic = only vw/vh support | scrict = enforce full compliance even if vmax not specified
		          sizeMode: 'auto', // auto|mobile|desktop Determines method used to gauge viewport height, for desktop window.height without status bars, for mobile screen.height. In auto mode initial 
		          maxMobileHeight: 480 // max window height at which a device is considered mobile in auto mode
		      }, options );
			
			var detectSupport = function() {
				var b = $('body');
				if (b.hasClass('vh-checked') == false) {
					var div = $('<div />'),className = 'vh-checked';
					gaugeWindowSize();
					_gauged = true;
					if (div.length>0) {
						if (typeof units == 'string' && settings.detect != 'strict') {
							settings.detect = 'basic';
						}
						b.append(div);
						var attrs = {position:'fixed',height:'100vh','font-size':'2vh',width:'50vmax','z-index':-2000,padding:0}, ds=0;
						div.css(attrs);
						ds = div.outerHeight();
						supported = ds > (wh * 0.85) && ds < (wh * 1.15);
						if (supported) {
							ds = div.css('font-size'),fract = 0;
							if (ds) {
								ds = ds.replace(/[a-z]/g,'');
								if ($.isNumeric(ds)) {
									ds = ds - 0; 
									fract = (wh / ds);
									supported = (fract > 42.5 && fract < 52.5);
									if (supported) {
										className += ' vh-supported';
									}
									if (settings.detect != 'basic' && supported) {
										ds = div.outerWidth();
										supported = ds > ((wmax / 2)*0.95) && ds < ((wmax / 2)*1.05);
										if (supported) {
											className += ' vmax-supported';
										}
									}
								}
							}
						}
						div.remove();
						b.addClass(className);
					}
				} else {
					supported = settings.detect == 'basic'? b.hasClass('vh-supported') : b.hasClass('vmax-supported');
				}
			}

			// Fetch window size on initial page load and subsequent resizing
			var gaugeWindowSize = function() {
				// support for ViewportSize plugin
				var flipOrient = false;
				if (window.orientation) {
					flipOrient = Math.abs(window.orientation%180) >= 45;
				}
				if (settings.sizeMode != 'mobile') {
					if (window.viewportSize) {
						ww = window.viewportSize.getWidth();
					} else {
						ww = $(window).outerWidth();
					}
					if (window.innerHeight) {
						wh = window.innerHeight;
					} else {
						wh = document.documentElement.clientHeight;
					}
					if (settings.sizeMode == 'auto' && wh <= settings.maxMobileHeight) {
						settings.sizeMode = 'mobile';
					}
				}
				if (settings.sizeMode == 'mobile') {
					if (flipOrient) {
						ww = screen.height;
						wh = screen.width;
					} else {
						ww = screen.width;
						wh = screen.height;
					}
				}
				//wh = (window.innerHeight + wh) / 2
				
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
				if (!_gauged) {
					gaugeWindowSize();
				}
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
				_gauged = false;
				element.css(attrs);
			}
			
			// Match units, vw, vh, vmax or vmin with integer or float numerals
			var matchUnit = function(str) {
				var prop = {unit: 'none',num:null};
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
			
			var apply = function() {
				var valid = false;
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
					if (valid) {
						resetSize();
						if (settings.resize !== false) {
							$(window).on('resize.viewport orientationchange.viewport',resetSize);
						}
					}
			}
		
			// Set up for all matched elements
			var init = function() {
				numEls = element.length;
				if (numEls>0) {
					if (settings.detect != 'skip') {
						detectSupport();
					} 
					if (!supported) {
						apply();
					}
				}
			}
			
			// initialise
			init();
			
			// return self for chaining
			return this;
		}
	
})(jQuery);