// Redux 要求我们通过创建数据副本和更新数据副本，来实现不可变地写入所有状态更新。
// 不过 Redux Toolkit createSlice 和 createReducer 在内部使用 Immer 允许我们编写“可变”的更新逻辑，变成正确的不可变更新。
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {getUserInfo} from '../service/interface';

// 创建一个异步 thunk 来处理 API 请求
export const fetchData = createAsyncThunk('userSlice/fetchData', async () => {
  const response = await getUserInfo();
  return response.data;
});

// 创建一个初始状态
const initialState = {
  data: [],
  loading: false,
  error: null,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
})
export default userSlice.reducer
