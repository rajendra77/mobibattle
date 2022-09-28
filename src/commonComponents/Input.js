import React from "react";
import PropTypes from "prop-types";
import cx from "classnames";

function Input({
  styles = "",
  type = "number",
  height,
  width,
  placeholderText = "",
  value = "",
  eventHandler = "",
  name = "",
  min = "",
  max = "",
  step = "",
  required = false,
  onFocus = () => {},
  onFocusOut = () => {},
  blockKeys = () => {},
}) {
  let inputClass = cx(styles, {
    [`w-${height}`]: true,
    [`h-${width}`]: true,
  });
  return (
    <>
      <input
        type={type}
        name={name}
        value={value}
        className={inputClass}
        placeholder={placeholderText}
        onChange={eventHandler}
        autoComplete="off"
        required={required}
        onFocus={onFocus}
        onBlur={onFocusOut}
        onKeyDown={blockKeys}
        min={min}
        max={max}
        step={step}
      ></input>
    </>
  );
}

Input.propTypes = {
  type: PropTypes.string,
  height: PropTypes.string,
  width: PropTypes.string,
  min: PropTypes.string,
  step: PropTypes.string,
  placeholderText: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  eventHandler: PropTypes.func,
  blockKeys: PropTypes.func,
  name: PropTypes.string,
  styles: PropTypes.string,
  required: PropTypes.bool,
  onFocus: PropTypes.func,
  onFocusOut: PropTypes.func,
};

export default Input;
