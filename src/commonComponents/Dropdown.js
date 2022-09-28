import React from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";

const Dropdown = ({ itemList, handleSelect, onClick, open, countryFlag }) => {
  const createItems = () => {
    return itemList.map(function (item) {
      const icon = `https://res.mobibattle.co/Demo/flag/${item.code.toLowerCase()}.png`;
      if(item.code==="CD"){
        return (
          <li
            className="flex items-center px-2 py-1 hover:bg-gray-200 focus:bg-gray-200 active:bg-gray-200"
            key={item.name}
            onClick={() => handleSelect(item.dial_code, icon)}
          >
            <img src={icon} className="w-6 mr-2 border-2" alt="img"/>
            <span>{item.dial_code}</span>
          </li>
        );
      }
   
    });
  };
  // const items = createItems();
  return (
    <div
      // onClick={onClick}
      className="flex items-center border-r border-lightPurple relative"
    >
      <img
        src={countryFlag}
        className="w-8 h-6 ml-2 3xs:w-7 3xs:h-5 3xs:ml-2 mr-1"
        alt="img"
      />
      {/* <button className="text-white focus:outline-none relative px-1" type="button">
                {selectedCode}
            </button> */}
      {/* <FontAwesomeIcon
        icon={faCaretDown}
        color="white"
        className="mr-2 3xs:mr-2"
      /> */}
      {open ? (
        <ul className="absolute w-40 top-10 left-0 bg-white z-10 shadow-lg rounded-lg h-40v overflow-auto">
          {" "}
          {items}
        </ul>
      ) : null}
    </div>
  );
};

Dropdown.propTypes = {
  itemList: PropTypes.array,
  handleSelect: PropTypes.func,
  onClick: PropTypes.func,
  // selectedCode: PropTypes.string,
  open: PropTypes.bool,
  countryFlag: PropTypes.string,
};
export default Dropdown;
