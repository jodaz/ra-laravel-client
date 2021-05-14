import axios from 'axios';
import { stringify } from 'qs';
import defaultSettings from './defaultSettings';
import init from './initializer';

init('token');

const getQueryFromParams = params => {
  const { page, perPage } = params.pagination;

  // Create query with pagination params.
  const query = {
    'page': page,
    'perPage': perPage,
  };

  // Add all filter params to query.
  Object.keys(params.filter || {}).forEach((key) => {
    query[`filter[${key}]`] = params.filter[key];
  });

  // Add sort parameter
  if (params.sort && params.sort.field) {
    const prefix = params.sort.order === 'ASC' ? '' : '-';
    query.sort = `${prefix}${params.sort.field}`;
  }

  return query;
}

const getIds = (params, arrayFormat) => {
  const query = stringify({
    'filter[id]': params.ids,
  }, { arrayFormat: arrayFormat });

  return query;
}

const dataProvider = (apiURL, customSettings = {}) => {
  let url = '';
  const settings = {...customSettings, ...defaultSettings};
  const options = {
    headers: settings.headers,
  };

  const client = axios.create({
    baseURL: apiURL,
    ...settings
  });

  return ({
    getList: async (resource, params) => {
      const query = getQueryFromParams(params);

      url = `${apiURL}/${resource}?${stringify(query)}`;

      const res = await client({ url, ...options });

      return {
        data: res.data.data.map(item => item),
        total: res.data.total
      }
    },
    getOne: async (resource, params) => {
      url = `${apiURL}/${resource}/${params.id}`;

      const res = await client.get(url);

      return { data: { ...res.data  } }
    },
    getMany: async (resource, params) => {
      const query = getIds(params);

      url = `${apiURL}/${resource}?${query}`;

      const res = await client({ url, ...options });

      return {
        data: res.data.data.map(item => item),
        total: res.data.total
      }
    },
    getManyReference: async (resource, params) => {
      const query = getQueryFromParams(params);

      url = `${apiURL}/${resource}?${stringify(query)}`;

      const res = await client({ url, ...options });

      return {
        data: res.data.data.map(item => item),
        total: res.data.total
      }
    },
    create: async (resource, params) => {
      url = `${apiURL}/${resource}`;

      const res = await client.post(url, params.data);
      const { id, attributes  } = res.data;

      return {
        data: {
          id, ...attributes,
        },
      };
    },
    update: async (resource, params) => {
      url = `${apiURL}/${resource}/${params.id}`;
      const attributes = params.data;
      delete attributes.id;
      const data = {
        ...attributes
      };

      const res = await axios.put(url, data);

      return {
        data: { ...res.data }
      }
    },
    updateMany: (resource, params) => Promise,
    delete: async (resource, params) => {
      url = `${apiURL}/${resource}/${params.id}`;

      const res = await client.delete(url);

      return { data: { ...res.data } }
    },
    deleteMany: async (resource, params) => {
      const query = getIds(params, settings.arrayFormat);
      url = `${apiURL}/${resource}/${query}`;

      const res = await client.delete(url);

      return { data: { ...res.data } }
    },
    get: async (endpoint) => {
      url = `${apiURL}/${endpoint}`;

      const res = await client.get(url);

      return res.data;
    },
    post: async (endpoint, data) => {

      url = `${apiURL}/${endpoint}`;

      const res = await client.post(url, data);

      return res.data;
    }
  });
}

export default dataProvider;
