import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, User, Mail, Lock, Building, Bell, Camera } from 'lucide-react';

const InputField = ({ label, icon, ...props }) => (
  <div style={{ marginBottom: '16px' }}>
    <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '6px', fontWeight: '500' }}>
      {label}
    </label>
    <div style={{ position: 'relative' }}>
      <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
        {icon}
      </div>
      <input 
        style={{
          width: '100%',
          backgroundColor: 'var(--input-bg)',
          border: '1px solid var(--border)',
          borderRadius: '8px',
          padding: '10px 12px 10px 40px',
          color: 'var(--text-main)',
          fontSize: '14px',
          outline: 'none',
          transition: 'all 0.2s ease',
        }}
        onFocus={(e) => {
          e.target.style.borderColor = 'var(--primary)';
          e.target.style.boxShadow = '0 0 0 2px rgba(14, 165, 233, 0.2)';
        }}
        onBlur={(e) => {
          e.target.style.borderColor = 'var(--border)';
          e.target.style.boxShadow = 'none';
        }}
        {...props}
      />
    </div>
  </div>
);

const Settings = () => {
  const [formData, setFormData] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    company: 'Acme Corp',
    notifications: true
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    // Simulate save
    const btn = e.target.querySelector('button[type="submit"]');
    const originalText = btn.innerHTML;
    btn.innerHTML = 'Saved Successfully!';
    btn.style.backgroundColor = '#10b981'; // Success green
    setTimeout(() => {
      btn.innerHTML = originalText;
      btn.style.backgroundColor = 'var(--primary)';
    }, 2000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      style={{ maxWidth: '800px', margin: '0 auto', width: '100%' }}
    >
      <header style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '8px' }}>Profile Settings</h1>
        <p style={{ color: 'var(--text-muted)' }}>Update your personal details and preferences.</p>
      </header>

      <div className="glass-card" style={{ padding: '32px' }}>
        <form onSubmit={handleSave}>
          
          {/* Avatar Section */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '32px', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative' }}>
              <div style={{ 
                width: '80px', height: '80px', borderRadius: '50%', 
                backgroundColor: 'var(--avatar-bg)', color: 'var(--text-main)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', fontWeight: 'bold'
              }}>
                {formData.firstName[0]}{formData.lastName[0]}
              </div>
              <button 
                type="button"
                style={{
                  position: 'absolute', right: '-4px', bottom: '-4px',
                  backgroundColor: 'var(--primary)', color: 'white',
                  width: '28px', height: '28px', borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: '2px solid var(--bg-card)', cursor: 'pointer'
                }}
              >
                <Camera size={14} />
              </button>
            </div>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: '600' }}>Profile Picture</h3>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>JPG, GIF or PNG. Max size of 800K</p>
            </div>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid var(--border)', marginBottom: '32px' }} />

          {/* Form Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            <InputField 
              label="First Name" name="firstName" value={formData.firstName} onChange={handleChange} 
              icon={<User size={16} />} placeholder="Enter first name" 
            />
            <InputField 
              label="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} 
              icon={<User size={16} />} placeholder="Enter last name" 
            />
            <InputField 
              label="Email Address" type="email" name="email" value={formData.email} onChange={handleChange} 
              icon={<Mail size={16} />} placeholder="name@example.com" 
            />
            <InputField 
              label="Company" name="company" value={formData.company} onChange={handleChange} 
              icon={<Building size={16} />} placeholder="Your company" 
            />
          </div>

          <div style={{ marginTop: '12px', marginBottom: '32px' }}>
            <InputField 
              label="New Password" type="password" name="password" placeholder="Leave blank to keep current" 
              icon={<Lock size={16} />} 
            />
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid var(--border)', marginBottom: '24px' }} />

          {/* Preferences */}
          <div style={{ marginBottom: '32px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>Preferences</h3>
            <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
              <input 
                type="checkbox" name="notifications" 
                checked={formData.notifications} onChange={handleChange}
                style={{ width: '18px', height: '18px', accentColor: 'var(--primary)', cursor: 'pointer' }}
              />
              <div>
                <div style={{ fontSize: '14px', fontWeight: '500' }}>Email Notifications</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Receive daily digest and lead updates.</div>
              </div>
            </label>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
            <button type="button" className="glass-card" style={{ padding: '10px 20px', fontSize: '14px', fontWeight: '500' }}>
              Discard Changes
            </button>
            <button type="submit" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 24px', transition: 'all 0.3s' }}>
              <Save size={16} /> Save Changes
            </button>
          </div>

        </form>
      </div>
    </motion.div>
  );
};

export default Settings;
