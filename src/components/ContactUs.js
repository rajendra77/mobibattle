import React, { useState, useContext, useEffect } from "react";
import Button from "../commonComponents/Button";
import { Context } from "../context/Context";
import { useHistory } from "react-router-dom";
import ReactGA from "react-ga";
import { reactLocalStorage } from "reactjs-localstorage";
import config from "../config/Config";

function Contact() {
  console.log("contact");
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const { handleShowModal } = useContext(Context);
  const [disable, setDisable] = useState(true);
  const history = useHistory();

  useEffect(() => {
    const code = reactLocalStorage.getObject("tempObj").code;
    const number = reactLocalStorage.getObject("tempObj").number;
    ReactGA.event({
      category: "contact_us_page",
      action: `user visits Contact Us page, mobile : ${code} ${number}`,
    });
  }, []);

  const modalData = {
    title: "Thank you!",
    body: "We have received your request. Someone from our team will contact you soon.",
    buttons: [
      {
        label: "Okay",
        action: "close",
        buttonColor: "bg-tabsColor",
        textColor: "text-white",
      },
    ],
    handleClick: function (button) {
      if (button === "close") {
        handleShowModal(false);
        history.push("/");
      }
    },
  };

  const handleButton = () => {
    const body = {
      number: number,
      name: name.toLowerCase(),
      email: email.toLowerCase(),
      message: message.toLowerCase(),
    };
    const url = config.get("base") + config.get("contactUs");
    return new Promise((resolve, reject) => {
      fetch(url, {
        method: "POST",
        body: JSON.stringify(body),
      })
        .then(async (response) => {
          if (response.status === 200) {
            const data = await response.json();
            // console.log('---arr--->', arr);
            handleShowModal(true, modalData);
            resolve(data);
          } else {
            reject(response);
          }
        })
        .catch((err) => {
          reject(err);
        });
    });
  };

  useEffect(() => {
    if (name && number && email && message) {
      if (email.includes("@") && email.includes(".")) {
        setDisable(false);
      } else {
        setDisable(true);
      }
    } else {
      setDisable(true);
    }
  }, [name, number, email, message]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setName("");
    setEmail("");
    setMessage("");
    setNumber("");
  };
  return (
    <form
      className="w-full h-screen flex flex-col justify-start items-center bg-primary"
      onSubmit={handleSubmit}
    >
      {/* <h1 className="text-white font-bold text-xl mt-16">Contact Us</h1> */}

      <label className="w-11/12 text-white mt-4 mb-2 font-bold">Name</label>

      <input
        className="w-11/12 py-1 border rounded focus:outline-none px-1"
        placeholder="Name"
        value={name}
        type="text"
        onChange={(e) => setName(e.target.value)}
        required
      />

      <label className="w-11/12 my-3 text-white font-bold">Number</label>

      <input
        className="w-11/12 py-1 border rounded focus:outline-none px-1"
        placeholder="Number"
        value={number}
        type="number"
        onChange={(e) => setNumber(e.target.value)}
        required
      />

      <label className="w-11/12 my-3 text-white font-bold">Email</label>
      <input
        className="w-11/12 py-1 border rounded focus:outline-none px-1"
        placeholder="Email"
        value={email}
        type="email"
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <label className="w-11/12 my-3 text-white font-bold">Query</label>

      <textarea
        className="w-11/12 border rounded focus:outline-none px-1 pt-1"
        placeholder="Query"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        required
      ></textarea>
      <div className="w-9/12">
        <Button
          type="submit"
          size="medium"
          label="Submit"
          styles="rounded-xl my-8 font-extrabold bg-white text-tabsColor"
          eventHandler={handleButton}
          isDisabled={disable}
        />
      </div>
    </form>
  );
}

export default Contact;
