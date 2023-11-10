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

// const T0diff = [
//   -0.859352,
//   -2.66164,
//   -3.26074,
//   -6.41909,
//   -8.74714,
//   -15.4034,
//   -21.7123,
//   -29.5946,
//   -37.8259,
//   -47.6842,
//   -56.7043,
//   -67.4222,
//   -81.057,
//   -99.5933,
//   -117.245,
//   -133.946,
//   -154.881,
//   -169.906,
//   -184.836,
//   -204.509,
//   -224.476,
//   -244.115,
//   -276.808,
//   -292.775,
//   -311.913,
//   -548.692,
//   -592.263,
// ];

G = 6.6743 * 10 ** (-11);
c = 299792458;
Mo = 1.989 * 10 ** 30;
Mc = 1.248866 * Mo;
Mp = 1.338186 * Mo;
Pb = 0.10225155555593921919 * 86400;
e = 0.0877774229;
dPdT = (-192 * Math.PI * G **(5/3)) / (5 * c ** 5) *
  ( Pb / (2*Math.PI))**(-5/3) *
  (1 - e**2)**(-7/2) *
  (1 + 73.0/24.0 * e**2 + 37.0/96.0 * e**4) *
  (Mp * Mc / (Mp + Mc)**(1/3));

console.log(dPdT);


const T0diff = [];
for (let i = 0; i < deltaTyear.length; i++) {
  T0diff.push( 1e3 * dPdT * (deltaTyear[i] * 86400 * 365) ** 2 / Pb / 2);
}
console.log(T0diff);



function residual_calc(data, model) {
  const result = [];
  console.log("data:", data);
  console.log("model:", model);
  for (let i = 0; i < model.length; i++) {
    const difference = data[i] - model[i];
    result.push(difference);
  }
  return result;
}

document.addEventListener('DOMContentLoaded', function () {
  // Initial empty plot data
  const epochLabels = [];
  for (let i = 1; i <= 27; i++) {
    epochLabels.push(`Epoch ${i}`);
  }
  var calcDataTrace = {
    x: deltaTyear,
    y: [],
    mode: 'markers',
    type: 'scatter',
    name: 'Calculated Data',
    text: epochLabels,
    marker: { size: 12 }
  };
  var predictedDataTrace = {
    x: deltaTyear,
    y: [],
    mode: 'lines',
    type: 'scatter',
    name: 'Predicted Data',
    text: epochLabels,
    marker: { size: 12 }
  };
  const layout = {
    width: 800,
    height: 600,
    title: 'Change in the Double Pulsar Peristron',
    xaxis: { title: 'Delta T (years)' },
    yaxis: { title: 'Peristron difference (milliseconds)' },
  };

  // Render the empty plot on page load
  Plotly.newPlot('plot', [calcDataTrace, predictedDataTrace], layout);
  var residualTrace = {
    x: deltaTyear,
    y: [],
    mode: 'markers',
    type: 'scatter',
    name: 'Predicted Data',
    text: epochLabels,
    marker: { size: 12 }
  };
  const residualLayout = {
    width: 800,
    height: 600,
    title: 'Difference between Calculated and Predicted Data',
    xaxis: { title: 'Delta T (years)' },
    yaxis: { title: 'Peristron difference (milliseconds)' },
  };
  Plotly.newPlot('residual', [residualTrace], residualLayout);

  document.getElementById('data-form').addEventListener('submit', function (event) {
      event.preventDefault();
      // Read data from the input fields and store it in an array
      const inputDataArray = [];
      for (let i = 1; i <= 27; i++) {
        const inputField = document.getElementById(`data${i}`);
        const inputValue = parseFloat(inputField.value);
        inputDataArray.push(inputValue);
      }
      console.log(inputDataArray);

      // Update the plot with all the traces
      Plotly.restyle('plot', {'y': [inputDataArray]}, 0);

      residual_array = residual_calc(inputDataArray, T0diff);
      console.log("residual_array:", residual_array);
      Plotly.restyle('residual', {'y': [residual_array]}, 0);
  });


  document.getElementById('plot_expected').addEventListener('submit', function (event) {
    event.preventDefault();

    // Update the plot with all the traces
    Plotly.restyle('plot', {'y': [T0diff]}, 1);
  });
});