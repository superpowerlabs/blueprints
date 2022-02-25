import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faBriefcase,
  faPaperPlane,
  faQuestion,
  faImage,
  faCopy,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import SubMenu from "./SubMenu";
// eslint-disable-next-line no-undef
const { Button, Nav } = ReactBootstrap;
import classNames from "classnames";
import Base from "./Base";

import allMetadata from "../config/allMetadata.json";
import rarityDistribution from "../config/rarityDistribution.json";

class SideBar extends Base {
  constructor(props) {
    super(props);
    this.state = { value: "" };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
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
  handleSubmit() {
    console.log(this.state.value);
    this.props.onId(this.state.value);
  }

  render() {
    let i = 0;
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

        <form onSubmit={this.handleSubmit}>
          <label>
            Search by Token ID :
            <input
              type="text"
              value={this.state.value}
              onChange={this.handleChange}
            />
          </label>
          <input type="submit" value="Submit" />
        </form>
        <Nav className="flex-column pt-2">{this.allTraits()}</Nav>
      </div>
    );
  }
}

export default SideBar;
