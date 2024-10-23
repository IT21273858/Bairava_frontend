import {jwtDecode} from "jwt-decode"
// import {getCookie} from "typescript-cookie"
import Cookies from "js-cookie";


const getToken = () => {
    const Token = Cookies.get("token");
    if(Token != undefined){

        const decode = jwtDecode(Token);
        return (decode)?decode:null
    }

    return null;
    
    
  
}

export default getToken
