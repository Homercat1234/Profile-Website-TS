import { useState, useEffect } from "react";
import { Navbar as Navb, Container, Nav } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import Cookies from "universal-cookie";
import axios from "axios";
import verify from "../functions/verify";


const logout = async () => {
  const cookies = new Cookies();
  if (cookies.get("session") != null) {
    await axios.post("http://127.0.0.1/api/auth/logout", {
      token: cookies.get("session").token,
      email: cookies.get("session").email,
    });

    cookies.remove("session");
  }
};

export default function Navbar() {
  const location = useLocation();
  const [shadow, setShadow] = useState(false);
  const [user, setUser] = useState(false);

  useEffect(() => {
    window.addEventListener("scroll", isShadow);
    (async () => {
      const cookies = new Cookies();
      if ((await verify()) === true) setUser(true);
      else {
        setUser(false);
        cookies.remove("session");
      }
    })();
    return () => {
      window.removeEventListener("scroll", isShadow);
    };
  }, [location, user]);

  const isShadow = () => {
    const scrollTop = window.scrollY;
    const topClass = scrollTop >= 1 ? true : false;
    setShadow(topClass);
  };

  const getClassName: () => string = () => {
    return `p-1 sticky-top ${shadow === true ? "shadow" : ""}`;
  };

  return (
    <>
      <Navb bg="dark" variant="dark" expand="lg" className={getClassName()}>
        <Container>
          <Navb.Brand as={Link} to="/">
            Smith's site
          </Navb.Brand>
          <Navb.Toggle />
          <Navb.Collapse>
            <Nav className="ms-auto">
              {user === false ? (
                <Nav.Item>
                  <Nav.Link as={Link} to="/register">
                    Register
                  </Nav.Link>
                </Nav.Item>
              ) : (
                <>
                  <Nav.Item>
                    <Nav.Link as={Link} to="/profile">
                      Profile
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link
                      onClick={() => {
                        logout();
                        setUser(false);
                      }}
                      as={Link}
                      to="/"
                    >
                      Logout
                    </Nav.Link>
                  </Nav.Item>
                </>
              )}
            </Nav>
          </Navb.Collapse>
        </Container>
      </Navb>
    </>
  );
}
