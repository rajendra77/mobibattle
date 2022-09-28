import { useState, useContext } from "react";
import config from "../config/Config";
import { reactLocalStorage } from "reactjs-localstorage";
import { Context } from "../context/Context";
import ReactGA from "react-ga";
import { logEvent } from "../Analytics/AnalyticsEvent";
import { events, screen } from "../Analytics/EventName";

const useSubscribe = () => {
  const [status, setStatus] = useState("idle");
  const { handleShowModal } = useContext(Context);
  const { uniqueId } = reactLocalStorage.getObject("userProfile");
  const tempObj = reactLocalStorage.getObject("tempObj");

  const getPacks = () => {   
    const header = config.get("headers");
    const url = config.get("base") + config.get("getPacks") + 1082;
    return new Promise((resolve) => {
      setStatus("fetching");
      fetch(url, {
        method: "GET",
        headers: header,
      })

        .then(async (response) => {
          if (response.status === 200) {
            const data = await response.json();
            if (
              data.status.toUpperCase() === "SUCCESS"
            ) {
              logEvent(
                {
                  screen: screen.subscription_p,
                  event: events.subscriptionApiSuccess,
                },
                {
                  title: "subscription getPacks request successfull",
                  mobile : tempObj.number,
                  others : {
                    resStatus : data.status,
                  }
                }
              );
              setStatus("fetched");
              resolve(data);
            } else { 
              const reason = data.reason ? data.reason : "null";
              logEvent(
                {
                  screen: screen.subscription_p,
                  event: events.subscriptionApiSuccess,
                },
                {
                  title: "subscription getPacks request failure",
                  mobile : tempObj.number,
                  others : {
                    resStatus : data.status,
                    resReason : reason
                  }
                }
              );        
                console.error("Subscribe API failure ", data);
                handleShowModal(true, {
                  body: data.reason,
                });
            }
          }
        })
        .catch((err) => {
          let errObj;
          const msg = err.message;
          if (msg === "Failed to fetch") {
            errObj = `${msg} due to internet disconnected, statusCode: 503`
          }else {
            errObj = err;
          }
          logEvent(
            {
              screen: screen.subscription_p,
              event: events.subscriptionApiFailure,
            },
            {
              title: "subscription getPacks request failure",
              mobile : tempObj.number,
              others : {
                err : errObj,
              }
            }
          )
          console.error("Subscribe API error ", err);
          // handleShowModal(true);
        });
    });
  };

  const subscribe = (obj, num) => {
    const header = config.get("headers");
    const body = {
      gross_amount: obj.amount,
      payment_category: obj.payment_options && obj.payment_options[0].payment_category,
      payment_mode: obj.payment_options && obj.payment_options[0].payment_mode,
      product_details: [
        {
          id: obj.packId,
          name: obj.name,
          price: obj.amount,
          quantity: obj.credits,
        },
      ],
      userId: num ? num : uniqueId,
    };
    const url = config.get("base") + config.get("subscribe");
    return new Promise((resolve, reject) => {
      setStatus("fetching");
      fetch(url, {
        method: "POST",
        headers: header,
        body: JSON.stringify(body),
      })

        .then(async (response) => {
          if (response.status === 200) {
              const data = await response.json();
              const reason = data.reason ? data.reason : "null";
              logEvent(
                {
                  screen: screen.subscription_p,
                  event: events.subscriptionApiSuccess,
                },
                {
                  title: "subscription request successfull",
                  mobile : tempObj.number,
                  others : {
                    resStatus : data.status,
                    resReason : reason
                  }
                }
              );
              setStatus("fetched");
              resolve(data);
          }else {
            logEvent(
              {
                screen: screen.subscription_p,
                event: events.subscriptionApiFailure,
              },
              {
                title: "subscription request failure",
                mobile : tempObj.number,
                others : {
                  resStatusCode : response.status,
                }
              }
            )
            reject(response);
          }
        })
        .catch((err) => {   
          logEvent(
            {
              screen: screen.subscription_p,
              event: events.subscriptionApiFailure,
            },
            {
              title: "subscription request failure",
              mobile : tempObj.number,
              others : {
                err : err,
              }
            }
          )     
          console.error("Subscribe API error ", err);
        });
    });
  };

  const checkSubscription = (uid) => {
    const header = config.get("headers");
    const url = config.get("base") + config.get("checkSubscription") + (uid ? uid : uniqueId);
    return new Promise((resolve, reject) => {
      setStatus("fetching");
      fetch(url, {
        method: "GET",
        headers: header,
        
      })
        .then(async (response) => {
          if (response.status === 200) {
            const data = await response.json();
            const reason = data.reason ? data.reason : "null";
            resolve(data);
            logEvent(
              {
                screen: screen.subscription_p,
                event: events.subscriptionApiSuccess,
              },
              {
                title: "checkSub request successfull",
                mobile : tempObj.number,
                others : {
                  resStatus : data.status,
                  resReason : reason
                }
              }
            );        
          } else {
            reject(response);
            logEvent(
              {
                screen: screen.subscription_p,
                event: events.subscriptionApiSuccess,
              },
              {
                title: "checkSub  request failure",
                mobile : tempObj.number,
                others : {
                  resStatusCode : response.status,
                }
              }
            );        
          }
        })
        .catch((err) => {
          reject(err);
          logEvent(
            {
              screen: screen.subscription_p,
              event: events.subscriptionApiFailure,
            },
            {
              title: "checkSub request failure",
              mobile : tempObj.number,
              others : {
                err : err,
              }
            }
          )     
        });
    });
  };
  const unSubscribe = () => {
    const header = config.get("headers");
    const url = config.get("base") + config.get("unSubscribe") + uniqueId;
    return new Promise((resolve, reject) => {
      setStatus("fetching");
      fetch(url, {
        method: "GET",
        headers: header,
      })
        .then(async (response) => {
          if (response.status === 200) {
            const data = await response.json();
            const reason = data.reason ? data.reason : "null";
            setStatus("fetched");
            resolve(data);
            logEvent(
              {
                screen: screen.subscription_p,
                event: events.subscriptionApiSuccess,
              },
              {
                title: "unSub request successfull",
                mobile : tempObj.number,
                others : {
                  resStatus : data.status,
                  resReason : reason
                }
              }
            );        
          } else {
            reject(response);
            logEvent(
              {
                screen: screen.subscription_p,
                event: events.subscriptionApiSuccess,
              },
              {
                title: "unSub request failure",
                mobile : tempObj.number,
                others : {
                  resStatusCode : response.status,
                }
              }
            )
          }
        })
        .catch((err) => {
          reject(err);
          logEvent(
            {
              screen: screen.subscription_p,
              event: events.subscriptionApiFailure,
            },
            {
              title: "unSub request failure",
              mobile : tempObj.number,
              others : {
                err : err,
              }
            }
          )     
        });
    });
  };

  const checkSubscriptionHE = (msisdn) => {
    const header = config.get("headers");
    const url = config.get("base") + config.get("checkSubHE") + (msisdn);;
    return new Promise((resolve, reject) => {
      setStatus("fetching");
      fetch(url, {
        method: "GET",
        headers: header,
        
      })
        .then(async (response) => {
          if (response.status === 200) {
            const data = await response.json();
            resolve(data);        
          } else {
            reject(response);       
          }
        })
        .catch((err) => {
          reject(err);   
        });
    });
  };
  const getHE = () => {
    const url = "http://gmobile.mobibattle.co/testhe.php"
    return new Promise((resolve, reject) => {
      setStatus("fetching");
      fetch(url, {
        method: "GET",
        // headers: header,
        
      })
        .then(async (response) => {
          if (response.status === 200) {
            const data = await response.json();
            resolve(data);        
          } else {
            reject(response);       
          }
        })
        .catch((err) => {
          reject(err);   
        });
    });
  };



  return { status, subscribe, checkSubscription, unSubscribe, getPacks, checkSubscriptionHE, getHE};
};

export default useSubscribe;
