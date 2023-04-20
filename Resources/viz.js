time_dict = {
    "Morning": ["6:00am-6:59am","7:00am-7:59am","8:00am-8:59am","9:00am-9:59am","10:00am-10:59am", "11:00am-11:59am"],
    "Afternoon": ["12:00pm-12:59pm", "1:00pm-1:59pm", "2:00pm-2:59pm", "3:00pm-3:59pm", "4:00pm-4:59pm", "5:00pm-5:59pm" ],
    "Night": ["6:00pm-6:59pm","7:00pm-7:59pm","8:00pm-8:59pm","9:00pm-9:59pm","10:00pm-10:59pm", "11:00pm-11:59pm"],
    "Early Morning": ["12:00am-12:59am","1:00am-1:59am","2:00am-2:59am","3:00am-3:59am","4:00am-4:59am","5:00am-5:59am"]
    }

// ----------------------------------------------------

var timeChart;
var dunChart;
var injuryChart;
var time = "Early Morning"

function timeChanged(time) {
    var region = document.getElementById("region").value;
    var url = 'http://localhost:5000/api/v1.0/time/' + region + "/" + time;
    updateTime(time);
    async function updateTime(time) {
        const response = await fetch(url)
        const data = await response.json();
        
        var values = [0,0,0,0,0,0]
        var labels = time_dict[time]
        
        for (i=0; i< data.length; i++) {
            // console.log(data[i])
            if (data[i].hour == labels[0]) {
                values[0] += 1
            } else if (data[i].hour == labels[1]) {
                values[1] += 1
            } else if (data[i].hour == labels[2]) {
                values[2] += 1
            } else if (data[i].hour == labels[3]) {
                values[3] += 1
            } else if (data[i].hour == labels[4]) {
                values[4] += 1
            } else if (data[i].hour == labels[5]) {
                values[5] += 1
            }
        }
        console.log("labels: ",url);
        timeChart.data.datasets[0].data = values;
        timeChart.data.labels = labels;
        timeChart.update();
    };
};

// --------------------------------------------------------------

function regionChanged(region) {
    var time = document.getElementById("dayTime").value;
    timeChanged(time);
    doughnutChanged(region);
    barChanged("passenger_inj");
}

function doughnutChanged(region) {

    url = 'http://localhost:5000/api/v1.0/make/' + region;
    doughnutUpdate();
    async function doughnutUpdate() {
        const response2 = await fetch(url)
        const data2 = await response2.json();
        console.log('data2: ', data2)

        var make=[];
        var count=[];
        for (i=0; i < 7; i++) {
            make.push(data2[i].make);
            count.push(data2[i].acc_count)
        }
        console.log("make: ",make)
        console.log("count: ", count)

        dunChart.data.datasets[0].data = count;
        dunChart.data.labels = make;
        dunChart.update();
    }
}
// --------------------------------------------------------------

function barChanged(passenger_vehicle) {
    var region = document.getElementById("region").value;
    url = 'http://localhost:5000/api/v1.0/severity/' + region + "/" + passenger_vehicle;
    barUpdate();
    async function barUpdate() {
        const response = await fetch(url)
        const data = await response.json();
        console.log('data2: ', data)

        var type=[];
        var inj_count=[];
        if (passenger_vehicle == "passenger_inj") {
            for (i=0; i < data.length; i++) {
                if (data[i].passenger_inj == 'No Apparent Injury (O)') {
                    d3.select("#no_injury").text(data[i].count);
                } else {
                    type.push(data[i].passenger_inj);
                    inj_count.push(data[i].count)
                }
            }
        
        } else {
            for (i=0; i < data.length; i++) {
            
                type.push(data[i].veh_damage);
                inj_count.push(data[i].count)
        
            }
            d3.select("#no_injury").text("No Data");
        }

        injuryChart.data.datasets[0].data = inj_count;
        injuryChart.data.labels = type;
        injuryChart.update();
    }
};

// --------------------------------------------------------------

url = 'http://localhost:5000/api/v1.0/time/All/' + time;
// getData();
window.onload =async function getData() {
    const response = await fetch(url)
    const data = await response.json();
    console.log(url)
    console.log(data);

    var values = [0,0,0,0,0,0]
    var labels = time_dict[time]

    for (i=0; i< data.length; i++) {
        // console.log(data[i])
        if (data[i].hour == labels[0]) {
            values[0] += 1
        } else if (data[i].hour == labels[1]) {
            values[1] += 1
        } else if (data[i].hour == labels[2]) {
            values[2] += 1
        } else if (data[i].hour == labels[3]) {
            values[3] += 1
        } else if (data[i].hour == labels[4]) {
            values[4] += 1
        } else if (data[i].hour == labels[5]) {
            values[5] += 1
        }
    }

    timeChart = new Chart(
        document.getElementById('timeChart'),
        {
            type: 'radar',
            data: {
            labels: labels,
            datasets: [
                {
                label: 'Number of Accidents by Hour',
                backgroundColor: ["#3e95cd",
                                    "#8e5ea2", 
                                    "#3cba9f", 
                                    "#e8c3b9",
                                    "#CD5C5C", 
                                    "#40E0D0",],
                data: values,
                fill: true,
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgb(255, 99, 132)',
                pointBackgroundColor: 'rgb(255, 99, 132)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgb(255, 99, 132)'
                }
            ]
            },
            options: {
                legend: { display: false },
                title: {
                    display: true,
                    text: 'Vehicle Damage in the South'
                }
            }
        }
    );
    
    // ------------------------------------------------
    
    url = 'http://localhost:5000/api/v1.0/make/All'
    const response2 = await fetch(url)
    const data2 = await response2.json();
    console.log('data2: ', data2)

    var make=[];
    var count=[];
    for (i=0; i < 7; i++) {
        make.push(data2[i].make);
        count.push(data2[i].acc_count)
    }
    console.log("make: ",make)
    console.log("count: ", count)

    dunChart = new Chart(
        document.getElementById('dunChart'),
            {
            type: 'doughnut',
            data: {
                labels: make,
                datasets: [{
                    label: "Top 7 Makes That Get Into Most Accidents",
                    data: count,
                    backgroundColor: ["#3e95cd",
                                    "#8e5ea2", 
                                    "#3cba9f", 
                                    "#e8c3b9",
                                    "#CD5C5C", 
                                    "#40E0D0",
                                    "#340505"],
                    hoverOffset: 7
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
                }
            },

            options: {
                legend: {
                position: 'bottom',},
                title: {
                    display: true,
                    text: 'Number of Vehicles in Accident (South)'
                }
            }
        }
    );

    // ------------------------------------------------
    
    url = 'http://localhost:5000/api/v1.0/severity/All/passenger_inj'
    const response3 = await fetch(url);
    const data3 = await response3.json();
    console.log('data3: ', data3);
    var type=[];
    var inj_count=[];
    var no_inj = []
    for (i=0; i < data3.length; i++) {
        if (data3[i].passenger_inj == 'No Apparent Injury (O)') {
            d3.select("#no_injury").text(data3[i].count);
        } else {
            type.push(data3[i].passenger_inj);
            inj_count.push(data3[i].count)
        }
    }
    // (data3[i].passenger_inj != 'No Apparent Injury (O)')
    
    console.log("make: ",type)
    console.log("count: ", inj_count)

    injuryChart = new Chart(
        document.getElementById("injuries"),
        {
            type: 'bar',
            data: {
                labels: type,
                datasets: [{
                    label: 'Number of Occurance by Severity',
                    data: inj_count,
                    backgroundColor: ["#3e95cd",
                                    "#8e5ea2", 
                                    "#3cba9f", 
                                    "#e8c3b9",
                                    "#CD5C5C", 
                                    "#40E0D0",],
                }]
            },
            options: {
                elements: {
                    line: {
                        borderWidth: 3
                    }
    
                }
            }
        }
    );

};
