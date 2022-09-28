import React, { useContext } from "react";
import Button from "../commonComponents/Button";
import Text from "../commonComponents/Text";
import Image from "../commonComponents/Image";
import { Context } from "../context/Context";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

export default function Modal({
  data: {
    title,
    body,
    description,
    subDescription,
    buttons = [],
    handleClick,
    icon,
    link = {},
    hideClose,
  } = {},
}) {
  const { showModal, handleShowModal } = useContext(Context);
  const handleButton = () => {
    handleShowModal(false);
  };
  return (
    <>
      {showModal ? (
        <>
          <div className="max-w-500px overflow-hidden m-auto justify-center items-center flex fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-full m-4 2xs:mt-28">
              {/*content*/}
              <div className="rounded-xl shadow-lg relative pt-2 flex flex-col w-full bg-primary outline-none focus:outline-none">
                {/*body*/}
                <div className="relative flex-auto text-center">
                  {!hideClose && (
                    <div
                      className="flex justify-center items-center absolute top-0 right-2 h-8 w-8 text-2xl text-white font-bold leading-6 z-10 text-center cursor-pointer"
                      onClick={() => {
                        console.log("----cancel button fired---->");
                        handleShowModal(false);
                      }}
                    >
                      &times;
                    </div>
                  )}
                  {icon && (
                    <div className="w-full flex justify-center">
                      <Image url={icon} styles="2xs:h-16 2xs:w-16 h-20 w-20" />
                    </div>
                  )}
                    {icon &&  <div className="my-6 h-1 w-14 bg-white bg-opacity-50 m-auto rounded-full"></div>}
                  <Text
                    tag="h2"
                    scale={true}
                    styles="2xs:mt-1 mt-4"
                    text={title}
                    fontweight="bold"
                    textColor={"text-white"}
                  />
                  {!icon &&  <div className="my-6 h-1 w-14 bg-white bg-opacity-50 m-auto rounded-full"></div>}
                  <div className="max-h-72 overflow-auto 2xs:p-0 p-3 2xs:mt-2 2xs:mb-2 mt-4 mb-6">
                    <Text
                      tag="h4"
                      scale={true}
                      styles="overflow-auto px-4 mb-2"
                      text={body}
                      fontweight="bold"
                      textColor={"text-white"}
                    />
                    {description && (
                      <Text
                        tag="h4"
                        scale={true}
                        styles="overflow-auto px-4 2xs:mt-2 mt-6"
                        text={description}
                        fontweight="bold"
                        textColor={"text-white"}
                      />
                    )}
                     {subDescription && (
                      <Text
                        tag="h6"
                        scale={true}
                        styles="overflow-auto px-4 2xs:mt-2 mt-6 font-medium"
                        text={subDescription}
                        textColor={"text-white"}
                      />
                    )}
                    <Link
                      to={link.to}
                      onClick={handleButton}
                      className="underline text-white font-bold text-lg text-yellow-400 font-bold"
                    >
                      {link.title}
                    </Link>
                  </div>
                </div>
                <div className="flex items-center justify-evenly px-4 2xs:pb-3 pb-6 rounded-b">
                  {buttons.map((item, i) => (
                    <Button
                      label={item.label}
                      eventHandler={() => handleClick(item.action)}
                      action={item.action}
                      key={i}
                      styles={`mx-2 font-bold w-1/2 ${item.buttonColor} ${item.textColor}`}
                      size={"medium"}
                      fullWidth={false}
                      textTag="h4"
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-75 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}
    </>
  );
}
Modal.propTypes = {
  data: PropTypes.object,
  icon: PropTypes.string,
};
