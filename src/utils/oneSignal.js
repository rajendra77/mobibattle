import OneSignal from 'react-onesignal';
import config from '../config/Config';
import usePushRegister from '../network/usePushRegister';
import { reactLocalStorage } from "reactjs-localstorage";

const OneSignalComponent = () =>{
    const { pushRegistration } = usePushRegister()

    const initializeOneSignal = (fcmToken) => {
        const{ deviceId, uniqueId }= reactLocalStorage.getObject("userProfile");
        console.log("deviceId is", deviceId)
        OneSignal.init({ appId: config.get("oneSignalApiKey") }).then(() => {
            OneSignal.isPushNotificationsEnabled(function (isEnabled) {
                if (isEnabled) {
                    console.log("Push notifications are enabled!");
                    OneSignal.getUserId(function (playerId) {
                        console.log("One Signal Token >>>", playerId);
                        reactLocalStorage.set("oneSignalToken", playerId);
                        // Make a POST call to your server with the user ID
                        deviceId && pushRegistration(playerId, fcmToken, uniqueId, deviceId).then((res) => {
                            console.log("res", res)
                          }).catch((err) => {
                            console.log(err)
                          })
                    });
                } else {
                    console.log("Push notifications are not enabled yet.");
                }
            });
        }).catch((err) => {
            console.log(err)
        })
    }
    return {  initializeOneSignal };
}

export default OneSignalComponent