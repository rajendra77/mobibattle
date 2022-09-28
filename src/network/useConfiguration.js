import config from "../config/Config";
import { reactLocalStorage } from "reactjs-localstorage";

const useConfiguration = () => {
  const getConfiguration = () => {
    const header = config.get("headers");
    const url = config.get("base") + config.get("configuration");
    const body = {
      primarymcc: 1,
      primarymnc: 23,
      secondarymcc: "ww",
      secondarymnc: "sd",
    };
    return new Promise((resolve, reject) => {
      fetch(url, {
        method: "POST",
        headers: header,
        body: JSON.stringify(body),
      })
        .then(async (response) => {
          if (response.status === 200) {
            let data = await response.json();
            if (data.status.toUpperCase() === "SUCCESS") {
              data = {
                optName: "digicel",
                optCountry: "jamaica",
                heUrl: "https://sandbox.mobibattle.co/he.php",
                registrationType: "OTP",
                language: "en",
                analytics: "google",
                callingcode: null,
                countryIsoCode: 0,
                otpMethod: "api",
                heMethod: "redirect",
                otpUrl: null,
                status: "SUCCESS",
                reason: null,
                subscription: null,
                redeemedPack: null,
              };
              reactLocalStorage.setObject("configuration", data);
              resolve(data);
            } else {
              reject(data);
            }
          } else {
            reject(response);
          }
        })
        .catch((err) => {
          reject(err);
        });
    });
  };

  return { getConfiguration };
};

export default useConfiguration;
