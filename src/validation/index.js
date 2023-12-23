import * as Yup from "yup";

//for signup validation
export const signup = Yup.object({
  fullname: Yup.string().min(3).max(15).required("Please Enter Your Full Name"),
  email: Yup.string().email().required("Please Enter A Valid Email"),
  password: Yup.string().min(8).required("Enter Your Password"),
  confirmpassword: Yup.string()
    .min(8)
    .oneOf([Yup.ref("password"), null], "Password Must Be Matched")
    .required("Please Give Corfirm Password"),
});

//for signin validation

export const signin = Yup.object({
  email: Yup.string().email().required("Please Enter A Valid Email"),
  password: Yup.string().min(8).required("Enter Your Password"),
});
