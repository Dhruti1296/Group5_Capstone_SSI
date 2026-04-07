import React, { useState } from "react";

function ContactUs() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    topic: "General",
    message: "",
  });

  const [status, setStatus] = useState({ type: "", msg: "" });

  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async (e) => {
    e.preventDefault();

    try {
      // Backend-ready: call your API later
      // await contactService.sendMessage(form);

      console.log("Contact form submit:", form);

      setStatus({ type: "success", msg: "Thanks! We received your message." });
      setForm({ fullName: "", email: "", topic: "General", message: "" });
    } catch (err) {
      setStatus({ type: "danger", msg: "Something went wrong. Try again." });
    }
  };

  return (
    <div className="container page-wrap">
      <div className="row g-4">
        <div className="col-lg-7">
          <div className="card ssi-card p-4">
            <h3 className="mb-2">Contact Us</h3>
            <p className="text-muted mb-4">
              Reach out to SSI support. We’ll get back to you as soon as possible.
            </p>

            {status.msg && (
              <div className={`alert alert-${status.type}`} role="alert">
                {status.msg}
              </div>
            )}

            <form onSubmit={submit}>
              <div className="mb-3">
                <label className="form-label">Full Name</label>
                <input
                  className="form-control"
                  name="fullName"
                  value={form.fullName}
                  onChange={onChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  className="form-control"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={onChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Topic</label>
                <select
                  className="form-select"
                  name="topic"
                  value={form.topic}
                  onChange={onChange}
                >
                  <option>General</option>
                  <option>Technical Issue</option>
                  <option>Account Support</option>
                  <option>Partnership</option>
                  <option>Feedback</option>
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label">Message</label>
                <textarea
                  className="form-control"
                  name="message"
                  rows="5"
                  value={form.message}
                  onChange={onChange}
                  required
                />
              </div>

              <button className="btn btn-primary">Send Message</button>
            </form>
          </div>
        </div>

        <div className="col-lg-5">
          <div className="card ssi-card p-4">
            <h5 className="mb-3">SSI Help Desk</h5>

            <div className="ssi-info-row">
              <div className="ssi-info-label">Email</div>
              <div className="ssi-info-value">support@ssi.com</div>
            </div>

            <div className="ssi-info-row">
              <div className="ssi-info-label">Hours</div>
              <div className="ssi-info-value">Mon–Fri, 9am–5pm</div>
            </div>

            <div className="ssi-info-row">
              <div className="ssi-info-label">Campus</div>
              <div className="ssi-info-value">Conestoga (Doon)</div>
            </div>

            <hr />

            <p className="text-muted mb-0">
              Tip: If your issue is urgent, include screenshots and your program/semester.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactUs;