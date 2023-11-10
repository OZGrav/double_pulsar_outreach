---
# Feel free to add content and custom Front Matter to this file.
# To modify the layout, see https://jekyllrb.com/docs/themes/#overriding-theme-defaults

layout: default
---
<head>
	<!-- Load plotly.js into the DOM -->
    <script src='https://cdn.plot.ly/plotly-2.27.0.min.js'></script>
	<script async src="https://polyfill.io/v3/polyfill.min.js?features=es6"></script>
	<script async id="MathJax-script" async="true" src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.7/MathJax.js?config=TeX-MML-AM_CHTML"></script>
</head>


$$
{\mathrm {Arrival}}(t) = \frac{1}{2}\frac{dP_{\mathrm b}}{dt} \frac{T^2}{P_{\mathrm b}}
$$

Now ...Einstein predicts that

$$
\frac{dP_{\mathrm b}}{dt} = \frac{-192 \pi G^{5/3}}{5c^5}\left(\frac{P_{\mathrm b}}{2 \pi}\right)^{-5/3}\left(\frac{1}{1-e^2}\right)^{7/2}\left( 1+\frac{73}{24}e^2+\frac{37}{96}e^4 \right)\frac{m_p m_c}{(m_p+m_c)^{1/3}}
$$

Orbital Shrinkage is $$\frac{da}{d {\mathrm {orbit}}} = \frac{\frac{dP_b}{dt} \sqrt{GM}}{3\pi\sqrt{ac}} P_{\mathrm b} $$

Now \\( m_c=1.248866 \\)  M\\(_{\mathrm{sun}}\\), \\(m_p=1.338186\\) M\\( _\{\mathrm{sun}} \\), \\(a_p=1.4150223\, c\\), P\\(_b=0.102251559\\) days, \\(e=0.0877774229\\)

Now if we adopt the above values, \\( dP_b/dt = -1.24319\times 10^{-12} \\)s/s and change in separation per orbit is \\(-2.710 \\) mm per orbit.

<body>
    <div class="centered-div">
    <div class="two-divs">
        <form id="data-form">
            {% for i in (1..27) %}
                <label for="data{{ i }}"><a href="/epochs/?epoch={{ i }}" target="_blank">Epoch {{ i }}:</a></label>
                <input type="text" id="data{{ i }}" name="data{{ i }}" ><br>
            {% endfor %}
            <button type="submit">Plot Calculated</button>
        </form>
        <form id="plot_expected">
            <button type="submit">Plot Predicted</button>
        </form>
    </div>
    <div class="two-divs">
        <div id='plot'><!-- Plotly chart will be drawn inside this DIV --></div>
	    <div id='residual'><!-- Plotly chart will be drawn inside this DIV --></div>
    </div>
    </div>
    <script src='{{ site.baseurl }}/assets/ploty_script.js'></script>
</body>

<link rel="stylesheet" href="{{ '/assets/main.css' | relative_url }}">