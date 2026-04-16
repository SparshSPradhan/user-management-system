import { useSelector } from 'react-redux';
import { isAdmin, canManageUsers } from '../utils/roles';

const useAuth = () => {
  const { user, accessToken, loading } = useSelector((state) => state.auth);
  return {
    user,
    accessToken,
    loading,
    isAuthenticated: !!accessToken && !!user,
    isAdmin: user ? isAdmin(user.role) : false,
    canManage: user ? canManageUsers(user.role) : false,
    role: user?.role,
  };
};

export default useAuth;