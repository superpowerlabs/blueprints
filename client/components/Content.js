// eslint-disable-next-line no-undef
const { Form } = ReactBootstrap;
import * as Scroll from 'react-scroll'
import Masonry from "react-masonry-component";
import allMetadata from "../config/allMetadata.json";
import { LazyLoadImage } from "react-lazy-load-image-component";
import InfiniteScroll from "react-infinite-scroll-component";

import Base from "./Base";

export default class Content extends Base {
  constructor(props) {
    super(props);

    this.state = {
      items: [],
      hasMore: true,
      previous: (this.Store.tokenIds || []).length,
    };

    this.bindMany(["getTokens", "fetchMoreData", "monitorData"]);
  }

  componentDidMount() {
      Scroll.animateScroll.scrollToTop()
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
    this.setState({
      items,
      hasMore,
    });
  }

  getTokens() {
    let { items } = this.state;
    const rows = [];
    for (let m of items) {
      let img = m.image.split("/");
      img =
        "https://s3.mob.land/blueprints-thumbs/" +
        img[img.length - 1].replace(/png$/, "jpg");
      rows.push(
        <div key={"tokenId" + m.tokenId} className={"tokenCard"}>
          <LazyLoadImage src={img} />
          <div className={"centered tokenId"}># {m.tokenId}</div>
        </div>
      );
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
              <p style={{ textAlign: "center" }}>
                <b>Yay! You have seen it all</b>
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
