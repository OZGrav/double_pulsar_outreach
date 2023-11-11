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


let calcT0diff = [];
let theoryT0diff = [];
for (let i = 0; i < deltaTyear.length; i++) {
  calcT0diff.push(NaN);
  theoryT0diff.push(NaN);
}
console.log(theoryT0diff);



function residual_calc(data, model) {
  const result = [];
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
      calcT0diff = [];
      for (let i = 1; i <= 26; i++) {
        const inputField = document.getElementById(`data${i}`);
        const inputValue = parseFloat(inputField.value);
        calcT0diff.push(inputValue);
      }
      console.log(calcT0diff);

      // Update the plot with all the traces
      Plotly.restyle('plot', {'y': [calcT0diff]}, 0);

      residual_array = residual_calc(calcT0diff, theoryT0diff);
      console.log("residual_array:", residual_array);
      Plotly.restyle('residual', {'y': [residual_array]}, 0);
  });


  document.getElementById('plot_expected').addEventListener('submit', function (event) {
    event.preventDefault();

    // Read data from the input fields and store it in an array
    var mc = parseFloat(document.getElementById("mc").value);
    if ( isNaN(mc) ) {
      mc = 1.248866;
    }
    var mp = parseFloat(document.getElementById("mp").value);
    if ( isNaN(mp) ) {
      mp = 1.338186;
    }
    var Pb = parseFloat(document.getElementById("Pb").value);
    if ( isNaN(Pb) ) {
      Pb = 0.10225155555593921919 * 86400;
    }
    var e = parseFloat(document.getElementById("e").value);
    if ( isNaN(e) ) {
      e = 0.0877774229;
    }

    G = 6.6743 * 10 ** (-11);
    c = 299792458;
    Mo = 1.989 * 10 ** 30;
    dPdT = (-192 * Math.PI * G **(5/3)) / (5 * c ** 5) *
      ( Pb / (2*Math.PI))**(-5/3) *
      (1 - e**2)**(-7/2) *
      (1 + 73.0/24.0 * e**2 + 37.0/96.0 * e**4) *
      (mp * Mo * mc * Mo / (mp * Mo + mc * Mo)**(1/3));

    theoryT0diff = [];
    for (let i = 0; i < deltaTyear.length; i++) {
      theoryT0diff.push( 1e3 * dPdT * (deltaTyear[i] * 86400 * 365) ** 2 / Pb / 2);
    }
    console.log("theoryT0diff", theoryT0diff);
    console.log("calcT0diff:", calcT0diff);

    // Update the plot with all the traces
    Plotly.restyle('plot', {'y': [theoryT0diff]}, 1);

    residual_array = residual_calc(calcT0diff, theoryT0diff);
    console.log("residual_array:", residual_array);
    Plotly.restyle('residual', {'y': [residual_array]}, 0);
  });
});
