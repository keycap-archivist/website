import React from 'react';

const ThumbnailImage = ({ src, alt, className }) => <img loading="lazy" src={src} alt={alt} className={className} />;

export default ThumbnailImage;
