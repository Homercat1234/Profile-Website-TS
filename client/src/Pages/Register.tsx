import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Cookies from "universal-cookie";
import axios from "axios";
import verify from "../functions/verify";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [url, setUrl] = useState("");
  const nagivate = useNavigate();

  useEffect(() => {
    (async () => {
      if ((await verify()) === true) nagivate("/");
    })();
  }, []);

  const handleSubmit = async (event: any) => {
    event.preventDefault();

    await axios
      .post("api/auth/create", {
        email,
        password,
        name,
        bio,
        url,
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
    <>
      <Container className="border mt-2 mb-2">
        <Row>
          <Col lg={4} className="mb-2 mt-2">
            <Form>
              <Form.Floating className="mb-2">
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
                />
                <label>Password</label>
              </Form.Floating>
            </Form>
          </Col>

          <Col lg={8} className="mb-2 mt-2">
            <Form.Floating className="mb-2">
              <Form.Control
                type="name"
                onChange={(e) => setName(e.target.value)}
                placeholder="Name"
              />
              <label>Name</label>
            </Form.Floating>

            <Form.Floating>
              <Form.Control
                type="url"
                onChange={(e) => setUrl(e.target.value)}
                placeholder="picture url"
              />
              <label>Picture Url</label>
            </Form.Floating>
          </Col>

          <div className="d-grid mb-2">
            <Form.Group className="mb-2">
              <Form.Control
                as="textarea"
                rows={4}
                onChange={(e) => setBio(e.target.value)}
                type="bio"
                placeholder="Enter bio"
              />
            </Form.Group>

            <Button variant="dark" onClick={handleSubmit}>
              Submit
            </Button>
            <span>
              Already have an accont? <Link to="/login">Click here</Link> to
              login
            </span>
          </div>
        </Row>
      </Container>
    </>
  );
}
