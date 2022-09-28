import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
// import Button from "../commonComponents/Button";
import Text from "../commonComponents/Text";
import useTournament from "../network/useTournament";
import queryString from "query-string";
import { useLocation } from "react-router-dom";

function TournamentEntries({ showEntriesModal, setShowEntriesModal, data1 }) {
  const { getTournamentEntry } = useTournament();
  let { search } = useLocation();
  const { gId, tId } = queryString.parse(search);
  const [data, setData] = useState([]);

  useEffect(() => {
    const type = showEntriesModal.button === "myEntries" ? "my" : "all";
    setData(data1);
    // getTournamentEntry(gId, tId, type)
    //   .then((res) => {
    //     showEntriesModal.button === "myEntries"
    //       ? setData(data)
    //       : setData(res.allEntries.reverse());
    //     // setData(res);
    //     console.log("::: Tournament Entries ::: ", res);
    //   })
    //   .catch((err) => console.log("::: Tournament Entries ERROR ::: ", err));
  }, []);

  return (
    <>
      <div
        className={`w-full max-w-500px max-h-3/4 m-auto justify-center items-center fixed bottom-0 z-50 outline-none focus:outline-none`}
      >
        <div className="relative">
          {/*content*/}
          <div className="rounded-t-3xl shadow-lg relative pt-2 flex flex-col w-full bg-primary outline-none focus:outline-none">
            {/*body*/}
            <div className="px-6 flex-auto text-center">
              <div
                className="flex justify-center items-center absolute top-1 right-1 h-8 w-8 text-2xl text-white font-bold leading-6 z-10 text-center cursor-pointer"
                onClick={() => {
                  setShowEntriesModal({ state: false });
                }}
              >
                &times;
              </div>

              <br />
              <Text
                tag="h2"
                scale={true}
                styles=""
                text={
                  showEntriesModal.button === "myEntries"
                    ? "My Entries"
                    : "All Entries"
                }
                fontweight="bold"
                textColor={"text-white"}
              />
              <div className="mt-4 w-12 border-b-2 border-t-2 rounded-full border-white border-opacity-50 m-auto"></div>
              <div className="mt-2 pb-28 h-500px overflow-scroll">
                {showEntriesModal.button === "myEntries" &&
                  data &&
                  data.length > 0 &&
                  data.map((item, index) => {
                    return (
                      <>
                        {item.name && (
                          <div
                            className="py-2 border-b border-lightPurple"
                            key={index}
                          >
                            <Text
                              tag="h4"
                              text={item.name}
                              textColor="text-white"
                              styles="text-left pl-2"
                            />
                          </div>
                        )}
                      </>
                    );
                  })}
                {showEntriesModal.button === "allEntries" &&
                  data &&
                  data.length > 0 &&
                  data.map((entry, index) => {
                    return (
                      <div
                        className="py-4 border-b border-lightPurple overflow-scroll"
                        key={index}
                      >
                        {entry &&
                          entry.length > 0 &&
                          entry.map((item, index) => {
                            return (
                              <>
                                {item.name && (
                                  <div className="py-2" key={index}>
                                    <Text
                                      key={index}
                                      tag="h4"
                                      text={item.name}
                                      textColor="text-white"
                                      styles="text-left pl-2"
                                    />
                                  </div>
                                )}
                              </>
                            );
                          })}
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="opacity-75 fixed inset-0 z-40 bg-black"></div>
    </>
  );
}

TournamentEntries.propTypes = {
  // data: PropTypes.array,
  showEntriesModal: PropTypes.object,
  setShowEntriesModal: PropTypes.func,
};

export default TournamentEntries;
