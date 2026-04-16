export const ROLES = { ADMIN: 'admin', MANAGER: 'manager', USER: 'user' };

export const canManageUsers = (role) => [ROLES.ADMIN, ROLES.MANAGER].includes(role);
export const isAdmin = (role) => role === ROLES.ADMIN;