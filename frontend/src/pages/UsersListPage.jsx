import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchUsers, deleteUser } from '../store/slices/userSlice';
import useAuth from '../hooks/useAuth';
import Navbar from '../components/Navbar';

const UsersListPage = () => {
  const dispatch = useDispatch();
  const { list, pagination, loading, error } = useSelector(s => s.users);
  const { isAdmin } = useAuth();
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(fetchUsers({ page, search, role, status }));
  }, [page, role, status]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    dispatch(fetchUsers({ page: 1, search, role, status }));
  };

  const handleDeactivate = async (id) => {
    if (window.confirm('Deactivate this user?')) {
      dispatch(deleteUser(id));
    }
  };

  return (
    <>
      <Navbar />
      <div className="container">
        <div className="page-header">
          <h1>Users</h1>
          {isAdmin && <Link to="/users/new" className="btn-primary">+ New User</Link>}
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSearch} className="filters">
          <input
            type="text"
            placeholder="Search by name or email"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="">All Roles</option>
            <option value="admin">Admin</option>
            <option value="manager">Manager</option>
            <option value="user">User</option>
          </select>
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <button type="submit" className="btn-secondary">Search</button>
        </form>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <table className="users-table">
            <thead>
              <tr>
                <th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {list.map(u => (
                <tr key={u._id}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td><span className={`badge badge-${u.role}`}>{u.role}</span></td>
                  <td><span className={`badge badge-${u.status}`}>{u.status}</span></td>
                  <td>
                    <Link to={`/users/${u._id}`} className="btn-link">View</Link>
                    {isAdmin && (
                      <>
                        <Link to={`/users/${u._id}/edit`} className="btn-link">Edit</Link>
                        <button onClick={() => handleDeactivate(u._id)} className="btn-link btn-danger">Deactivate</button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <div className="pagination">
          <button disabled={page <= 1} onClick={() => setPage(p => p - 1)}>Prev</button>
          <span>Page {pagination.page} of {pagination.pages}</span>
          <button disabled={page >= pagination.pages} onClick={() => setPage(p => p + 1)}>Next</button>
        </div>
      </div>
    </>
  );
};

export default UsersListPage;