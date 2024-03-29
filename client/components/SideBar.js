import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import SubMenu from "./SubMenu";
import {
  InputGroup,
  FormControl,
  Button,
  Nav,
  ButtonGroup,
  ToggleButton,
  // Form,
} from "react-bootstrap";
import classNames from "classnames";
import Base from "./Base";

class SideBar extends Base {
  constructor(props) {
    super(props);
    this.state = { value: "", checked: false };
    this.bindMany([
      "handleChange",
      // , "handleChangeCheckbox"
    ]);
    this.setStore({ sortBy: "id" });
  }

  allTraits() {
    const { rarityDistribution } = this.Store;
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
          onCheck={(...args) => {
            this.setState({ value: "" });
            this.props.onCheck(...args);
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

  // handleChangeCheckbox(event) {
  //   if (event.target.checked) {
  //     this.setStore({ onlyRevealed: true });
  //     this.props.onSort();
  //   } else {
  //     this.setStore({ onlyRevealed: false });
  //     this.props.onSort();
  //   }
  // }

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
                  id={"radio-3"}
                  type="radio"
                  variant="warning"
                  name="radio"
                  value={"value"}
                  checked={sortBy === "value"}
                  className={"btn nowrap"}
                  size={"sm"}
                  onChange={(e) => {
                    this.sortBy("value");
                    this.setStore({ sortBy: "value" });
                  }}
                >
                  Sort by Power
                </ToggleButton>
              </ButtonGroup>

              {/*<Form.Check*/}
              {/*  type={"checkbox"}*/}
              {/*  id={"default-checkbox"}*/}
              {/*  label={"Show only revealed"}*/}
              {/*  checked={this.Store.onlyRevealed || false}*/}
              {/*  onChange={this.handleChangeCheckbox}*/}
              {/*  variant="warning"*/}
              {/*  className={"checkbox"}*/}
              {/*/>*/}
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
                    this.setStore({ sortBy: "id" });
                  }}
                >
                  Sort by ID
                </ToggleButton>

                <ToggleButton
                  id={"radio-3"}
                  type="radio"
                  variant="warning"
                  name="radio"
                  value={"value"}
                  checked={sortBy === "value"}
                  className={"btn nowrap"}
                  size={"sm"}
                  onChange={(e) => {
                    this.sortBy("value");
                    this.setStore({ sortBy: "value" });
                  }}
                >
                  Sort by Power
                </ToggleButton>
              </ButtonGroup>
              {/*<Form.Check*/}
              {/*  type={"checkbox"}*/}
              {/*  id={"default-checkbox"}*/}
              {/*  label={"Show only revealed"}*/}
              {/*  checked={this.Store.onlyRevealed || false}*/}
              {/*  onChange={this.handleChangeCheckbox}*/}
              {/*  variant="warning"*/}
              {/*  className={"checkbox"}*/}
              {/*/>*/}
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
