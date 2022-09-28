import React, { useState } from "react";
import { subPackNames, subPacksDescription } from "../Database/Text";
import Image from "./Image";
import Text from "./Text";

function SubscriptionPack({
  amount,
  item,
  id,
  handleClick,
  activeId,
  lang,
  type,
  coinAmount,
  gbIcon
}) {
  let name = "";
  let description = "";
  if (item && item.sub_period === 1) {
    name = subPackNames.pack1[lang];
    description = subPacksDescription.pack1[lang];
  } else if (item && item.sub_period === 7) {
    name = subPackNames.pack2[lang];
    description = subPacksDescription.pack2[lang];
  } else if (item && item.sub_period === 30) {
    name = subPackNames.pack3[lang];
    description = subPacksDescription.pack3[lang];
  }
  return (
    <div
      className={
        "w-full py-2 pt-5 my-2 rounded-xl px-3" +
        (activeId === id ? " bg-subscriptionPackGreen" : " bg-tHeader")
      }
      onClick={() => handleClick(id, item)}
    >
      <div className="flex flex-col">
        <div className="flex justify-between items-center">
          <Text
            tag="h2"
            text={name}
            textColor="text-white"
            styles="capitalize font-bold text-white"
          />
          <div className="">
            <img src={gbIcon} className="w-14 h-14 mx-auto" />
          </div>
          
          {item && item.credits && (
            <Text
              tag="h4"
              text={`${item.credits} ₮`}
              textColor={activeId === id ? "text-white" : "text-orange"}
              styles="uppercase font-bold text-white"
            />
          )}

        </div>

        <div
          className={
            "capitalize text-white text-base text-white text-right mt-2 " +
            (activeId === id ? "opacity-100" : "opacity-50")
          }
        >
          {description}
        </div>
      </div>
    </div>
  );
}
export default SubscriptionPack;
