import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateProfile } from '../store/slices/userSlice';
import { getMeThunk } from '../store/slices/authSlice';
import useAuth from '../hooks/useAuth';
import Navbar from '../components/Navbar';

const ProfilePage = () => {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const [form, setForm] = useState({ name: user?.name || '', password: '', confirmPassword: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setMessage('');
    if (form.password && form.password !== form.confirmPassword) {
      return setError('Passwords do not match');
    }
    const data = { name: form.name };
    if (form.password) data.password = form.password;
    const res = await dispatch(updateProfile(data));
    if (!res.error) {
      dispatch(getMeThunk());
      setMessage('Profile updated!');
      setForm(f => ({ ...f, password: '', confirmPassword: '' }));
    } else {
      setError(res.payload);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container">
        <h1>My Profile</h1>
        <div className="info-box" style={{ marginBottom: '1.5rem' }}>
          <p><strong>Email:</strong> {user?.email}</p>
          <p><strong>Role:</strong> {user?.role}</p>
          <p><strong>Status:</strong> {user?.status}</p>
        </div>
        {message && <div className="alert alert-success">{message}</div>}
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={handleSubmit} className="user-form">
          <div className="form-group">
            <label>Name</label>
            <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div className="form-group">
            <label>New Password (optional)</label>
            <input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="Leave blank to keep current" />
          </div>
          <div className="form-group">
            <label>Confirm New Password</label>
            <input type="password" value={form.confirmPassword} onChange={e => setForm({ ...form, confirmPassword: e.target.value })} />
          </div>
          <button type="submit" className="btn-primary">Update Profile</button>
        </form>
      </div>
    </>
  );
};

export default ProfilePage;