import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getMeThunk } from './store/slices/authSlice';
import PrivateRoute from './components/PrivateRoute';
import RoleGuard from './components/RoleGuard';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import UsersListPage from './pages/UsersListPage';
import UserDetailPage from './pages/UserDetailPage';
import CreateUserPage from './pages/CreateUserPage';
import ProfilePage from './pages/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';
import Loader from './components/Loader';

function App() {
  const dispatch = useDispatch();
  const { initialized, accessToken } = useSelector(s => s.auth);

  useEffect(() => {
    if (accessToken) dispatch(getMeThunk());
    else dispatch({ type: 'auth/getMe/rejected' });
  }, []);

  if (accessToken && !initialized) return <Loader />;

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route
            path="/users"
            element={
              <RoleGuard allowedRoles={['admin', 'manager']}>
                <UsersListPage />
              </RoleGuard>
            }
          />
          <Route
            path="/users/new"
            element={
              <RoleGuard allowedRoles={['admin']}>
                <CreateUserPage />
              </RoleGuard>
            }
          />
          <Route
            path="/users/:id"
            element={
              <RoleGuard allowedRoles={['admin', 'manager']}>
                <UserDetailPage />
              </RoleGuard>
            }
          />
          <Route
            path="/users/:id/edit"
            element={
              <RoleGuard allowedRoles={['admin']}>
                <UserDetailPage editMode />
              </RoleGuard>
            }
          />
        </Route>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

