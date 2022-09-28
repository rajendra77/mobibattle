import { subFeatures , subPackNames, subPacksDescription, } from "../Database/Text";
const lang = "en";
console.log("lang::", lang);

const subscriptionDataNew = {
    
    featues: [
        {   id: 1,
            img: require("../assets/mtncongo/play_game_real_money_icon.png").default,
            text: subFeatures.feature1
        },
        {   
            id: 2,
            img: require("../assets/mtncongo/all_game_access_icon.png").default,
            text: subFeatures.feature2
        },
        {   
            id: 3,
            img: require("../assets/mtncongo/add_free_coins_wallet_icon.png").default,
            text: subFeatures.feature3
        },
        {   
            id: 4,
            img: require("../assets/mtncongo/convert_winnings_icon.png").default,
            text: subFeatures.feature4
        },
        
    ],
    plans: [
        {   id: 1,
            name: subPackNames.pack1,
            amount: "40",
            description: subPacksDescription.pack1
        },
        {   
            id: 2,
            name: subPackNames.pack2,
            amount: "310",
            description: subPacksDescription.pack2
        },
        {   
            id: 3,
            name: subPackNames.pack3,
            amount: "1160",
            description: subPacksDescription.pack3
        }
    ],
    currency: "₮"
}

export default subscriptionDataNew;

