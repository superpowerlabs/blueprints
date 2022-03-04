import React from "react";
import text from "../../text";
import Markdown from "react-markdown-it";
function Overview() {
  return (
    <div className={"Overview"} style={{ 
      marginTop: "50px",
      textAlign: "center" }}>
      <Markdown source={text} />
    </div>
  );
}

export default Overview;
