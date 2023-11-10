// Update the title based on the epoch number in the URL
const urlParams = new URLSearchParams(window.location.search);
const epoch_url = urlParams.get('epoch');
if (epoch_url) {
  document.title = "Epoch " + epoch_url + " Orbit Fit";
  console.log(document.querySelector('.project-name').innerText);
  document.querySelector('.project-name').innerText = "Epoch " + epoch_url + " Orbit Fit";
}

const sinEquation = (x, amplitude, period, phase) => amplitude * Math.sin( ( 2 * Math.PI / period ) * ( x + phase ) );

function range(start, end, step = 1) {
  return Array.from({ length: Math.floor((end - start) / step) + 1 }, (_, i) => start + i * step);
}

function residual_calc(data, model) {
  const result = [];
  for (let i = 0; i < data.length; i++) {
    const difference = data[i] - model[i];
    result.push(difference);
  }
  return result;
}

// Function to read the file
function readFile(filePath) {
  return fetch(filePath)
    .then(response => {
      if (!response.ok) {
        throw new Error(`Failed to fetch the file: ${response.status}`);
      }
      return response.text();
    })
    .then(content => {
      const { days, residuals } = parseDataFile(content);

      // Display the result
      return { days, residuals };
    })
    .catch(error => {
      console.error(error);
    });
}

// Function to parse the data file content into two arrays of floats
function parseDataFile(content) {
  const lines = content.trim().split('\n');
  const days = [];
  const residuals = [];

  lines.forEach(line => {
    const [value1, value2] = line.split(' ').map(parseFloat);
    days.push(value1);
    residuals.push(value2*10e3);
  });

  return { days, residuals };
}


document.addEventListener('DOMContentLoaded', function () {
  readFile('/assets/residuals/residuals.26.dat')
  .then(result => {
    // Process the result here
    const { days, residuals } = result;
    console.log("days:", days);
    console.log("residuals:", residuals);

    const initialAmplitude = 1;
    const initialPeriod = 0.1;
    const initialPhase = 0;
    const initialSin = [days.map(x => sinEquation(x, initialAmplitude, initialPeriod, initialPhase))];

    let amplitude = initialAmplitude;
    let period = initialPeriod;
    let phase = initialPhase;
    let fitResidual = residual_calc(initialSin[0], residuals);
    console.log("initialSin:", initialSin);


    const modelTrace = {
      x: days,
      y: initialSin,
      type: 'scatter',
      name: 'Orbit Model',
    };
    var inputDataTrace = {
      x: days,
      y: [residuals],
      mode: 'markers',
      type: 'scatter',
      name: 'ToAs',
      marker: { size: 12 }
    };
    var residualTrace = {
      x: days,
      y: fitResidual,
      mode: 'markers',
      type: 'scatter',
      name: 'Residual',
      marker: { size: 12 }
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
    }
    for (let a = 0; a <= 0.1; a += 0.001) {
      periodSliderSteps.push({
        method: 'relayout',
        label: a.toFixed(3),
        args: ['yaxis.range', [-10, 10]],
      });
    }
    for (let a = 0; a <= 1; a += 0.01) {
      phaseSliderSteps.push({
        method: 'relayout',
        label: a.toFixed(2),
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
      width: 800,
      height: 600,
      xaxis: { title: 'MJD' },
      yaxis: { title: 'ToA residuals (ms)' },
      sliders: sliders,
    };

    Plotly.newPlot('plot', [modelTrace, inputDataTrace], layout);
    Plotly.restyle('plot', {'y': initialSin}, 0);
    Plotly.restyle('plot', {'y': [residuals]}, 1);
    const plot = document.getElementById('plot');

    const residualLayout = {
      width: 800,
      height: 400,
      xaxis: { title: 'MJD' },
      yaxis: { title: 'Residual between model and fit', autorange: false, range: [-10, 10] },
    };
    Plotly.newPlot('residual', [residualTrace], residualLayout);
    Plotly.restyle('residual', {'y': [fitResidual]}, 0);

    plot.on('plotly_sliderchange', (event) => {
      if (event.slider.currentvalue.prefix.startsWith('Amplitude')) {
        amplitude = parseFloat(event.step.label);
      }
      if (event.slider.currentvalue.prefix.startsWith('Period')) {
        period = parseFloat(event.step.label);
      }
      if (event.slider.currentvalue.prefix.startsWith('Phase')) {
        phase = parseFloat(event.step.label);
      }
      const newY = days.map(x => sinEquation(x, amplitude, period, phase));
      Plotly.restyle('plot', {'y': [newY]}, 0);

      // Update residual
      const newResidual = residual_calc(initialSin[0], newY);
      Plotly.restyle('residual', {'y': [newResidual]}, 0);
    });
  })
  .catch(error => {
    // Handle errors here
    console.error('Error:', error);
  });
});