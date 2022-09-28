import React from "react";
import Text from "../commonComponents/Text";

function ComingSoon() {
  // const data = SideData.data;
  return (
    <div className="flex min-w-screen pt-10 justify-center items-center">
      <Text
        tag="h1"
        scale={true}
        text="Coming Soon!!!"
        fontweight="bold"
        textColor="text-white"
      />
    </div>
  );
}

export default ComingSoon;
