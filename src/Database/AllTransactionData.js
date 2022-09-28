const AllTransactionData = [
    {
        id: 1,
        type:'Coin Deposited',
        date : "24 May 2021, 10:24 AM",
        balance:10,
        txnId : "#NITE92423432423BNG3234",
        txnStatus : "Success",
        txnType : 'deposit',
        image : require("../assets/wallet-icon/transaction_deposited_icon.svg").default
    },
    {
        id: 2,
        type:'Entry Fees : Guns & Bottles',
        date : "25 May 2021, 12:20 PM",
        balance:2.5,
        txnId : "#LMFE92342322423BNG3234",
        txnStatus : "Pending",
        txnType : 'play',
        image : require("../assets/wallet-icon/transaction_entry_fees_icon.svg").default

    },
    {
        id: 3,
        type:'Entry Fees : Monsters Up',
        date : "26 May 2021, 12:48 PM",
        balance:2.5,
        txnId : "#PPPE92423432423BNG3234",
        txnStatus : "Failure",
        txnType : 'play',
        image : require("../assets/wallet-icon/transaction_entry_fees_icon.svg").default

    },
    {
        id: 4,
        type:'Winnings Game',
        date : "28 May 2021, 12:10 PM",
        balance:10,
        txnId : "#AAAE924234323223BNG3234",
        txnStatus : "Success",
        txnType : 'win',
        image : require("../assets/wallet-icon/transaction_winnings_game_icon.svg").default
    }
];
export default AllTransactionData;