jQuery viewportScale
=============

This simple jQuery plugin (compatible with jQuery 1.7+ and 2.*.x) lets you apply responsive viewport size units (vw, vh, vmax and vmin) with browsers with incomplete CSS3 support. See <em><a href="http://www.w3.org/TR/css3-values" rel="external">W3C: CSS Values and Units Module Level 3</a></em> for more details on these properties.

In <em>fluid design</em>, the width of HTML elements can always be calculated in percent as long as the document body has a known percentage value, although percentage width and height are always relative to their parent element's width and height. However, until recently without Javascript it was impossible to scale an element based on viewport height alone. This technique has become very common in mobile designs, e.g. where a page section is designed to occupy the whole screen height and width, but more content is available by scrolling up or down. Viewport height (vh) units are the answer.

When applied to <em>font-sizes</em>, viewport width (vw) is a lightweight alternative to <strong>fit-text</strong> scripts to ensure text always occupies approximately the same proportion of the screen width and thus take up the same number of lines.

<h3>Browser Support Detection</h3>

The plugin can optionally run a basic viewport unit support test. This will only run once as it adds two class names to the HTML body tag. 

Some common browsers such as IOS Safari before version 7 and Internet Explorer before version 10 provide partial support. The test ensures a hidden element sized in <em>vh</em> matches its expected size based on viewport height. See <a href="http://caniuse.com/#feat=viewport-units">Can I Use Viewport units</a> for more detailed analysis.

For a practical example please view this simple <a href="http://multifaceted.info/demos/viewport-scale/demo/">demo</a> .

As of November 2014, the latest official version of all major browsers support vw, vh, vmax and vmin. However, if you need to support IE8, IE9 (partial support), Safari < 7 (no support), iOS Safari < 7.1, you may target this plugin only at users of these browsers and let modern browsers use CSS only.

<p>A  <a href="http://multifaceted.info/demos/viewport-scale/demo/index.html">simple demo</a> shows you the desired effects</p>

<h3>Correct Viewport Width</h3>

Before the introduction of CSS viewport units, browsers did not consistently distinguish between window width with or without scrollbars. Most mobile browsers and some desktop browsers hide scrollbars when not scrolling and thus report Javascript's window.outerWidth to be exactly 100vw. However, most desktop browsers subtract the scrollbar width from this value. As a result, 100% of window width is always not the same as 100vw. If you wish to ensure exact compatibility with W3C definition of viewport width, please include Tyson Matanich's 
<a href="https://github.com/tysonmatanich/viewportSize">viewportSize</a>. This is not necessary if you require only viewport heights (vh) or do not mind discrepencies in viewport width when scrollbars are always present.

<h3>Requirements</h3>
	
<ol>
	<li>jQuery 1.7+, jQuery 2.* and hopefully jQuery 3.*</li>
	<li>Optionally load the viewportSize script first. This adds a new window.viewportSize object</li>
	<li>Load the viewportScale plugin </li>
	<li>Use it in your custom javascript within a jQuery context.</li>
</ol>

<h2>How it works<h3>

On initial page load the script gauges the correct window height and width (optionally with the aid of viewportSize to gauge correct viewport width without scrollbars). It then translates these into pixel values for the following properties:

<ol>
	<li>width</li>
	<li>height</li>
	<li>top</li>
	<li>bottom</li>
	<li>left</li>
	<li>right</li>
	<li>min-width</li>
	<li>min-height</li>
	<li>max-width</li>
	<li>max-height</li>
	<li>font-size</li>
</ol>

The plugin does not support other common properties, as these can be derived from the above using relative units, e.g. padding and margin in em's are relative the font-size and layout properties in percent are relative to their parent elements.

The plugin will recalculate these values when the browser window is resized or the screen orientation is flipped.

<h3>Sample usage:</h3>

This plugin is best suited for situations where viewport units are only used sparingly for a few strategic layout elements or text that must fit within those elements (a great alternative to Fit-Text).

If you need to target a large set of HTML objects matching one or more CSS paths, the plugin will generate inline markup for each element and will recalculate these values when browser windows are resized and thus potentially consume more resources, especially in older browsers.

<h4>Options:</h4>
<dl>
	<dt>resize:</dt><dd>Default = <strong>true</strong>, to disable automatic resizing of inline styles applied by this plugin on window resize enter <strong>false</strong>.</dd>
	<dt>detect:</dt><dd>Default = <strong>'full'</strong>, unless only simplified string syntax is used in the first parameter, in which case only a basic test is run. Use 'skip' to suppress browser detection altogether. To enforce full suppprt detection even with simplified vw/vh syntax, specify <em>'strict'</em> for this option.</dd>
	<dt>sizeMode:</dt><dd>Default = <strong>'auto'</strong>, define whether the initial viewport size detection script should be based on application window height, as is preferable in a desktop environment or on screen height, as is preferable for mobile device in which the browser is usually fullscreen except when nagivation controls are displayed. Auto mode assumes if the initial window height is below a certain value (480 by default) it should assume screen height is the better unit, although this may include some smaller desktop/laptop screens. In 'mobile' mode screen height is enforced and in desktop mode, only true window height is considered. You can use a third party deivce  detection script to apply the best setting.</dd>
	<dt>maxMobileHeight:</dt><dd>Default = <strong>480</strong>, define the maximum initial window height at which a device is considered mobile. We recommend using a device detection script.</dd>
</dl>

<h4>iOS Screen Height Issue</h4>
<p>iOS subtracts the navigation bar from the window height, even if its hidden on page load. As a result only screen.height is a reliable measure for such devices.</p>
<h4>Basic Usage</h4>
<p>For basic usage when applying viewport height or width to CSS height or width properties, you need only add a comma separated string:</p>

<pre>
	/* Exactly 80% of viewport height irrespective of page length
	* most common use case, translates to 
	* #my-element { height: 80vh; }
	*/
	$('#my-element').viewportScale('80vh');
</pre>

<pre>
	/* Exactly 50% of viewport height and 25% of viewport width 
	* Translates to:
	* #my-element { height: 50vh; width: 25vw; }
	*/
	$('#my-element').viewportScale('50vh,25vw');
</pre>

For other supported combinations, use object notation:

<pre>
	/* Height, width and font-size scaled to match viewport width only 
	* Translates to:
	* #my-element { max-height: 30vw; width: 20vw; font-size: 2vw; }
	*/
	$('#my-element').viewportScale({
		'max-height': '30vw',
		 width: '20vw',
		'font-size': '2vw'
	});
</pre>

<h4>HTML Snippet:</h4>
<pre>
&lt;section class="half-width-height"&gt;
	&lt;p&gt; Scalable text 2% of viewport height or width, whichever is the largest&lt;/p&gt;
&lt;/section&gt;

&lt;section class="third-width-fixed-aspect"&gt;
	&lt;p&gt; Fixed aspect ratio relative to screen width only. &lt;/p&gt;
&lt;/section&gt;

</pre>

<h4>Stylesheet:</h4>
<pre>
section.half-width-height {
  position: relative;
  width: 50vw; /* viewport width, not supported in IE8*/
  height: 50vh; /* viewport height, not supported in IE8*/
	border: dashed 3px #999999;
	background-color: #ffff66;
	margin: 5%;
}

section.half-width-height p {
  font-size: 2vmax;
}

section.third-width-fixed-aspect {
  position: relative;
  width: 33.333vw; /* viewport width, not supported in IE8*/
  height: 33.333vh; /* viewport height, not supported in IE8*/
	border: dashed 3px #999999;
	background-color: #9999ff;
	margin: 5%;
}

</pre>

<h4>Javascript in jQuery context:</h4>
<pre>
	
/* Optionally include and instantiate viewportSize to add window.viewportSize.getWidth() method */

viewportSize.getWidth();
	
/* simple set up for only height and width using vh and vw units respectively */
$('section.half-width-height').viewportScale('50vh,50vw');

/* For other units and combinations use object notation */
$('section.half-width-height p').viewportScale({
	'font-size': '2vmax'
});

/* For other units and combinations use object notation */
$('section.third-width-fixed-aspect').viewportScale({
	'width': '33.333vw',
	'height': '33.333vw',
});

</pre>

<h4>Resize Events</h4>

The plugin responds to window resizing and changes in screen orientation. If you use this plugin within a resize event handler, you may want to disable this feature, by just adding <em>false</em> as the second parameter.

<pre>
			/* only set on initial page load  or in response to other triggers */
			$('#my-container').viewPortScale({'font-size': '3vw'}, false);
	
</pre>

<h4>Configure Browser Support Detection</h4>
<p>The detection function temporarily creates an empty div, to which it applies a height of 100vh, a font-size of 2vh and in full or strict mode a width of 50vmax. After appending it to the body it checks its height matches the correct viewport height (outerHeight) and its font-size translated into pixels is approximately 1/50 of that. In strict mode it will detect vmax, which is not supported in Internet Explorer 9-11. In basic mode, where only vw and vh units are required, IE9 to 11 should pass the test.</p>
<p>By contrast iOS Safari fails to support vh correctly and thus before version 8 failed both tests.</p>

<p>To suppress this test and always apply inline translated pixel-based styles, you may specify detect <em>mode</em> as the second options parameter of viewportScale(). When using simplified string syntax in the first parameter, the plugin will only run a basic test e.g.</p>

<pre>
			/* Apply basic test only, as vmax and vmin are not required */
			$('#my-container').viewPortScale(
					{
						'font-size':
						'3vw'
					},
					{
						detect:'basic'
					}
				);
	
</pre>

<pre>
			/* Always apply irrespective of browser support, skip browser detection */
			$('#my-container').viewPortScale(
				{
					'font-size': '3vw'
				},
				{
					detect:'skip'
			});
	
</pre>

