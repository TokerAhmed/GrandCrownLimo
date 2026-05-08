
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