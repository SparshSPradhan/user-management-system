// import { useState } from 'react';
// import { useDispatch } from 'react-redux';
// import { updateProfile } from '../store/slices/userSlice';
// import { getMeThunk } from '../store/slices/authSlice';
// import useAuth from '../hooks/useAuth';
// import Navbar from '../components/Navbar';

// const ProfilePage = () => {
//   const dispatch = useDispatch();
//   const { user } = useAuth();
//   const [form, setForm] = useState({ name: user?.name || '', password: '', confirmPassword: '' });
//   const [message, setMessage] = useState('');
//   const [error, setError] = useState('');

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError(''); setMessage('');
//     if (form.password && form.password !== form.confirmPassword) {
//       return setError('Passwords do not match');
//     }
//     const data = { name: form.name };
//     if (form.password) data.password = form.password;
//     const res = await dispatch(updateProfile(data));
//     if (!res.error) {
//       dispatch(getMeThunk());
//       setMessage('Profile updated!');
//       setForm(f => ({ ...f, password: '', confirmPassword: '' }));
//     } else {
//       setError(res.payload);
//     }
//   };

//   return (
//     <>
//       <Navbar />
//       <div className="container">
//         <h1>My Profile</h1>
//         <div className="info-box" style={{ marginBottom: '1.5rem' }}>
//           <p><strong>Email:</strong> {user?.email}</p>
//           <p><strong>Role:</strong> {user?.role}</p>
//           <p><strong>Status:</strong> {user?.status}</p>
//         </div>
//         {message && <div className="alert alert-success">{message}</div>}
//         {error && <div className="alert alert-error">{error}</div>}
//         <form onSubmit={handleSubmit} className="user-form">
//           <div className="form-group">
//             <label>Name</label>
//             <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
//           </div>
//           <div className="form-group">
//             <label>New Password (optional)</label>
//             <input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="Leave blank to keep current" />
//           </div>
//           <div className="form-group">
//             <label>Confirm New Password</label>
//             <input type="password" value={form.confirmPassword} onChange={e => setForm({ ...form, confirmPassword: e.target.value })} />
//           </div>
//           <button type="submit" className="btn-primary">Update Profile</button>
//         </form>
//       </div>
//     </>
//   );
// };

// export default ProfilePage;


import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateProfile } from '../store/slices/userSlice';
import { getMeThunk } from '../store/slices/authSlice';
import useAuth from '../hooks/useAuth';
import Navbar from '../components/Navbar';
import PageHeader from '../components/PageHeader';
import FormField from '../components/FormField';

const ProfilePage = () => {
  const dispatch = useDispatch();
  const { user }  = useAuth();
  const [form, setForm] = useState({ name: user?.name || '', password: '', confirmPassword: '' });
  const [message, setMessage] = useState('');
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setMessage('');
    if (form.password && form.password !== form.confirmPassword) {
      return setError('Passwords do not match');
    }
    const data = { name: form.name };
    if (form.password) data.password = form.password;
    setLoading(true);
    const res = await dispatch(updateProfile(data));
    setLoading(false);
    if (!res.error) {
      dispatch(getMeThunk());
      setMessage('Profile updated successfully!');
      setForm(f => ({ ...f, password: '', confirmPassword: '' }));
    } else {
      setError(res.payload);
    }
  };

  const ROLE_COLORS = {
    admin:   'bg-violet-100 text-violet-700',
    manager: 'bg-sky-100 text-sky-700',
    user:    'bg-emerald-100 text-emerald-700',
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PageHeader title="My Profile" subtitle="Manage your personal information" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Account summary */}
          <div className="card p-6 h-fit">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-brand-500 flex items-center justify-center mb-3">
                <span className="text-white text-2xl font-bold">
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <h3 className="font-semibold text-slate-800">{user?.name}</h3>
              <p className="text-xs text-slate-400 mt-0.5">{user?.email}</p>
              <span className={`mt-2 px-2.5 py-1 rounded-full text-xs font-semibold ${ROLE_COLORS[user?.role]}`}>
                {user?.role}
              </span>
            </div>
            <div className="mt-5 pt-4 border-t border-slate-100 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400 font-medium">Status</span>
                <span className={`badge badge-${user?.status}`}>{user?.status}</span>
              </div>
            </div>
            <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-xs text-amber-700 font-medium">
                ⚠️ You cannot change your own role. Contact an admin if needed.
              </p>
            </div>
          </div>

          {/* Edit form */}
          <div className="lg:col-span-2 card p-6">
            <h2 className="section-title mb-5">Edit Information</h2>

            {message && (
              <div className="alert-success mb-5">
                <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                {message}
              </div>
            )}
            {error && (
              <div className="alert-error mb-5">
                <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
                </svg>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <FormField label="Full Name">
                <input
                  className="input"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  required minLength={2}
                />
              </FormField>

              <FormField label="Email Address">
                <input className="input" value={user?.email} disabled
                  style={{ opacity: 0.6, cursor: 'not-allowed' }} />
                <p className="text-xs text-slate-400 mt-1">Email cannot be changed here. Contact an admin.</p>
              </FormField>

              <div className="pt-2 border-t border-slate-100">
                <h3 className="text-sm font-semibold text-slate-600 mb-3">Change Password</h3>
                <div className="space-y-4">
                  <FormField label="New Password">
                    <input
                      type="password"
                      className="input"
                      placeholder="Leave blank to keep current"
                      value={form.password}
                      onChange={e => setForm({ ...form, password: e.target.value })}
                      minLength={6}
                    />
                  </FormField>
                  <FormField label="Confirm New Password">
                    <input
                      type="password"
                      className="input"
                      placeholder="Repeat new password"
                      value={form.confirmPassword}
                      onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
                    />
                  </FormField>
                </div>
              </div>

              <div className="pt-2">
                <button type="submit" className="btn-primary" disabled={loading}>
                  {loading ? (
                    <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/>Saving…</>
                  ) : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>

        </div>
      </main>
    </div>
  );
};

export default ProfilePage;