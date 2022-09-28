import React from 'react';
import TableHeader from "../commonComponents/TournamentTableHeader";
import TableItem from "../commonComponents/TournamentTableItem";
import PropTypes from "prop-types";


function TournamentTable({data}) {
    
    return(
        <div className="flex flex-col justify-between h-full bg-primary">
              <TableHeader />
              <div>
                {data.map(function (item, i) {
                  return <TableItem data={item} key={i} />;
                })}
              </div>
            </div>
    )
}

TournamentTable.propTypes = {
  data: PropTypes.array,
}


export default TournamentTable;