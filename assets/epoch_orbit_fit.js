const updateEquation = (x, a, b) => a * x * x + b;


document.addEventListener('DOMContentLoaded', function () {
  const initialX = [1,2,3]; // Initial x-values
  const initialY = [1,2,3]; // Corresponding initial y-values

  const trace = {
    x: initialX,
    y: initialY,
    type: 'scatter',
  };

  const sliderSteps = [];
  for (let a = 0; a <= 5; a += 0.1) {
    sliderSteps.push({
      method: 'relayout',
      label: a.toFixed(1),
      args: ['x', [initialX.map(x => updateEquation(x, a, 1, 0))]],
    });
  }

  const sliders = [
    {
      steps: sliderSteps,
      active: 10,  // Initial position of the slider
      currentvalue: {
        prefix: 'a: ',
        xanchor: 'right',
        visible: true,
        offset: 25,
      },
    },
  ];

  const layout = {
    title: 'Plot with Slider',
    xaxis: { title: 'MJD' },
    yaxis: { title: 'ToA Residual' },
    sliders: sliders,
  };

  Plotly.newPlot('plot', [trace], layout);
  const plot = document.getElementById('plot');

  plot.on('plotly_sliderchange', (event) => {
    const a = event.step.label;
    const newY = initialX.map(x => updateEquation(x, parseFloat(a), 1, 0));
    Plotly.update(plot, { y: [newY] });
  });
});