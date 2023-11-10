// Update the title based on the epoch number in the URL
const urlParams = new URLSearchParams(window.location.search);
const epoch_url = urlParams.get('epoch');
if (epoch_url) {
  document.title = "Epoch " + epoch_url + " Orbit Fit";
  console.log(document.querySelector('.project-name').innerText);
  document.querySelector('.project-name').innerText = "Epoch " + epoch_url + " Orbit Fit";
}
const epoch_zero_pad = epoch_url < 10 ? '0' + epoch_url : epoch_url;

// number of orbits for each of the epochs
const epoch_orbit = {
  "1": 226.128565454.toFixed(0),
  "2": 509.103936198.toFixed(0),
  "3": 814.129563006.toFixed(0),
  "4": 1105.090793138.toFixed(0),
  "5": 0.0.toFixed(0),
  "6": 1679.084698178.toFixed(0),
  "7": 1964.154749043.toFixed(0),
  "8": 2313.113649158.toFixed(0),
  "9": 2608.063934618.toFixed(0),
  "10": 2928.050490437.toFixed(0),
  "11": 3203.049085177.toFixed(0),
  "12": 3503.036537798.toFixed(0),
  "12": 3503.036537798.toFixed(0),
  "13": 3826.001625193.toFixed(0),
  "14": 4265.028388363.toFixed(0),
  "15": 4635.993986476.toFixed(0),
  "16": 4940.00162813.toFixed(0),
  "17": 5300.964026289.toFixed(0),
  "18": 5561.040620811.toFixed(0),
  "19": 5794.988285849.toFixed(0),
  "20": 0.0.toFixed(0),
  "21": 6382.954259388.toFixed(0),
  "22": 6666.007307285.toFixed(0),
  "23": 7094.972144746.toFixed(0),
  "24": 7299.986870266.toFixed(0),
  "25": 7531.989070608.toFixed(0),
  "26": 9990.977891796.toFixed(0),
};
const epoch_delay = {
  "1": -0.859352,
  "2": -2.66164,
  "3": -3.26074,
  "4": -6.41909,
  "5": -8.74714,
  "6": -15.4034,
  "7": -21.7123,
  "8": -29.5946,
  "9": -37.8259,
  "10": -47.6842,
  "11": -56.7043,
  "12": -67.4222,
  "13": -81.057,
  "14": -99.5933,
  "15": -117.245,
  "16": -133.946,
  "17": -154.881,
  "18": -169.906,
  "19": -184.836,
  "20": -204.509,
  "21": -224.476,
  "22": -244.115,
  "23": -276.808,
  "24": -292.775,
  "25": -311.913,
  "26": -548.692,
  "27": -592.263,
};

// convert phase from ms to days
const sinEquation = (x, amplitude, phase) => amplitude * Math.sin( ( 2 * Math.PI / 0.10225155555593921919 ) * ( x + ( phase / 86400 ) ) );

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
    days.push(value1 - 0.10225155555593921919 * epoch_orbit[epoch_url]);
    residuals.push(value2*10e3);
  });

  return { days, residuals };
}


document.addEventListener('DOMContentLoaded', function () {
  readFile('/assets/residuals/residuals.' + epoch_zero_pad + '.dat')
  .then(result => {
    // Process the result here
    const { days, residuals } = result;
    console.log("days:", days);
    console.log("residuals:", residuals);

    // Load real value
    const displayDiv = document.getElementById('true-value');
    displayDiv.innerHTML = epoch_delay[epoch_url];

    const initialAmplitude = 1;
    const initialPeriod = 0.1;
    const initialPhase = 0;
    const initialSin = [days.map(x => sinEquation(x, initialAmplitude, initialPhase))];

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
      marker: { size: 4 }
    };
    var residualTrace = {
      x: days,
      y: fitResidual,
      mode: 'markers',
      type: 'scatter',
      name: 'Residual',
      marker: { size: 4 }
    };


    const amplitudeSliderSteps = [];
    const phaseSliderSteps = [];
    for (let a = 0; a <= 8; a += 0.1) {
      amplitudeSliderSteps.push({
        method: 'relayout',
        label: a.toFixed(1),
        args: ['yaxis.range', [-a * 1.2, a * 1.2]],
      });
    }
    for (let a = -8000; a <= 0 ; a += 10) {
      phaseSliderSteps.push({
        method: 'relayout',
        label: a.toFixed(0),
        args: [],
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
        steps: phaseSliderSteps,
        active: 10,  // Initial position of the slider
        currentvalue: {
          prefix: 'Phase offset (s): ',
          xanchor: 'right',
          visible: true,
          offset: 75,
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
      yaxis: { title: 'Residual between model and fit', autorange: false, range: [-3, 3] },
    };
    Plotly.newPlot('residual', [residualTrace], residualLayout);
    Plotly.restyle('residual', {'y': [fitResidual]}, 0);

    plot.on('plotly_sliderchange', (event) => {
      if (event.slider.currentvalue.prefix.startsWith('Amplitude')) {
        amplitude = parseFloat(event.step.label);
      }
      if (event.slider.currentvalue.prefix.startsWith('Phase')) {
        phase = parseFloat(event.step.label);
      }
      console.log("phase:", phase);
      const newY = days.map(x => sinEquation(x, amplitude, phase));
      console.log("newY:", newY);
      Plotly.restyle('plot', {'y': [newY]}, 0);
      // const displayDiv = document.getElementById('fit-value');
      // displayDiv.innerHTML = phase*1000;

      // Update residual
      const newResidual = residual_calc(residuals, newY);
      Plotly.restyle('residual', {'y': [newResidual]}, 0);

    });
  })
  .catch(error => {
    // Handle errors here
    console.error('Error:', error);
  });
});