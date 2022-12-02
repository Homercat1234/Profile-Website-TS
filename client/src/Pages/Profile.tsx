import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
import axios from "axios";
import SingleProfile from "../components/SingleProfile";
import verify from "../functions/verify";

export default function Profile() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [url, setUrl] = useState("");
  const nagivate = useNavigate();

  useEffect(() => {
    (async () => {
      if ((await verify()) === false) nagivate("/");
    })();
  }, []);

  const handleSubmit = async (event: any) => {
    event.preventDefault();

    const cookies = new Cookies();
    if (cookies.get("session") != null) {
    await axios
      .patch("http://127.0.0.1/api/profile", {
        token: cookies.get("session").token,
        auth: {
          ...(password != null && password !== "" && { password }),
          ...(email != null && email !== "" && { email }),
        },
        profile: {
          ...(url != null && url !== "" && { url }),
          ...(bio != null && bio !== "" && { bio }),
          ...(name != null && name !== "" && { name }),
        },
        email: cookies.get("session").email,
      })
      .then(function (res) {
        nagivate("/");
      })
      .catch(function (error) {
        alert(error);
      });
    }
  };

  return (
    <div style={{ minHeight: "100vh" }}>
      <SingleProfile name={`${name}`} url={`${url}`} bio={`${bio}`} />
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
                  placeholder="Enter new password"
                />
                <label>New Password</label>
              </Form.Floating>
            </Form>
          </Col>

          <Col lg={8} className="mb-2 mt-2">
            <Form.Floating className="mb-2">
              <Form.Control
                type="name"
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter name"
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
                placeholder="Enter bio"
              />
            </Form.Group>

            <Button variant="dark" onClick={handleSubmit}>
              Submit
            </Button>
          </div>
        </Row>
      </Container>
    </div>
  );
}
