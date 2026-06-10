let axios
if (process.env.NODE_ENV !== "test"){
  import('axios').then((module) => {
      axios = module.default
  })
}

const BASE_URL = process.env.API_BASE_URL || "https://www.dnd5eapi.co/api/2014";
// const BASE_URL = process.env.API_BASE_URL || "https://api.open5e.com/v2"

/** API Class.
 *
 * Static class tying together methods used to get/send to to the API.
 * There shouldn't be any frontend-specific stuff here, and there shouldn't
 * be any API-aware stuff elsewhere in the frontend.
 *
 */

class Dnd5eApi {
  // the token for interactive with the API will be stored here.

  static async request(endpoint, data = {}, method = "get") {
    console.debug("API Call:", endpoint, data, method);

    //there are multiple ways to pass an authorization token, this is how you pass it in the header.
    //this has been provided to show you another way to pass the token. you are only expected to read this code for this project.
    const url = `${BASE_URL}/${endpoint}`;
    const params = (method === "get")
        ? data
        : {};

    try {
      return (await axios({ url, method, data, params })).data;
    } catch (err) {
      console.error("API Error:", err.response);
      console.log(err.response)
      let message = err.response.data;
      throw Array.isArray(message) ? message : [message];
    }
  }

  // Individual API routes

  /** Get details of a spell by name */

  static async getSpells(name) {
    let res = await this.request("spells", {name})
    return res.results
  }

  static async getSpell(index) {
    let res = await this.request(`spells/${index}`);
    return res;
  }
}

export default Dnd5eApi