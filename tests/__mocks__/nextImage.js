import React from 'react';

const NextImage = ({ src, alt, width, height, className, onLoad, onError, ...props }) => {
  return React.createElement('img', {
    src,
    alt,
    width,
    height,
    className,
    onLoad,
    onError,
    ...props
  });
};

export default NextImage;