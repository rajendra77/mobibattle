import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWifi } from "@fortawesome/free-solid-svg-icons";

function Offline() {
  return (
    <div className="bg-primary flex flex-col items-center justify-center text-white min-h-screen w-full">
      <div className="">
        <FontAwesomeIcon icon={faWifi} size="6x" className="mb-6" />
      </div>

      <div className="font-bold">
        <h1>You&apos;re currently Offline.....</h1>
      </div>
      <div className="font-bold">
        <h1>Please Connect to the Internet</h1>
      </div>
    </div>
  );
}

export default Offline;
