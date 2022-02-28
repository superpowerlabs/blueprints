import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import SubMenu from "./SubMenu";
// eslint-disable-next-line no-undef
const { InputGroup, FormControl, Button, Nav } = ReactBootstrap;
import classNames from "classnames";
import Base from "./Base";

import rarityDistribution from "../config/rarityDistribution.json";

class SideBar extends Base {
  constructor(props) {
    super(props);
    this.state = { value: "" };
    this.handleChange = this.handleChange.bind(this);
  }

  allTraits() {
    const rows = [];
    let i = 0;
    for (let trait in rarityDistribution) {
      rows.push(
        <SubMenu
          key={"trait" + i++}
          trait={trait}
          values={rarityDistribution[trait]}
          Store={this.Store}
          setStore={this.setStore}
          onCheck={this.props.onCheck}
        />
      );
    }
    return rows;
  }
  handleChange(event) {
    this.setState({ value: event.target.value });
    this.props.onId(event.target.value);
  }

  render() {
    return (
      <div className={classNames("sidebar", { "is-open": this.props.isOpen })}>
        <div className="sidebar-header">
          <Button
            variant="link"
            onClick={this.props.toggle}
            style={{ color: "#fff" }}
            className="mt-4"
          >
            <FontAwesomeIcon icon={faTimes} pull="right" size="xs" />
          </Button>
        </div>
        {/*<label>*/}
        {/*  Search by Token ID :*/}
        {/*  <input*/}
        {/*    type="text"*/}
        {/*    value={this.state.value}*/}
        {/*    onChange={this.handleChange}*/}
        {/*  />*/}
        {/*</label>*/}
        <div className={"searchBox"}>
          <InputGroup className="mb-3" size={"sm"}>
            <InputGroup.Text id="basic-addon3">Search by ID</InputGroup.Text>
            <FormControl
              aria-describedby="basic-addon3"
              value={this.state.value}
              onChange={this.handleChange}
            />
          </InputGroup>
        </div>

        <Nav className="flex-column pt-2">{this.allTraits()}</Nav>
      </div>
    );
  }
}

export default SideBar;
