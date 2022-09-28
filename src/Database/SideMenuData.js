// const userProfile = localStorage.getItem("userProfile");
// const userName = userProfile ? localStorage.getItem("userProfile").name : "";
// console.log("userProfile::", userProfile, "userName::", userName);
// let guest = (userName === "Guest") ? 1 : 0
// const walletLink = (guest === 0) ? "/wallet" : "/subscription";
// console.log("walletLink::", walletLink);

const SideMenuData = {
  profileImg: require("../assets/svg-icons/animal-avatar4.png").default,
  userName: "Shivani Singh",
  text: "Username",
  data: [
    {
      id: 1,
      name : {
        en: "Profile",
        gr: "Profile",
        fr: "Profil",
        mg : "Миний булан ",
      },
      icon: require("../assets/side-menu/profile_menu_icon.svg").default,
      link: "/myprofile",
    },
    // {
    //   id: 2,
    //   name : {
    //     en: "Leaderboards",
    //     gr: "Leaderboards",
    //     fr: "Tableau d'honneur",
    //   },
    //   icon: require("../assets/side-menu/leaderboard_menu_icon.svg").default,
    //   link: "/leaderBoard",
    // },
    // {
    //   id: 2,
    //   name: "Game History",
    //   icon: require("../assets/svg-icons/leaderboards_menu_icon.svg").default,
    //   link: "/leaderBoardFinalDesign",
    // },
    // {
    //   id: 3,
    //   name : {
    //     en: "Wallet",
    //     gr: "Wallet",
    //     fr: "Portefeuille",
    //     mg : "Хэтэвч",
    //   },
    //   icon: require("../assets/side-menu/wallet_menu_icon.svg").default,
    //   link: "/wallet"
    // },

    {
      id: 4,
      name : {
        en: "Terms & Conditions",
        gr: "Terms & Conditions",
        fr: "Termes et Conditions",
        mg : "Үйлчилгээний нөхцөл",
      },
      icon: require("../assets/side-menu/terms_conditions_menu_icon.svg")
        .default,
      link: "/TermsAndConditions",
    },
    {
      id: 5,
      name : {
        en: "Privacy Policy",
        gr: "Privacy Policy",
        fr: "Politique de confidentialité",
        mg : "Үйлчилгээний тухай",
      },
      icon: require("../assets/side-menu/privacy_policy_menu_icon.svg").default,
      link: "/PrivacyPolicy",
    },
    {
      id: 6,
      name : {
        en: "FAQs",
        gr: "FAQs",
        fr: "FAQs",
        mg : "Түгээмэл асуултууд",
      },
      icon: require("../assets/side-menu/faqs_menu_icon.svg").default,
      link: "/faqs",
    },
    {
      id: 7,
      name : {
        en: "Contact Us",
        gr: "Contact Us",
        fr: "Contact Us",
        mg : "Холбоо барих",
      },
      icon: require("../assets/side-menu/leaderboard_menu_icon.svg").default,
      link: "/contact-us",
    },
    {
      id: 8,
      name : {
        en: "Logout",
        gr: "Logout",
        fr: "Se déconnecter",
        mg : "Гарах",
      },
      icon: require("../assets/mtncongo/logout_menu_icon.png").default,
      link: "/",
    },
  ],
};
export default SideMenuData;
