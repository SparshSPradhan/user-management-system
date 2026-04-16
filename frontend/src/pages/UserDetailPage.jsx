// import { useEffect, useState } from 'react';
// import { useParams, useNavigate, Link } from 'react-router-dom';
// import { useDispatch, useSelector } from 'react-redux';
// import { fetchUser, updateUser, clearSelectedUser } from '../store/slices/userSlice';
// import useAuth from '../hooks/useAuth';
// import Navbar from '../components/Navbar';

// const UserDetailPage = ({ editMode = false }) => {
//   const { id } = useParams();
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { isAdmin } = useAuth();
//   const { selectedUser: user, loading, error } = useSelector(s => s.users);
//   const [form, setForm] = useState({ name: '', email: '', role: '', status: '' });
//   const [saved, setSaved] = useState(false);

//   useEffect(() => {
//     if (id && id !== 'new') dispatch(fetchUser(id));
//     return () => dispatch(clearSelectedUser());
//   }, [id]);

//   useEffect(() => {
//     if (user) setForm({ name: user.name, email: user.email, role: user.role, status: user.status });
//   }, [user]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const res = await dispatch(updateUser({ id, data: form }));
//     if (!res.error) { setSaved(true); setTimeout(() => navigate('/users'), 1000); }
//   };

//   if (loading) return <><Navbar /><div className="container"><p>Loading...</p></div></>;

//   return (
//     <>
//       <Navbar />
//       <div className="container">
//         <div className="page-header">
//           <h1>{editMode ? 'Edit User' : 'User Details'}</h1>
//           <Link to="/users" className="btn-secondary">← Back</Link>
//         </div>
//         {error && <div className="alert alert-error">{error}</div>}
//         {saved && <div className="alert alert-success">User updated successfully!</div>}

//         {editMode && isAdmin ? (
//           <form onSubmit={handleSubmit} className="user-form">
//             <div className="form-group">
//               <label>Name</label>
//               <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
//             </div>
//             <div className="form-group">
//               <label>Email</label>
//               <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
//             </div>
//             <div className="form-group">
//               <label>Role</label>
//               <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
//                 <option value="user">User</option>
//                 <option value="manager">Manager</option>
//                 <option value="admin">Admin</option>
//               </select>
//             </div>
//             <div className="form-group">
//               <label>Status</label>
//               <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
//                 <option value="active">Active</option>
//                 <option value="inactive">Inactive</option>
//               </select>
//             </div>
//             <button type="submit" className="btn-primary">Save Changes</button>
//           </form>
//         ) : user ? (
//           <div className="detail-card">
//             <div className="detail-row"><span>Name</span><strong>{user.name}</strong></div>
//             <div className="detail-row"><span>Email</span><strong>{user.email}</strong></div>
//             <div className="detail-row"><span>Role</span><span className={`badge badge-${user.role}`}>{user.role}</span></div>
//             <div className="detail-row"><span>Status</span><span className={`badge badge-${user.status}`}>{user.status}</span></div>
//             <div className="detail-row"><span>Created At</span><strong>{new Date(user.createdAt).toLocaleString()}</strong></div>
//             <div className="detail-row"><span>Updated At</span><strong>{new Date(user.updatedAt).toLocaleString()}</strong></div>
//             {user.createdBy && <div className="detail-row"><span>Created By</span><strong>{user.createdBy?.name} ({user.createdBy?.email})</strong></div>}
//             {user.updatedBy && <div className="detail-row"><span>Last Updated By</span><strong>{user.updatedBy?.name} ({user.updatedBy?.email})</strong></div>}
//           </div>
//         ) : null}
//       </div>
//     </>
//   );
// };

// export default UserDetailPage;



import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUser, updateUser, clearSelectedUser } from '../store/slices/userSlice';
import useAuth from '../hooks/useAuth';
import Navbar from '../components/Navbar';
import PageHeader from '../components/PageHeader';
import FormField from '../components/FormField';
import Loader from '../components/Loader';

const AUDIT_FIELDS = [
  { key: 'createdAt',   label: 'Created at',      format: v => new Date(v).toLocaleString() },
  { key: 'updatedAt',   label: 'Last updated',     format: v => new Date(v).toLocaleString() },
  { key: 'createdBy',   label: 'Created by',       format: v => v ? `${v.name} (${v.email})` : 'System' },
  { key: 'updatedBy',   label: 'Last updated by',  format: v => v ? `${v.name} (${v.email})` : '—' },
];

const UserDetailPage = ({ editMode = false }) => {
  const { id }     = useParams();
  const dispatch   = useDispatch();
  const navigate   = useNavigate();
  const { isAdmin } = useAuth();
  const { selectedUser: user, loading, error } = useSelector(s => s.users);
  const [form,  setForm]  = useState({ name: '', email: '', role: '', status: '' });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (id && id !== 'new') dispatch(fetchUser(id));
    return () => dispatch(clearSelectedUser());
  }, [id]);

  useEffect(() => {
    if (user) setForm({ name: user.name, email: user.email, role: user.role, status: user.status });
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await dispatch(updateUser({ id, data: form }));
    if (!res.error) { setSaved(true); setTimeout(() => navigate('/users'), 1200); }
  };

  if (loading) return <><Navbar /><Loader fullscreen={false} /></>;

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <PageHeader
          title={editMode ? 'Edit User' : 'User Details'}
          subtitle={user?.email}
          action={
            <div className="flex gap-2">
              {!editMode && isAdmin && user && (
                <Link to={`/users/${id}/edit`} className="btn-primary">
                  Edit User
                </Link>
              )}
              <Link to="/users" className="btn-secondary">
                ← Back
              </Link>
            </div>
          }
        />

        {error && <div className="alert-error mb-5">{error}</div>}
        {saved && (
          <div className="alert-success mb-5">
            <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            User updated successfully! Redirecting…
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Main form / info */}
          <div className="lg:col-span-2">
            {editMode && isAdmin ? (
              <div className="card p-6">
                <h2 className="section-title mb-5">Edit Details</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <FormField label="Full Name">
                    <input className="input" value={form.name}
                      onChange={e => setForm({ ...form, name: e.target.value })} required />
                  </FormField>
                  <FormField label="Email Address">
                    <input type="email" className="input" value={form.email}
                      onChange={e => setForm({ ...form, email: e.target.value })} required />
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
                  <div className="flex gap-3 pt-2">
                    <button type="submit" className="btn-primary">Save Changes</button>
                    <button type="button" onClick={() => navigate('/users')} className="btn-secondary">
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            ) : user ? (
              <div className="card p-6">
                <h2 className="section-title mb-5">Account Information</h2>
                <dl className="space-y-4">
                  {[
                    { label: 'Full Name',      value: user.name },
                    { label: 'Email Address',  value: user.email },
                    { label: 'Role',           value: <span className={`badge badge-${user.role}`}>{user.role}</span> },
                    { label: 'Account Status', value: <span className={`badge badge-${user.status}`}>{user.status}</span> },
                  ].map(item => (
                    <div key={item.label} className="flex items-center justify-between py-3 border-b border-slate-50 last:border-0">
                      <dt className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{item.label}</dt>
                      <dd className="text-sm font-medium text-slate-700">{item.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            ) : null}
          </div>

          {/* Audit sidebar */}
          {user && (
            <div className="card p-6 h-fit">
              <h2 className="section-title mb-4 flex items-center gap-2">
                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Audit Trail
              </h2>
              <dl className="space-y-3">
                {AUDIT_FIELDS.map(({ key, label, format }) => (
                  <div key={key} className="space-y-0.5">
                    <dt className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{label}</dt>
                    <dd className="text-xs text-slate-600 font-medium">{format(user[key])}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default UserDetailPage;