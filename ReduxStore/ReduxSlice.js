import { createSlice } from '@reduxjs/toolkit';

// SignUp Form Slice
const signUpFormSlice = createSlice({
  name: 'signUpForm',
  initialState: {
    userName: '',
    email: '',
    password: '',
    confirmPassword: '',
    mobileNumber: '',
  },
  reducers: {
    setSignUpForm: (state, action) => {
      return { ...state, ...action.payload };
    },
    clearSignUpForm: () => ({
      userName: '',
      email: '',
      password: '',
      confirmPassword: '',
      mobileNumber: '',
    }),
  },
});

// Auth Slice
const authSlice = createSlice({
  name: 'auth',
  initialState: {
      isLoggedIn: false,
      userData: {},
      isChecked: false,
  },
  reducers: {
      setIsLoggedIn(state, action) {
          state.isLoggedIn = action.payload;
      },
      setUserData(state, action) {
          state.userData = action.payload;
      },
      setIsChecked(state, action) {
          state.isChecked = action.payload;
      },
      resetAuthState(state) {
          state.isLoggedIn = false;
          state.userData = {};
          state.isChecked = false;
      },
  },
});

// Export actions
export const { setSignUpForm, clearSignUpForm } = signUpFormSlice.actions;
export const { setIsLoggedIn, setUserData, setIsChecked } = authSlice.actions;

// Export reducers
export default {
  signUpForm: signUpFormSlice.reducer,
  auth: authSlice.reducer,
};
