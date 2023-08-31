import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  updateProfile,
  signOut,
} from "firebase/auth";
import { auth } from "../../firebase/config";
import { authSlice } from "./authReduser";
const { updateUserProfile, authSingOut, authStateChange } = authSlice.actions;

export const register =
  ({ email, password, login }) =>
  async (dispatch, getState) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      const user = await auth.currentUser;

      await updateProfile(user, {
        displayName: login,
      });
      const { uid, displayName } = await auth.currentUser;

      const userUpdateProfile = {
        userId: uid,
        nickName: displayName,
      };

      dispatch(updateUserProfile(userUpdateProfile));
    } catch (error) {
      console.log(error);
      console.log(error.message);
    }
  };

export const logIn =
  ({ email, password }) =>
  async (dispatch, getState) => {
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      return user;
    } catch (error) {
      console.log(error.message);
    }
  };
export const logOut = () => async (dispatch, getState) => {
  await signOut(auth);
  dispatch(authSingOut());
};

export const authStateChangeUser = () => async (dispatch, getState) => {
  await onAuthStateChanged(auth, (user) => {
    if (user) {
      const userUpdateProfile = {
        userId: user.uid,
        nickName: user.displayName,
      };
      dispatch(authStateChange({ stateChange: true }));
      dispatch(updateUserProfile(userUpdateProfile));
    }
  });
};
