jQuery viewportScale
=============

This simple jQuery plugin lets you apply responsive viewport size units (vw, vh, vmax and vmin) with browsers with incomplete or non-existent support for these properties. See <em><a href="http://www.w3.org/TR/css3-values" rel="external">W3C: CSS Values and Units Module Level 3</a></em> for more details on these properties. 

The plugin does not detect browser support for viewport units, as some common browsers such as IOS Safari before version 7 and Internet Explorer before version 10 provide partial support. See <a href="http://caniuse.com/#feat=viewport-units">Can I Use Viewport units</a> for more detailed analysis.

As of November 2014, the latest official version of all major browsers support vw, vh, vmax and vmin. However, if you need to support IE8, IE9 (partial support), Safari < 7 (no support), iOS Safari < 7.1, you may target this plugin only at users of these browsers and let modern browsers use CSS only. For IE, you may use conditional tags to include additional scripts not required for other browsers. For iOS Safari, you may need to use jQuery's deprecated $.browser object (available for jQuery 1.9+ via a plugin) or other third-party browser detection scripts.

<p>A  <a href="http://multifaceted.info/demos/viewport-scale/demo/index.html">simple demo</a> shows you the desired effects</p>

<h2>Correct Viewport Width<h3>

Before the introduction of CSS viewport units, browsers did not consistently distinguish between window width with or without scrollbars. Most mobile browsers and some desktop browsers hide scrollbars when not scrolling and thus report Javascripts windowc.clientWidth to be exactly 100vw. However, most desktop browsers substract the scrollbar width from this value. As a result, 100% of window width is always not the same as 100vw. If you wish to ensure exact compatibility with W3C definition of viewport width, please include 
<a href="https://github.com/tysonmatanich/viewportSize">viewportSize</a>. This is not necessary if you require only viewport heights (vh) or do not mind discrepencies in viewport width when scrollbars are always present.

<h2>How it works<h3>

On initial page load the script gauges the correct window height and width (optionally with the aid of viewportSize to gauge correct viewport width without scrollbars). It then translates these into values into pixels for the following properties:

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

<h3>Sample usage:<h3>

This plugin is best suited for situations where viewport units are only used sparingly for a few strategic layout elements or text that must sized to fit within those elements.

If you need to target a large set of HTML objects matching one or more CSS paths, the plugin will generate inline markup for each element and will recalculate these values when browser windows are resized and thus potentially consume more resources, especially in older browsers.

<h4>HTML Snippet:</h4>
<pre>
&lt;section class="half-width-height"&gt;
	&lt;p&gt; Scalable text 2% of viewport height or width, whichever is the largest&lt;/p&gt;
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
$('section.half-width-height').viewportScaleer('50vh,50vw');

/* For other units and combinations use object notation */
$('section.half-width-height p').viewportScaleer({
	'font-size': '2vmax'
});

/* For other units and combinations use object notation */
$('section.third-width-fixed-aspect').viewportScaleer({
	'width': '33.333vw',
	'height': '33.333vw',
});

</pre>