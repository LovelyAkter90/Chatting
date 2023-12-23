import React from "react";
import TextField from "@mui/material/TextField";
import { useFormik } from "formik";
import { getDatabase, ref, update } from "firebase/database";
import { getAuth, updatePassword, updateProfile } from "firebase/auth";
import { useDispatch, useSelector } from "react-redux";
import Button from "@mui/material/Button";
import { LoginUsers } from "../../features/Slice/LoginSlice";
import { ToastContainer, toast } from "react-toastify";

const SettingForm = () => {
  const db = getDatabase();
  const auth = getAuth();
  const users = useSelector((user) => user.login.loggedIn);
  const currentuser = auth.currentUser;

  const dispatch = useDispatch();

  const initialValues = {
    fullname: users.displayName,
    email: users.email,
    password: "",
  };
  const formik = useFormik({
    initialValues: initialValues,

    onSubmit: () => {
      handleUpdateProfile();
      // update(ref(db, "users/" + users.uid), {
      //username: formik.values.fullname,
      // }).then(() => {
      // updateProfile(auth.currentUser, {
      // displayName: formik.values.fullname,
      //});
      // });
    },
  });

  const handleUpdateProfile = async () => {
    await updateProfile(auth.currentUser, {
      displayName: formik.values.fullname,
    }).then(async () => {
      const userInfo = {
        // 2 way te kora jay ae code ta
        //uid: auth.currentUser.uid,
        //email: auth.currentUser.email,
        //emailVerified: auth.currentUser.emailVerified,
        displayName: auth.currentUser.displayName,
        //photoURL: auth.currentUser.photoURL,
      };
      console.log(userInfo);
      await update(ref(db, "users/" + users.uid), {
        username: userInfo.displayName,
      });
      updatePassword(currentuser, formik.values.password)
        .then(() => {
          console.log("password changed");
        })
        .then(() => {
          toast.info("Information UpDate!", {
            position: "top-right",
            autoClose: 1500,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: false,
            theme: "colored",
          });
        });
      formik.resetForm();
      dispatch(LoginUsers({ ...users, displayName: formik.values.fullname }));
      localStorage.setItem(
        "users",
        JSON.stringify({ ...users, displayName: formik.values.fullname })
      );
    });
  };
  console.log(auth.currentUser);
  return (
    <div>
      <form onSubmit={formik.handleSubmit}>
        <div className="setting-field">
          <ToastContainer />
          <TextField
            className="account-form"
            label="Full Name"
            variant="outlined"
            type="text"
            name="fullname"
            onBlur={formik.onBlur}
            value={formik.values.fullname}
            onChange={formik.handleChange}
          />
          <TextField
            className="account-form"
            label="Email"
            disabled
            variant="outlined"
            type="email"
            name="email"
            onBlur={formik.onBlur}
            value={formik.values.email}
            onChange={formik.handleChange}
          />
          <TextField
            className="account-form"
            label="New password"
            variant="outlined"
            type="password"
            name="password"
            onBlur={formik.onBlur}
            value={formik.values.password}
            onChange={formik.handleChange}
          />
        </div>
        <div className="setting-btn">
          <Button className="buttons" variant="contained" type="submit">
            Update Account
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SettingForm;
