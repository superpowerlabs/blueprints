import * as Scroll from "react-scroll";

import text from "../config/text";
import Markdown from "react-markdown-it";
import Base from "../components/Base";

// eslint-disable-next-line no-undef
const { Container, Row, Col } = ReactBootstrap;

export default class Overview extends Base {
  componentDidMount() {
    Scroll.animateScroll.scrollToTop();
  }

  render() {
    return (
      <Container
        style={{
          margin: "100px 0",
        }}
      >
        <Row>
          <Col md={"4"} />
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
}
