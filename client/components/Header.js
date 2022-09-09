import React from "react";
import { Navbar, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import Base from "./Base";
import { BsFillFunnelFill } from "react-icons/bs";

export default class Header extends Base {
  constructor(props) {
    super(props);

    this.state = {
      addressExpanded: false,
      expanded: "",
      pathname: window.location.pathname,
    };

    this.bindMany([
      "expandAddress",
      "checkPathname",
      "setExpanded",
      "handleMyIds",
      "handleAllIds",
      "openSidebar",
    ]);
  }

  setExpanded() {
    this.setState({
      expanded: this.state.expanded ? "" : "expanded",
    });
  }

  componentDidMount() {
    this.checkPathname();
    this.checkIfOperator();
  }

  expandAddress() {
    this.setState({
      addressExpanded: !this.state.addressExpanded,
    });
  }

  handleMyIds() {
    const filter = {};
    this.setStore({
      filter,
      isMyId: true,
      justIsMyId: true,
    });
  }

  handleAllIds() {
    const filter = {};

    this.setStore({
      filter,
      isMyId: false,
      justIsMyId: true,
    });
  }

  checkPathname() {
    let { pathname } = window.location;
    if (pathname !== this.state.pathname) {
      this.setState({
        pathname,
      });
    }
    setTimeout(this.checkPathname, 500);
  }

  openSidebar() {
    if (this.Store.sideOpen) {
      this.setStore({
        sideOpen: false,
      });
    } else {
      this.setStore({
        sideOpen: true,
      });
    }
  }

  render() {
    const { connectedWallet } = this.Store;
    const { expanded } = this.state;

    let address;
    if (connectedWallet) {
      address = this.ellipseAddress(connectedWallet);
    }

    const pathname = window.location.pathname.split("/")[1];

    return (
      <Navbar
        expanded={expanded}
        fixed={this.isMobile() ? undefined : "top"}
        bg="dark"
        expand="lg"
        className={"roboto"}
      >
        {/*<i className="fa-solid fa-bars" style={{fontSize: '2rem'}}></i>*/}
        <Navbar.Toggle
          aria-controls="basic-navbar-nav"
          onClick={this.setExpanded}
        />
        <Navbar.Brand as={Link} to={"/"}>
          <img
            // className={"positionAbsolute"}
            src={"/images/logo.png"}
            style={{
              width: this.isMobile() ? 300 : "100%",
              //left: this.isMobile() ? 80 : null,
            }}
          />
        </Navbar.Brand>
        <Navbar.Collapse id="navbarScroll">
          {/*<Nav className="mr-auto my-2 my-lg-0" navbarScroll>*/}
          {/*  <Navbar.Text className={"links"}>*/}
          {/*    <span style={{ fontSize: "1.4rem" }}>BLUEPRINTS SHOWCASE</span>*/}
          {/*  </Navbar.Text>*/}
          {/*</Nav>*/}
          {/*{this.Store.width ? (*/}
          {/*  <img*/}
          {/*    className={"positionAbsolute"}*/}
          {/*    src={"https://s3.mob.land/assets/Mobland_Title_Stylized300.png"}*/}
          {/*    style={{*/}
          {/*      width: 160,*/}
          {/*      left: this.isMobile() ? 80 : this.Store.width / 2 - 80,*/}
          {/*    }}*/}
          {/*  />*/}
          {/*) : null}*/}
          {/*{this.Store.width ? (*/}
          {/*  <img*/}
          {/*    className={"positionAbsolute"}*/}
          {/*    src={"https://s3.mob.land/assets/Mobland_Title_Stylized300.png"}*/}
          {/*    style={{*/}
          {/*      width: 160,*/}
          {/*      left: this.isMobile() ? 80 : this.Store.width / 2 - 80,*/}
          {/*    }}*/}
          {/*  />*/}
          {/*) : null}*/}
          <Link
            className={"headerButton " + (pathname === "" ? "selected" : "")}
            to="/"
            onClick={this.handleAllIds}
          >
            Collection
          </Link>
          <Link
            className={"headerButton " + (pathname === "" ? "selected" : "")}
            to="/"
            onClick={this.handleMyIds}
          >
            My Collection
          </Link>
          <Link
            className={"headerButton " + (pathname === "" ? "selected" : "")}
            to="/overview"
          >
            Overview
          </Link>
        </Navbar.Collapse>
        {this.isMobile() ? (
          <BsFillFunnelFill onClick={this.openSidebar} />
        ) : null}
        {!this.isMobile() ? (
          connectedWallet ? (
            <div className={"coral floatRightAbsolute"}>
              <i
                className="fas fa-user-astronaut"
                style={{ marginRight: 10 }}
              />
              {address}
            </div>
          ) : (
            <Button
              className={"floatRightAbsolute"}
              size={"sm"}
              onClick={this.props.connect}
            >
              Connect your wallet
            </Button>
          )
        ) : connectedWallet ? (
          <div className={"coral floatRightAbsolute"}>
            <i className="fas fa-user-astronaut" style={{ marginRight: 10 }} />
            {address}
          </div>
        ) : (
          <Button
            className={"floatRightAbsolute"}
            size={"sm"}
            onClick={this.props.connect}
          >
            Connect your wallet
          </Button>
        )}
      </Navbar>
    );
  }
}
