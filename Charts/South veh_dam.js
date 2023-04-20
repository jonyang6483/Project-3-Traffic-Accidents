

getData();
  
        async function getData() {
            const response = await fetch(
'http://localhost:5000/api/v1.0/severity/South');
            console.log(response);
            const data = await response.json();
            console.log(data);
            length = data.length;
            console.log(length);

            
            labels = ['No Damage', 'Minor Damage', 'Functional Damage', 'Disabling Damage', 'Not Reported', 'Reported as Unknown'];
            values = [0, 0, 0, 0, 0, 0];
            original_labels = []
            original_values = []
            for (i = 0; i < length; i++) {
                original_labels.push(data[i].veh_damage);
                original_values.push(data[i].num_injured);
            }
            for (i = 0; i < original_labels.length; i++) {
                if (original_labels[i] == 'Not Reported') {
                    values[4] += original_values[i]}
                else if (original_labels[i] == 'Disabling Damage') {
                    values[3] += original_values[i]}
                else if (original_labels[i] == 'Minor Damage') {
                    values[1] += original_values[i]}
                else if (original_labels[i] == 'Functional Damage') {
                    values[2] += original_values[i]}
                else if (original_labels[i] == 'No Damage') {
                    values[0] += original_values[i]}
                else if (original_labels[i] == 'Reported as Unknown') {
                    values[5] += original_values[i]}
                };


  new Chart(
    document.getElementById('bar-chart'),
    {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Number of Injured',
            backgroundColor: ["#3e95cd",
                                              "#8e5ea2", 
                                              "#3cba9f", 
                                              "#e8c3b9",
                                              "#CD5C5C", 
                                              "#40E0D0"],
            data: values
          }
        ]
      },
      options: {
        legend: { display: false },
        title: {
            display: true,
            text: 'Vehicle Damage in the South'
    }
}}
  )
};