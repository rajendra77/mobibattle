const home = {
  bannerList: [
    {
      id: 0,
      category: "solo",
      img: {
        "750x660": require("../assets/drawable-hdpi/banner1.png").default,
        "562x495": require("../assets/drawable-hdpi/banner1.png").default,
      },
    },
    {
      id: 1,
      category: "multiplayer",
      img: {
        "750x660": require("../assets/drawable-hdpi/banner2.png").default,
        "562x495": require("../assets/drawable-hdpi/banner2.png").default,
      },
    },
    {
      id: 2,
      category: "tournament",
      img: {
        "750x660": require("../assets/drawable-hdpi/banner3.png").default,
        "562x495": require("../assets/drawable-hdpi/banner3.png").default,
      },
    },
  ],
  allGames: {
    title: "Play and Win Now!",
    games: [
      {
        id: 1,
        category: "solo",
        gameId: "solo01",
        img: {
          "96x96":
            require("../assets/drawable-hdpi/jumping-angry-ape-thumbnail.png")
              .default,
          "256x256":
            require("../assets/drawable-hdpi/jumping-angry-ape-thumbnail.png")
              .default,
        },
        gameName: "Jumping Angry Ape",
        views: 500,
        icons: { views: "user_play_icon.svg" },
      },
      {
        id: 2,
        category: "solo",
        gameId: "solo02",
        img: {
          "96x96":
            require("../assets/drawable-hdpi/rolling-panda-thumbnail.png")
              .default,
          "256x256":
            require("../assets/drawable-hdpi/rolling-panda-thumbnail.png")
              .default,
        },
        gameName: "Rolling Panda",
        views: 500,
        icons: { views: "user_play_icon.svg" },
      },
      {
        id: 3,
        category: "multiplayer",
        gameId: "battle01",
        img: {
          "96x96":
            require("../assets/drawable-hdpi/chase-racing-cars-thumbnail.png")
              .default,
          "256x256":
            require("../assets/drawable-hdpi/chase-racing-cars-thumbnail.png")
              .default,
        },
        gameName: "Chase Racing Cars",
        views: 500,
        icons: { views: "user_play_icon.svg" },
      },
      {
        id: 4,
        category: "multiplayer",
        gameId: "battle02",
        img: {
          "96x96": require("../assets/drawable-hdpi/monsters-uo-thumbnail.png")
            .default,
          "256x256":
            require("../assets/drawable-hdpi/monsters-uo-thumbnail.png")
              .default,
        },
        gameName: "Monsters UP",
        views: 500,
        icons: { views: "user_play_icon.svg" },
      },
    ],
    viewAll: {
      label: "View All",
      link: "/allgames",
    },
  },
  tournaments: [
    {
      gameId: "tour01",
      name: "Free Fire Premier League",
      img: {
        "96x96": require("../assets/drawable-hdpi/free-fire-thum1.jpg").default,
        "128x128": require("../assets/drawable-hdpi/free-fire-thum1.jpg")
          .default,
        "256x256": require("../assets/drawable-hdpi/free-fire-thum1.jpg")
          .default,
        "270x360": require("../assets/drawable-hdpi/free-fire-thum1.jpg")
          .default,
        "360x480": require("../assets/drawable-hdpi/free-fire-thum1.jpg")
          .default,
        "512x512": require("../assets/drawable-hdpi/free-fire-thum1.jpg")
          .default,
      },
      date: "10/06/21",
      datetime: "2021-06-12T01:30:00.000-05:00",
      activePlayers: 90,
      slotsLeft: 26,
      entryFees: 100,
      prizeMoney: "10K",
      currency: "$",
    },
    {
      gameId: "tour02",
      name: "Pubg Premier League",
      img: {
        "96x96": require("../assets/drawable-hdpi/pubg-thum1.jpg").default,
        "128x128": require("../assets/drawable-hdpi/pubg-thum1.jpg").default,
        "256x256": require("../assets/drawable-hdpi/pubg-thum1.jpg").default,
        "270x360": require("../assets/drawable-hdpi/pubg-thum1.jpg").default,
        "360x480": require("../assets/drawable-hdpi/pubg-thum1.jpg").default,
        "512x512": require("../assets/drawable-hdpi/pubg-thum1.jpg").default,
      },
      date: "3/04/21",
      datetime: "2021-06-12T05:30:00.000-05:00",
      activePlayers: 1345,
      slotsLeft: 85,
      entryFees: 50,
      prizeMoney: 1000,
      currency: "$",
    },
  ],
  menu: [
    {
      id: 1,
      label: "home",
      name: "Home",
      icon: "home_menu_icon.svg",
      link: "/home",
    },
    {
      id: 2,
      label: "myProfile",
      name: "My Profile",
      icon: "myprofile_menu_icon.svg",
      link: "/myprofile",
    },
    {
      id: 3,
      label: "leaderboards",
      name: "Leaderboards",
      icon: "leaderboards_menu_icon.svg",
      link: "/leaderboards",
    },
    {
      id: 4,
      label: "gameHistory",
      name: "Game History",
      icon: "game_history_menu_icon.svg",
      link: "/gamehistory",
    },
    {
      id: 5,
      label: "notifications",
      name: "Notifications",
      icon: "notifications_menu_icon.svg",
      link: "/notifications",
    },
    {
      id: 6,
      label: "wallet",
      name: "Wallet",
      icon: "wallet_menu_icon.svg",
      link: "/wallet",
    },
    {
      id: 7,
      label: "termsConditions",
      name: "Terms & Conditions",
      icon: "terms_menu_icon.svg",
      link: "/termsconditions",
    },
    {
      id: 8,
      label: "privacyPolicy",
      name: "Privacy Plocy",
      icon: "policy_menu_icon.svg",
      link: "/privacypolicy",
    },
    {
      id: 9,
      label: "faq",
      name: "FAQs",
      icon: "faqs_menu_icon.svg",
      link: "/faq",
    },
    {
      id: 10,
      label: "contact",
      name: "Contact",
      icon: "contact_menu_icon.svg",
      link: "/contact",
    },
    {
      id: 11,
      label: "helpSupport",
      name: "Help & Support",
      icon: "help_support_menu_icon.svg",
      link: "/helpsupport",
    },
    {
      id: 12,
      label: "settings",
      name: "Settings",
      icon: "settings_menu_icon.svg",
      link: "/settings",
    },
    {
      id: 13,
      label: "logout",
      name: "Logout",
      icon: "logout_menu_icon.svg",
      link: "/logout",
    },
  ],
  allgames: {
    tabs: [
      { id: 1, label: "solo", title: "Solo", header: "Solo Games" },
      {
        id: 2,
        label: "multiplayer",
        title: "Multiplayer",
        header: "Multiplayer Games",
      },
      {
        id: 3,
        label: "leaderboard",
        title: "Leaderboards",
        header: "Leaderboards",
      },
    ],
  },
  homescreen: {
    title: "Hi",
  },
  solobattles: {
    title: "Solo Battles",
    tabs: [
      { id: 1, label: "allGames", title: "All Games", header: "Solo Battles" },
      {
        id: 2,
        label: "leaderboard",
        title: "Leaderboards",
      },
    ],
  },
  multiplayerbattles: {
    title: "Multiplayer Battles",
    tabs: [
      {
        id: 1,
        label: "allGames",
        title: "All Games",
        header: "Multiplayer Battles",
      },
      {
        id: 2,
        label: "leaderboard",
        title: "Leaderboards",
      },
    ],
  },
  leaderboard: [
    { id: 1, label: "solo", title: "Solo Battles Leaderboards" },
    { id: 2, label: "multiplayer", title: "Multiplayer Battles Leaderboards" },
  ],
  soloBattleResult: {
    text: {
      commitAsk: "You can commit 5 scores daily!",
      commitSuccess: "Your Score has been added to the leaderboard!",
    },
    stats: {
      title: "Your Stats",
      icons: {
        rank: "best_icon.svg",
        score: "score_icon.svg",
        playCount: "game_play_icon.svg",
      },
    },
    buttonText: {
      notNow: "Not Now",
      commitNow: "Commit Now",
      playAgain: "Play Again",
      leaderboard: "Leaderboard",
    },
  },
  multiplayerBattleResult: {
    stats: {
      title: "Your Stats",
      icons: {
        rank: "best_icon.svg",
        score: "score_icon.svg",
        playCount: "game_play_icon.svg",
      },
    },
    buttonText: {
      playAgain: "Play More",
      leaderboard: "Leaderboard",
    },
    text: {
      win: "You Won!!!",
      lose: "You Lose!",
      tie: "That's a Tie!",
    },
  },
  tournamentScreen: {
    title: "Tournaments",
    tabs: [
      { id: 1, label: "ongoing", title: "On Going" },
      { id: 2, label: "upcoming", title: "Upcoming" },
      { id: 3, label: "results", title: "Results" },
    ],
  },
  tournamentJoining: {
    title: "Joining Match",
  },
  myProfile: {
    title: "My Profile",
  },
  notification: {
    title: "Notifications",
  },
  subscription: {
    title: "Subscription",
    tabs: [
      { id: 1, label: "solo", title: "Solo Games", header: "Subscription" },
      {
        id: 2,
        label: "multiplayer",
        title: "Multiplayer Games",
        header: "Subscription",
      },
    ],
    solo: {
      title: "Solo Games",
      description:
        "Please subscribe to any of the packs below. You can add your score to the leaderboard and get a chance to win exciting prizes.",
      packs: [
        {
          id: "solo_daily01",
          subscriptionStatus: false,
          type: "daily",
          title: "Daily Subscription",
          description: "Auto-renewal - Every day",
          amount: "$5/day",
          buttonText: {
            subscribe: "Subscribe",
          },
        },
        {
          id: "solo_weekly01",
          subscriptionStatus: true,
          type: "weekly",
          title: "Weekly Subscription",
          description: "Auto-renewal - Every week",
          amount: "$10/week",
          buttonText: {
            subscribe: "Subscribe",
          },
        },
        {
          id: "solo_monthly01",
          subscriptionStatus: false,
          type: "monthly",
          title: "Monthly Subscription",
          description: "Auto-renewal - Every month",
          amount: "$20/month",
          buttonText: {
            subscribe: "Subscribe",
          },
        },
      ],
    },
    multiplayer: {
      title: "Multiplayer Games",
      description:
        "Please subscribe to any of the packs below. You can add your score to the leaderboard and get a chance to win exciting prizes.",
      packs: [
        {
          id: "multi_daily01",
          subscriptionStatus: true,
          type: "daily",
          title: "Daily Subscription",
          description: "Auto-renewal - Every day",
          amount: "$5/day",
          buttonText: {
            subscribe: "Subscribe",
          },
        },
        {
          id: "multi_weekly01",
          subscriptionStatus: false,
          type: "weekly",
          title: "Weekly Subscription",
          description: "Auto-renewal - Every week",
          amount: "$10/week",
          buttonText: {
            subscribe: "Subscribe",
          },
        },
        {
          id: "multi_monthly01",
          subscriptionStatus: false,
          type: "monthly",
          title: "Monthly Subscription",
          description: "Auto-renewal - Every month",
          amount: "$20/month",
          buttonText: {
            subscribe: "Subscribe",
          },
        },
      ],
    },
  },
  subscriptionModal: {
    solo: {
      title: "",
      body: "Subscribe, play any game, add your score to the leaderboard and get a chance to win exciting prizes. You can add upto 5 scores/month of any game you play.",
      buttons: [
        {
          action: "close",
          label: "Play for free",
          buttonColor: "bg-black",
        },
        {
          action: "subscribe",
          label: "Subscribe",
          buttonColor: "bg-orange",
        },
      ],
    },
    multiplayer: {
      title: "",
      body: "Subscribe, play any game, add your score to the leaderboard and get a chance to win exciting prizes. You can add upto 5 scores/month of any game you play.",
      buttons: [
        {
          action: "close",
          label: "Play for free",
          buttonColor: "bg-black",
        },
        {
          action: "subscribe",
          label: "Subscribe",
          buttonColor: "bg-orange",
        },
      ],
    },
  },
  matchingModal: {
    searching: {
      title: { en: "Please wait. We are searching for a player for you." },
      body: "",
      buttons: [
        {
          action: "close",
          label: "Stop Searching",
          buttonColor: "bg-black",
        },
      ],
    },
  },
  reason: "SUCCESS",
  status: "SUCCESS",
};

export default home;
