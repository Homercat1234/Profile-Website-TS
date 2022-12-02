import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Cookies from "universal-cookie";
import axios from "axios";
import verify from "../functions/verify";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const nagivate = useNavigate();

  useEffect(() => {
    (async () => {
      if ((await verify()) === false) nagivate("/");
    })();
  }, []);

  const handleSubmit = async (event: any) => {
    event.preventDefault();

    await axios
      .post("http://127.0.0.1/api/auth/login", {
        email,
        password,
      })
      .then(function (res) {
        const cookies = new Cookies();
        cookies.set(
          "session",
          { token: res.data.token, email: res.data.email },
          {
            path: "/",
            expires: new Date(res.data.date),
          }
        );
        nagivate("/");
      })
      .catch(function (error) {
        alert(error);
      });
  };

  return (
    <div style={{ height: "100vh" }}>
      <Container className="mt-1 mb-2">
        <Row className="m-0">
          <Col xs={6} md={4} />
          <Col xs={6} md={4} className="border mb-2 mt-1">
            <Form>
              <Form.Floating className="mt-2 mb-2">
                <Form.Control
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  placeholder="Email"
                />
                <label>Email address</label>
              </Form.Floating>

              <Form.Floating>
                <Form.Control
                  type="password"
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="mb-2"
                />
                <label>Password</label>
              </Form.Floating>
            </Form>
            <div className="d-grid mb-2">
              <Button variant="dark" onClick={handleSubmit}>
                Submit
              </Button>
              <span>
                Don't have an accont? <Link to="/register">Click here</Link> to
                register
              </span>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
