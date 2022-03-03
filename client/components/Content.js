// eslint-disable-next-line no-undef
const { Form, Row, Col } = ReactBootstrap;
import * as Scroll from "react-scroll";
import Masonry from "react-masonry-component";
import allMetadata from "../config/allDataandRarityScore.json";
import { LazyLoadImage } from "react-lazy-load-image-component";
import InfiniteScroll from "react-infinite-scroll-component";
import percent from "../config/percentageDistribution.json";
import { preferredOrder } from "../config";
import sortedAllMetadata from "../config/sortedAllDataandRarityScore.json";

import Base from "./Base";

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

  componentDidMount() {
    Scroll.animateScroll.scrollToTop();
    this.fetchMoreData();
    this.setTimeout(this.monitorData, 1000);
  }

  monitorData() {
    const tokenIds = this.Store.tokenIds || [];
    if (tokenIds.length !== this.state.previous) {
      this.setState({
        items: [],
        previous: tokenIds.length,
      });
      this.fetchMoreData();
    }
    this.setTimeout(this.monitorData, 1000);
  }

  fetchMoreData() {
    let { items } = this.state;
    const filter = this.Store.filter || {};
    const noFilter = Object.keys(filter).length === 0;
    const tokenIds = this.Store.tokenIds || [];
    let hasMore = false;
    let index = 1;
    let len = items.length;
    let newItems = 0;
    if (this.Store.isSorted) {
     // console.log("hi");
      for (let m of sortedAllMetadata) {
        if (noFilter || tokenIds.indexOf(m.tokenId) !== -1) {
          if (index <= len) {
            index++;
            continue;
          }
          newItems++;
          items.push(m);
        }
        if (newItems > 20) {
          hasMore = true;
          items.pop();
          break;
        }
      }
    } else {
      //console.log(this.Store.isSorted);

      for (let m of allMetadata) {
        if (noFilter || tokenIds.indexOf(m.tokenId) !== -1) {
          if (index <= len) {
            index++;
            continue;
          }
          newItems++;
          items.push(m);
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
    const attributes = m.attributes;
    const percentages = {};
    for (let x in attributes) {
      for (let y in percent) {
        if (attributes[x]["trait_type"] === y) {
          for (let num in percent[y]) {
            if (num === attributes[x]["value"]) {
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

  imageClick(m) {
    const percentages = this.getPercentages(m);
    const pc = [];
    const pc2 = [];
    let i = 0;
    for (let trait in percentages) {
      let arr = i % 2 ? pc2 : pc;
      arr.push(
        <div key={"pc" + i++}>
          <span className={"pcTrait"}>{trait}</span>:{" "}
          <span className={"pcValue"}>
            {this.cleanTrait(percentages[trait][0])}
          </span>{" "}
          <span className={"pcPc"}>({percentages[trait][1]}%)</span>
        </div>
      );
    }
    const body = (
      <Row>
        <Col lg={6}>
          <video
            style={{ width: "100%" }}
            src={m.animation_url}
            controls
            loop
            autoPlay
            poster={this.getJpg(m)}
          />
        </Col>
        <Col className={"pcCol"} lg={3}>
          {pc}
        </Col>
        <Col className={"pcCol"} lg={3}>
          {pc2}
        </Col>
      </Row>
    );

    this.setStore({
      modalSize: "xl",
      showModal: true,
      modalTitle: m.name,
      modalBody: body,
    });
  }

  getJpg(m) {
    let img = m.image.split("/");
    return (
      "https://s3.mob.land/blueprints-thumbs/" +
      img[img.length - 1].replace(/png$/, "jpg")
    );
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
        if (m.tokenId === this.Store.searchTokenId) {
          let img = this.getJpg(m);
          rows.push(
            <div key={"tokenId" + m.tokenId} className={"tokenCard"}>
              <LazyLoadImage
                className={"command"}
                src={img}
                onClick={() => this.imageClick(m)}
              />
              <div className={"centered tokenId"}># {m.tokenId}</div>
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
        let img = this.getJpg(m);
        rows.push(
          <div key={"tokenId" + m.tokenId} className={"tokenCard"}>
            <LazyLoadImage
              className={"command"}
              src={img}
              onClick={() => this.imageClick(m)}
            />
            <div className={"centered tokenId"}># {m.tokenId}</div>
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
    let i = 0;

    return (
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
                    onChange={(event) => this.props.onCheck(event, f[0], f[1])}
                  />
                </Form.Group>
              </div>
            );
          })}
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
    );
  }
}
