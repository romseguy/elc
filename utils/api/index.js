import { databaseErrorCodes } from "middlewares/errors";

function createHttpRequestError(error) {
  return error;
}

async function request(endpoint, params, method = "GET") {
  try {
    const options = {
      method,
      headers: {
        "Content-Type": "application/json"
      }
    };

    if (params) {
      if (method === "GET") {
        endpoint += "?" + objectToQueryString(params);
      } else {
        options.body = JSON.stringify(params);
      }
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API}/${endpoint}`,
      options
    );

    if (response.status === 200) {
      const { data } = await response.json();
      // console.log(`/${endpoint}`, data);
      return { data };
    } else {
      const error = await response.json();
      console.log(`API ERROR /${endpoint}`, error);
      return { error };
    }
  } catch (error) {
    return createHttpRequestError({ error });
  }
}

function objectToQueryString(obj) {
  return Object.keys(obj)
    .map((key) => key + "=" + obj[key])
    .join("&");
}

function get(endpoint, params) {
  return request(endpoint, params);
}

function post(endpoint, params) {
  return request(endpoint, params, "POST");
}

function update(endpoint, params) {
  return request(endpoint, params, "PUT");
}

function remove(endpoint, params) {
  return request(endpoint, params, "DELETE");
}

export default {
  get,
  post,
  update,
  remove,
  databaseErrorCodes
};
