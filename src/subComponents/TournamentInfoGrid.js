import React from 'react';
import PropTypes from "prop-types";
function TournamentInfoGrid({ data }) {
  return (
    <div className="flex justify-between flex-wrap w-full my-2">
      {data.map((item, i) => {
        return (
          <div className="text-center w-1/3 p-2" key={i}>
            <div className="text-tournamentCardsLight">{item.title}</div>
            <div className="text-white text-sm font-bold mt-1">{item.value}</div>
          </div>
        );
      })}
    </div>
  );
}

TournamentInfoGrid.propTypes = {
  data: PropTypes.array,
};

export default TournamentInfoGrid;
