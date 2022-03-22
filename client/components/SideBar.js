import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import SubMenu from "./SubMenu";
const { InputGroup, FormControl, Button, Nav, ButtonGroup, ToggleButton } =
  // eslint-disable-next-line no-undef
  ReactBootstrap;
import classNames from "classnames";
import Base from "./Base";

import rarityDistribution from "../config/rarityDistribution.json";

class SideBar extends Base {
  constructor(props) {
    super(props);
    this.state = { value: "" };
    this.bindMany(["handleChange"]);
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
          onCheck={() => {
            this.setState({ value: "" });
            this.props.onCheck();
          }}
        />
      );
    }
    return rows;
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
    this.props.onId(event.target.value);
  }

  sortBy(by) {
    if (by !== this.Store.sortBy) {
      this.props.onSort();
    }
  }

  render() {
    const sortBy = this.Store.sortBy || "id";
    return (
      <div>
        {!this.isMobile() ? (
          <div>
            <div className={"searchBox"}>
              <InputGroup className="mb-3" size={"sm"}>
                <InputGroup.Text id="basic-addon3">
                  Search by ID
                </InputGroup.Text>
                <FormControl
                  className={"id-input"}
                  aria-describedby="basic-addon3"
                  value={this.state.value}
                  onChange={this.handleChange}
                />
              </InputGroup>
              <ButtonGroup aria-label="Basic example">
                <ToggleButton
                  id={"radio-1"}
                  type="radio"
                  variant="warning"
                  name="radio"
                  value={"id"}
                  checked={sortBy === "id"}
                  className={"btn nowrap"}
                  size={"sm"}
                  onChange={(e) => {
                    this.sortBy("id");
                    this.setStore({ sortBy: "id" });
                  }}
                >
                  Sort by ID
                </ToggleButton>

                <ToggleButton
                  id={"radio-2"}
                  type="radio"
                  variant="warning"
                  name="radio"
                  value={"score"}
                  checked={sortBy === "score"}
                  className={"btn nowrap"}
                  size={"sm"}
                  onChange={(e) => {
                    this.sortBy("score");
                    this.setStore({ sortBy: "score" });
                  }}
                >
                  Sort by Rarity
                </ToggleButton>
              </ButtonGroup>
            </div>
            <div
              className={classNames("sidebar", {
                "is-open": this.props.isOpen,
              })}
            >
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

              <Nav className="sidebarBody flex-column pt-2">
                {this.allTraits()}
              </Nav>
            </div>
          </div>
        ) : (
          <div>
            <div
              className={"searchBox"}
              style={{ position: "static", padding: "10px 12px 21px 21px" }}
            >
              <InputGroup className="mb-3" size={"sm"}>
                <InputGroup.Text id="basic-addon3">
                  Search by ID
                </InputGroup.Text>
                <FormControl
                  className={"id-input"}
                  aria-describedby="basic-addon3"
                  value={this.state.value}
                  onChange={this.handleChange}
                />
                {/* <Form.Check
                type={"checkbox"}
                id={"default-checkbox"}
                label={"My NFTs"}
                checked={this.Store.isMyId}
                onChange={this.handleMyIds}
                variant="warning"
                className={"checkbox"}
              /> */}
              </InputGroup>

              <ButtonGroup aria-label="Basic example">
                <ToggleButton
                  id={"radio-1"}
                  type="radio"
                  variant="warning"
                  name="radio"
                  value={"id"}
                  checked={sortBy === "id"}
                  className={"btn nowrap"}
                  size={"sm"}
                  onChange={(e) => {
                    this.sortBy("id");
                    this.setState({ sortBy: e.currentTarget.value });
                  }}
                >
                  Sort by ID
                </ToggleButton>

                <ToggleButton
                  id={"radio-2"}
                  type="radio"
                  variant="warning"
                  name="radio"
                  value={"score"}
                  checked={sortBy === "score"}
                  className={"btn nowrap"}
                  size={"sm"}
                  onChange={(e) => {
                    this.sortBy("score");
                    this.setState({ sortBy: e.currentTarget.value });
                  }}
                >
                  Sort by Rarity
                </ToggleButton>
              </ButtonGroup>
            </div>
            <div
              className={classNames("sidebar", {
                "is-open": this.props.isOpen,
              })}
              style={{ position: "relative", paddingTop: "0px", top: "0px" }}
            >
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

              <Nav className="sidebarBody flex-column pt-2">
                {this.allTraits()}
              </Nav>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default SideBar;
