import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import SubMenu from "./SubMenu";
// eslint-disable-next-line no-undef
const { InputGroup, FormControl, Button, Nav } = ReactBootstrap;
import classNames from "classnames";
import Base from "./Base";
import BootstrapSwitchButton from "bootstrap-switch-button-react";

import rarityDistribution from "../config/rarityDistribution.json";

class SideBar extends Base {
  constructor(props) {
    super(props);
    this.state = { value: "" };
    this.handleChange = this.handleChange.bind(this);
    this.handleToggle = this.handleToggle.bind(this);
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
  handleToggle(event) {
    this.props.onSort();
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
        <div className={"searchBox"}>
          <InputGroup className="mb-3" size={"sm"}>
            <InputGroup.Text id="basic-addon3">Search by ID</InputGroup.Text>
            <FormControl
              aria-describedby="basic-addon3"
              value={this.state.value}
              onChange={this.handleChange}
            />
          </InputGroup>

          <div  className='rows'>
          Sort by:
          <BootstrapSwitchButton
            checked={this.Store.isSorted}
            onlabel="Rarity Score"
            offlabel="Token ID "
            onChange={this.handleToggle}
            width={100}
            onstyle="info" 
            offstyle="outline-info"
          />
          </div>
        </div>

        <Nav className="flex-column pt-2">{this.allTraits()}</Nav>
      </div>
    );
  }
}

export default SideBar;
