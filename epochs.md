---
layout: default
title:  "Epoch"
permalink: /epochs
---

Use the three sliders to get the orbit model (blue line) as close to the time of arrival data (orange dots).
The bottom plot is the residual (difference between orbital model and time of arrivals) so it when
it is close to zero, you have found the correct value (remember to write it down!).

The top slider is the amplitude (height of the sine wave),
the middle slider is the period of the of the orbit (width of sine wave before it repeats),
and the bottom is the phase of the orbit (when the sine wave starts).

<div class="display-box">
  <!-- Title -->
  <div class="box-title">True Value (ms)</div>

  <!-- Value -->
  <div class="box-value" id="true-value"></div>
</div>

<head>
	<!-- Load plotly.js into the DOM -->
    <script src='https://cdn.plot.ly/plotly-2.27.0.min.js'></script>
</head>

<body>
	<div id='plot'><!-- Plotly chart will be drawn inside this DIV --></div>
	<div id='residual'><!-- Plotly chart will be drawn inside this DIV --></div>
	<script src='{{ site.baseurl }}/assets/epoch_orbit_fit.js'></script>
</body>

Did you get it? If so write down the values in the top plot and click the below button to go back!

<footer>
  <!-- Home button -->
  <a href="{{ site.baseurl }}/" class="home-button">Home</a>
</footer>
<link rel="stylesheet" href="{{ '/assets/main.css' | relative_url }}">