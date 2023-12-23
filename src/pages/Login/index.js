import React, { useState } from "react";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import "./style.css";
import TextField from "@mui/material/TextField";
import { AiFillEye } from "react-icons/ai";
import { AiFillEyeInvisible } from "react-icons/ai";
import Button from "@mui/material/Button";
import { useFormik } from "formik";
import BeatLoader from "react-spinners/BeatLoader";
import { ToastContainer, toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { signin } from "../../validation";
import { LoginUsers } from "../../features/Slice/LoginSlice";
import {
  getAuth,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  FacebookAuthProvider,
} from "firebase/auth";
import { useDispatch } from "react-redux";
import { getDatabase, ref, set } from "firebase/database";

const Login = () => {
  //for database google collection....
  const db = getDatabase();

  const [showPass, setShowPass] = useState("password");
  const [loading, setLoading] = useState(false);

  const [googleuser, setGoogleuser] = useState();
  const handelShowpass = () => {
    if (showPass === "password") {
      setShowPass("text");
    } else {
      setShowPass("password");
    }
  };

  //usingm dispatch for call an action
  const dispatch = useDispatch();

  //this is for authentication
  const auth = getAuth();
  const navigate = useNavigate();

  const initialValues = {
    email: "",
    password: "",
  };

  //this is for provider
  const googleprovider = new GoogleAuthProvider();
  const facebookprovider = new FacebookAuthProvider();

  //this is for formik which needs for form validation
  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: signin,
    onSubmit: () => {
      setLoading(true);
      signInWithEmailAndPassword(
        auth,
        formik.values.email,
        formik.values.password
      )
        .then(({ user }) => {
          if (auth.currentUser.emailVerified === true) {
            dispatch(LoginUsers(user));
            localStorage.setItem("users", JSON.stringify(user));
            setLoading(false);
            setTimeout(() => {
              navigate("/");
            }, 1000);
          } else {
            toast.info("email not varified", {
              position: "bottom-center",
              autoClose: 3000,
              hideProgressBar: true,
              closeOnClick: true,
              pauseOnHover: false,
            });
            setLoading(false);
          }
        })

        .catch((error) => {
          toast.info("Invalid Email!", {
            position: "bottom-center",
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: false,
          });
          setLoading(false);
        });
    },
  });

  // googleauthentication
  const handleGoogleauth = (user) => {
    if (auth.currentUser == user.uid) {
      signInWithPopup(auth, googleprovider)
        .then((user) => {
          dispatch(LoginUsers(user));
          localStorage.setItem("users", JSON.stringify(user));
        })
        .then((result) => {
          const credential = GoogleAuthProvider.credentialFromResult(result);
          const token = credential.accessToken;
          const user = result.user;
        })
        .then((user) => {
          if (user !== null) {
            user.providerData.forEach((user) => {
              set(ref(db, "googlecollection"), {
                username: user.displayName,
                email: user.email,
              });
              navigate("/");
            });
          }
        });
    }
  };
  console.log("ase");

  // facebookauthentication
  const handleFacebookauth = () => {
    signInWithPopup(auth, facebookprovider).then(() => {
      navigate("/");
    });
  };

  return (
    <>
      <Container fixed>
        <ToastContainer />
        <Grid className="box" container spacing={2}>
          <Grid item xs={6}>
            <div className="signup-image">
              <picture>
                <img loading="lazy" src="./images/login.png" alt="login" />
              </picture>
            </div>
          </Grid>
          <Grid item xs={6}>
            <div className="login-left">
              <div className="avatar">
                <picture>
                  <img load="lazy" src="./images/female.png" alt="female" />
                </picture>
              </div>
              <div className="login-auth">
                <div className="authentication" onClick={handleGoogleauth}>
                  <div className="auth-pic">
                    <picture>
                      <img src="./images/google.png" alt="google" />
                    </picture>
                  </div>
                  <div className="auth-text">
                    <h4>Login with Google</h4>
                  </div>
                </div>
                <div className="authentication" onClick={handleFacebookauth}>
                  <div className="auth-pic">
                    <picture>
                      <img src="./images/facebook.png" alt="facebook" />
                    </picture>
                  </div>
                  <div className="auth-text">
                    <h4>Login with Facebook</h4>
                  </div>
                </div>
              </div>
              <div className="forms">
                <div className="login-header">
                  <h2>Login To Your Account</h2>
                </div>
                <div className="inputs-forms">
                  <form onSubmit={formik.handleSubmit}>
                    <TextField
                      className="login-input-design"
                      label="Email"
                      variant="outlined"
                      type="email"
                      name="email"
                      value={formik.values.email}
                      onChange={formik.handleChange}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          "& > fieldset": {
                            borderColor: "var(--border-color)",
                          },
                        },
                        "& .MuiInputLabel-root.Mui-focused": {
                          color: "var(--border-color)",
                        },
                      }}
                    />
                    {formik.errors.email && formik.touched.email ? (
                      <p className="errors-log">{formik.errors.email}</p>
                    ) : null}
                    <div className="password">
                      <TextField
                        className="login-input-design"
                        label="Password"
                        variant="outlined"
                        type={showPass}
                        name="password"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            "& > fieldset": {
                              borderColor: "var(--border-color)",
                            },
                          },
                          "& .MuiInputLabel-root.Mui-focused": {
                            color: "var(--border-color)",
                          },
                        }}
                      />
                      <div className="eyes-login" onClick={handelShowpass}>
                        {showPass === "password" ? (
                          <AiFillEye />
                        ) : (
                          <AiFillEyeInvisible />
                        )}
                      </div>
                    </div>
                    {formik.errors.password && formik.touched.password ? (
                      <p className="errors-log">{formik.errors.password}</p>
                    ) : null}
                    {loading ? (
                      <Button
                        disabled
                        className="login-buttons"
                        variant="contained"
                        type="submit"
                      >
                        <BeatLoader size={13} color="#fff" />
                      </Button>
                    ) : (
                      <Button
                        className="login-buttons"
                        variant="contained"
                        type="submit"
                      >
                        Log In
                      </Button>
                    )}
                  </form>
                  <div className="links-log">
                    <div className="forget-link">
                      <Link to="/forgetpassword">Forgot Password</Link>
                    </div>
                    <p>
                      Don't Have An Account?
                      <Link to="/regestration">Sign up</Link>{" "}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default Login;
