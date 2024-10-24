import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { FiInfo, FiLock, FiMail } from "react-icons/fi";
import AlertPopup from "../Alertpopup";
import { useNavigate } from "react-router-dom";
import CheckToken from "../token/checktoken";
import axios from "axios";
import Cookies from "js-cookie";

const LoginScreen = () => {
  const navigate = useNavigate();

  const handleforgotClick = () => {
    navigate("/forgot");
  };

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const submitbtn = useRef(null);

  const loginCover =
    "https://i.pinimg.com/736x/37/40/a0/3740a02e35d43e66dd1217cc03142517.jpg";

  const submitHandle = async (data) => {
    setLoading(true);
    setErrorMessage("");

    try {
      const response = await axios.post(
        import.meta.env.VITE_REACT_APP_BASE_URL + "/employees/login",
        {
          email: data.email,
          password: data.password,
        }
      );

      if (response.status === 200) {
        const { token } = response.data;
        Cookies.set("token", token);
        localStorage.setItem("token", token);
        window.location.href = "/";
        AlertPopup({
          message: "Signed up successfully",
          icon: "success",
        });
      } else {
        AlertPopup({
          message: "Invalid Login",
          icon: "warning",
        });
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const responseError = error.response?.data?.error || "Login failed";
        setErrorMessage(responseError);
      } else {
        setErrorMessage("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (CheckToken()) {
      navigate("/");
    }
  }, [navigate]);

  return (
    <section className="bg-pageColor w-screen h-screen flex items-center flex-col justify-center text-pageinverse overflow-hidden relative">
      {/* text */}
      <div className="hidden md:flex w-3/5 flex-col text-xl font-poppins gap-3 h-full md:mt-20 lg:mt-8 items-center justify-start">
        <div className="flex flex-col text-lg items-center justify-center gap-0 leading-none">
        <p className="font-serif">Welcome to a world of fragrances....</p>
          <img src="/logo.png" alt="Logo" height={250} width={250} className="mt-4 mb-4" />
          {/* <p className="text-2xl font-limeLight">Bairavaa</p> */}
          <p className="font-light">
          Craft your scent, one login away.
          </p>
        </div>
      </div>
      <form onSubmit={handleSubmit(submitHandle)} className="w-full h-full flex justify-center">
        {/* container */}
        <div
          id="container"
          className="w-full h-full bg-pageColor md:w-4/5 md:h-3/4 md:drop-shadow-2xl md:rounded-2xl md:absolute md:-bottom-10 flex flex-col lg:flex-row"
        >
          <div className="w-full h-2/5 lg:h-full lg:w-3/5">
            <img
              src={loginCover}
              alt="Login Cover"
              className="w-full h-full object-cover md:rounded-tl-2xl lg:rounded-tl-2xl lg:rounded-tr-none"
            />
          </div>

          <div className="relative w-full h-3/5 lg:h-full lg:w-2/5 flex flex-col font-poppins px-5 text-start py-10 gap-1">
            <p className="font-bold text-2xl text-pageinverse/70 mb-8">Login</p>

            {/* user name / email */}
            <div id="username" className="flex flex-col text-center">
              <div className="flex gap-3 items-center text-xl">
                <FiMail />
                <p>Email</p>
              </div>
              <input
                {...register("email", { required: "Enter a valid Email" })}
                type="text"
                className="w-full text-xl font-light rounded-2xl h-10 px-4 mt-2 border sm:border-b-gray-700 md:border-none"
              />
            </div>

            {/* password */}
            <div id="password" className="flex flex-col text-center mt-5">
              <div className="flex gap-3 items-center text-xl">
                <FiLock />
                <p>Password</p>
              </div>
              <input
                {...register("password", { required: "Password cannot be empty" })}
                type="password"
                className="w-full text-xl font-light rounded-2xl h-10 px-4 mt-2 border sm:border-b-gray-700 md:border-none"
              />
            </div>

            {/* forgot password */}
            <div className="w-full text-end mt-5 font-light">
              <p className="underline underline-offset-1 cursor-pointer" onClick={handleforgotClick}>
                Forgot Password?
              </p>
            </div>

            <div className="mt-10 w-full px-10">
              {(errors.password || errors.email || errorMessage) && (
                <div className="gap-2 my-3 flex items-center text-red-600">
                  <FiInfo />
                  <p>{errors.email?.message || errors.password?.message || errorMessage}</p>
                </div>
              )}
              <div
                className="cursor-pointer w-full bg-purple-400 hover:bg-purple-500 h-fit py-1 text-2xl rounded-md drop-shadow-md text-pageColor font-limeLight text-center"
                onClick={() => {
                  submitbtn.current?.click();
                }}
              >
                {loading ? "Logging in..." : "LOGIN"}
              </div>
              <input ref={submitbtn} type="submit" className="hidden" />
            </div>
          </div>
        </div>
      </form>
    </section>
  );
};

export default LoginScreen;
