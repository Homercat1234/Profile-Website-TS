import { Row, Col, Container, Image, Card, Badge } from "react-bootstrap";
import { useState, useEffect } from "react";
import Cookies from "universal-cookie";
import axios from "axios";

interface IProps {
  name?: string;
  bio?: string;
  url?: string;
}

export default function SingleProfile({
  name = "",
  bio = "",
  url = "",
}: IProps) {
  const [profile, setProfile]: any = useState();
  const [cookie, setCookie] = useState(false);

  useEffect(() => {
    (async () => {
      const cookies = new Cookies();
      if (cookies.get("session") != null) {
        setProfile(
          await axios
            .post("http://127.0.0.1/api/profile/email", {
              email: cookies.get("session").email,
            })
            .then((res) => {
              return res.data.profile;
            })
        );
        setCookie(true);
      } else {
        setCookie(false);
      }
    })();
  }, [cookie]);

  return (
    <>
      <div>
        <Container
          className="d-flex justify-content-center mb-1 mt-2"
          style={{ whiteSpace: "pre-wrap" }}
        >
          <Card style={{ width: "130vh" }}>
            <Card.Header>
              <span>{`${
                (cookie as Boolean) === true
                  ? name !== ""
                    ? name
                    : profile.name
                  : "Loading"
              }`}</span>
              <Badge className="mx-2 bg-dark">Preview</Badge>
            </Card.Header>

            <Row className="mt-2 mb-2 me-3 g-0">
              <Col lg={4} className="text-center">
                <Container className="d-flex justify-content-center">
                  <div style={{ height: "30vh", width: "30vh" }}>
                    <Image
                      src={`${
                        (cookie as Boolean) === true
                          ? url !== ""
                            ? url
                            : profile.url
                          : "/placeholder.png"
                      }`}
                      alt={`${
                        (cookie as Boolean) === true
                          ? name !== ""
                            ? name
                            : profile.name
                          : "Loading"
                      }`}
                      rounded
                      thumbnail
                      fluid
                    />
                  </div>
                </Container>
              </Col>
              <Col lg={8} className="text-start ms-0">
                <div>{`${
                  (cookie as Boolean) === true
                    ? bio !== ""
                      ? bio
                      : profile.bio
                    : "Loading"
                }`}</div>
              </Col>
            </Row>
          </Card>
        </Container>
      </div>
    </>
  );
}
