let steps = 0;
let lastAccel = { x: 0, y: 0, z: 0 };
const threshold = 2.2;

function startTracking() {
    window.addEventListener("devicemotion", detectStep);
}

function detectStep(event) {
    let acc = event.accelerationIncludingGravity;
    if (!acc) return;

    let movement =
        Math.abs(acc.x - lastAccel.x) +
        Math.abs(acc.y - lastAccel.y) +
        Math.abs(acc.z - lastAccel.z);

    if (movement > threshold) {
        steps++;
        document.getElementById("steps").innerText = steps;
        saveSteps();
    }

    lastAccel = acc;
}

function saveSteps() {
    fetch("/save-steps/", {
        method: "POST",
        headers: {
            "X-CSRFToken": csrfToken,
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: `steps=${steps}`
    });
}

fetch("/weekly-summary/")
  .then(res => res.json())
  .then(data => {
      new Chart(ctx, {
          type: "bar",
          data: {
              labels: ["Steps", "Distance (km)", "Calories"],
              datasets: [{
                  data: [
                      data.total_steps,
                      data.total_distance,
                      data.total_calories
                  ]
              }]
          }
      });
  });
