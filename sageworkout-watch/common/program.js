export const PROGRAM = {
  months: {
    "Апрель": { pu: [10, 10, 10, 10, 10], sq: [10, 10, 10], plups: [1, 1, 1, 1, 1], pl: [30, 30, 30] },
    "Май": { pu: [10, 10, 10, 10, 10, 10], sq: [10, 10, 10, 10], plups: [2, 2, 2, 2, 2, 2], pl: [40, 40, 40] },
    "Июнь": { pu: [15, 15, 15, 15, 15], sq: [15, 15, 15, 15, 15], plups: [3, 3, 3, 3, 3, 3, 3, 3], pl: [50, 50, 50] },
    "Июль": { pu: [15, 15, 15, 15, 15, 15], sq: [20, 20, 20, 20, 20, 20], plups: [4, 4, 4, 4, 4, 4, 4, 4, 4, 4], pl: [45, 45, 45, 45] },
    "Август": { pu: [20, 20, 20, 20, 20], sq: [30, 30, 30, 30, 30], plups: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5], pl: [60, 60, 60] },
    "Сентябрь": { pu: [25, 25, 25, 25], sq: [30, 30, 30, 30, 30, 30], plups: [8, 8, 8, 8, 8, 8, 8, 8], pl: [60, 60, 60, 60] },
    "Октябрь": { pu: [35, 35, 35], sq: [40, 40, 40, 40, 40], plups: [10, 10, 10, 10, 10, 10, 10, 10, 10, 10], pl: [90, 90, 90] },
    "Ноябрь": { pu: [50, 50], sq: [50, 50, 50, 50], plups: [15, 15, 15, 15, 15, 25], pl: [100, 100, 100] },
    "Декабрь": { pu: [100], sq: [50, 50, 50, 50], plups: [10, 10, 10, 10, 10, 10, 10, 10, 10, 10], pl: [120, 120, 120] }
  }
};

export const MONTH_NAMES = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];

export function getWorkout(date) {
  const day = date.getDay();
  const monthName = MONTH_NAMES[date.getMonth()];
  const data = PROGRAM.months[monthName] || PROGRAM.months["Апрель"];
  
  let type = "Rest";
  if ([1, 3, 5].includes(day)) type = "Volume";
  else if ([2, 4].includes(day)) type = "Recovery";
  else if (day === 6) type = "Tech";

  let volume = JSON.parse(JSON.stringify(data));
  if (type === "Tech") {
    for (let k in volume) {
      volume[k] = volume[k].map(v => Math.ceil(v / 2)).slice(0, Math.ceil(volume[k].length / 2));
    }
  } else if (type === "Recovery") {
    volume = { pl: volume.pl };
  } else if (type === "Rest") {
    volume = null;
  }

  return { type, volume, monthName };
}
