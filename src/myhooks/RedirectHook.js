import { useHistory } from "react-router-dom";

const RedirectHook = () => {
  let history = useHistory();
  const historyBack = () => {
    console.log("history back ::", history);
    history.goBack();
  };
  const homeBack = () => {
    console.log("history home ::", history);
    history.push("/home");
  };
  const walletPage = () => {
    console.log("wallet home ::", history);
    history.push("/wallet");
  };
  const unblock = () => {
    return history.block((location, action) => {
      console.log("-----step 1----->", location, action);
      if (action === "POP") {
        console.log("-----step 2----->", action);
        return false;
      }
      return true;
    });
  };
  return { historyBack, homeBack, walletPage, unblock };
};

export default RedirectHook;
