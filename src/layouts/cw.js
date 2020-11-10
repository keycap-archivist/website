/* eslint-disable no-return-assign */
import React, { useState, useEffect } from 'react';
import { Link } from 'gatsby';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import { getWishlist, isInWishlist, rmCap, addCap } from '../internal/wishlist';
import Layout from '../components/layout';
import SEO from '../components/seo';
import Alert from '../components/alert';
import SubmitNameModal from '../components/modals/submit-name';

const Maker = (props) => {
  const { pageContext, location } = props;
  const { makerUrl, makerName, sculptUrl, sculptName, colorway } = pageContext;
  const seoTitle = `${makerName} - ${colorway.name} ${sculptName}`;
  const [state, setState] = useState({ text: 'Copy link' });

  const [showModal, setShowModal] = useState(false);

  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);

  const updateText = () => {
    setState({ text: 'Copied!' });
  };

  const [wishlist, setStateWishlist] = useState(undefined);
  useEffect(() => {
    setStateWishlist(getWishlist());
  }, []);

  return (
    <Layout>
      {showSuccessAlert && (
        <Alert color="green" alertMessage="Suggestion Successfully Submited" setAlert={setShowSuccessAlert} />
      )}
      {showErrorAlert && <Alert color="red" alertMessage="Suggestion Submission Failed" setAlert={setShowErrorAlert} />}
      <SEO title={seoTitle} img={colorway.img} />
      <div className="lg:w-3/5 mx-auto">
        <div className="pt-4">
          <Link to="/" className="text-blue-600">
            <span style={{ 'font-size': '16px' }}>
              <FontAwesomeIcon icon={['fas', 'home']} />
            </span>
          </Link>
          <span className="text-gray-400"> / </span>
          <Link to={makerUrl} className="text-blue-600">
            {makerName}
          </Link>
          <span className="text-gray-400"> / </span>
          <Link to={sculptUrl} className="text-blue-600">
            {sculptName}
          </Link>
        </div>
        <div className="flex flex-col sm:flex-row justify-between my-6">
          <div className="mb-2 pr-3 leading-snug sm:mb-0">
            <h2 className="text-3xl font-bold leading-none">{colorway.name ? colorway.name : '(Unknown)'}</h2>
            {colorway.releaseDate ? (
              <div className="mt-2">
                <FontAwesomeIcon icon={['fa', 'calendar']} />
                <span className="font-bold mx-2">Release date:</span>
                {colorway.releaseDate}
              </div>
            ) : (
              ''
            )}
          </div>
          <div className="flex flex-row flex-no-wrap flex-shrink-0 mt-1 items-start">
            {!colorway.name && (
              <button
                className="
                  modal-open
                  mx-2
                  block
                  w-35
                  bg-pink-500
                  hover:bg-pink-700
                  text-white
                  font-bold
                  ml-2
                  py-2
                  px-3
                  text-xs
                  rounded"
                onClick={() => setShowModal(true)}
              >
                Suggest Name
              </button>
            )}
            <CopyToClipboard text={location.href} onCopy={updateText}>
              <button
                className="
                block
                w-20
                bg-blue-500
                hover:bg-blue-700
                text-white
                font-bold
                py-2 px-3
                text-xs
                rounded
                whitespace-no-wrap"
              >
                {state.text}
              </button>
            </CopyToClipboard>
            {isInWishlist(wishlist, colorway.id) ? (
              <button
                onClick={() => setStateWishlist(rmCap(colorway.id))}
                className="
                  block
                  w-48
                  inline-flex
                  items-center
                  justify-center
                  bg-red-500
                  hover:bg-red-700
                  text-white
                  font-bold
                  ml-2
                  py-2
                  px-3
                  text-xs
                  rounded"
              >
                <FontAwesomeIcon className="mr-1" icon={['fas', 'star']} />
                <span>Remove from wishlist</span>
              </button>
            ) : (
              <button
                onClick={() => setStateWishlist(addCap(colorway.id))}
                className="
                  block
                  w-48
                  bg-green-500
                  hover:bg-green-700
                  text-white
                  font-bold
                  ml-2
                  py-2
                  px-3
                  text-xs
                  rounded"
              >
                <FontAwesomeIcon className="mr-1" icon={['fas', 'star']} />
                <span>Add to wishlist</span>
              </button>
            )}
          </div>
        </div>
        <div className="flex bg-white border">
          <div className="flex flex-col p-5 mx-auto">
            <div className="colorway-wrapper">
              <img loading="lazy" className="block h-full w-full object-cover" alt={seoTitle} src={colorway.img} />
            </div>
          </div>
        </div>
      </div>
      {showModal && (
        <SubmitNameModal
          modalHeader="Suggest Colorway Name"
          placeholder="Suggestion Name"
          clwId={colorway.id}
          setModal={setShowModal}
          setErrorAlert={setShowErrorAlert}
          setSuccessAlert={setShowSuccessAlert}
        />
      )}
    </Layout>
  );
};

export default Maker;
