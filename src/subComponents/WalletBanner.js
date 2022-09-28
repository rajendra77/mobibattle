import React, { useEffect, useState } from "react";
import Image from "../commonComponents/Image";
import Text from "../commonComponents/Text";

export default function WalletBanner({ title, image, handleClick }) {
  return (
    <div className="w-full pt-2">
      <Text tag="h5" text={title} styles="font-bold mb-2" />
      <Image url={image} handleClick={handleClick} styles="w-full rounded-xl" />
    </div>
  );
}
