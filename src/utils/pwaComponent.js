import Button from "../commonComponents/Button";
import Text from "../commonComponents/Text";
import {GeneralText} from '../Database/Text'

 const PWA = ({handlePwaClick, handlePwaCancel}) => {
  return (
    <div className="w-full text-black text-sm text-center fixed -bottom-16 left-1/2 transform -translate-y-1/2 -translate-x-1/2 bg-white px-4 py-2 z-50">
      <Text
        tag={"h5"}
        scale={true}
        text={GeneralText.pwaBody["mg"]}
        fontweight="bold"
      />
      {/* <div className="flex">
       
      </div> */}
       <Button
          label={GeneralText.add["mg"]}
          shape={"pill"}
          size={"small"}
          textStyles={"font-bold"}
          eventHandler={handlePwaClick}
          styles="text-white bg-indigo-900 mr-2 py-2 mb-2"
        />
        <Button
          label={GeneralText.continue["mg"]}
          shape={"pill"}
          size={"small"}
          textStyles={"font-bold"}
          eventHandler={handlePwaCancel}
          styles="text-white bg-indigo-900 mr-2 py-2"
        />
    </div>
  );
};

export default PWA

// let deferredPrompt;
// window.addEventListener("beforeinstallprompt", (e) => {
//   deferredPrompt = e;
//   const modalData = {
//     title: "PWA APP",
//     body: "Download PWA application",
//     buttons: [
//       {
//         label: "Okay",
//         action: "okay",
//         buttonColor: "bg-tabsColor",
//         textColor: "text-white",
//       },
//     ],
//     hideClose: true,
//     handleClick: function (button) {
//       if (button === "okay") {
//         if (deferredPrompt !== null) {
//           deferredPrompt.prompt();
//           const { outcome } = deferredPrompt.userChoice;
//           if (outcome === "accepted") {
//             deferredPrompt = null;
//           }
//         }
//         handleShowModal(false);
//       }
//     },
//   };
//   handleShowModal(true, modalData);
// });
