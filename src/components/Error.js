import React from "react";
import Text from "../commonComponents/Text";
import Image from "../commonComponents/Image";
import Anchor from "../commonComponents/Anchor";

function Error() {
  // const counter = useSelector(state => state.counter);
  // const dispatch = useDispatch();

  const icon = require("../assets/error_icons/page-not-found.svg").default;

  return (
    <div className="bg-primary flex flex-col justify-center items-center p-8">
      <Image url={icon} styles="w-48 mb-6" />
      <Text
        tag="h2"
        text="Page not found"
        textTransform="capitalize"
        textColor="text-white"
        fontweight="bold"
      />
      <Text
        tag="h6"
        text="We're sorry. The page you requested could not be found. Please go back to Home or try again."
        textTransform="capitalize"
        textColor="text-lightPurple"
        styles="my-4 text-center"
      />
      <Anchor
        redirectPath="/home"
        tag="h2"
        item={{ title: "Back to Home" }}
        classes="text-green-500 font-bold"
      />
    </div>
  );
}

export default Error;
