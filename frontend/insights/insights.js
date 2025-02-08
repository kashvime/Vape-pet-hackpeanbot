// Load Chart.js 
const script = document.createElement('script');
script.src = "https://cdn.jsdelivr.net/npm/chart.js";
document.head.appendChild(script);

// This is the vape data with start & end dates, puffs, and cost per vape
const vapeData = [
  { startDate: "2024-01-01", endDate: "2024-01-03", puffsPerVape: 400, costPerVape: 12 },
  { startDate: "2024-01-03", endDate: "2024-01-06", puffsPerVape: 500, costPerVape: 14 },
  { startDate: "2024-01-06", endDate: "2024-01-10", puffsPerVape: 600, costPerVape: 16 },
  { startDate: "2024-01-10", endDate: "2024-01-12", puffsPerVape: 300, costPerVape: 10 },
  { startDate: "2024-01-10", endDate: "2024-01-17", puffsPerVape: 700, costPerVape: 27 },
  { startDate: "2024-01-18", endDate: "2024-01-20", puffsPerVape: 450, costPerVape: 15 },
  { startDate: "2024-01-19", endDate: "2024-01-25", puffsPerVape: 350, costPerVape: 12 }
];

// This function finds which week a date belongs to (like "2024-W1" for the first week of 2024)
function getWeek(date) {
  let d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 4 - (d.getDay() || 7));
  let year = d.getFullYear();
  let yearStart = new Date(year, 0, 1);
  let weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
  return `${year}-W${weekNo}`;
}

// This function converts a week key (like "2024-W1") to a date range (like "Jan 1 - Jan 7")
function getWeekLabelFromKey(weekKey) {
  // Split the weekKey into year and week number
  let parts = weekKey.split("-W");
  let year = parseInt(parts[0]);
  let weekNumber = parseInt(parts[1]);
  
  // Calculate the Monday of the given week
  // This formula gets the Monday date by taking Jan 1 and adding (weekNumber-1)*7 days, then adjusting to Monday.
  let simpleDate = new Date(year, 0, 1 + (weekNumber - 1) * 7);
  let day = simpleDate.getDay();
  let monday = new Date(simpleDate);
  // If simpleDate is not a Monday, adjust it: if it's Sunday (day 0) or any other day
  if (day !== 1) {
    // For Sunday (0) or other days, subtract the appropriate number of days to reach Monday.
    let diff = (day === 0 ? 6 : day - 1);
    monday.setDate(simpleDate.getDate() - diff);
  }
  
  // Calculate the Sunday of the week by adding 6 days to Monday
  let sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  
  // Format both dates as "Mon D" (e.g., "Jan 1")
  const options = { month: 'short', day: 'numeric' };
  let mondayStr = monday.toLocaleDateString('en-US', options);
  let sundayStr = sunday.toLocaleDateString('en-US', options);
  
  return `${mondayStr} - ${sundayStr}`;
}

// This groups puffs and money spent into weeks
const weeklyData = {};
vapeData.forEach(session => {
  let start = new Date(session.startDate);
  let end = new Date(session.endDate);
  let totalDays = ((end - start) / (1000 * 60 * 60 * 24)) + 1;
  let dailyPuffs = session.puffsPerVape / totalDays;
  let dailyCost = session.costPerVape / totalDays;

  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    let weekKey = getWeek(d);
    if (!weeklyData[weekKey]) {
      weeklyData[weekKey] = { totalPuffs: 0, totalCost: 0 };
    }
    weeklyData[weekKey].totalPuffs += dailyPuffs;
    weeklyData[weekKey].totalCost += dailyCost;
  }
});

// Sorting the weeks and converting them to  date ranges
const weekKeys = Object.keys(weeklyData).sort();
const weeks = weekKeys.map(key => getWeekLabelFromKey(key));

const totalPuffsPerWeek = weekKeys.map(week => weeklyData[week].totalPuffs);
const totalCostPerWeek = weekKeys.map(week => weeklyData[week].totalCost);

// This calculates the change from last week to this week
function calculateChange(current, previous) {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
}

let lastPuffs = totalPuffsPerWeek[totalPuffsPerWeek.length - 1];
let prevPuffs = totalPuffsPerWeek[totalPuffsPerWeek.length - 2] || lastPuffs;
let puffsChange = calculateChange(lastPuffs, prevPuffs);

let lastCost = totalCostPerWeek[totalCostPerWeek.length - 1];
let prevCost = totalCostPerWeek[totalCostPerWeek.length - 2] || lastCost;
let costChange = calculateChange(lastCost, prevCost);

// Show insights
let puffsMessage = `Your vape usage ${puffsChange > 0 ? "increased" : "decreased"} by <span class="insights-highlight ${puffsChange > 0 ? "increase" : "decrease"}">${Math.abs(puffsChange).toFixed(1)}%</span> compared to last week.`;
let costMessage = `Your spending ${costChange > 0 ? "increased" : "decreased"} by <span class="insights-highlight ${costChange > 0 ? "increase" : "decrease"}">$${Math.abs(lastCost - prevCost).toFixed(2)}</span> compared to last week.`;

document.getElementById("insights").innerHTML = `<p>${puffsMessage}</p><p>${costMessage}</p>`;

// If spending decreased, predict yearly savings
if (costChange < 0) {
  let weeklySavings = Math.abs(lastCost - prevCost);
  let yearlySavings = weeklySavings * 52;
  let savingsMessage = `If you keep this up, your estimated savings for the year is <span class="insights-highlight decrease">$${yearlySavings.toFixed(2)}</span>.`;
  document.getElementById("savings-prediction").innerHTML = savingsMessage;
}

// puffs per week line chart
script.onload = function() {
  new Chart(document.getElementById("puffsChart").getContext("2d"), {
    type: "line",
    data: {
      labels: weeks,
      datasets: [{
        label: "Puffs Per Week",
        data: totalPuffsPerWeek,
        borderColor: "#a389f7",
        backgroundColor: "rgba(138, 43, 226, 0.2)",
        fill: false,
        tension: 0.4,
        borderWidth: 3
      }]
    }
  });

  //dollars per week bar chart
   new Chart(document.getElementById("costChart").getContext("2d"), {
    type: "bar",
    data: {
      labels: weeks,
      datasets: [{
        label: "Dollars Spent Per Week",
        data: totalCostPerWeek,
        backgroundColor: "#c599ff",
        borderWidth: 2
      }]
    }
  });
};