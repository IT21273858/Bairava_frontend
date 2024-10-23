import Cookies from "js-cookie";

const CheckToken = () => {

  const Token = Cookies.get("token");
  // console.log("TK check",Token);

  // #const Token = getCookie("token");

  if (Token == undefined) {
    return false;
  } else return true;
};

export default CheckToken;
