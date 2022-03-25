// eslint-disable-next-line no-undef
const { Accordion, Nav, Form } = ReactBootstrap;
// eslint-disable-next-line no-undef
import Base from "./Base";

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
    return this.addSomeDecimals((100 * value) / 8000) + "%";
  }

  addSomeDecimals(s = "", c = 2) {
    s = s.toString().split(".");
    if (!s[0]) {
      s[0] = 0;
    }
    s[1] = (s[1] || "").substring(0, c);
    s[1] = s[1] + "0".repeat(c - s[1].length);
    return s.join(".");
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
