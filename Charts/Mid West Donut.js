getData();
  
        async function getData() {
            const response = await fetch(
'http://localhost:5000/api/v1.0/region/Mid West');
            console.log(response);
            const data = await response.json();
            console.log(data);
            length = data.length;
            console.log(length);

            
            labels = ['1', '2', '3', '4', '5'];
            values = [0, 0, 0, 0, 0];
            original_labels = []
            original_values = []
            for (i = 0; i < length; i++) {
                original_labels.push(data[i].veh_num);
                original_values.push(data[i].region);
            }
            for (i = 0; i < original_labels.length; i++) {
                if (original_labels[i] == '1') {
                    values[0] += 1}
                else if (original_labels[i] == '2') {
                    values[1] += 1}
                else if (original_labels[i] == '3') {
                    values[2] += 1}
                else if (original_labels[i] == '4') {
                    values[3] += 1}
                else if (original_labels[i] == '5') {
                        values[3] += 1}
                };

new Chart(
    document.getElementById('donut'),
    {
    type: 'doughnut',
    data: {
    labels: labels,
    datasets: [{
      label: ['1', '2', '3', '4', '5'],
      data: values,
      backgroundColor: [
        'rgb(255, 99, 132)',
        'rgb(54, 162, 235)',
        'rgb(255, 205, 86)',
        'rgb(50, 205, 50)',
        'rgb(200, 200, 200)'
      ],
      hoverOffset: 4
    }]
  },
  tooltips: {
    callbacks: {
        callbacks: {
            label: function(tooltipItem, data) {
               var dataset = data.datasets[tooltipItem.datasetIndex];
              var total = dataset.data.reduce(function(previousValue, currentValue, currentIndex, array) {
                return previousValue + currentValue;
              });
              var currentValue = dataset.data[tooltipItem.index];
              var precentage = Math.floor(((currentValue/total) * 100)+0.5);
              return precentage + "%";
      }
    }
  } },
  options: {
    legend: {
      position: 'bottom',},
    title: {
        display: true,
        text: 'Number of Vehicles in Accident (Mid West)'
}
}}
)};