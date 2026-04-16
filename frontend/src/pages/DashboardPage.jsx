// import useAuth from '../hooks/useAuth';
// import Navbar from '../components/Navbar';
// import { Link } from 'react-router-dom';

// const DashboardPage = () => {
//   const { user, isAdmin, canManage } = useAuth();

//   return (
//     <>
//       <Navbar />
//       <div className="container">
//         <div className="dashboard-header">
//           <h1>Welcome, {user?.name}</h1>
//           <span className={`badge badge-${user?.role}`}>{user?.role}</span>
//         </div>
//         <div className="cards-grid">
//           {canManage && (
//             <Link to="/users" className="dashboard-card">
//               <h3>User Management</h3>
//               <p>View and manage all users</p>
//             </Link>
//           )}
//           {isAdmin && (
//             <Link to="/users/new" className="dashboard-card">
//               <h3>Create User</h3>
//               <p>Add a new user to the system</p>
//             </Link>
//           )}
//           <Link to="/profile" className="dashboard-card">
//             <h3>My Profile</h3>
//             <p>View and update your profile</p>
//           </Link>
//         </div>
//         <div className="info-box">
//           <h3>Account Info</h3>
//           <p><strong>Email:</strong> {user?.email}</p>
//           <p><strong>Role:</strong> {user?.role}</p>
//           <p><strong>Status:</strong> {user?.status}</p>
//         </div>
//       </div>
//     </>
//   );
// };

// export default DashboardPage;


import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers } from '../store/slices/userSlice';
import useAuth from '../hooks/useAuth';
import Navbar from '../components/Navbar';
import PageHeader from '../components/PageHeader';

const ACTION_CARDS = [
  {
    to: '/users',
    roles: ['admin', 'manager'],
    title: 'Manage Users',
    desc: 'View, search, filter and manage all users',
    icon: (
      <svg className="w-6 h-6 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    color: 'from-brand-50 to-brand-100 border-brand-200 hover:border-brand-400',
  },
  {
    to: '/users/new',
    roles: ['admin'],
    title: 'Create User',
    desc: 'Add a new user and assign a role',
    icon: (
      <svg className="w-6 h-6 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
      </svg>
    ),
    color: 'from-teal-50 to-teal-100 border-teal-200 hover:border-teal-400',
  },
  {
    to: '/profile',
    roles: ['admin', 'manager', 'user'],
    title: 'My Profile',
    desc: 'Update your name and password',
    icon: (
      <svg className="w-6 h-6 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    color: 'from-amber-50 to-amber-100 border-amber-200 hover:border-amber-400',
  },
];

const ROLE_BADGE = {
  admin:   'bg-violet-100 text-violet-700 border border-violet-200',
  manager: 'bg-sky-100 text-sky-700 border border-sky-200',
  user:    'bg-emerald-100 text-emerald-700 border border-emerald-200',
};

const DashboardPage = () => {
  const { user, isAdmin, canManage } = useAuth();
  const dispatch = useDispatch();
  const { list, pagination } = useSelector(s => s.users);

  useEffect(() => {
    if (canManage) dispatch(fetchUsers({ page: 1, limit: 5 }));
  }, [canManage]);

  const activeUsers   = list.filter(u => u.status === 'active').length;
  const inactiveUsers = list.filter(u => u.status === 'inactive').length;
  const adminCount    = list.filter(u => u.role === 'admin').length;

  const visibleCards = ACTION_CARDS.filter(c => user && c.roles.includes(user.role));

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <PageHeader
          title={`Welcome back, ${user?.name?.split(' ')[0]} 👋`}
          subtitle="Here's what's happening in your workspace"
        />

        {/* Stats — admin/manager only */}
        {canManage && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Total Users',    value: pagination.total, color: 'bg-brand-500' },
              { label: 'Active',         value: activeUsers,      color: 'bg-green-500' },
              { label: 'Inactive',       value: inactiveUsers,    color: 'bg-red-400' },
              { label: 'Admins',         value: adminCount,       color: 'bg-violet-500' },
            ].map(s => (
              <div key={s.label} className="card p-4 flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl ${s.color} flex items-center justify-center flex-shrink-0`}>
                  <span className="text-white font-bold text-sm">{s.value}</span>
                </div>
                <p className="text-xs text-slate-500 font-medium leading-tight">{s.label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Action cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {visibleCards.map(card => (
            <Link
              key={card.to}
              to={card.to}
              className={`card p-5 flex items-start gap-4 bg-gradient-to-br border transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 ${card.color}`}
            >
              <div className="w-11 h-11 bg-white rounded-xl flex items-center justify-center shadow-sm flex-shrink-0">
                {card.icon}
              </div>
              <div>
                <h3 className="font-semibold text-slate-800 text-sm">{card.title}</h3>
                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{card.desc}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Account info card */}
        <div className="card p-6 max-w-lg">
          <h2 className="section-title mb-4">Account Details</h2>
          <dl className="space-y-3">
            {[
              { label: 'Full Name', value: user?.name },
              { label: 'Email',     value: user?.email },
              { label: 'Role',      value: <span className={`badge px-2.5 py-1 rounded-full text-xs font-semibold ${ROLE_BADGE[user?.role]}`}>{user?.role}</span> },
              { label: 'Status',    value: <span className={`badge ${user?.status === 'active' ? 'badge-active' : 'badge-inactive'}`}>{user?.status}</span> },
            ].map(item => (
              <div key={item.label} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                <dt className="text-xs font-medium text-slate-400 uppercase tracking-wider">{item.label}</dt>
                <dd className="text-sm font-medium text-slate-700">{item.value}</dd>
              </div>
            ))}
          </dl>
        </div>

      </main>
    </div>
  );
};

export default DashboardPage;