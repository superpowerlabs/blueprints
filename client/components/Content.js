import React from "react";
import { Form, Row, Col } from "react-bootstrap";
import * as Scroll from "react-scroll";
import Masonry from "react-masonry-component";
import { LazyLoadImage } from "react-lazy-load-image-component";
import InfiniteScroll from "react-infinite-scroll-component";
import { tokenTypes } from "../config/constants";
import { preferredOrder, updated } from "../config";

let allMetadata;
let percent;
let sortedValue;

import Base from "./Base";

const classes = {
  Tier: "aqua",
  Rarity: "chartreuse",
  Health: "gold",
  Heal: "gold",
  Defense: "gold",
  Attack: "gold",
};

export default class Content extends Base {
  constructor(props) {
    super(props);

    this.state = {
      items: [],
      hasMore: true,
      previous: (this.Store.tokenIds || []).length,
    };

    this.bindMany([
      "getTokens",
      "fetchMoreData",
      "monitorData",
      "getPercentages",
      "imageClick",
    ]);
  }

  async componentDidMount() {
    allMetadata = this.Store.allMetadata;
    percent = this.Store.percent;
    sortedValue = this.Store.sortedValue;
    this.fetchMoreData();
    this.setTimeout(this.monitorData, 1000);
    Scroll.animateScroll.scrollToTop();
  }

  monitorData() {
    const tokenIds = this.Store.tokenIds || [];

    if (this.Store.justToggled || this.Store.justIsMyId) {
      this.setState({
        items: [],
        previous: tokenIds.length,
      });
      if (this.Store.justToggled) {
        this.setStore({
          justToggled: false,
        });
      }
      if (this.Store.justIsMyId) {
        this.setStore({
          justIsMyId: false,
        });
      }
      this.fetchMoreData();
    }
    if (tokenIds.length !== this.state.previous) {
      this.setState({
        items: [],
        previous: tokenIds.length,
      });
      this.fetchMoreData();
    }
    this.setTimeout(this.monitorData, 1000);
  }

  async fetchMoreData() {
    // let sorted = this.Store.isSorted;
    let { items } = this.state;
    let depositedBlueprint = [];
    let wallet = this.Store.connectedWallet;
    let depositLength = 0;
    if (this.Store.contracts && this.Store.contracts.SeedPool) {
      let pool = this.Store.contracts.SeedPool;
      depositLength = await pool.getDepositsLength(wallet);
      for (let i = 0; i < depositLength; i++) {
        let deposit = await pool.getDepositByIndex(wallet, i);
        if (
          deposit.tokenType >= tokenTypes.BLUEPRINT_STAKE_FOR_BOOST &&
          deposit.unlockedAt === 0
        ) {
          depositedBlueprint.push(deposit.tokenID);
        }
      }
    }
    const { sortBy, onlyRevealed } = this.Store;
    const filter = this.Store.filter || {};
    const noFilter = Object.keys(filter).length === 0;
    const tokenIds = this.Store.tokenIds || [];
    let hasMore = false;
    let index = 1;
    let len = items.length;
    let newItems = 0;
    if (sortBy === "id") {
      for (let m of allMetadata) {
        if (noFilter || tokenIds.indexOf(m.i) !== -1) {
          if (onlyRevealed && !updated[m.i.toString()]) {
            continue;
          }
          if (index <= len) {
            index++;
            continue;
          }
          if (this.Store.isMyId) {
            const ownedIds = this.Store.ownedIds || [];
            if (ownedIds.includes(m.i) && !items.includes(m)) {
              newItems++;
              items.push(m);
            } else if (depositedBlueprint.includes(m.i) && !items.includes(m)) {
              newItems++;
              items.push(m);
            }
          } else {
            newItems++;
            items.push(m);
          }
        }
        if (newItems > 20) {
          hasMore = true;
          items.pop();
          break;
        }
      }
    } else if (sortBy === "value") {
      for (let m of sortedValue) {
        if (noFilter || tokenIds.indexOf(m.i) !== -1) {
          if (onlyRevealed && !updated[m.i.toString()]) {
            continue;
          }
          if (index <= len) {
            index++;
            continue;
          }
          if (this.Store.isMyId) {
            const ownedIds = this.Store.ownedIds || [];
            if (ownedIds.includes(m.i) && !items.includes(m)) {
              newItems++;
              items.push(m);
            }
          } else if (depositedBlueprint.includes(m.i) && !items.includes(m)) {
            newItems++;
            items.push(m);
          } else {
            newItems++;
            items.push(m);
          }
        }
        if (newItems > 20) {
          hasMore = true;
          items.pop();
          break;
        }
      }
    }
    this.setState({
      items,
      hasMore,
    });
  }

  getPercentages(m) {
    const attributes = m.A;
    const percentages = {};
    for (let x in attributes) {
      for (let y in percent) {
        if (attributes[x].t === y) {
          for (let num in percent[y]) {
            if (num === attributes[x].v) {
              percentages[y] = [num, percent[y][num]];
            }
          }
        }
      }
    }
    const result = {};
    for (let key of preferredOrder) {
      result[key] = percentages[key];
    }
    return result;
  }

  getThumbnail(m) {
    if (updated[m.i.toString()]) {
      return (
        "https://data.mob.land/genesis_blueprints/thumbnails/" + m.i + ".jpg"
      );
    } else {
      return "https://data.mob.land/genesis_blueprints/jpg/" + m.j + "-png.jpg";
    }
  }

  getVideo(m) {
    return "https://data.mob.land/genesis_blueprints/mp4/" + m.a + ".mp4";
  }

  imageClick(m) {
    const percentages = this.getPercentages(m);
    const pc = [];
    const pc2 = [];
    let i = 0;
    let arr;
    for (let trait in percentages) {
      arr = i % 2 ? pc2 : pc;
      arr.push(
        <div key={"pc" + i++}>
          <span className={classes[trait] || "pcTrait"}>{trait}</span>:{" "}
          <span className={"pcValue"}>
            {this.cleanTrait(percentages[trait][0])}
          </span>{" "}
          <span className={"pcPc"}>({percentages[trait][1]}%)</span>
        </div>
      );
    }
    const body = (
      <div>
        <Row>
          <Col lg={6}>
            {updated[m.i.toString()] ? (
              <img
                src={
                  "https://data.mob.land/genesis_blueprints/images/" +
                  m.i +
                  ".png"
                }
                alt={"nft #" + m.i + " image"}
                style={{ width: "100%" }}
              />
            ) : (
              <video
                style={{ width: "100%" }}
                src={this.getVideo(m)}
                controls
                loop
                autoPlay
                poster={this.getThumbnail(m)}
              />
            )}
          </Col>
          <Col lg={6}>
            <Row>
              <Col className={"pcCol"}>{pc}</Col>
              <Col className={"pcCol"}>{pc2}</Col>
            </Row>
            <Row>
              <Col>
                <div className={"powerScore"}>
                  Power score: {m.rarity_score}
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    );

    this.Store.globals.showPopUp({
      title: m.name,
      body: body,
    });
  }

  getTokens() {
    let { items } = this.state;
    const rows = [];
    let foundSearch = null;
    if (
      this.Store.isSearch &&
      this.Store.searchTokenId &&
      !isNaN(parseInt(this.Store.searchTokenId))
    ) {
      for (let m of allMetadata) {
        if (m.i === this.Store.searchTokenId) {
          // console.log(m.extras.thumbnail);
          let img = this.getThumbnail(m);
          rows.push(
            <div key={"tokenId" + m.i} className={"tokenCard"}>
              <LazyLoadImage
                className={"command"}
                src={img}
                onClick={() => this.imageClick(m)}
              />
              <div className={"centered tokenId"}># {m.i}</div>
            </div>
          );
          foundSearch = true;
        }
      }
      if (!foundSearch) {
        rows.push(<div>Token not found :(</div>);
      }
    } else {
      for (let m of items) {
        let img = this.getThumbnail(m);
        // console.log(m.extras.thumbnail);
        rows.push(
          <div key={"tokenId" + m.i} className={"tokenCard"}>
            <LazyLoadImage
              className={"command"}
              src={img}
              onClick={() => this.imageClick(m)}
            />
            <div className={"centered tokenId"}># {m.i}</div>
          </div>
        );
      }
    }
    return rows;
  }

  cleanTrait(value) {
    value = value.split(/[ _]+/);
    let str = "";
    for (let t of value) {
      str +=
        (str ? " " : "") +
        (/^\d+$/.test(t)
          ? parseInt(t)
          : t.substring(0, 1).toUpperCase() + t.substring(1));
    }
    return str;
  }

  render() {
    const filter = this.Store.filter || {};
    let myTotal = this.Store.ownedIds || {};

    myTotal = myTotal.length;
    let total = 0;
    if (allMetadata) {
      total = allMetadata.length;
    }
    if (this.Store.tokenIds) {
      total = this.Store.tokenIds.length;
    }
    if (this.Store.isSearch) {
      total = 1;
    }
    let i = 0;

    return (
      <div>
        {!this.isMobile() ? (
          <div className={"tokenList"}>
            <div className={"toplist"}>
              {Object.keys(filter).map((f) => {
                f = f.split("|");
                let text = [f[0], this.cleanTrait(f[1])].join(": ");
                return (
                  <div key={"cat" + i++} className={"category"}>
                    <Form.Group className="" controlId={"check" + i}>
                      <Form.Check
                        inline
                        type="checkbox"
                        label={text}
                        checked={true}
                        onChange={(event) =>
                          this.props.onCheck(event, f[0], f[1])
                        }
                      />
                    </Form.Group>
                  </div>
                );
              })}
              {!this.Store.isMyId ? (
                <span className={"total"}>
                  {total} result{total !== 1 ? "s" : ""}
                </span>
              ) : (
                <span className={"total"}>
                  My result{myTotal !== 1 ? "s" : ""}: {myTotal}
                </span>
              )}
            </div>
            <div style={{ marginTop: 8 }}>
              <InfiniteScroll
                dataLength={this.state.items.length}
                next={this.fetchMoreData}
                hasMore={this.state.hasMore}
                loader={<h4>Loading...</h4>}
                endMessage={
                  <p
                    style={{
                      padding: 40,
                      textAlign: "center",
                      color: "#bac",
                      fontSize: "80%",
                    }}
                  >
                    {this.state.items.length
                      ? "Yay! You have seen it all"
                      : this.Store.isMyId
                      ? "Whoops, you do not own any blueprint"
                      : "No items with this filter"}
                  </p>
                }
              >
                {" "}
                <Masonry>{this.getTokens()}</Masonry>
              </InfiniteScroll>
            </div>
          </div>
        ) : (
          <div
            className={"tokenList"}
            style={{ marginLeft: "60px", marginTop: "10px" }}
          >
            <div
              className={"toplist"}
              style={{ position: "static", left: "50px" }}
            >
              {Object.keys(filter).map((f) => {
                f = f.split("|");
                let text = [f[0], this.cleanTrait(f[1])].join(": ");
                return (
                  <div key={"cat" + i++} className={"category"}>
                    <Form.Group className="" controlId={"check" + i}>
                      <Form.Check
                        inline
                        type="checkbox"
                        label={text}
                        checked={true}
                        onChange={(event) =>
                          this.props.onCheck(event, f[0], f[1])
                        }
                      />
                    </Form.Group>
                  </div>
                );
              })}
              {!this.Store.isMyId ? (
                <span className={"total"}>
                  {total} result{total !== 1 ? "s" : ""}
                </span>
              ) : (
                <span className={"total"}>
                  My result{myTotal !== 1 ? "s" : ""}: {myTotal}
                </span>
              )}
            </div>
            <div style={{ marginTop: 8 }}>
              <InfiniteScroll
                dataLength={this.state.items.length}
                next={this.fetchMoreData}
                hasMore={this.state.hasMore}
                loader={<h4>Loading...</h4>}
                endMessage={
                  <p
                    style={{
                      padding: 40,
                      textAlign: "center",
                      color: "#bac",
                      fontSize: "80%",
                    }}
                  >
                    {this.state.items.length
                      ? "Yay! You have seen it all"
                      : "No items with this filter"}
                  </p>
                }
              >
                {" "}
                <Masonry>{this.getTokens()}</Masonry>
              </InfiniteScroll>
            </div>
          </div>
        )}
      </div>
    );
  }
}
