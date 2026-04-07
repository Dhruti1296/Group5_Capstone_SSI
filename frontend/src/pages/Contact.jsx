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

const handleChange = (e) => {
setForm({ ...form, [e.target.name]: e.target.value });
};

return (
<> <Navbar />

  <div className="page-container">

    <h2 className="page-title">Get in Touch</h2>

    <div className="contact-card">

      <div className="contact-left"></div>

      <form className="contact-form">
        <input name="name" placeholder="Name" onChange={handleChange} />
        <input name="email" placeholder="Email" onChange={handleChange} />
        <input name="phone" placeholder="Phone" onChange={handleChange} />
        <textarea name="message" placeholder="What can we help you with?" onChange={handleChange}></textarea>
        <button>Submit</button>
      </form>

    </div>

  </div>

  <Footer />
</>

);
}

export default Contact;
