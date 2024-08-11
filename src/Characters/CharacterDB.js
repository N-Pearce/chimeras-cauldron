import supabase from '../api-homebrew/supabaseClient.js'

const {NotFoundError} = require("../api-homebrew/expressError");


/** Related functions for companies. */

class CharacterDB {
  /** Create a company (from data), update db, return new company data.
   *
   * data should be { handle, name, description, numEmployees, logoUrl }
   *
   * Returns { handle, name, description, numEmployees, logoUrl }
   *
   * Throws BadRequestError if company already in database.
   * */

  static async create({name, user_name}) {
    const result = await supabase
      .from("characters")
      .insert({
        user_name: user_name,
        name: name
      })
      .select()

    const item = result.data[0]

    return item;
  }

//   /** Find all companies (optional filter on searchFilters).
//    *
//    * searchFilters (all optional):
//    * - minEmployees
//    * - maxEmployees
//    * - name (will find case-insensitive, partial matches)
//    *
//    * Returns [{ handle, name, description, numEmployees, logoUrl }, ...]
//    * */

  static async findAll({user}) {

    const result = await supabase.from("characters")
                        .select(`id,
                                name`)
                        .eq("user_name", user)

    return result.data
  }

  /** Given a company handle, return data about company.
   *
   * Returns { handle, name, description, numEmployees, logoUrl, jobs }
   *   where jobs is [{ id, title, salary, equity }, ...]
   *
   * Throws NotFoundError if not found.
   **/

  static async getName(character_id) {

    const result = await supabase.from("characters")
                        .select(`name`)
                        .eq("id", character_id)
                        
    if (result) return result.data[0].name
    throw new NotFoundError(`No character: ${character_id}`);
  }

//   /** Update company data with `data`.
//    *
//    * This is a "partial update" --- it's fine if data doesn't contain all the
//    * fields; this only changes provided ones.
//    *
//    * Data can include: {name, description, numEmployees, logoUrl}
//    *
//    * Returns {handle, name, description, numEmployees, logoUrl}
//    *
//    * Throws NotFoundError if not found.
//    */

  static async update(handle, data) {  
    // unneeded for current project
  }

//   /** Delete given company from database; returns undefined.
//    *
//    * Throws NotFoundError if company not found.
//    **/

  static async remove(handle) {
    // unneeded for current project
  }
}


export default CharacterDB;
