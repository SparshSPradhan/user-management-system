import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUser, updateUser, clearSelectedUser } from '../store/slices/userSlice';
import useAuth from '../hooks/useAuth';
import Navbar from '../components/Navbar';

const UserDetailPage = ({ editMode = false }) => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const { selectedUser: user, loading, error } = useSelector(s => s.users);
  const [form, setForm] = useState({ name: '', email: '', role: '', status: '' });
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
    if (!res.error) { setSaved(true); setTimeout(() => navigate('/users'), 1000); }
  };

  if (loading) return <><Navbar /><div className="container"><p>Loading...</p></div></>;

  return (
    <>
      <Navbar />
      <div className="container">
        <div className="page-header">
          <h1>{editMode ? 'Edit User' : 'User Details'}</h1>
          <Link to="/users" className="btn-secondary">← Back</Link>
        </div>
        {error && <div className="alert alert-error">{error}</div>}
        {saved && <div className="alert alert-success">User updated successfully!</div>}

        {editMode && isAdmin ? (
          <form onSubmit={handleSubmit} className="user-form">
            <div className="form-group">
              <label>Name</label>
              <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>Role</label>
              <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
                <option value="user">User</option>
                <option value="manager">Manager</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div className="form-group">
              <label>Status</label>
              <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <button type="submit" className="btn-primary">Save Changes</button>
          </form>
        ) : user ? (
          <div className="detail-card">
            <div className="detail-row"><span>Name</span><strong>{user.name}</strong></div>
            <div className="detail-row"><span>Email</span><strong>{user.email}</strong></div>
            <div className="detail-row"><span>Role</span><span className={`badge badge-${user.role}`}>{user.role}</span></div>
            <div className="detail-row"><span>Status</span><span className={`badge badge-${user.status}`}>{user.status}</span></div>
            <div className="detail-row"><span>Created At</span><strong>{new Date(user.createdAt).toLocaleString()}</strong></div>
            <div className="detail-row"><span>Updated At</span><strong>{new Date(user.updatedAt).toLocaleString()}</strong></div>
            {user.createdBy && <div className="detail-row"><span>Created By</span><strong>{user.createdBy?.name} ({user.createdBy?.email})</strong></div>}
            {user.updatedBy && <div className="detail-row"><span>Last Updated By</span><strong>{user.updatedBy?.name} ({user.updatedBy?.email})</strong></div>}
          </div>
        ) : null}
      </div>
    </>
  );
};

export default UserDetailPage;