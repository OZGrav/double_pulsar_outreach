const deltaTyear = [
  0.0636267,
  0.142842,
  0.228229,
  0.309678,
  0.358675,
  0.470363,
  0.550169,
  0.647864,
  0.73044,
  0.820025,
  0.897014,
  0.980997,
  1.07141,
  1.19431,
  1.29815,
  1.38326,
  1.48431,
  1.55712,
  1.62261,
  1.71334,
  1.78722,
  1.86647,
  1.98656,
  2.04395,
  2.1089,
  2.79729,
  2.90367
];

const T0diff = [
  -0.859352,
  -2.66164,
  -3.26074,
  -6.41909,
  -8.74714,
  -15.4034,
  -21.7123,
  -29.5946,
  -37.8259,
  -47.6842,
  -56.7043,
  -67.4222,
  -81.057,
  -99.5933,
  -117.245,
  -133.946,
  -154.881,
  -169.906,
  -184.836,
  -204.509,
  -224.476,
  -244.115,
  -276.808,
  -292.775,
  -311.913,
  -548.692,
  -592.263,
];

document.addEventListener('DOMContentLoaded', function () {
  // Initial empty plot data
  const emptyPlotData = [];
  const layout = {
    title: 'J1909-3744 Residuals',
    xaxis: { title: 'Delta T (years)' },
    yaxis: { title: 'Peristron difference (ms)' },
  };
  // Initialize an array to store traces
  let traces = [];

  // Render the empty plot on page load
  Plotly.newPlot('plot', emptyPlotData, layout);

  document.getElementById('data-form').addEventListener('submit', function (event) {
      event.preventDefault();
      // Read data from the input fields and store it in an array
      const inputDataArray = [];
      const epochLabels = [];
      for (let i = 1; i <= 27; i++) {
        const inputField = document.getElementById(`data${i}`);
        const inputValue = parseFloat(inputField.value);
        inputDataArray.push(inputValue);
        epochLabels.push(`Epoch ${i}`);
      }
      console.log(inputDataArray);

      var calcDataTrace = {
        x: deltaTyear,
        y: inputDataArray,
        mode: 'markers',
        type: 'scatter',
        name: 'Calculated Data',
        text: epochLabels,
        marker: { size: 12 }
      };
      // Add the new trace to the array of traces
      traces.push(calcDataTrace);

      // Update the plot with all the traces
      Plotly.newPlot('plot', traces, layout);
  });


  document.getElementById('plot_expected').addEventListener('submit', function (event) {
    event.preventDefault();
    const epochLabels = [];
    for (let i = 1; i <= 27; i++) {
      epochLabels.push(`Epoch ${i}`);
    }

    var predictedDataTrace = {
      x: deltaTyear,
      y: T0diff,
      mode: 'lines',
      type: 'scatter',
      name: 'Predicted Data',
      text: epochLabels,
      marker: { size: 12 }
    };
    // Add the new trace to the array of traces
    traces.push(predictedDataTrace);

    // Update the plot with all the traces
    Plotly.newPlot('plot', traces, layout);
  });
});