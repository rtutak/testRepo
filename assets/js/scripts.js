var ctx = document.getElementById("myChart");
const backgroundGradient = ctx
  .getContext("2d")
  .createLinearGradient(0, 0, 0, 400);
backgroundGradient.addColorStop(0, "rgb(255, 145, 0)");
backgroundGradient.addColorStop(1, "rgb(255, 241, 165)");

var myChart = new Chart(ctx, {
  type: "bar",
  data: {
    labels: [
      "JAN",
      "FEB",
      "MAR",
      "APR",
      "MAY",
      "JUN",
      "JUL",
      "MAY",
      "SEPT",
      "OCT",
      "NOV",
      "DEC",
    ],
    datasets: [
      {
        data: [19, 15, 19, 12, 14, 15, 12, 11, 13, 19, 13, 15],
        label: "",
        backgroundColor: backgroundGradient,
      },
    ],
  },
  options: {
    responsive: true,
    layout: {
      padding: {
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
      },
    },
    legend: {
      display: false,
    },
    scales: {
      yAxes: [
        {
          gridLines: {
            display: false,
          },
          ticks: {
            display: false,
            min: 0,
            max: 20,
          },
        },
      ],
      xAxes: [
        {
          barPercentage: 0.7,
          gridLines: {
            display: false,
          },
          ticks: {
            fontSize: 11,
          },
        },
      ],
    },
  },
});
