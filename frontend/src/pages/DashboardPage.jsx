import useAuth from '../hooks/useAuth';
import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';

const DashboardPage = () => {
  const { user, isAdmin, canManage } = useAuth();

  return (
    <>
      <Navbar />
      <div className="container">
        <div className="dashboard-header">
          <h1>Welcome, {user?.name}</h1>
          <span className={`badge badge-${user?.role}`}>{user?.role}</span>
        </div>
        <div className="cards-grid">
          {canManage && (
            <Link to="/users" className="dashboard-card">
              <h3>User Management</h3>
              <p>View and manage all users</p>
            </Link>
          )}
          {isAdmin && (
            <Link to="/users/new" className="dashboard-card">
              <h3>Create User</h3>
              <p>Add a new user to the system</p>
            </Link>
          )}
          <Link to="/profile" className="dashboard-card">
            <h3>My Profile</h3>
            <p>View and update your profile</p>
          </Link>
        </div>
        <div className="info-box">
          <h3>Account Info</h3>
          <p><strong>Email:</strong> {user?.email}</p>
          <p><strong>Role:</strong> {user?.role}</p>
          <p><strong>Status:</strong> {user?.status}</p>
        </div>
      </div>
    </>
  );
};

export default DashboardPage;