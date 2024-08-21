import React from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { THEME_ENUM } from "constants/theme.constant";

const { MODE_DARK } = THEME_ENUM;

const DoubleSidedImage = ({ src, darkModeSrc, alt, ...rest }) => {
  const mode = useSelector((state) => state.theme.mode);

  return (
    <div className="mt-4">
      <img
        src={mode === MODE_DARK ? darkModeSrc : src}
        alt={alt}
        {...rest}
        className="py-4"
      />
    </div>
    // <div>mempoVerse</div>
  );
};

DoubleSidedImage.propTypes = {
  darkModeSrc: PropTypes.string,
};

export default DoubleSidedImage;
