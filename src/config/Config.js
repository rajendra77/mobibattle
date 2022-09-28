import config from "react-global-configuration";

// config.setEnvironment("production");
console.log("ENVIRONEMNT :: ", process.env.REACT_APP_ENVIRONMENT);
config.setEnvironment(process.env.REACT_APP_ENVIRONMENT);

/* Configurations for development environment */
config.set(
  {
    
    base: "https://sandboxdemoapi.mobibattle.co/mobibattle-backend-v-1",
    socket_endpoint: "https://sandboxbattle.mobibattle.co:5000",
    // heUrl: "http://localhost:3000/#/",
    heUrl: "http://52.36.94.173/mbhe/gmo/sandbox.php",
    ga_tag: "UA-221380045-1",
    ga_debug: false,
    registrationMethod: "OTP",
    registrationMode: "WEB",
    requestSource: "WEB",
    branchKey: "key_test_gi0BzHR31U6zbtmip54Z0kofvxkIVj1H",
    operatorId: 6,
    paymentCategory: "IN",
    paymentMode: "GMOB",
    fcmPublicKey:
      "BEYArjmKix9ru6bdJfLZQaCwNmo2NYoJhPUNk2_RVy_TgBVx_Kesco75nuAzFUejGNvvd8tUgyMjTUWUFMJTtE8",
    oneSignalApiKey: "11c8d760-86f2-4c87-b0c7-a3354bd0c770", //valid only for local,
    androidApkBaseUrl: "https://dev.mobibattle.co/apk/",
    NUMBER_SERIES_VALID : [83,921,93,97,98]

  },
  { freeze: false, environment: "development" }
);

/* Configurations for production environment */
config.set(
  {
    base: "https://prod.mobibattle.co/mobibattle-backend-v-1",
    socket_endpoint: "https://engine.mobibattle.co:5000",
    heUrl: "http://52.36.94.173/mbhe/gmo/gdemohe.php",
    ga_tag: "UA-199571769-3",
    ga_debug: false,
    registrationMethod: "OTP",
    registrationMode: "WEB",
    requestSource: "WEB",
    branchKey: "key_live_of6zzSJW3P8skujepW1BPabiwzgIQp8D",
    operatorId: 6,
    paymentCategory: "IN",
    paymentMode: "GMOB",
    fcmPublicKey:
      "BEYArjmKix9ru6bdJfLZQaCwNmo2NYoJhPUNk2_RVy_TgBVx_Kesco75nuAzFUejGNvvd8tUgyMjTUWUFMJTtE8",
    oneSignalApiKey: "0f321883-83c4-4762-aeeb-b392e3e2a049", //valid only for https://gmobile.mobibattle.com
    androidApkBaseUrl: "https://dev.mobibattle.co/apk/",
    NUMBER_SERIES_VALID : [83,921,93,97,98]
  },
  { freeze: false, environment: "production" }
);

/* Configurations for API requests */
config.set(
  {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json, text/html",
      Authorization:
        "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhMmUyMTIifQ.ZecaFKb1gUfP5JrReixd00LZ6efkwgYhL5wGU7HR9hVE9xo3BnM8Zhkr3uCzrajRp_LOSa2d2DaGOArdjUHA2g",
        operatorId: 6,
      deviceType: "WEB",
      language: "mng",
    },
  },
  { freeze: false }
);

/* API endpoints*/
config.set(
  {
    configuration: "/configuration",
    getOtp: "/prelogin/sendotp",
    verifyOtp: "/prelogin/verifyOtp",
    register: "/prelogin/register",
    home: "/postlogin/home",
    createProfile: "/postlogin/createprofile",
    leaderboard: "/postlogin/leaderBoard",
    battleLeaderboard: "/postlogin/leaderboardBattle",
    endGame: "/postlogin/endGame",
    myBattle: "/postlogin/myBattle",
    gameDetails: "/postlogin/gameDetails",
    commitScore: "/postlogin/setEntryLeaderboard",
    commitedScore: "/postlogin/commitedScore",
    resetScore: "/postlogin/resetLeaderBoard",
    getAvatarList: "/postlogin/avatar",
    getTopups: "/wallet/getPacks",
    addBalance: "/postlogin/addBalance",
    getBalance: "/wallet/getBalance",
    subscribe: "/sub_engine/subscribe",
    unSubscribe: "/sub_engine/unSubscribe/",
    initiateGame: "/postlogin/initiateGame",
    battleResult: "/postlogin/battleResult",
    getPlayerRegister: "/postlogin/getPlayerRegister",
    sendPlayerRegister: "/postlogin/tournamentRegister",
    tournamentMatch: "/postlogin/tournamentMatch",
    checkSubscription: "/sub_engine/check/subscription/",
    tournamentEntry: "/postlogin/tournamentEntry",
    withdraw: "/wallet/withdraw/money",
    gameHistory: "/postlogin/gameHistory",
    getProfile: "/postlogin/userProfile",
    contactUs: "/contactDetails",
    sendReferer: "/referer",
    playgame: "/wallet/playgame/debit/coins",
    claimCoins: "/postlogin/claimCoins",
    getTransaction: "/wallet/getTransactionHistory",
    tournamentSummary: "/tournament/app/summary/list",
    tournamentDetails: "/tournament/app/details/list",
    addGameId: "/tournament/user/add_game_id",
    joinTournament: "/tournament/user/onHold",
    registeredUser: "/postlogin/registeredUser",
    clearRegisteredUser: "/tournament/clear_user",
    reportUser: "/postlogin/reportUser",
    prizePool: "/tournament/prize",
    tournamentHistory: "/tournament/history",
    debitCoinsTournament: "/tournament/user/join/confirmation",
    pushRegistration: "/notification/push_register",
    winnersList: "/tournament/result/users_details",
    addCoins: "/wallet/generate/order",
    createDeviceDetailsAndReferCode: "/refer_code/store",
    getPacks: "/sub_engine/getPacks/",
    guestRegister: "/guest/register",
    he: "/he.php",
    getRegisterNumberId: "/get/register/id/",
    checkSubHE: "/sub_engine/check/subscriptionHE/",
    elasticPublish : "/elastic/publish"

  },
  { freeze: false, assign: true }
);

/* Configurations for socket connection */
config.set(
  {
    socketConfig: {
      reconnectionDelayMax: 10000,
      reconnectionDelay: 1500,
      forceNew: true,
      reconnection: true,
      binaryType: "arraybuffer",
    },
  },
  { freeze: false, assign: true }
);

export default config;
