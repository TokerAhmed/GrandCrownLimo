const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = 3000;

app.use(express.static("public"));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Handle ride requests
app.post("/submit-ride", (req, res) => {
  const data = req.body;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.ADMIN_EMAIL,
    subject: "New Ride Request",
    text: `
New Ride Request:

Name: ${data.name}
Phone: ${data.phone}
Pickup: ${data.pickup}
Drop-off: ${data.dropoff || "N/A"}
Date/Time: ${data.pickupTime}
Car Type: ${data.carType}
Hours (if hourly): ${data.hours || "N/A"}
Estimated Price: ${data.estimate || "N/A"}
`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      res.status(500).send({ success: false, message: "Failed to send email." });
    } else {
      console.log("Email sent: " + info.response);
      res.send({ success: true, message: "Request submitted successfully!" });
    }
  });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
