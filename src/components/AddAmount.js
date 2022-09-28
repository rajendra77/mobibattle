import React, { useEffect, useState, useContext } from "react";
import { useLocation, useHistory } from "react-router-dom";
import Text from "../commonComponents/Text";
import SelectAmount from "../commonComponents/SelectAmount";
import Button from "../commonComponents/Button";
import useProceedToPay from "../network/useProceedToPay";
import { Context } from "../context/Context";
import Loader from "../commonComponents/Loader";
import ApiNotFound from "./ApiNotFound";
import ReactGA from "react-ga";
import { reactLocalStorage } from "reactjs-localstorage";
import Image from "../commonComponents/Image";
import queryString from "query-string";
import ProcessingPage from "../commonComponents/ProcessingPage";
import {BuyCoinText as text} from '../Database/Text';
import { Base64 } from "js-base64";
import {SendGuiDataEvents} from '../commonScript';

function AddAmount() {
  const [activeId, setActiveId] = useState(0);
  const [selectedPackId, setSelectedPackId] = useState();
  const [selectedAmount, setSelectedAmount] = useState("");
  const [topups, setTopups] = useState([]);
  const [disabled, setDisabled] = useState(false);
  const [loader, showLoader] = useState(true);
  const [apiFailed, setApiFailed] = useState(false);
  const [showProcessing, setShowProcessing] = useState(false);
  const [lang, setLang] = useState("en");
  const {  getLanguage } = useContext(Context);
  const { getTopupsData, sendProceedToPayData } = useProceedToPay();
  const { search, pathname } = useLocation();
  let { packId } = queryString.parse(search);
  packId = packId && Base64.decode(packId);
  const history = useHistory();
  const tempObj = reactLocalStorage.getObject("tempObj");

  const mPesaLogo =
    require("../assets/wallet-icon/prepaid_balance_icon.png").default;
  const icon =
    require("../assets/mtncongo/select_wallet_withdraw_tick.png").default;

  useEffect(() => {
    let guiDataEvent = {}
    guiDataEvent['page'] = 'buycoin';
    guiDataEvent['event'] = 'open';
    SendGuiDataEvents(guiDataEvent);

    window.scrollTo(0, 0);
    setLang(getLanguage());
    getTopupsData()
      .then((res) => {
        console.log(
          ">>>>> GET TOPUPS API SUCCESS >>>>>",
          JSON.parse(res.packs)
        );
        const packs = JSON.parse(res.packs);
        // const packs = walletPacks
        packs.sort((a,b)=> {
          return(
            a.amount- b.amount
          )
        })
        setSelectedAmount(packId ? packs[Number(packId)].amount : packs[0].amount) 
        setActiveId(packId ? Number(packId) : 0)
        console.log(packs);
        // setSelectedPackId(packs[0].packId)
        setSelectedPackId(packs[Number(packId) || 0].packId)
        const newPacks = packs.filter((item)=> item.linkedEventId==null)
        setTopups(newPacks);
        showLoader(false);
        res.suggested_currency === "" && setDisabled(true);
      })
      .catch((err) => {
        console.log(">>>>> GET TOPUPS API ERROR >>>>>", err);
        showLoader(false);
        setApiFailed(true);
      });
     
  }, [packId]);

  if (apiFailed) {
    return <ApiNotFound />;
  }

  const handleClick = (id, amount, packId) => {
    let guiDataEvent = {}
    guiDataEvent['page'] = 'buycoin';
    guiDataEvent['event'] = 'coinpacks_click';
    guiDataEvent['amount'] = amount;
    SendGuiDataEvents(guiDataEvent);

    console.log(packId);
    ReactGA.event({
      category: "addAmount_p",
      action: `${amount} amount button selected - mobile - ${
        tempObj.number
      }, date - ${new Date()}`,
    });
    setDisabled(false);
    setActiveId(id);
    setSelectedAmount(amount);
    setSelectedPackId(packId)
  };
  

  const handleSubmit = () => {
    let guiDataEvent = {}
    guiDataEvent['page'] = 'buycoin';
    guiDataEvent['event'] = 'buycoin_click';
    guiDataEvent['amount'] = selectedAmount;
    SendGuiDataEvents(guiDataEvent);
    setDisabled(true);
    setShowProcessing(true)
      sendProceedToPayData(selectedAmount, selectedAmount, selectedPackId).then(
        (res) => {
          let guiDataEvent = {}
          guiDataEvent['page'] = 'buycoin';
          guiDataEvent['event'] = `buycoin_api_${res.status.lowerCase()}`;
          SendGuiDataEvents(guiDataEvent);
          setShowProcessing(false)
          console.log(res);
        },
        (err) => {
          setShowProcessing(false)
          console.log(err);
        }
      ).catch((err)=>{
        console.error(err)
      })
  };

  
  return (
    <div className="min-h-screen">
      {loader && <Loader />}
      {showProcessing ? <ProcessingPage /> : 
       topups.length > 0 && (
        <>
          <div className="py-4">
            <Text
              tag="h4"
              scale={true}
              styles="pl-3 text-white"
              text={text.selectCoin[lang]}
              fontweight="bold"
            />

            <SelectAmount

              amountData={topups}
              handleClick={handleClick}
              activeId={activeId}
            />
          </div>
          <div className="min-h-screen w-full max-w-500px mt-5 pt-5 rounded-t-xl px-3 border-t-4 border-tViolet">
            {/* <Text
              tag="h4"
              scale={true}
              styles="pl-3 text-white"
              text={text.selectAccount[lang]}
              fontweight="bold"
            /> */}
            <div className="bg-walletNewGreen text-white p-4 my-6 rounded-md relative">
              <Text
                tag="label"
                scale={true}
                styles="px-1 absolute left-0 top-0 bg-mPesa text-white text-xs rounded-3xl font-bold"
                text={text.primaryAccount[lang]}
                textTransform="uppercase"
              />
              <div className="flex justify-between items-center mt-4">
                <div className="flex items-center">
                <Image url={mPesaLogo} styles="mr-6" />
                  <Text
                    tag="h6"
                    scale={true}
                    text={text.prepaidWallet[lang]}
                    fontweight="bold"
                  />
               
                </div>
                <div>
                  <Image url={icon} styles="w-8 h-8" />
                </div>
              </div>
            </div>
            <Button
              type="button"
              label={`${text.proceedToPay[lang]} ${selectedAmount} ₮`}
              action={"addMoney"}
              size={"medium"}
              styles={"font-bold text-lg text-white bg-wallet"}
              eventHandler={handleSubmit}
              isDisabled={disabled}
            />
          </div>
        </>
      )}
    </div>
  );
}

export default AddAmount;