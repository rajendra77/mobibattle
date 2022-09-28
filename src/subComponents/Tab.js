/**
 * Tab component props :
 * @property {Array} data Array of tab objects with id, label, title (name of the tab) and header (optional, if title of Header changes with tab)
 * @property {string} activeTab Label of the active tab
 * @property {function} changeTab function to handle selection of a tab
 */
import React from 'react';
import PropTypes from "prop-types";

function Tab({ data, activeTab, changeTab, lang }) {
  return (
    <div className="flex justify-evenly bg-primary text-lightgray font-bold text-lg">
      {data.map((item, i) => {
        if (item.label == activeTab) {
          return (
            <div
              label={item.label}
              className="py-3 w-full text-center font-bold text-tabsColor border-b-2 text-lg border-tabsColor"
              key={i}
              onClick={() => changeTab(item.label)}
            >
              {item.title[lang]}
            </div>
          );
        } else {
          return (
            <div
              label={item.label}
              className="py-3 w-full text-center"
              key={i}
              onClick={() => changeTab(item.label)}
            >
              {item.title[lang]}
            </div>
          );
        }
      })}
    </div>
  );
}

Tab.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      label: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      header: PropTypes.string,
    })
  ),
  activeTab: PropTypes.string.isRequired,
  changeTab: PropTypes.func.isRequired,
  text : PropTypes.string,
  lang : PropTypes.string
};

export default Tab;
