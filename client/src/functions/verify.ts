import Cookies from "universal-cookie";
import axios from "axios";

export default async function verify() {
  const cookies = new Cookies();
  if (cookies.get("session") != null) {
    return await axios
      .post("api/auth/verify", {
        token: cookies.get("session").token,
        email: cookies.get("session").email,
      })
      .then((res) => {
        if (res.data.result === true) return true;
        return false;
      })
      .catch(() => {
        return false;
      });
  } else {
    return false;
  }
}
