/* eslint-disable no-return-assign */
import React, { useState, useEffect } from 'react';
import { Link } from 'gatsby';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { sortBy } from 'lodash';

import { getWishlist, isInWishlist, rmCap, addCap } from '../internal/wishlist';
import Layout from '../components/layout';
import SEO from '../components/seo';
import ThumbnailImage from '../components/thumbnail-image';
import SubmitNewCwModal from '../components/modals/submit-new-cw';
import Alert from '../components/alert';

const Maker = (props) => {
  const { pageContext, location } = props;
  const { maker, makerUrl, sculpt, selfOrder } = pageContext;

  const seoTitle = `${maker.name} - ${sculpt.name}`;

  const [wishlist, setStateWishlist] = useState(undefined);
  useEffect(() => {
    setStateWishlist(getWishlist());
  }, []);
  const cwList = selfOrder === true ? sculpt.colorways : sortBy(sculpt.colorways, (x) => x.name);

  const [showModal, setShowModal] = useState(false);

  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);

  return (
    <Layout>
      {showSuccessAlert && (
        <Alert color="green" alertMessage="Colorway Successfully Submitted" setAlert={setShowSuccessAlert} />
      )}
      {showErrorAlert && <Alert color="red" alertMessage="Colorway Submission Failed" setAlert={setShowErrorAlert} />}
      <SEO title={seoTitle} img={sculpt.previewImg} />
      <div className="pt-4">
        <Link to="/" className="text-blue-600">
          <FontAwesomeIcon icon={['fas', 'home']} />
        </Link>
        <span className="text-gray-400"> / </span>
        <Link to={makerUrl} className="text-blue-600">
          {maker.name}
        </Link>
      </div>
      <div className="flex text-3xl my-6 justify-between">
        <h2 className="font-bold">{sculpt.name}</h2>

        <button
          className="
            inline-block
            block
            w-35
            bg-teal-500
            hover:bg-teal-700
            text-white
            font-bold
            py-1
            px-2
            text-xs
            rounded"
          onClick={() => setShowModal(true)}
        >
          Submit a Colorway
        </button>
      </div>
      <ul className="flex flex-wrap flex-row list-none -ml-2 -mr-2">
        {cwList.map((c) => (
          <li key={c.id} id={c.id} className="flex h-auto w-1/2 md:w-1/4 lg:w-1/5 py-1 px-1">
            <div
              className="
                flex
                flex-col
                justify-between
                max-w-full
                min-w-full
                bg-white
                p-2
                bg-white
                hover:text-blue-600
                shadow-xs
                hover:shadow-md
                pb-4"
            >
              <Link to={`${location.pathname}/${c.id}`} className="w-full h-full bg-gray-300 thumbnail-wrapper">
                <ThumbnailImage
                  loading="lazy"
                  className="h-full w-full object-cover"
                  src={c.img}
                  alt={`${maker.name} - ${sculpt.name} - ${c.name}`}
                />
              </Link>
              <div className="font-bold flex flex-row pt-3 px-2 relative">
                {isInWishlist(wishlist, c.id) ? (
                  <FontAwesomeIcon
                    id="favStar"
                    className="m-1 absolute star-icon text-yellow-500 cursor-pointer"
                    icon={['fas', 'star']}
                    onClick={() => setStateWishlist(rmCap(c.id))}
                  />
                ) : (
                  <FontAwesomeIcon
                    id="favStar"
                    className="m-1 absolute star-icon text-gray-500 cursor-pointer"
                    icon={['fas', 'star']}
                    onClick={() => setStateWishlist(addCap(c.id))}
                  />
                )}
                <Link to={`${location.pathname}/${c.id}`} className="text-sm text-center w-full px-5">
                  {c.name ? c.name : '(Unknown)'}
                </Link>
              </div>
            </div>
          </li>
        ))}
      </ul>
      {showModal && (
        <SubmitNewCwModal
          setModal={setShowModal}
          maker={maker.name}
          sculpt={sculpt.name}
          setErrorAlert={setShowErrorAlert}
          setSuccessAlert={setShowSuccessAlert}
        />
      )}
    </Layout>
  );
};

export default Maker;
