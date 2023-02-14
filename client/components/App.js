import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import { ethers } from "ethers";
import clientApi from "../utils/ClientApi";
import config from "../config";

import { SYN_COUPONS_NAME } from "../config/constants";
import ls from "local-storage";
import Common from "./Common";
import Header from "./Header";
import Showcase from "./Showcase";
import Error404 from "./Error404";
import PopUp from "./Popup";
import Overview from "../Pages/Overview";
import { isMobile } from "react-device-detect";
import WalletConnectProvider from "@walletconnect/web3-provider";

class App extends Common {
  constructor(props) {
    super(props);

    let localStore = JSON.parse(ls("localStore") || "{}");
    let pathhash = ethers.utils.id(window.location.pathname);

    if (/mobland/.test(window.location.origin)) {
      window.location = "https://mob.land";
    } else if (
      !/local/.test(location.origin) &&
      window.location.protocol === "http:"
    ) {
      window.location = location.href.replace(/^http:/, "https:");
    }

    this.state = {
      Store: Object.assign(
        {
          content: {},
          editing: {},
          temp: {},
          menuVisibility: false,
          config,
          width: this.getWidth(),
          pathname: window.location.pathname,
        },
        localStore
      ),
      pathhash,
    };

    this.bindMany([
      "setStore",
      "updateDimensions",
      "setWallet",
      "connect",
      "getPercent",
      "getCoupons",
    ]);

    this.globals = ["showPopUp", "handleClose"];
    this.bindMany(this.globals);
  }

  getWidth() {
    return window.innerWidth;
  }

  updateDimensions() {
    this.setStore({
      width: this.getWidth(),
    });
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions.bind(this));
  }

  async componentDidMount() {
    window.addEventListener("resize", this.updateDimensions.bind(this));
    const globals = this.state.Store.globals || {};
    for (let f of this.globals) {
      globals[f] = this[f];
    }
    this.setStore({
      globals,
    });
    if (this.state.Store.connectedWith) {
      this.connect();
    }
    this.setStore({
      isSorted: false,
      isMyId: false,
    });
  }

  async connect() {
    // console.log("connecting");
    let eth = null;
    if (isMobile) {
      eth = new WalletConnectProvider({
        infuraId: "a5d8ae5cf48e49269d71a5cf25289c0d",
        qrcodeModalOptions: {
          mobileLinks: ["metamask"],
        },
      });
      await eth.enable();
      this.setWallet(eth, "metamask");

      if (await eth.request({ method: "eth_requestAccounts" })) {
        eth.on("accountsChanged", (accounts) => {
          window.reload();
        });
        eth.on("chainChanged", (chainId) => {
          window.reload();
        });
        eth.on("disconnect", (code, reason) => {
          window.reload();
        });
        this.setWallet(eth, "metamask");
      }
    } else if (typeof window.ethereum !== "undefined") {
      let eth = window.ethereum;
      if (await eth.request({ method: "eth_requestAccounts" })) {
        eth.on("accountsChanged", () => window.location.reload());
        eth.on("chainChanged", () => window.location.reload());
        eth.on("disconnect", () => window.location.reload());
        this.setWallet(eth, "metamask");
      }
    }
  }

  async switchTo(chainId, chainName, symbol, rpcUrls) {
    if (window.clover !== undefined) {
      const provider = window.clover;
      try {
        await provider.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId,
              chainName,
              nativeCurrency: {
                symbol,
                decimals: 18,
              },
              rpcUrls: [rpcUrls],
            },
          ],
        });
        return true;
      } catch (error) {
        console.error(error);
        return false;
      }
    }
  }

  async setWallet(eth, connectedWith) {
    let contracts = {};

    try {
      const provider = new ethers.providers.Web3Provider(eth);
      const signer = provider.getSigner();
      const chainId = (await provider.getNetwork()).chainId;
      const connectedWallet = await signer.getAddress();
      let networkNotSupported = false;
      let connectedNetwork = null;
      if (config.supportedId && config.supportedId[chainId]) {
        connectedNetwork = config.supportedId[chainId];
        let addresses = config.contracts[chainId];

        for (let contractName in addresses) {
          contracts[contractName] = new ethers.Contract(
            addresses[contractName],
            config.abi[contractName],
            provider
          );
        }
      } else {
        networkNotSupported = true;
      }
      this.setStore({
        provider,
        signer,
        connectedWallet,
        chainId,
        connectedNetwork,
        networkNotSupported,
        contracts,
      });
      this.setStore(
        {
          connectedWith,
        },
        true
      );

      clientApi.setConnectedWallet(connectedWallet, chainId);
      this.getCoupons(contracts, connectedWallet);
    } catch (e) {
      console.error(e);
      // window.location.reload()
    }
  }

  async getCoupons(contracts, connectedWallet) {
    const couponsContract = contracts[SYN_COUPONS_NAME];

    let ownedCoupons = [];
    if (connectedWallet && couponsContract) {
      const balance = (
        await couponsContract.balanceOf(connectedWallet)
      ).toNumber();
      for (let i = 0; i < balance; i++) {
        ownedCoupons.push(
          (
            await couponsContract.tokenOfOwnerByIndex(connectedWallet, i)
          ).toNumber()
        );
      }
      // const depositLength = await poolContract.getDepositsLength(
      //   connectedWallet
      // );
      // for (let i = 0; i < depositLength; i++) {
      //   let deposit = await poolContract.getDepositByIndex(connectedWallet, i);
      //   if (
      //     deposit.tokenType >= tokenTypes.BLUEPRINT_STAKE_FOR_BOOST &&
      //     deposit.unlockedAt === 0
      //   ) {
      //     deposit.locked = true
      //     ownedCoupons.push(deposit.tokenID);
      //   }
      // }
      this.setStore({
        ownedIds: ownedCoupons,
      });
    }
  }

  showPopUp(params) {
    try {
      this.setStore({
        modals: Object.assign(params, {
          show: true,
          what: "popup",
          handleClose: this.handleClose,
          closeLabel: "Close",
          noSave: true,
          size: "xl",
        }),
      });
    } catch (e) {
      console.error(e);
    }
  }

  handleClose(event) {
    const { onBeforeClose, onClose } = this.state.Store.modals || {};
    if (onBeforeClose && event !== null) {
      if (!onBeforeClose()) {
        // onBeforeClose returns true if the user want to exit
        return;
      }
    }
    if (typeof onClose === "function") {
      onClose(this.changes);
    }
    this.setStore({
      modals: {},
    });
    delete this.changes;
  }

  setStore(newProps, storeItLocally) {
    let store = this.state.Store;
    let localStore = JSON.parse(ls("localStore") || "{}");
    for (let i in newProps) {
      if (newProps[i] === null) {
        if (storeItLocally) {
          delete localStore[i];
        }
        delete store[i];
      } else {
        if (storeItLocally) {
          localStore[i] = newProps[i];
        }
        store[i] = newProps[i];
      }
    }
    this.setState({
      Store: store,
    });
    if (storeItLocally) {
      ls("localStore", JSON.stringify(localStore));
    }
  }

  getPercent(m) {
    let ret = [];
    let number = Object.entries(m);
    for (let [x, y] of number) {
      ret.push(
        <div>
          {y[0]}: {x} {y[1]}%{" "}
        </div>
      );
    }
    return ret;
  }

  render() {
    const Store = this.state.Store;
    const modals = Store.modals;
    const { show, what } = modals || {};
    return (
      <BrowserRouter>
        <Header Store={Store} setStore={this.setStore} connect={this.connect} />
        <main>
          <Switch>
            <Route exact path="/">
              <Showcase Store={Store} setStore={this.setStore} />
            </Route>
            <Route exact path="/overview">
              <Overview Store={Store} setStore={this.setStore} />
            </Route>
            <Route exact path="*">
              <Error404 Store={Store} setStore={this.setStore} />
            </Route>
          </Switch>
          {/*<Footer />*/}
          {/* Since we have only one time of popup the parameter what is unnecessary. But we will keep it for the future */}
          {!!show && what === "popup" ? <PopUp modals={modals} /> : ""}
        </main>
      </BrowserRouter>
    );
  }
}

module.exports = App;
