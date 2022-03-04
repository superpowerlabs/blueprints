// import { isMobile } from "react-device-detect";
const { Navbar, Button } =
  // eslint-disable-next-line no-undef
  ReactBootstrap;

// eslint-disable-next-line no-undef
const { Link } = ReactRouterDOM;

import Base from "./Base";

export default class Header extends Base {
  constructor(props) {
    super(props);

    this.state = {
      addressExpanded: false,
      expanded: "",
      pathname: window.location.pathname,
    };

    this.bindMany(["expandAddress", "checkPathname", "setExpanded"]);
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

  checkPathname() {
    let { pathname } = window.location;
    if (pathname !== this.state.pathname) {
      this.setState({
        pathname,
      });
    }
    setTimeout(this.checkPathname, 500);
  }

  render() {
    const { connectedWallet } = this.Store;
    const { expanded } = this.state;

    let address;
    if (connectedWallet) {
      address = this.ellipseAddress(connectedWallet);
    }

    const pathname = window.location.pathname.split('/')[1]

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
        <Navbar.Collapse id="navbarScroll">
          <Navbar.Brand as={Link} to={"/"}>
            <img
              // className={"positionAbsolute"}
              src={"/images/logo.png"}
              style={
                {
                  // width: 300,
                  // left: this.isMobile() ? 80 : this.Store.width / 2 - 80,
                }
              }
            />
          </Navbar.Brand>
          {/*<Nav className="mr-auto my-2 my-lg-0" navbarScroll>*/}
          {/*  <Navbar.Text className={"links"}>*/}
          {/*    <span style={{ fontSize: "1.4rem" }}>BLUEPRINTS SHOWCASE</span>*/}
          {/*  </Navbar.Text>*/}
          {/*</Nav>*/}
        </Navbar.Collapse>
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
        <Link className={"headerButton " + (pathname === "" ? "selected" : "")} to="/">
          Collection
        </Link>
        <Link className={"headerButton lastButton "+ (pathname === "overview" ? "selected" : "")} to="/overview">
          Overview
        </Link>
        {!this.isMobile() ? (
          connectedWallet ? (
            <div className={"aqua floatRightAbsolute"}>
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
        ) : null}
      </Navbar>
    );
  }
}
