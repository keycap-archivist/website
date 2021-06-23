import React, { useEffect, useState } from 'react';
import { Link } from 'gatsby';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Layout from '../layouts/base';
import SEO from '../components/seo';
import Alert from '../components/alert';
import { getCollections, delCollection } from '../internal/collection';
import AddCollectionModal from '../components/modals/add-collection';

const CollectionPage = () => {
  const [collections, setCollections] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);

  useEffect(() => {
    getCollections().then((data) => {
      const list = data.map((c) => ({
        name: c.name,
        id: c.id,
        items: c.content.items,
      }));

      setCollections(list);
    });
  }, []);

  return (
    <Layout>
      <SEO title="" img={'/android-icon-512x512.png'} />

      {showSuccessAlert && <Alert color="green" alertMessage="Collection Successfully Created" setAlert={setShowSuccessAlert} />}
      {showErrorAlert && <Alert color="red" alertMessage="Collection Creation Failed" setAlert={setShowErrorAlert} />}

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
      <ul className="flex flex-wrap flex-row list-none -ml-2 -mr-2">
        {collections.map((element) => (
          <li key={element.id} className="maker_tile_item">
            <Link to={element.id} className="tile_block">
              {/* <div className="img_holder">
                <Img fluid={getImg(element.context.maker.id)} className="block" alt={element.context.maker.name} width="500" height="500" />
              </div> */}
              <div className="text_header">
                <div className="text-sm">{element.name}</div>

                <FontAwesomeIcon
                  id="favStar"
                  className="m-1 trash-alt-icon text-red-500 cursor-pointer"
                  icon={['fas', 'trash-alt']}
                  onClick={() => {
                    delCollection(element.id);
                  }}
                />
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </Layout>
  );
};

export default CollectionPage;
