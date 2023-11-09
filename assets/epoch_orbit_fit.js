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

  let amplitude = initialAmplitude;
  let period = initialPeriod;
  let phase = initialPhase;


  const trace = {
    x: xRange,
    y: initialSin,
    type: 'scatter',
  };


  const amplitudeSliderSteps = [];
  const periodSliderSteps = [];
  const phaseSliderSteps = [];
  for (let a = 0; a <= 10; a += 0.1) {
    amplitudeSliderSteps.push({
      method: 'relayout',
      label: a.toFixed(1),
      args: ['yaxis.range', [-10, 10]],
    });
    periodSliderSteps.push({
      method: 'relayout',
      label: 2 * a.toFixed(1),
      args: ['yaxis.range', [-10, 10]],
    });
    phaseSliderSteps.push({
      method: 'relayout',
      label: a.toFixed(1),
      args: ['yaxis.range', [-10, 10]],
    });
  }

  const sliders = [
    {
      steps: amplitudeSliderSteps,
      active: 10,  // Initial position of the slider
      currentvalue: {
        prefix: 'Amplitude: ',
        xanchor: 'left',
        visible: true,
        offset: 25,
      },
    },
    {
      steps: periodSliderSteps,
      active: 10,  // Initial position of the slider
      currentvalue: {
        prefix: 'Period: ',
        xanchor: 'center',
        visible: true,
        offset: 75,
      },
    },
    {
      steps: phaseSliderSteps,
      active: 10,  // Initial position of the slider
      currentvalue: {
        prefix: 'Phase: ',
        xanchor: 'right',
        visible: true,
        offset: 125,
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
    console.log(event);
    if (event.slider.currentvalue.prefix.startsWith('Amplitude')) {
      amplitude = parseFloat(event.step.label);
    }
    if (event.slider.currentvalue.prefix.startsWith('Period')) {
      period = parseFloat(event.step.label);
    }
    if (event.slider.currentvalue.prefix.startsWith('Phase')) {
      phase = parseFloat(event.step.label);
    }
    const newY = xRange.map(x => sinEquation(x, amplitude, period, phase));
    Plotly.update(plot, { y: [newY] });
  });
});