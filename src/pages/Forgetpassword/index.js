import "./style.css";
import TextField from "@mui/material/TextField";
import { useFormik } from "formik";
import Button from "@mui/material/Button";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { ToastContainer, toast } from "react-toastify";

const Forget = () => {
  const auth = getAuth();

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    onSubmit: () => {
      sendPasswordResetEmail(auth, formik.values.email)
        .then(() => {
          toast.info("Password Reset Done!", {
            position: "bottom-center",
            autoClose: 1500,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: false,
            theme: "colored",
          });
          formik.resetForm();
        })
        .catch((error) => {
          toast.info("Invalid Email!", {
            position: "bottom-center",
            autoClose: 1500,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: false,
            theme: "colored",
          });
        });
    },
  });
  console.log(formik);

  return (
    <>
      <div className="forget-box">
        <ToastContainer />
        <div className="forget-input">
          <h3>Forgot Password</h3>
          <div className="forget-filed">
            <form action="post" onSubmit={formik.handleSubmit}>
              <TextField
                className="login-input-design"
                label="Email"
                variant="outlined"
                type="email"
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                sx={{
                  "& .MuiInputLabel-root": { color: "blue" }, //styles the label
                  "& .MuiOutlinedInput-root": {
                    "& > fieldset": { borderColor: "blue" },
                  },
                }}
              />
              <Button
                className="login-buttons"
                variant="contained"
                type="submit"
              >
                Reset
              </Button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Forget;
