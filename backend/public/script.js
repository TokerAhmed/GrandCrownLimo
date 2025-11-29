const rideTab = document.getElementById("rideTab");
const hourTab = document.getElementById("hourTab");
const rideForm = document.getElementById("rideForm");
const hourForm = document.getElementById("hourForm");
const successMsg = document.getElementById("successMessage");

// Rates per hour for hour bookings
const RATES = {
  "sedan": 40,
  "suv": 60,
  "full-size-suv": 80
};
const BASE_FEE = 10; // optional base booking fee

// Tab switching
rideTab.addEventListener("click", () => {
  rideTab.classList.add("active");
  hourTab.classList.remove("active");
  rideForm.classList.add("active");
  hourForm.classList.remove("active");
});

hourTab.addEventListener("click", () => {
  hourTab.classList.add("active");
  rideTab.classList.remove("active");
  hourForm.classList.add("active");
  rideForm.classList.remove("active");
});

// Helper to calculate estimate
function calcHourEstimate(hours, carType) {
  const rate = RATES[carType] || 0;
  const total = rate * Number(hours) + BASE_FEE;
  return total;
}

//form submission
document.querySelectorAll("form").forEach(form => {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    let formData = {};
    if (form.id === "rideForm") {
      formData = {
        name: form.querySelector("input[placeholder='Full Name']").value,
        phone: form.querySelector("input[placeholder='Phone Number']").value,
        pickup: form.querySelector("input[placeholder='Pickup Location']").value,
        dropoff: form.querySelector("input[placeholder='Drop-off Location']").value,
        pickupTime: form.querySelector("#pickupTime1").value,
        carType: form.querySelector("select").value
      };
    } else if (form.id === "hourForm") {
      const hours = form.querySelector("select[name='hours']").value;
      const carType = form.querySelector("select[name='carType']").value;
      const estimate = calcHourEstimate(hours, carType);

      formData = {
        name: form.querySelector("input[name='name']").value,
        phone: form.querySelector("input[name='phone']").value,
        pickup: form.querySelector("input[name='pickup']").value,
        pickupTime: form.querySelector("#pickupTime2").value,
        carType: carType,
        hours: hours,
        estimate: estimate.toFixed(2)
      };
    }

    try {
      const res = await fetch("http://localhost:3000/submit-ride", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const result = await res.json();
      successMsg.textContent = result.message;
      successMsg.style.display = "block";
      form.reset();

      setTimeout(() => successMsg.style.display = "none", 6000);
    } catch (err) {
      successMsg.textContent = "Failed to submit request. Try again later.";
      successMsg.style.display = "block";
    }
  });
});



/*
// Form submission handling
document.querySelectorAll("form").forEach(form => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    let msg = "Your request has been submitted, we will reach out to you very soon.";

    // If it's the hour form, calculate price and append to message
    if (form.id === "hourForm") {
      const hours = form.querySelector("select[name='hours']").value;
      const carType = form.querySelector("select[name='carType']").value;
      if (hours && carType) {
        const estimate = calcHourEstimate(hours, carType);
        msg += ` Estimated Price: $${estimate.toFixed(2)}.`;
      }
    }

    form.reset();
    successMsg.textContent = msg;
    successMsg.style.display = "block";

    setTimeout(() => successMsg.style.display = "none", 6000);
  });
});
*/