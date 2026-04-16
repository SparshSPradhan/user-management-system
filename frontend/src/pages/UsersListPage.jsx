// import { useEffect, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { Link } from 'react-router-dom';
// import { fetchUsers, deleteUser } from '../store/slices/userSlice';
// import useAuth from '../hooks/useAuth';
// import Navbar from '../components/Navbar';

// const UsersListPage = () => {
//   const dispatch = useDispatch();
//   const { list, pagination, loading, error } = useSelector(s => s.users);
//   const { isAdmin } = useAuth();
//   const [search, setSearch] = useState('');
//   const [role, setRole] = useState('');
//   const [status, setStatus] = useState('');
//   const [page, setPage] = useState(1);

//   useEffect(() => {
//     dispatch(fetchUsers({ page, search, role, status }));
//   }, [page, role, status]);

//   const handleSearch = (e) => {
//     e.preventDefault();
//     setPage(1);
//     dispatch(fetchUsers({ page: 1, search, role, status }));
//   };

//   const handleDeactivate = async (id) => {
//     if (window.confirm('Deactivate this user?')) {
//       dispatch(deleteUser(id));
//     }
//   };

//   return (
//     <>
//       <Navbar />
//       <div className="container">
//         <div className="page-header">
//           <h1>Users</h1>
//           {isAdmin && <Link to="/users/new" className="btn-primary">+ New User</Link>}
//         </div>

//         {error && <div className="alert alert-error">{error}</div>}

//         <form onSubmit={handleSearch} className="filters">
//           <input
//             type="text"
//             placeholder="Search by name or email"
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//           />
//           <select value={role} onChange={(e) => setRole(e.target.value)}>
//             <option value="">All Roles</option>
//             <option value="admin">Admin</option>
//             <option value="manager">Manager</option>
//             <option value="user">User</option>
//           </select>
//           <select value={status} onChange={(e) => setStatus(e.target.value)}>
//             <option value="">All Statuses</option>
//             <option value="active">Active</option>
//             <option value="inactive">Inactive</option>
//           </select>
//           <button type="submit" className="btn-secondary">Search</button>
//         </form>

//         {loading ? (
//           <p>Loading...</p>
//         ) : (
//           <table className="users-table">
//             <thead>
//               <tr>
//                 <th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {list.map(u => (
//                 <tr key={u._id}>
//                   <td>{u.name}</td>
//                   <td>{u.email}</td>
//                   <td><span className={`badge badge-${u.role}`}>{u.role}</span></td>
//                   <td><span className={`badge badge-${u.status}`}>{u.status}</span></td>
//                   <td>
//                     <Link to={`/users/${u._id}`} className="btn-link">View</Link>
//                     {isAdmin && (
//                       <>
//                         <Link to={`/users/${u._id}/edit`} className="btn-link">Edit</Link>
//                         <button onClick={() => handleDeactivate(u._id)} className="btn-link btn-danger">Deactivate</button>
//                       </>
//                     )}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         )}

//         <div className="pagination">
//           <button disabled={page <= 1} onClick={() => setPage(p => p - 1)}>Prev</button>
//           <span>Page {pagination.page} of {pagination.pages}</span>
//           <button disabled={page >= pagination.pages} onClick={() => setPage(p => p + 1)}>Next</button>
//         </div>
//       </div>
//     </>
//   );
// };

// export default UsersListPage;



import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchUsers, deleteUser } from '../store/slices/userSlice';
import useAuth from '../hooks/useAuth';
import Navbar from '../components/Navbar';
import PageHeader from '../components/PageHeader';
import Loader from '../components/Loader';

const UsersListPage = () => {
  const dispatch  = useDispatch();
  const { list, pagination, loading, error } = useSelector(s => s.users);
  const { isAdmin } = useAuth();

  const [search,  setSearch]  = useState('');
  const [role,    setRole]    = useState('');
  const [status,  setStatus]  = useState('');
  const [page,    setPage]    = useState(1);

  useEffect(() => {
    dispatch(fetchUsers({ page, search, role, status }));
  }, [page, role, status]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    dispatch(fetchUsers({ page: 1, search, role, status }));
  };

  const handleDeactivate = (id, name) => {
    if (window.confirm(`Deactivate "${name}"? They will not be able to log in.`)) {
      dispatch(deleteUser(id));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <PageHeader
          title="Users"
          subtitle={`${pagination.total} total users`}
          action={
            isAdmin && (
              <Link to="/users/new" className="btn-primary">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                New User
              </Link>
            )
          }
        />

        {error && <div className="alert-error mb-5">{error}</div>}

        {/* Filters */}
        <div className="card p-4 mb-5">
          <form onSubmit={handleSearch} className="flex flex-wrap gap-3 items-end">
            <div className="flex-1 min-w-48">
              <label className="label">Search</label>
              <input
                className="input"
                placeholder="Name or email…"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <div className="w-36">
              <label className="label">Role</label>
              <select className="input" value={role} onChange={e => setRole(e.target.value)}>
                <option value="">All roles</option>
                <option value="admin">Admin</option>
                <option value="manager">Manager</option>
                <option value="user">User</option>
              </select>
            </div>
            <div className="w-36">
              <label className="label">Status</label>
              <select className="input" value={status} onChange={e => setStatus(e.target.value)}>
                <option value="">All statuses</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <button type="submit" className="btn-secondary h-10">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
              Search
            </button>
            {(search || role || status) && (
              <button type="button" className="btn-ghost h-10 text-xs"
                onClick={() => { setSearch(''); setRole(''); setStatus(''); setPage(1); dispatch(fetchUsers({ page: 1 })); }}>
                Clear
              </button>
            )}
          </form>
        </div>

        {/* Table */}
        <div className="card overflow-hidden">
          {loading ? (
            <Loader fullscreen={false} />
          ) : list.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-slate-400">
              <svg className="w-10 h-10 mb-3 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <p className="text-sm font-medium">No users found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-100">
                <thead className="bg-slate-50">
                  <tr>
                    {['User', 'Role', 'Status', 'Created', 'Actions'].map(h => (
                      <th key={h} className="th-cell">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 bg-white">
                  {list.map(u => (
                    <tr key={u._id} className="hover:bg-slate-50 transition-colors">
                      <td className="td-cell">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center flex-shrink-0">
                            <span className="text-brand-600 text-xs font-bold">
                              {u.name?.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-slate-800 text-sm">{u.name}</p>
                            <p className="text-xs text-slate-400">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="td-cell">
                        <span className={`badge badge-${u.role}`}>{u.role}</span>
                      </td>
                      <td className="td-cell">
                        <span className={`badge badge-${u.status}`}>{u.status}</span>
                      </td>
                      <td className="td-cell text-xs text-slate-400">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                      <td className="td-cell">
                        <div className="flex items-center gap-1">
                          <Link to={`/users/${u._id}`} className="btn-ghost px-2.5 py-1.5 text-xs">
                            View
                          </Link>
                          {isAdmin && (
                            <>
                              <Link to={`/users/${u._id}/edit`} className="btn-ghost px-2.5 py-1.5 text-xs">
                                Edit
                              </Link>
                              {u.status === 'active' && (
                                <button
                                  onClick={() => handleDeactivate(u._id, u.name)}
                                  className="px-2.5 py-1.5 text-xs rounded-lg text-red-500 hover:bg-red-50 transition-colors font-medium"
                                >
                                  Deactivate
                                </button>
                              )}
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="px-4 py-3 border-t border-slate-100 flex items-center justify-between bg-slate-50">
              <p className="text-xs text-slate-400">
                Page {pagination.page} of {pagination.pages} · {pagination.total} users
              </p>
              <div className="flex items-center gap-1.5">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage(p => p - 1)}
                  className="btn-secondary px-3 py-1.5 text-xs disabled:opacity-40"
                >
                  ← Prev
                </button>
                <button
                  disabled={page >= pagination.pages}
                  onClick={() => setPage(p => p + 1)}
                  className="btn-secondary px-3 py-1.5 text-xs disabled:opacity-40"
                >
                  Next →
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default UsersListPage;