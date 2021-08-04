import React, { useEffect, useState } from 'react';
import { Link } from 'gatsby';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { sample } from 'lodash';
import Layout from '../layouts/base';
import SEO from '../components/seo';
import Alert from '../components/alert';
import Loading from '../components/loading';
import { getCollections, delCollection } from '../internal/collection';
import { getLocalCollections } from '../internal/wishlist';
import AddCollectionModal from '../components/modals/add-collection';
import ThumbnailImage from '../components/thumbnail-image';
import { getConfig } from '../internal/config';

const CollectionPage = () => {
  const [loading, setLoading] = useState(false);
  const [collections, setCollections] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);

  const cfg = getConfig();

  const fetchCollections = async () => {
    setLoading(true);
    let list = cfg.authorized ? await getCollections() : getLocalCollections();

    list = list.map((c) => {
      const cap = sample(c.content.items);
      return {
        name: c.name,
        id: c.id,
        items: c.content.items,
        previewImg: cap && `https://cdn.keycap-archivist.com/keycaps/250/${cap.id}.jpg`,
      };
    });

    setCollections(list);
    setLoading(false);
  };

  useEffect(() => {
    fetchCollections();
  }, [showSuccessAlert]);

  return (
    <Layout>
      <SEO title="Collection" img={'/android-icon-512x512.png'} />

      {showSuccessAlert && <Alert color="green" alertMessage="Collection Successfully Created" setAlert={setShowSuccessAlert} />}
      {showErrorAlert && <Alert color="red" alertMessage="Collection Creation Failed" setAlert={setShowErrorAlert} />}

      <h2 className="text-3xl font-bold leading-none">Manage Collection</h2>
      <br />
      {loading && <Loading />}
      {cfg.authorized && !loading && (
        <div className="flex flex-row flex-no-wrap flex-shrink-0 mt-1 items-start">
          <button
            className="modal-open mx-2 block w-35 bg-blue-500 hover:bg-blue-700 text-white font-bold ml-2 py-2 px-3 text-xs rounded"
            onClick={() => setShowModal(true)}
          >
            Add Collection
          </button>
          {showModal && (
            <AddCollectionModal
              modalHeader="Add New Collection"
              placeholder="Collection Name"
              setModal={setShowModal}
              setErrorAlert={setShowErrorAlert}
              setSuccessAlert={setShowSuccessAlert}
            />
          )}
        </div>
      )}
      <br />
      <ul className="flex flex-wrap flex-row list-none -ml-2 -mr-2">
        {collections.map((c) => (
          <li key={c.id} id={c.id} className="tile_item">
            <div className="tile_sculpt">
              <Link to={`/collection/${c.id}`} className="w-full h-full bg-gray-300 thumbnail-wrapper">
                <ThumbnailImage loading="lazy" className="h-full w-full object-cover" src={c.previewImg} alt={c.name} />
              </Link>
              <div className="font-bold flex flex-row pt-3 px-2 relative">
                <Link to={`/collection/${c.id}`} className="text-sm text-center w-full px-5">
                  {c.name ? c.name : '(Unknown)'}
                </Link>
                <FontAwesomeIcon
                  id="favTrash"
                  className="m-1 trash-icon text-red-500 cursor-pointer"
                  icon={['fas', 'trash']}
                  onClick={() => {
                    delCollection(c.id);
                  }}
                />
              </div>
            </div>
          </li>
        ))}
      </ul>
    </Layout>
  );
};

export default CollectionPage;
