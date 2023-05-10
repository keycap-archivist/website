import React from 'react';

const ThumbnailImage = ({ src, alt, className, width, height }) => (
  <img width={width ?? 250} height={height ?? 250} loading="lazy" src={src} alt={alt} className={className} />
);

export default ThumbnailImage;
