import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./Contact.css";

function Contact() {
const [form, setForm] = useState({
name: "",
email: "",
phone: "",
message: "",
});

const [status, setStatus] = useState("");

const handleChange = (e) => {
setForm({ ...form, [e.target.name]: e.target.value });
};

const handleSubmit = async (e) => {
e.preventDefault();

if (!form.name || !form.email || !form.message) {
  setStatus("Please fill all required fields.");
  return;
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!emailRegex.test(form.email)) {
  setStatus("Please enter a valid email.");
  return;
}

try {
  const response = await fetch("http://localhost:5277/api/contact", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      fullName: form.name,
      email: form.email,
      topic: "General",
      message: form.message,
    }),
  });

  if (response.ok) {
    setStatus("Message sent successfully.");

    setForm({
      name: "",
      email: "",
      phone: "",
      message: "",
    });

    setTimeout(() => {
      setStatus("");
    }, 3000);
  } else {
    const err = await response.text();
    setStatus(err);
  }
} catch (error) {
  setStatus("Server error. Please try again.");
}

};

return (
<> <Navbar />


  <div className="contact-wrapper">
    <h2 className="contact-title">GET IN TOUCH</h2>

    <div className="contact-box">

      <div className="contact-left">
        <img
          src="/images/ContactUs.jpg"
          alt="Contact"
          className="contact-image"
        />
      </div>

      <form className="contact-form" onSubmit={handleSubmit} noValidate>

        <input
          type="text"
          name="name"
          placeholder="Name *"
          value={form.name}
          onChange={handleChange}
        />

        <input
          type="email"
          name="email"
          placeholder="Email *"
          value={form.email}
          onChange={handleChange}
        />

        <input
          type="text"
          name="phone"
          placeholder="Phone"
          value={form.phone}
          onChange={handleChange}
        />

        <textarea
          name="message"
          placeholder="What can we help you with? *"
          value={form.message}
          onChange={handleChange}
        ></textarea>

        <button type="submit">Submit</button>

        {status && <p className="form-status">{status}</p>}

      </form>
    </div>
  </div>

  <Footer />
</>

);
}

export default Contact;