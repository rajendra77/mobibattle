import React, { useContext, useEffect } from "react";
import PropTypes from "prop-types";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Context } from "../context/Context";

const ReactNotificationComponent = ({ title, body, hideNotification }) => {
  const {updateNotification} =useContext(Context)
  let hideNotif = title === "";

  useEffect(()=>{
    setTimeout(()=>{
      hideNotification()
      updateNotification()
    },5000)
  })

  if (!hideNotif) {
    toast.info(<Display />);
  }

  function Display() {
    return (
      <div>
        <h4>{title}</h4>
        <p>{body}</p>
      </div>
    );
  }

  return (
    <ToastContainer
      autoClose={5000}
      hideProgressBar
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss={false}
      draggable
      pauseOnHover={false}
    />
  );
};

ReactNotificationComponent.defaultProps = {
  title: "This is title",
  body: "Some body",
};

ReactNotificationComponent.propTypes = {
  title: PropTypes.string,
  body: PropTypes.string,
};

export default ReactNotificationComponent;