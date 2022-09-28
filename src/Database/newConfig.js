const Config = {
  status: "SUCCESS",
  subStatus: "SUCCESS",
  reason: "default",
  subscription: {
    status: false,
    currentTime: 1619592677297,
  },
  orderStatus: "",
  subUrl: "http://mobibattle.com/checksub.php",
  policyAllow: true,
  version: 1,
  gameVersion: 1,
  loginScreen: {
    title: "Enter your phone number",
    subtitle: "This number would be used for your account",
    sub: "Winnings can be withdrawn only to the Mobile wallet account linked to this number",
    footer: "Have an account? Sign in",
    terms: "I accept the ",
    cardText: {
      title: "Login",
      numberInput: {
        label: "Please enter the mobile number",
        placeholder: "Enter mobile number",
      },
      buttonText: "Lets Go!",
    },
    icons: {
      back: "back_arrow_white.svg",
    },
  },
  otpScreen: {
    title: "Verify your phone number",
    subtitle: "Please enter your 4 digit OTP below",
    // sub: "Please Enter the OTP shared by our sales team",
    // sub: "We have sent you an SMS with a OTP code to your number +91 ",
    sub : "Enter OTP Sent to your mobile number",
    terms: "I accept the ",
    // footer: "Don't have an OTP?",

    // resend: "Contact Sales Team",
    footer: "Resend OTP in",
    resend: "Resend OTP",
    cardText: {
      title: "Login",
      numberInput: {
        label: "Please enter the mobile number",
        placeholder: "Mobile number",
      },
      otpInput: {
        label: "Enter the 4-digit code below",
      },
      formHelpText: "Don't have an code?",
      formHelpTitle: "RESEND CODE",
      // formHelpText: "Didn't receive any code?",
      // formHelpTitle: "RESEND CODE",
      icons: {
        next: "next_arrow_white.svg",
      },
    },
    icons: {
      back: "back_arrow_white.svg",
    },
  },
  matching: {
    status: "searching",
    title: "Please wait...",
    subtitle: "We are searching for a player for you!",
    vs: "vs",
    buttonText: "Stop Searching",
  },
};

export default Config;
