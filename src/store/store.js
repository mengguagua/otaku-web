import { configureStore } from '@reduxjs/toolkit';
import loadingReducer from './loadingSlice';
import userReducer from './userSlice';


export default configureStore({
  reducer: {
    loading: loadingReducer,
    user: userReducer,
  },
})
