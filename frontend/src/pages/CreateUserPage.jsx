// import { useState } from 'react';
// import { useDispatch } from 'react-redux';
// import { useNavigate, Link } from 'react-router-dom';
// import { createUser } from '../store/slices/userSlice';
// import Navbar from '../components/Navbar';

// const CreateUserPage = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const [form, setForm] = useState({ name: '', email: '', password: '', role: 'user', status: 'active' });
//   const [error, setError] = useState('');

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
//     const res = await dispatch(createUser(form));
//     if (!res.error) navigate('/users');
//     else setError(res.payload);
//   };

//   return (
//     <>
//       <Navbar />
//       <div className="container">
//         <div className="page-header">
//           <h1>Create New User</h1>
//           <Link to="/users" className="btn-secondary">← Back</Link>
//         </div>
//         {error && <div className="alert alert-error">{error}</div>}
//         <form onSubmit={handleSubmit} className="user-form">
//           <div className="form-group">
//             <label>Name</label>
//             <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
//           </div>
//           <div className="form-group">
//             <label>Email</label>
//             <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
//           </div>
//           <div className="form-group">
//             <label>Password</label>
//             <input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required minLength={6} />
//           </div>
//           <div className="form-group">
//             <label>Role</label>
//             <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
//               <option value="user">User</option>
//               <option value="manager">Manager</option>
//               <option value="admin">Admin</option>
//             </select>
//           </div>
//           <div className="form-group">
//             <label>Status</label>
//             <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
//               <option value="active">Active</option>
//               <option value="inactive">Inactive</option>
//             </select>
//           </div>
//           <button type="submit" className="btn-primary">Create User</button>
//         </form>
//       </div>
//     </>
//   );
// };

// export default CreateUserPage;


import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { createUser } from '../store/slices/userSlice';
import Navbar from '../components/Navbar';
import PageHeader from '../components/PageHeader';
import FormField from '../components/FormField';

const CreateUserPage = () => {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'user', status: 'active' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const res = await dispatch(createUser(form));
    setLoading(false);
    if (!res.error) navigate('/users');
    else setError(res.payload);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PageHeader
          title="Create New User"
          action={<Link to="/users" className="btn-secondary">← Back</Link>}
        />

        <div className="card p-6">
          {error && <div className="alert-error mb-5">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <FormField label="Full Name">
              <input
                className="input"
                placeholder="Alice Johnson"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                required minLength={2}
              />
            </FormField>

            <FormField label="Email Address">
              <input
                type="email"
                className="input"
                placeholder="alice@example.com"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                required
              />
            </FormField>

            <FormField label="Password">
              <input
                type="password"
                className="input"
                placeholder="Min. 6 characters"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                required minLength={6}
              />
            </FormField>

            <div className="grid grid-cols-2 gap-4">
              <FormField label="Role">
                <select className="input" value={form.role}
                  onChange={e => setForm({ ...form, role: e.target.value })}>
                  <option value="user">User</option>
                  <option value="manager">Manager</option>
                  <option value="admin">Admin</option>
                </select>
              </FormField>

              <FormField label="Status">
                <select className="input" value={form.status}
                  onChange={e => setForm({ ...form, status: e.target.value })}>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </FormField>
            </div>

            <div className="flex gap-3 pt-2 border-t border-slate-100 mt-6">
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? (
                  <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/>Creating…</>
                ) : 'Create User'}
              </button>
              <button type="button" onClick={() => navigate('/users')} className="btn-secondary">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default CreateUserPage;