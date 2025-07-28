import React from 'react';

const NextImage = ({ src, alt, width, height, className, onLoad, onError, fill, priority, sizes, ...props }) => {
  // Filter out Next.js specific props that shouldn't be passed to DOM
  const domProps = {};
  
  // Only include standard HTML img attributes
  if (src) domProps.src = src;
  if (alt) domProps.alt = alt;
  if (width && !fill) domProps.width = width;
  if (height && !fill) domProps.height = height;
  if (className) domProps.className = className;
  if (onLoad) domProps.onLoad = onLoad;
  if (onError) domProps.onError = onError;
  
  // Handle fill prop by applying CSS styles
  if (fill) {
    domProps.style = {
      position: 'absolute',
      height: '100%',
      width: '100%',
      left: 0,
      top: 0,
      right: 0,
      bottom: 0,
      objectFit: 'cover',
      ...props.style
    };
  }

  return React.createElement('img', domProps);
};

export default NextImage;