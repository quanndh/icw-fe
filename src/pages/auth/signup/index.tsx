import { TextField, Button, Typography } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { internalRequest } from "../../../shared/utils/request";
import isEmail from "validator/lib/isEmail";

const SignupPage = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailErr, setEmailErr] = useState("");
  const [passwordErr, setPasswordErr] = useState("");

  const isValid = () => {
    let valid = true;
    const trimEmail = email.trim();
    const trimPassword = password.trim();

    if (!trimEmail) {
      setEmailErr("Email is required");
      valid = false;
    }
    if (!isEmail(trimEmail)) {
      setEmailErr("Email format is invalid");
      valid = false;
    }
    if (!trimPassword) {
      setPasswordErr("Password is required");
      valid = false;
    }
    if (trimPassword.length < 6) {
      setPasswordErr("Password is too short(6 or more characters)");
      valid = false;
    }
    if (valid) {
      setEmailErr("");
      setPasswordErr("");
    }
    return valid;
  };

  const handleSubmit = async () => {
    if (isValid()) {
      try {
        const res = await internalRequest.post("/auth/signup", {
          email: email.trim(),
          password: password.trim(),
        });

        if (res.data.id) {
          toast.success("Sign up successfully");
          navigate("/login");
        }
      } catch (error: any) {
        toast.error(error.response.data.message);
      }
    }
  };

  return (
    <div className="bg-red mt-12 w-full flex flex-col items-center space-y-1 md:space-y-4 lg:space-y-8">
      <div className="font-semibold xs:text-lg lg:text-3xl">Sign up</div>

      <TextField
        error={emailErr.length > 0}
        id="email"
        label="Email"
        placeholder="Enter your email"
        helperText={emailErr}
        className="w-1/2 md:w-1/2 lg:w-1/3 xl:w-1/4"
        onChange={(e) => setEmail(e.target.value)}
      />
      <TextField
        error={passwordErr.length > 0}
        id="password"
        label="Password"
        type="password"
        placeholder="Enter your password"
        helperText={passwordErr}
        className="w-1/2 md:w-1/2 lg:w-1/3 xl:w-1/4"
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button variant="outlined" color="inherit" onClick={handleSubmit}>
        Sign up
      </Button>
      <Typography variant="inherit">
        Already have an account?
        <Button
          variant="text"
          color="primary"
          onClick={() => navigate("/login")}
        >
          Login
        </Button>
      </Typography>
    </div>
  );
};

export default SignupPage;
