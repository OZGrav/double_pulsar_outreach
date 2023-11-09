const sinEquation = (x, amplitude, period, phase) => amplitude * Math.sin( ( 2 * Math.PI / period ) * ( x + phase ) );

function range(start, end, step = 1) {
  return Array.from({ length: Math.floor((end - start) / step) + 1 }, (_, i) => start + i * step);
}


document.addEventListener('DOMContentLoaded', function () {
  const xRange = range(1, 100);
  const initialAmplitude = 1;
  const initialPeriod = 30;
  const initialPhase = 10;
  const initialSin = [xRange.map(x => sinEquation(x, initialAmplitude, initialPeriod, initialPhase))];
  console.log(initialSin);


  const trace = {
    x: xRange,
    y: initialSin,
    type: 'scatter',
  };

  const sliderSteps = [];
  for (let a = 0; a <= 5; a += 0.1) {
    sliderSteps.push({
      method: 'relayout',
      label: a.toFixed(1),
      args: ['x', [xRange.map(x => sinEquation(x, a, initialPeriod, initialPhase))]],
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
    const newY = xRange.map(x => sinEquation(x, parseFloat(a), initialPeriod, initialPhase));
    Plotly.update(plot, { y: [newY] });
  });
});