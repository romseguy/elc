import { databaseErrorCodes } from "middlewares/errors";
import { isServer } from "utils/isServer";

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
      // if (!process.env.NEXT_PUBLIC_IS_TEST)
      if (!isServer()) console.log(`${method} /${endpoint}`, data);
      return { data };
    }

    const error = await response.json();
    console.log(`API ERROR /${endpoint}`, error);
    return { error };
  } catch (error) {
    console.error(`API ERROR /${endpoint}`, error);
    return {
      error: {
        message:
          "Une erreur inconnue est survenue, merci de contacter le développeur"
      }
    };
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
