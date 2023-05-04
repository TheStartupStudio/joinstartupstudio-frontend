import React, { useState } from "react";
import { Link, NavLink, useHistory, Redirect } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { FormattedMessage } from "react-intl";
import { Auth } from "aws-amplify";
import { userLogin, loginLoading } from "../../../redux";
import IntlMessages from "../../../utils/IntlMessages";
import { validateEmail } from "../../../utils/helpers";
import SUSLogo from "../../../assets/images/LTS-logo.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import instructorNormal from "../../../assets/images/instructor-normal.png";
import learnerNormal from "../../../assets/images/learner-normal.png";
import loginInstructor from "../../../assets/images/login-instructor-01.png";
import { ReactComponent as LoginInstructorLogo } from "../../../assets/images/login-instructor-logo-4-fixed.svg";
import { ReactComponent as LoginLearnerLogo } from "../../../assets/images/login-learner-logo-4.svg";
import "./index.css";
import {
  faTwitter,
  faFacebook,
  faInstagram,
  faVimeo,
  faLinkedin,
  faSpotify,
} from "@fortawesome/free-brands-svg-icons";

const ChooseLogin = () => {
  const [loginRole, setLoginRole] = useState(null);
  const [user, setUser] = useState({});
  const currentLanguage =
    localStorage.getItem("currentLanguage") !== undefined ||
    localStorage.getItem("currentLanguage") !== ""
      ? localStorage.getItem("currentLanguage")
      : "en";
  const [loading, setLoading] = useState(false);
  const isLoading = useSelector((state) => state.user.loginLoading);
  const history = useHistory();
  const dispatch = useDispatch();

  console.log(loginRole);
  const handleLoginRole = (role) => {
    setLoginRole(role);
  };

  const navigateToLogin = () => {
    if (loginRole) {
      if (loginRole === "ims") {
        return history.push("/ims-login");
      } else if (loginRole === "main") {
        return window.location.replace("https://main.learntostart.com/");
      }
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setUser((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const enterLogin = (e) => {
    if (e.key.toLowerCase() == "enter") handleSubmit(e);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    dispatch(loginLoading(true));

    if (!user.email || user.email === "") {
      toast.error(<IntlMessages id="alerts.email_required" />);
      dispatch(loginLoading(false));
    } else if (!user.password || user.password === "") {
      toast.error(<IntlMessages id="alerts.password_required" />);
      dispatch(loginLoading(false));
    } else if (!validateEmail(user.email)) {
      toast.error(<IntlMessages id="alerts.valid_email" />);
      dispatch(loginLoading(false));
    } else {
      await Auth.signIn(user.email, user.password)
        .then((response) => {
          localStorage.setItem(
            "access_token",
            response.signInUserSession.idToken.jwtToken
          );
          localStorage.setItem(
            "language",
            response.attributes["custom:language"]
          );
          localStorage.setItem("email", user.email);
          dispatch(userLogin(user.password)).then((res) => {
            if (res === "passwordResetRequired") {
              history.push("/password-change-required");
            }
          });
        })
        .catch((err) => {
          dispatch(loginLoading(false));
          if (err.message === "Incorrect username or password.") {
            toast.error(<IntlMessages id="alerts.email_password_incorrect" />);
          } else {
            toast.error(<IntlMessages id="alerts.something_went_wrong" />);
          }
        });
    }
    // dispatch(loginLoading(false))
  };

  const LoginUser = ({
    logo,
    role,
    loginClassName,
    loginRoleColor,
    backgroundColor,
    handleLoginRole,
  }) => {
    const circleStyle = {
      padding: 5,
      backgroundColor: "#F2F5FC",
      borderRadius: "50%",
      boxShadow:
        "rgba(136, 165, 191, 0.48) 6px 2px 16px 0px, rgba(255, 255, 255, 0.8) -6px -2px 16px 0px",
    };

    const circleBackgroundStyle = {
      border: `2px solid ${loginRoleColor}`,
      backgroundColor: backgroundColor,
      borderRadius: "50%",
      width: 86,
      height: 86,
      alignItems: "center",
      display: "flex",
      justifyContent: "center",
    };

    return (
      <div
        onClick={() => handleLoginRole(role)}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <img src={logo} width={150} />

        {/*<div*/}
        {/*  style={{*/}
        {/*    padding: 10,*/}
        {/*    borderRadius: "50%",*/}
        {/*    border: "1px solid #707070",*/}
        {/*    backgroundColor: "#F2F5FC",*/}
        {/*  }}*/}
        {/*>*/}

        {/*  <div onClick={() => handleLoginRole(role)} style={circleStyle}>*/}
        {/*    <div className={loginClassName} style={circleBackgroundStyle}>*/}
        {/*      /!*{logo}*!/*/}
        {/*    </div>*/}
        {/*  </div>*/}
        {/*</div>*/}
      </div>
    );
  };

  // const Icon = (icon) => {
  //   return (
  //     <>
  //       {icon == "ims" && <LoginInstructorLogo />}
  //       {icon == "main" && <LoginLearnerLogo />}
  //     </>
  //   );
  // };
  const [hover, setHover] = useState(false);

  const handleMouseEnter = () => {
    setHover(true);
  };

  const handleMouseLeave = () => {
    setHover(false);
  };

  return (
    <div
      className="container-fluid md-px-5 ps-md-5"
      style={{
        backgroundColor: "#F8F7F7",
        minHeight: " calc(100vh - 90px)",
      }}
    >
      {/* <div className='login-create-account'>
				<Link to='/create-account'>Create your Account</Link>
			</div> */}
      <div className="row pt-5 center-content">
        <div className="col-md-6">
          <div className="row">
            <div className="col-md-9 mx-auto">
              <div className="login-left-content">
                <img className="login-logo" src={SUSLogo} alt="logo" />
                <h1 className="login-title">Welcome...</h1>
                <p>
                  ...to the Learn to Start Instructor Management System. Please
                  log in to access your platform.
                </p>

                <div className="social-media-items">
                  {/* <a className='social-media-item' href='' target='_blank'>
										<FontAwesomeIcon icon={faFacebook} />
									</a> */}
                  <a
                    className="social-media-item"
                    href="https://twitter.com/learntostart"
                    target="_blank"
                  >
                    <FontAwesomeIcon icon={faTwitter} />
                  </a>
                  <a
                    className="social-media-item"
                    href="https://www.linkedin.com/company/learntostart/"
                    target="_blank"
                  >
                    <FontAwesomeIcon icon={faLinkedin} />
                  </a>
                  <a
                    className="social-media-item"
                    href="https://vimeo.com/showcase/9368302"
                    target="_blank"
                  >
                    <FontAwesomeIcon icon={faVimeo} />
                  </a>
                  <a
                    className="social-media-item"
                    href="https://open.spotify.com/show/0LZ1HxvXnMf6IAdyY8M9q3"
                    target="_blank"
                  >
                    <FontAwesomeIcon icon={faSpotify} />
                  </a>
                  {/* <a className='social-media-item' href='' target='_blank'>
										<FontAwesomeIcon icon={faInstagram} />
									</a> */}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-5">
          <div
            className="col-lg-9 mx-auto public-page-form px-4 pb-3 pt-4"
            style={{
              // backgroundColor: "white",
              backgroundColor: "#F2F5FC",
            }}
          >
            <h3
              className="text-center"
              style={{
                textTransform: "uppercase",
                color: "#51C7DF",
                fontSize: 20,
              }}
            >
              <IntlMessages id="login.title2" />
            </h3>
            <h4 style={{ color: "#707070", textAlign: "center", fontSize: 12 }}>
              Choose your Role
            </h4>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <div style={{ marginRight: "-5px" }}>
                  {/*<LoginUser*/}
                  {/*  logo={*/}
                  {/*    instructorNormal*/}
                  {/*    // <LoginInstructorLogo />*/}
                  {/*  }*/}
                  {/*  role={"ims"}*/}
                  {/*  loginClassName={"ims-login-role"}*/}
                  {/*  loginRoleColor={"#51C7DF"}*/}
                  {/*  backgroundColor={loginRole == "ims" ? "#51C7DF" : ""}*/}
                  {/*  handleLoginRole={(role) => handleLoginRole(role)}*/}
                  {/*/>*/}
                  <div
                    onClick={() => handleLoginRole("ims")}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: "50%",
                      width: 150,
                      height: 150,
                      overflow: "hidden",
                    }}
                  >
                    <img
                      src={hover ? instructorNormal : learnerNormal}
                      // width={"100%"}
                      style={{ width: "100%", objectFit: "contain" }}
                    />
                  </div>
                </div>
                <div>
                  <div
                    onClick={() => handleLoginRole("main")}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <img src={learnerNormal} width={150} />
                  </div>
                  {/*<LoginUser*/}
                  {/*  logo={*/}
                  {/*    learnerNormal*/}
                  {/*    // <LoginLearnerLogo*/}
                  {/*    //   className={*/}
                  {/*    //     loginRole == "main"*/}
                  {/*    //       ? "learner-logo-clicked"*/}
                  {/*    //       : "learner-logo"*/}
                  {/*    //   }*/}
                  {/*    // />*/}
                  {/*  }*/}
                  {/*  role={"main"}*/}
                  {/*  loginClassName={"main-login-role"}*/}
                  {/*  loginRoleColor={"#ff3399"}*/}
                  {/*  backgroundColor={loginRole == "main" ? "#ff3399" : ""}*/}
                  {/*  handleLoginRole={(role) => handleLoginRole(role)}*/}
                  {/*/>*/}
                </div>
              </div>
            </div>
            <div></div>

            {/*<FormattedMessage id='login.email' defaultMessage='login.email'>*/}
            {/*    {(placeholder) => (*/}
            {/*        <input*/}
            {/*            className='mt-2 mb-3'*/}
            {/*            type='text'*/}
            {/*            name='email'*/}
            {/*            placeholder={placeholder}*/}
            {/*            onKeyDown={enterLogin}*/}
            {/*            onChange={(event) => handleChange(event)}*/}
            {/*        />*/}
            {/*    )}*/}
            {/*</FormattedMessage>*/}
            {/*<FormattedMessage*/}
            {/*    id='login.password'*/}
            {/*    defaultMessage='login.password'*/}
            {/*>*/}
            {/*    {(placeholder) => (*/}
            {/*        <input*/}
            {/*            className='mb-3'*/}
            {/*            type='password'*/}
            {/*            name='password'*/}
            {/*            placeholder={placeholder}*/}
            {/*            onKeyDown={enterLogin}*/}
            {/*            onChange={(event) => handleChange(event)}*/}
            {/*        />*/}
            {/*    )}*/}
            {/*</FormattedMessage>*/}
            <button
              type="submit"
              className="mt-2"
              disabled={isLoading}
              onClick={navigateToLogin}
            >
              {isLoading ? (
                <span className="spinner-border spinner-border-sm" />
              ) : (
                <IntlMessages id="login.next" />
              )}
            </button>
            <p className="my-4">
              <IntlMessages id="login.security" />
              <a href="/lts-secure" className="ml-2 link">
                <IntlMessages id="login.protect_data" />
              </a>
            </p>
            {/*<p className='text-center public-page-text'>*/}
            {/*    <IntlMessages id='login.forgot_password' />*/}
            {/*    <NavLink to={'/forgot-password'} className='ml-2 link'>*/}
            {/*        <IntlMessages id='general.click_here' />*/}
            {/*    </NavLink>*/}
            {/*</p>*/}
          </div>
          {/* <p className='text-center mt-3 public-page-text link'>
            <IntlMessages id='login.register' />
            <a href='/create-account' className='ml-2 link'>
              <IntlMessages id='login.register_link' />
            </a>
          </p> */}
        </div>
      </div>
    </div>
  );
};

export default ChooseLogin;
