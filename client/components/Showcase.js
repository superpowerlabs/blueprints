// eslint-disable-next-line no-undef
import indexedMetadata from "../config/indexedMetadata.json";

import SideBar from "./SideBar";
import Content from "./Content";
import Base from "./Base";
import allMetadata from "../config/allMetadata.json";
import { toNumber } from "lodash";


export default class Showcase extends Base {
  constructor(props) {
    super(props);

    this.bindMany(["onCheck", "onId"]);
  }


  onCheck(event, trait, value, id) {
    console.log(event, trait, value, id, "on check");
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
    let idnum = toNumber(id)
    console.log(id)
    const filter = {};
    this.setStore({
      filter,
      searchTokenId: idnum ,
      isSearch: true,

    });
  }

  render() {
    return (
      <div style={{ width: "100%" }}>
        <SideBar
          Store={this.Store}
          setStore={this.setStore}
          isOpen={true}
          onCheck={this.onCheck}
          onId={this.onId}
        />
        <Content
          Store={this.Store}
          setStore={this.setStore}
          onCheck={this.onCheck}
        />
      </div>
    );
  }
}
