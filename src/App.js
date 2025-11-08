import React, { useState } from 'react';

const API_URL = 'https://vernanbackend.ezlab.in/api/contact-us/';

export default function App() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [errors, setErrors] = useState({});
  const [statusText, setStatusText] = useState('');
  const [loading, setLoading] = useState(false);
  const [apiResponse, setApiResponse] = useState(null);

  const validate = () => {
    const e = {};
    if (!form.email) e.email = 'Email required';
    else {
      // simple email regex
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!re.test(form.email)) e.email = 'Valid email required';
    }
    if (!form.name) e.name = 'Name required';
    if (!form.message) e.message = 'Message required';
    
    if (form.phone && !/^\d{7,15}$/.test(form.phone)) e.phone = 'Enter valid phone (7-15 digits)';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (ev) => {
    setForm(prev => ({ ...prev, [ev.target.name]: ev.target.value }));
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    setStatusText('');
    setApiResponse(null);
    if (!validate()) return;
    setLoading(true);
    try {
      const payload = {
        name: form.name,
        email: form.email,
        phone: form.phone,
        message: form.message
      };

      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json().catch(() => ({}));
      setApiResponse({ status: res.status, body: data });

      if (res.ok) {
        setStatusText('Form Submitted');
        
      } else {
        setStatusText('Submission failed: ' + (data.message || res.statusText || res.status));
      }
    } catch (err) {
      setStatusText('Network error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="card">
        <h1 className="title">Contact Us</h1>
        <p className="subtitle">Single page React app — responsive + API integration</p>

        <form className="form" onSubmit={handleSubmit} noValidate>
          <label>
            Name
            <input name="name" value={form.name} onChange={handleChange} placeholder="Your name" />
            {errors.name && <small className="err">{errors.name}</small>}
          </label>

          <label>
            Email *
            <input name="email" value={form.email} onChange={handleChange} placeholder="you@example.com" />
            {errors.email && <small className="err">{errors.email}</small>}
          </label>

          <label>
            Phone
            <input name="phone" value={form.phone} onChange={handleChange} placeholder="9876543210" />
            {errors.phone && <small className="err">{errors.phone}</small>}
          </label>

          <label>
            Message
            <textarea name="message" value={form.message} onChange={handleChange} placeholder="Your message..." rows="4" />
            {errors.message && <small className="err">{errors.message}</small>}
          </label>

          <div className="row">
            <button type="submit" className="btn" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit'}
            </button>

            {}
            <input className="statusField" readOnly value={statusText} placeholder="Status will appear here" />
          </div>
        </form>

        {apiResponse && (
          <div className="responseBox">
            <h3>API Response</h3>
            <div>HTTP: {apiResponse.status}</div>
            <pre>{JSON.stringify(apiResponse.body, null, 2)}</pre>
          </div>
        )}

        <footer className="note">
          Note: Required variable for API is <code>email</code>. Other fields added for realistic UX.
        </footer>
      </div>
    </div>
  );
};