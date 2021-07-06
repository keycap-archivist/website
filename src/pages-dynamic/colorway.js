/* eslint-disable no-return-assign */
import React, { useState, useEffect } from 'react';
import { Link } from 'gatsby';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import { getLocalCollections } from '../internal/wishlist';
import { getCollections } from '../internal/collection';
import Layout from '../layouts/base';
import SEO from '../components/seo';
import Alert from '../components/alert';
import SubmitNameModal from '../components/modals/submit-name';
import AddToCollectionModal from '../components/modals/add-to-collection';
import { getConfig } from '../internal/config';

const Maker = (props) => {
  const { pageContext, location } = props;
  const { makerUrl, makerName, sculptUrl, sculptName, colorway } = pageContext;
  const seoTitle = `${makerName} - ${colorway.name} ${sculptName}`;
  const [state, setState] = useState({ text: 'Copy link' });

  const [showModal, setShowModal] = useState(false);
  const [showCollectionModel, setShowCollectionModel] = useState(false);

  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [showExceedAlert, setShowExceedAlert] = useState(false);

  const updateText = () => {
    setState({ text: 'Copied!' });
  };

  const cfg = getConfig();
  const [collections, setCollections] = useState([]);
  const [addingCap, setAddingCap] = useState({});

  useEffect(async () => {
    const list = cfg.authorized ? await getCollections() : getLocalCollections();

    setCollections(list);
  }, []);
  const cwImg = `https://cdn.keycap-archivist.com/keycaps/720/${colorway.id}.jpg`;
  return (
    <Layout>
      {showSuccessAlert && <Alert color="green" alertMessage="Suggestion Successfully Submited" setAlert={setShowSuccessAlert} />}
      {showErrorAlert && <Alert color="red" alertMessage="Suggestion Submission Failed" setAlert={setShowErrorAlert} />}
      {showExceedAlert && <Alert color="red" alertMessage="Wishlist or trade list items exceeded" setAlert={setShowExceedAlert} />}
      <SEO title={seoTitle} img={cwImg} />
      <div className="lg:w-3/5 mx-auto">
        <div className="pt-4">
          <Link to="/" className="text-blue-600">
            <FontAwesomeIcon icon={['fas', 'home']} />
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

            <button
              className="
              modal-open
              mx-2
              block
              w-35
              bg-blue-500
              hover:bg-blue-700
              text-white
              font-bold
              ml-2
              py-2
              px-3
              text-xs
              rounded"
              onClick={() => {
                setShowCollectionModel(true);
                setAddingCap(colorway);
              }}
            >
              Add to Collection
              <FontAwesomeIcon id="favTrade" className="m-1 folder-plus-icon text-500 cursor-pointer" icon={['fas', 'folder-plus']} />
            </button>
          </div>
        </div>
        <div className="colorway-wrapper">
          <div className="flex flex-col p-5 mx-auto">
            <div className="colorway-wrapper">
              <img loading="lazy" className="block h-full w-full object-cover" alt={seoTitle} src={cwImg} />
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
      {showCollectionModel && (
        <AddToCollectionModal
          modalHeader="Add colorway to collection"
          setModal={setShowCollectionModel}
          collections={collections}
          cap={addingCap}
          authorized={cfg.authorized}
          setErrorAlert={setShowErrorAlert}
          setSuccessAlert={setShowSuccessAlert}
        />
      )}
    </Layout>
  );
};

export default Maker;
