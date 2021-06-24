import React, { useEffect, useState } from 'react';
import { get } from 'lodash';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Layout from '../../layouts/base';
import SEO from '../../components/seo';
import Alert from '../../components/alert';
import { getCollectionById, updateCollection } from '../../internal/collection';
import ThumbnailImage from '../../components/thumbnail-image';

const CollectionPage = (props) => {
  const defaultCollection = {
    content: {
      items: [],
    },
  };
  const [collection, setCollection] = useState(defaultCollection);
  const [reload, setReload] = useState(false);
  useEffect(() => {
    getCollectionById(props.collectionId).then((data) => {
      setCollection(data);
      setReload(false);
    });
  }, [reload]);

  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);

  const caps = get(collection, 'content.items', []);
  return (
    <Layout>
      <SEO title={`Collection - ${collection.name}`} img={'/android-icon-512x512.png'} />

      {showSuccessAlert && <Alert color="green" alertMessage="Collection Successfully Created" setAlert={setShowSuccessAlert} />}
      {showErrorAlert && <Alert color="red" alertMessage="Collection Creation Failed" setAlert={setShowErrorAlert} />}

      <h2 className="text-3xl font-bold leading-none">{collection.name}</h2>
      <br />
      {caps.length ? (
        <ul className="flex flex-wrap flex-row list-none -ml-2 -mr-2">
          {caps.map((c) => (
            <li key={c.id} id={c.id} className="tile_item">
              <div className="tile_sculpt">
                <ThumbnailImage
                  loading="lazy"
                  className="h-full w-full object-cover"
                  src={`https://cdn.keycap-archivist.com/keycaps/250/${c.id}.jpg`}
                  alt={c.name}
                />

                <div className="font-bold flex flex-row pt-3 px-2 relative justify-between">
                  <span>{c.legend ? c.legend : '(Unknown)'}</span>

                  <FontAwesomeIcon
                    id="favTrash"
                    className="m-1 trash-icon text-red-500 cursor-pointer"
                    icon={['fas', 'trash']}
                    onClick={() => {
                      const items = collection.content.items.filter((i) => i.id !== c.id);
                      const wishlist = { ...collection.content, items };

                      updateCollection(props.collectionId, {
                        name: collection.name,
                        wishlist,
                      }).then(() => setReload(true));
                    }}
                  />
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm italic">Currently, no items in this collection.</p>
      )}
    </Layout>
  );
};

export default CollectionPage;
