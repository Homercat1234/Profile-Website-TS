import axios from "axios";
import React, { useEffect, useState } from "react";
import { Row, Col, Container, Image, Card } from "react-bootstrap";

async function getProfiles(): Promise<any[]> {
  interface IProfile {
    profile: {
      name: string;
      bio: string;
      url: string;
    };
  }

  let profiles: any = await axios.get("api/profile").then((data) => {
    return data.data;
  });

  let array: Array<React.ReactElement> = [];
  profiles.forEach((item: IProfile, index: Number) =>
    array.push(
      <div key={index as React.Key}>
        <Container
          className="d-flex justify-content-center mb-2 mt-2"
          style={{ whiteSpace: "pre-wrap" }}
        >
          <Card style={{ width: "130vh" }}>
            <Card.Header>{item.profile.name}</Card.Header>

            <Row className="mt-2 mb-2 me-3 g-0">
              <Col lg={4} className="text-center">
                <Container className="d-flex justify-content-center">
                  <div style={{ height: "30vh", width: "30vh" }}>
                    <Image
                      src={item.profile.url}
                      alt={`${index}`}
                      rounded
                      fluid
                      thumbnail
                    />
                  </div>
                </Container>
              </Col>
              <Col lg={8} className="text-start ms-0">
                <div>{item.profile.bio}</div>
              </Col>
            </Row>
          </Card>
        </Container>
      </div>
    )
  );
  return array;
}

export default function Profile() {
  const [profile, setProfile]: any = useState();

  useEffect(() => {
    (async () => {
      setProfile(await getProfiles()); 
    })();
  }, []);

  return <>{profile}</>;
}
