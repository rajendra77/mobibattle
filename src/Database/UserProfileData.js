const UserProfileData = {
  img: require("../assets/svg-icons/animal-avatar4.png").default,
  firstName: "Nitesh",
  userName: "Nitesh Kumar",
  logout: { en: "Logout", fr: "Se déconnecter", mg: "Гарах" },
  gameStats: [
    {
      type: "duel",
      title: "Multiplayer Battles",
      playCount: 23,
      totalPlayCount: 25,
    },
    {
      type: "tournament",
      title: "Tournaments",
      playCount: 4,
      totalPlayCount: 6,
    },
  ],
  gameDetails: [
    {
      type: "multiplayer",
      title: "Multiplayer",
      stats: [
        {
          label: "playCount",
          icon: "game_play_icon.svg",
          value: "3/5",
        },
        {
          label: "score",
          icon: "score_icon.svg",
          value: 3460,
        },
        {
          label: "best",
          icon: "best_icon.svg",
          value: 7,
        },
      ],
    },
  ],
  tournamentStats: {
    type: "tournament",
    title: "Tournaments",
    upcoming: {
      title: "Upcoming",
      value: "Pubg Premier League",
    },
    datetime: {
      icon: "calendar_time_icon.svg",
      value: "23/04/21, 3:30 PM IST",
    },
  },
  menu: [
    // {
    //   id: 1,
    //   label: "Buy Coins",
    //  title: {en : "Buy Coins", fr : "Acheter des pièces", mg : "Койн нэмэх ",},
    //   icon: "account_buy_coin_icon.svg",
    //   next_icon: "next_arrow_icon.svg",
    //   link: "/addamount",
    // },
    {
      id: 1,
      label: "Game History",
      title: {
        en: "Game History",
        fr: "Historique du jeu",
        mg: "Тоглоомын түүх",
      },
      icon: "account_game_history_icon.svg",
      next_icon: "next_arrow_icon.svg",
      link: "/gameHistory",
    },
    // {
    //   id: 3,
    //   label: "Wallet",
    //   title: {en : "Wallet", fr : "Portefeuille", mg : "Хэтэвч",},
    //   icon: "account_wallet_icon.svg",
    //   next_icon: "next_arrow_icon.svg",
    //   link: "/wallet",
    // },
    {
      id: 2,
      label: "Transaction History",
      title: {
        en: "Transaction History",
        fr: "Historique des transactions",
        mg: "Гүйлгээний түүх",
      },
      icon: "account_transaction_history_icon.svg",
      next_icon: "next_arrow_icon.svg",
      link: "/alltransaction",
    },
  ],

  data: [
    {
      id: 1,
      key: require("../assets/icons/user_pict1.svg").default,
      label: "Avatar",
      type: "img",
    },
    {
      id: 2,
      key: "Nitesh Kumar",
      label: "Nick Name",
      type: "text",
    },
    {
      id: 3,
      key: "+91 9910045408",
      label: "Mobile No.",
      type: "text",
    },
    {
      id: 4,
      key: "niteshams@gmail.com",
      label: "Email Id",
      type: "text",
    },
    {
      id: 5,
      key: "Male",
      label: "Gender",
      type: "text",
    },
    {
      id: 6,
      key: "21 June, 2020",
      label: "Birthday",
      type: "text",
    },
  ],
  subcription: {
    title: "Subscriptions",
    data: [
      {
        id: 1,
        label: "Daily Subscription",
        active: true,
        status: "Active",
        button: "Subscribe Now",
        img: require("../assets/icons/daily_subscription_icon.svg").default,
        amount: 0.99,
        type: "currency",
        link: "/subscription",
      },
      {
        id: 2,
        label: "Weekly Subscription",
        active: false,
        status: "Not Active",
        button: "Subscribe Now",
        img: require("../assets/icons/weekly_subscription_bell_icon.svg")
          .default,
        amount: 5.99,
        type: "currency",
        link: "/subscription",
      },
      {
        id: 3,
        label: "Monthly Subscription",
        active: false,
        status: "Not Active",
        button: "Subscribe Now",
        img: require("../assets/icons/weekly_subscription_bell_icon.svg")
          .default,
        amount: 19.99,
        type: "currency",
        link: "/subscription",
      },
    ],
  },
  battleHistory: {
    title: "Battle History",
    data: [
      {
        id: 1,
        label: "Total Playing History",
        active: false,
        status: "Not Active",
        button: "View All",
        img: require("../assets/icons/total_playing_history_icon.svg").default,
        amount: 110,
        type: "number",
        link: "/battlehistory",
      },
      {
        id: 2,
        label: "Weekly Subscription",
        active: false,
        status: "Not Active",
        button: "View All",
        img: require("../assets/icons/winning_premium_battles_history_icon.svg")
          .default,
        amount: 13,
        type: "number",
        link: "/battlehistory",
      },
      {
        id: 3,
        label: "Monthly Subscription",
        active: false,
        status: "Not Active",
        button: "View All",
        img: require("../assets/icons/winning_premium_battles_history_icon.svg")
          .default,
        amount: 19,
        type: "number",
        link: "/battlehistory",
      },
    ],
  },
};

export default UserProfileData;
