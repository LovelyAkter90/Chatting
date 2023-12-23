import React, { useState } from "react";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import "./style.css";
import TextField from "@mui/material/TextField";
import { AiFillEye } from "react-icons/ai";
import { AiFillEyeInvisible } from "react-icons/ai";
import Button from "@mui/material/Button";
import { useFormik } from "formik";
import { signup } from "../../validation";
import BeatLoader from "react-spinners/BeatLoader";
import { ToastContainer, toast } from "react-toastify";
import {
  getAuth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Login from "../Login";
import { getDatabase, ref, set } from "firebase/database";

const Regestration = () => {
  const db = getDatabase();

  const [showPass, setShowPass] = useState("password");
  const [loading, setLoading] = useState(false);
  const auth = getAuth();
  const navigate = useNavigate();
  const handelShowpass = () => {
    if (showPass === "password") {
      setShowPass("text");
    } else {
      setShowPass("password");
    }
  };

  // for use formik option for validation
  const initialValues = {
    fullname: "",
    email: "",
    password: "",
    confirmpassword: "",
  };
  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: signup,
    onSubmit: () => {
      setLoading(true);
      createUserWithEmailAndPassword(
        auth,
        formik.values.email,
        formik.values.password
      )
        .then(({ user }) => {
          console.log(user);
          updateProfile(auth.currentUser, {
            displayName: formik.values.fullname,
          }).then(() => {
            sendEmailVerification(auth.currentUser)
              .then(() => {
                set(ref(db, "users/" + user.uid), {
                  username: user.displayName,
                  email: user.email,
                });
              })
              .then(() => {
                toast.info("Regestration Done!", {
                  position: "bottom-center",
                  autoClose: 1500,
                  hideProgressBar: true,
                  closeOnClick: true,
                  pauseOnHover: false,
                  theme: "colored",
                });
              });
          });

          formik.resetForm();
          setLoading(false);
          setTimeout(() => {
            navigate("/login");
          }, 2500);
        })
        .catch((errors) => {
          console.log("You did not sent a email twice");
        });
    },
  });
  console.log(formik);
  return (
    <>
      <Container fixed>
        <ToastContainer />
        <Grid className="box" container spacing={2}>
          <Grid item xs={6}>
            <div className="forms">
              <div className="reg-header">
                <h2>Get started with easily register</h2>
                <p>Free register and you can enjoy it</p>
              </div>
              <div className="inputs-forms">
                <form onSubmit={formik.handleSubmit}>
                  <TextField
                    className="inputs-design"
                    label="Full Name"
                    variant="outlined"
                    type="text"
                    name="fullname"
                    value={formik.values.fullname}
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
                  {formik.errors.fullname ? (
                    <p className="errors">{formik.errors.fullname}</p>
                  ) : null}
                  <TextField
                    className="inputs-design"
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
                    <p className="errors">{formik.errors.email}</p>
                  ) : null}
                  <div className="password">
                    <TextField
                      className="inputs-design"
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
                    <div className="eyes" onClick={handelShowpass}>
                      {showPass === "password" ? (
                        <AiFillEye />
                      ) : (
                        <AiFillEyeInvisible />
                      )}
                    </div>
                  </div>
                  {formik.errors.password && formik.touched.password ? (
                    <p className="errors">{formik.errors.password}</p>
                  ) : null}
                  <TextField
                    className="inputs-design"
                    label="Confirm Password"
                    variant="outlined"
                    type="password"
                    name="confirmpassword"
                    value={formik.values.confirmpassword}
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
                  {formik.errors.confirmpassword &&
                  formik.touched.confirmpassword ? (
                    <p className="errors">{formik.errors.confirmpassword}</p>
                  ) : null}

                  {loading ? (
                    <Button
                      disabled
                      className="buttons"
                      variant="contained"
                      type="submit"
                    >
                      <BeatLoader size={13} color="#fff" />
                    </Button>
                  ) : (
                    <Button
                      className="buttons"
                      variant="contained"
                      type="submit"
                    >
                      Sign Up
                    </Button>
                  )}
                </form>
                <div className="links">
                  <p>
                    Already have an account ? <Link to="/login">Sign In</Link>{" "}
                  </p>
                </div>
              </div>
            </div>
          </Grid>
          <Grid item xs={6}>
            <div className="signup-image">
              <picture>
                <img loading="lazy" src="./images/signup.png" alt="signup" />
              </picture>
            </div>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default Regestration;
