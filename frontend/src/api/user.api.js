import axiosInstance from './axiosInstance';

export const getUsersApi = (params) => axiosInstance.get('/users', { params });
export const getUserApi = (id) => axiosInstance.get(`/users/${id}`);
export const createUserApi = (data) => axiosInstance.post('/users', data);
export const updateUserApi = (id, data) => axiosInstance.put(`/users/${id}`, data);
export const deleteUserApi = (id) => axiosInstance.delete(`/users/${id}`);
export const updateProfileApi = (data) => axiosInstance.put('/users/profile', data);