import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getUsersApi, getUserApi, createUserApi, updateUserApi, deleteUserApi, updateProfileApi } from '../../api/userApi';

export const fetchUsers = createAsyncThunk('users/fetchAll', async (params, { rejectWithValue }) => {
  try {
    const res = await getUsersApi(params);
    return res.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch users');
  }
});

export const fetchUser = createAsyncThunk('users/fetchOne', async (id, { rejectWithValue }) => {
  try {
    const res = await getUserApi(id);
    return res.data.data.user;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const createUser = createAsyncThunk('users/create', async (data, { rejectWithValue }) => {
  try {
    const res = await createUserApi(data);
    return res.data.data.user;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const updateUser = createAsyncThunk('users/update', async ({ id, data }, { rejectWithValue }) => {
  try {
    const res = await updateUserApi(id, data);
    return res.data.data.user;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const deleteUser = createAsyncThunk('users/delete', async (id, { rejectWithValue }) => {
  try {
    await deleteUserApi(id);
    return id;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const updateProfile = createAsyncThunk('users/updateProfile', async (data, { rejectWithValue }) => {
  try {
    const res = await updateProfileApi(data);
    return res.data.data.user;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

const userSlice = createSlice({
  name: 'users',
  initialState: {
    list: [],
    selectedUser: null,
    pagination: { total: 0, page: 1, pages: 1 },
    loading: false,
    error: null,
  },
  reducers: {
    clearUserError(state) { state.error = null; },
    clearSelectedUser(state) { state.selectedUser = null; },
  },
  extraReducers: (builder) => {
    const pending = (state) => { state.loading = true; state.error = null; };
    const rejected = (state, action) => { state.loading = false; state.error = action.payload; };

    builder
      .addCase(fetchUsers.pending, pending)
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.users;
        state.pagination = { total: action.payload.total, page: action.payload.page, pages: action.payload.pages };
      })
      .addCase(fetchUsers.rejected, rejected)
      .addCase(fetchUser.fulfilled, (state, action) => { state.selectedUser = action.payload; })
      .addCase(createUser.fulfilled, (state, action) => { state.list.unshift(action.payload); })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.list = state.list.map(u => u._id === action.payload._id ? action.payload : u);
        state.selectedUser = action.payload;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.list = state.list.map(u => u._id === action.payload ? { ...u, status: 'inactive' } : u);
      });
  },
});

export const { clearUserError, clearSelectedUser } = userSlice.actions;
export default userSlice.reducer;