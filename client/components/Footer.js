import Base from "./Base";
import { isMobile } from "react-device-detect";

export default class Footer extends Base {
  render() {
    // const { loaded } = this.state;

    return (
      <div className={"footer2 centered mb100"}>
        <img
          alt={"logo"}
          src={"https://s3.mob.land/assets/Mobland_Logo_Stylized300.png"}
          style={{ width: isMobile ? 66 : "4.5%" }}
        />
        <img
          alt={"separator"}
          src={"/images/footer-sep.png"}
          style={{ width: "100%", margin: "18px 0 30px" }}
        />
        Copyright © 2022 Mobland - All right reserved
      </div>
    );
  }
}
