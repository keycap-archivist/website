import React from 'react';

const srcSetSizes = [160, 175, 168, 219];
const MAX_SIZE = 219;

const ThumbnailImage = ({ src, alt, className }) => {
  if (src.indexOf('googleusercontent') > -1) {
    return (
      <img
        loading="lazy"
        src={`${src}=s${MAX_SIZE}`}
        alt={alt}
        srcSet={srcSetSizes.map((x) => `${src}=s${x} ${x}w`).join(',')}
        className={className}
      />
    );
  }
  return <img loading="lazy" src={src} alt={alt} className={className} />;
};

export default ThumbnailImage;
