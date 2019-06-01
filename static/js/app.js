function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
  url = `/metadata/${sample}`;

  d3.json(url).then(function(data) {
    console.log(data);
    // Use d3 to select the panel with id of `#sample-metadata`
    var panel = d3.select("#sample-metadata");
   // Use `.html("") to clear any existing metadata
    panel.html("");
  
    // Use `Object.entries` to add each key and value pair to the panel
    console.log(Object.entries(data));

    Object.entries(data).forEach(([key,value]) => {
      console.log(key,value)
      var paragraph = panel.append("p")
      paragraph.text(`${key}: ${value}`)
    });
    //work on bonus
    var wfreq = data.WFREQ;
    wfreq=(wfreq)? wfreq:1
    console.log(wfreq)

    // first attempt, level = (wfreq*10); , continued to play to define. 
    level = (wfreq - 1)*(20)+10
    // Trig to calc meter point
    var degrees = 180 - (level),
         radius = .5;
    var radians = degrees * Math.PI / 180;
    var x = radius * Math.cos(radians);
    var y = radius * Math.sin(radians);
    
    // Path: may have to change to create a better triangle
    var mainPath = 'M -.0 -0.025 L .0 0.025 L ',
         pathX = String(x),
         space = ' ',
         pathY = String(y),
         pathEnd = ' Z';
    var path = mainPath.concat(pathX,space,pathY,pathEnd);
    
    var data = [{ type: 'scatter',
       x: [0], y:[0],
        marker: {size: 28, color:'850000'},
        showlegend: false,
        name: 'speed',
        text: level,
        hoverinfo: 'text+name'},
      { values: [50/9,50/9,50/9,50/9,50/9,50/9,50/9,50/9,50/9,50],
      rotation: 90,
      text: ['9','8','7','6', '5', '4', '3',
                '2', '1', ''],
      textinfo: 'text',
      textposition:'inside',
      marker: {colors:['#84B589','rgba(14, 127, 0, .5)', 'rgba(110, 154, 22, .5)',
                             'rgba(170, 202, 42, .5)', 'rgba(202, 209, 95, .5)',
                             'rgba(210, 206, 145, .5)', 'rgba(232, 226, 202, .5)',
                             '#F4F1E4','#F8F3EC', 'rgba(255, 255, 255, 0)',]},
      labels: ['9','8','7','6','5', '4', '3', '2',
      '1', '0', ''],
      hoverinfo: 'label',
      hole: .5,
      type: 'pie',
      showlegend: false
    }];
    
    var layout = {
      shapes:[{
          type: 'path',
          path: path,
          fillcolor: '850000',
          line: {
            color: '850000'
          }
        }],

      title: '<b>Belly Button Washing Station<br> Scrubs Per Week',
      xaxis: {zeroline:false, showticklabels:false,
                 showgrid: false, range: [-1, 1]},
      yaxis: {zeroline:false, showticklabels:false,
                 showgrid: false, range: [-1, 1]}
    };
    Plotly.newPlot('gauge', data, layout);

    


  })

    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
}
function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  url = `/samples/${sample}`;

  d3.json(url).then(function(data) {
    console.log(data);
    // var sorted_data = [data];

    //sort our information first
    // sorted_data.sort(function(a,b){
    //   return parseFloat(b.sample_values) - parseFloat(a.sample_values)
    // });
    // console.log(sorted_data)

    // Grab values from the response json object to build the plots
    //pull only first 10 values
    var otu_ids = data.otu_ids.slice(0,10).map((item)=>item);
    //test variable pull
    console.log(otu_ids);
    var otu_labels = data.otu_labels.slice(0,10).map((item)=>item);
    console.log(otu_labels);
    var sample_values = data.sample_values.slice(0,10).map((item)=>item);
    console.log(sample_values);

    //Build a Pie Chart
    var trace1 = {
      values: sample_values,
      labels: otu_ids,
      hoverinfo: otu_labels,
      type: "pie"
    };

    var pieData = [trace1];

    //layout
    var pieLayout = {
      title: `<b>Sample: ${sample}, Top 10 `
    }

    Plotly.newPlot("pie",pieData, pieLayout);

    // @TODO: Build a Bubble Chart using the sample data
    var trace2 = {
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: 'markers',
      marker: {
        size: sample_values,
        color: otu_ids
      }
    };

    var bubbleData = [trace2]

    var bubbleLayout = {
      title: ` <b>Sample: ${sample} Biodiversity Bubble Chart`,
      showlegend:false,
      xaxis: {
        title: "OTU ID"
      }
    }

    Plotly.newPlot('bubble',bubbleData, bubbleLayout);

  })
};

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();


