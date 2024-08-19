let people = ["Alice", "Bob", "Charlie"];
const canvas = document.getElementById("wheel");
const ctx = canvas.getContext("2d");
const spinButton = document.getElementById("spinButton");
const namesInput = document.getElementById("namesInput");
const resultDiv = document.getElementById("result");
const radius = canvas.width / 2;

let startAngle = 0;
let spinAngleStart = 10;
let spinTime = 0;
let spinTimeTotal = 0;

function drawWheel() {
  let slices = people.length;
  let sliceAngle = (2 * Math.PI) / slices;

  for (let i = 0; i < slices; i++) {
    const angle = startAngle + i * sliceAngle;
    ctx.beginPath();
    ctx.fillStyle = getColor(i);
    ctx.moveTo(radius, radius);
    ctx.arc(radius, radius, radius, angle, angle + sliceAngle);
    ctx.fill();
    ctx.save();
    ctx.translate(
      radius + Math.cos(angle + sliceAngle / 2) * radius * 0.6,
      radius + Math.sin(angle + sliceAngle / 2) * radius * 0.6
    );
    ctx.rotate(angle + sliceAngle / 2);
    ctx.fillStyle = "white";
    ctx.font = "bold 20px Arial";
    ctx.shadowColor = "black";
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    ctx.shadowBlur = 3;
    ctx.fillText(people[i], -ctx.measureText(people[i]).width / 2, 0);
    ctx.restore();
  }
}

function getColor(index) {
  // 20 colors that are easy to distinguish
  const colors = [
    "#FF6633",
    "#FFB399",
    "#FF33FF",
    "#FFFF99",
    "#00B3E6",
    "#E6B333",
    "#3366E6",
    "#999966",
    "#99FF99",
    "#B34D4D",
    "#80B300",
    "#809900",
    "#E6B3B3",
    "#6680B3",
    "#66991A",
    "#FF99E6",
    "#CCFF1A",
    "#FF1A66",
    "#E6331A",
    "#33FFCC",
  ];
  return colors[index % colors.length];
}

function rotateWheel() {
  spinTime += 30;
  if (spinTime >= spinTimeTotal) {
    stopRotateWheel();
    return;
  }
  const spinAngle =
    spinAngleStart - easeOut(spinTime, 0, spinAngleStart, spinTimeTotal);
  startAngle += (spinAngle * Math.PI) / 180;
  drawWheel();
  requestAnimationFrame(rotateWheel);
}

function stopRotateWheel() {
  const sliceAngle = (2 * Math.PI) / people.length;

  const degrees = (startAngle * 180) / Math.PI + 90;
  const arcd = (sliceAngle * 180) / Math.PI;
  const index = Math.floor((360 - (degrees % 360)) / arcd);
  resultDiv.textContent = `Selected: ${people[index]}`;
}

function easeOut(t, b, c, d) {
  t /= d;
  t--;
  return c * (t * t * t + 1) + b;
}

spinButton.addEventListener("click", () => {
  spinAngleStart = Math.random() * 10 + 10;
  spinTime = 0;
  spinTimeTotal = Math.random() * 6000 + 12000;
  drawWheel();
  rotateWheel();
});

function setNames(newValue) {
  const oldValue = window.localStorage.getItem("names");
  window.localStorage.setItem("names", newValue);
  const event = new StorageEvent("storage", {
    key: "names",
    oldValue,
    newValue,
  });
  window.dispatchEvent(event);
}

// on local storage change, update names
window.addEventListener("storage", handleStorageChange);

function handleStorageChange(event) {
  console.log("storage event", JSON.parse(localStorage.getItem("names")));
  const names = JSON.parse(localStorage.getItem("names"));
  if (names) {
    if (namesInput.value.trim() !== names.join("\n")) {
      namesInput.value = names.join("\n");
    }
    people = names;
    drawWheel();
  }
}

namesInput.addEventListener("input", () => {
  const names = namesInput.value
    .trim()
    .split("\n")
    .map((name) => name.trim())
    .filter((name) => name);

  setNames(JSON.stringify(names));
});

handleStorageChange();
drawWheel();
