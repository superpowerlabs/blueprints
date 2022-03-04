import React from "react";
import text from "../config/text";
import Markdown from "react-markdown-it";
// import Base from "../components/Base";

// eslint-disable-next-line no-undef
const { Container, Row, Col } = ReactBootstrap;

function Overview() {
  return (
    <Container
      style={{
        margin: "100px 0",
      }}
    >
      <Row>
        <Col md={"4"}></Col>
        <Col md={"8"} className={"doc"}>
          <div
            className={"Overview"}
            style={{
              textAlign: "left",
            }}
          >
            <Markdown source={text} />
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default Overview;
