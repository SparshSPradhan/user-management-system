// import { Link, useNavigate } from 'react-router-dom';
// import { useDispatch } from 'react-redux';
// import { logoutThunk } from '../store/slices/authSlice';
// import useAuth from '../hooks/useAuth';

// const Navbar = () => {
//   const { user, canManage } = useAuth();
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const handleLogout = async () => {
//     await dispatch(logoutThunk());
//     navigate('/login');
//   };

//   return (
//     <nav className="navbar">
//       <div className="navbar-brand">
//         <Link to="/dashboard">UserManager</Link>
//       </div>
//       <div className="navbar-links">
//         <Link to="/dashboard">Dashboard</Link>
//         {canManage && <Link to="/users">Users</Link>}
//         <Link to="/profile">My Profile</Link>
//       </div>
//       <div className="navbar-user">
//         <span>{user?.name} ({user?.role})</span>
//         <button onClick={handleLogout} className="btn-logout">Logout</button>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;


import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logoutThunk } from '../store/slices/authSlice';
import useAuth from '../hooks/useAuth';

const NAV_LINKS = [
  { to: '/dashboard', label: 'Dashboard', roles: ['admin', 'manager', 'user'] },
  { to: '/users',     label: 'Users',     roles: ['admin', 'manager'] },
  { to: '/profile',   label: 'My Profile',roles: ['admin', 'manager', 'user'] },
];

const ROLE_COLORS = {
  admin:   'bg-violet-100 text-violet-700',
  manager: 'bg-sky-100 text-sky-700',
  user:    'bg-emerald-100 text-emerald-700',
};

const Navbar = () => {
  const { user } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const handleLogout = async () => {
    await dispatch(logoutThunk());
    navigate('/login');
  };

  const visibleLinks = NAV_LINKS.filter(l => user && l.roles.includes(user.role));

  return (
    <header className="sticky top-0 z-30 bg-slate-900 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Brand */}
          <Link to="/dashboard" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center">
              <span className="text-white font-bold text-sm">UM</span>
            </div>
            <span className="text-white font-semibold text-sm tracking-wide hidden sm:block">
              UserManager
            </span>
          </Link>

          {/* Nav links */}
          <nav className="flex items-center gap-1">
            {visibleLinks.map(link => {
              const active = pathname === link.to || (link.to !== '/dashboard' && pathname.startsWith(link.to));
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                    active
                      ? 'bg-brand-500 text-white'
                      : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* User info + logout */}
          <div className="flex items-center gap-3">
            {user && (
              <div className="hidden sm:flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-brand-500 flex items-center justify-center">
                  <span className="text-white text-xs font-bold">
                    {user.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="text-slate-300 text-xs font-medium">{user.name}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${ROLE_COLORS[user.role]}`}>
                  {user.role}
                </span>
              </div>
            )}
            <button
              onClick={handleLogout}
              className="text-slate-400 hover:text-white hover:bg-slate-700 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border border-slate-600"
            >
              Logout
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};

export default Navbar;