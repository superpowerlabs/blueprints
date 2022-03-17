// eslint-disable-next-line no-undef
import indexedMetadata from "../config/indexedMetadata.json";

import SideBar from "./SideBar";
import Content from "./Content";
import Base from "./Base";
import { toNumber } from "lodash";
import {chainConf} from "../config";

export default class Showcase extends Base {
  constructor(props) {
    super(props);

    this.bindMany(["onCheck", "onId", "onSort"]);
  }

  async switchTo(chainId) {
    const chain = chainConf[chainId];
    chainId = chain.chainId;
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId }],
      });
    } catch (switchError) {
      // This error code indicates that the chain has not been added to MetaMask.
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              chain
            ],
          });
        } catch (addError) {
          console.error(addError);
        }
      } else {
        console.error(switchError);
      }
      // handle other "switch" errors
    }
  }

  onCheck(event, trait, value, id) {
    const filter = this.Store.filter || {};
    let key = [trait, value].join("|");
    let prevValue;
    for (let k in filter) {
      let tv = k.split("|");
      if (tv[0] === trait) {
        prevValue = tv[1];
        delete filter[k];
        break;
      }
    }
    if (prevValue !== value) {
      filter[key] = true;
    }
    let tokens;
    for (let key in filter) {
      if (!tokens) {
        tokens = indexedMetadata[key];
      } else {
        let tmp = tokens.concat(indexedMetadata[key]).sort((a, b) => {
          a = parseInt(a);
          b = parseInt(b);
          return a > b ? 1 : a < b ? -1 : 0;
        });
        tokens = [];
        for (let j = 0; j < tmp.length; j++) {
          if (j && tmp[j] === tmp[j - 1]) {
            tokens.push(tmp[j]);
          }
        }
      }
    }
    this.setStore({
      filter,
      tokenIds: tokens,
      isSearch: false,
    });
  }

  onId(id) {
    let idnum = toNumber(id);
    const filter = {};
    this.setStore({
      filter,
      searchTokenId: idnum,
      isSearch: true,
    });
  }
  onSort() {
    this.setStore({
      filter: this.Store.filter,
      isSorted: !this.Store.isSorted,
      justToggled: true,
    });
  }

  render() {
    const {
      connectedWallet: wallet,
      isMyId: check,
      connectedNetwork,
    } = this.Store;
    const ownedIds = this.Store.ownedIds || "";
    return (
      <div style={{ width: "100%" }}>
        <SideBar
          Store={this.Store}
          setStore={this.setStore}
          isOpen={true}
          onCheck={this.onCheck}
          onId={this.onId}
          onSort={this.onSort}
        />
        {wallet || !check ? (
          <div>
            {connectedNetwork || !check ? (
              <div>
                {ownedIds === 0 && check ? (
                  <div className="wallet-message">You do not own any NFTS</div>
                ) : (
                  <Content
                    Store={this.Store}
                    setStore={this.setStore}
                    onCheck={this.onCheck}
                  />
                )}
              </div>
            ) : (
              <div className="wallet-message command" onClick={() => this.switchTo(56)}>Click to switch to Binance Smart Chain</div>
            )}
          </div>
        ) : (
          <div className="wallet-message">Please connect to wallet</div>
        )}
      </div>
    );
  }
}
