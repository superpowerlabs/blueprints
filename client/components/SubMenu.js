// eslint-disable-next-line no-undef
const { Accordion, Nav, Form } = ReactBootstrap;
// eslint-disable-next-line no-undef
import Base from "./Base";
import Decimals from "../utils/Decimals";

class SubMenu extends Base {
  constructor(props) {
    super(props);

    this.state = {
      collapsed: true,
      selected: undefined,
    };
    this.bindMany(["toggleNavbar", "allValues", "getForm"]);
  }

  toggleNavbar() {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  }

  getForm(trait, value, text) {
    const id = [trait, value].join("_").replace(/[^\w]/g, "_");
    return (
      <Form.Group className="" controlId={id}>
        <Form.Check
          type="radio"
          label={text}
          name={trait}
          checked={(this.Store.filter || {})[[trait, value].join("|")]}
          onChange={(event) => this.props.onCheck(event, trait, value, id)}
        />
      </Form.Group>
    );
  }

  cleanTrait(value) {
    value = value.split(/[ _]+/);
    let str = "";
    for (let t of value) {
      str +=
        (str ? " " : "") +
        (/^\d+$/.test(t)
          ? parseInt(t)
          : t.substring(0, 1).toUpperCase() + t.substring(1));
    }
    return str;
  }

  getPercentage(value) {
    return Decimals((100 * value) / 8000) + "%";
  }

  allValues() {
    const { trait, values } = this.props;
    const rows = [];
    let i = 0;
    for (let value in values) {
      let text = (
        <span>
          <b>{this.cleanTrait(value)}</b>{" "}
          <span style={{ color: "#888", fontSize: "90%" }}>
            ({values[value]}, {this.getPercentage(values[value])})
          </span>
        </span>
      );
      rows.push(
        <div key={"value" + i++}>{this.getForm(trait, value, text)}</div>
      );
    }
    return rows;
  }

  render() {
    const { trait } = this.props;

    return (
      <Nav.Item className={""}>
        <Accordion>
          <Accordion.Item eventKey="0">
            <Accordion.Header>{trait}</Accordion.Header>
            <Accordion.Body>{this.allValues()}</Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </Nav.Item>
    );
  }
}

export default SubMenu;
