import React from "react";
import Header from "../commonComponents/ResultTableHeader";
import Item from "../commonComponents/ResultTableItem";
import PropTypes from "prop-types";

function ResultTable({ data, text, lang }) {
  return (
    <React.Fragment>
      <div className="w-full h-40 flex flex-col justify-between h-full">
        <Header text={text} lang={lang} />
        {/* {loader && <Loader />} */}
        <div>
          {data.map(function (item, i) {
            return <Item data={item} key={i} />;
          })}
        </div>
      </div>
    </React.Fragment>
  );
}

ResultTable.propTypes = {
  data: PropTypes.array,
  text: PropTypes.object,
  lang: PropTypes.string,
};

export default ResultTable;
