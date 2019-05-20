const lineColor = "#414141";

export const chartConfig = () => {
  return {

    legend: {
      display: false
    },
    options: {

      responsive: true,
      maintainAspectRatio: false,
      scales: {
        yAxes: [
          {
            gridLines: {
              display: true,
              lineWidth: 1,
              color: "rgba(0,0,0,0.1)",
              drawBorder: false
            },
            ticks: {
              beginAtZero: true,

              padding: 20
            }
          }
        ],
        xAxes: [
          {
            gridLines: {
              display: false
            }
          }
        ]
      },
      elements: {
          line: {
              tension: 0
          }
      }
    },
    data: {
      labels: [],
      datasets: [
        {
          label: "recent",
          data: [],
          borderColor: lineColor,
          pointBackgroundColor: "transparent", //lineColor,
          pointBorderColor: "transparent", //lineColor,
          pointHoverBackgroundColor: lineColor,
          pointHoverBorderColor: lineColor,
          pointRadius: 4,
          pointBorderWidth: 2,
          pointHoverRadius: 5,
          fill: false,
          borderWidth: 1,
          backgroundColor: "#e5eff5"
        }
      ]
    }
  }
};
