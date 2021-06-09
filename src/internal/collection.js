import axios from 'axios';

axios.defaults.withCredentials = true;

const baseAPI = 'https://api.keycap-archivist.com';

export function updateCollection(id, data) {
  console.log('updating...', data.name);

  return axios
    .post(`${baseAPI}/ws/${id}`, data)
    .then((response) => response.data.id)
    .catch((err) => {
      console.log(err.message);
    });
}

export function setCollection(data) {
  console.log('syncing...', data.name);

  return axios
    .post(`${baseAPI}/ws`, data)
    .then((response) => response.data.id)
    .catch((err) => {
      console.log(err.message);
    });
}

export function getCollections() {
  return axios
    .get(`${baseAPI}/ws`)
    .then(({ data }) => data)
    .catch(() => []);
}

export function getCollectionById(id) {
  console.log('getting collection', id);

  return axios
    .get(`${baseAPI}/ws/${id}`)
    .then(({ data }) => data[0])
    .catch((err) => {
      console.log(err.message);
    });
}

export async function getCurrentSession() {
  await axios.get(`${baseAPI}/auth/current-session`, { timeout: 20000 });
}
