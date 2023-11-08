---
# Feel free to add content and custom Front Matter to this file.
# To modify the layout, see https://jekyllrb.com/docs/themes/#overriding-theme-defaults

layout: default
---
<head>
	<!-- Load plotly.js into the DOM -->
    <script src='https://cdn.plot.ly/plotly-2.27.0.min.js'></script>
</head>

<body>
    <div style="display: flex;">
    <div style="flex: 1;">
        <form id="data-form">
            {% for i in (1..27) %}
                <label for="data{{ i }}"><a href="/epochs/?epoch={{ i }}">Epoch {{ i }}:</a></label>
                <input type="text" id="data{{ i }}" name="data{{ i }}" ><br>
            {% endfor %}
            <button type="submit">Plot Calculated</button>
        </form>
        <form id="plot_expected">
            <button type="submit">Plot Predicted</button>
        </form>
    </div>
    <div style="flex: 1;">
        <div id='plot'><!-- Plotly chart will be drawn inside this DIV --></div>
    </div>
    </div>
    <script src='{{ site.baseurl }}/assets/ploty_script.js'></script>
</body>
