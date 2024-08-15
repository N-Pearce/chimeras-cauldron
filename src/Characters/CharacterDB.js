import supabase from '../api-homebrew/supabaseClient.js'

const {NotFoundError} = require("../api-homebrew/expressError");


/** Related functions for characters. */

class CharacterDB {
  /** Create a character (from name), update db, return new character.
   *
   * Returns { id, user_name, user }
   *
   * */

  static async create({name, user_name}) {
    const result = await supabase
      .from("characters")
      .insert({
        user_name: user_name,
        name: name
      })
      .select()

    const character = result.data[0]

    return character;
  }

  /** Find all characters that match user_name
   *
   * Returns [{ id, name }, ...]
   * */

  static async findAll({user}) {

    const result = await supabase.from("characters")
                        .select(`id,
                                name`)
                        .eq("user_name", user)

    return result.data
  }

  /** Given a character_id, character name
   *
   * Returns { name }
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

  /** Update character data with `data`.
   *
   * Throws NotFoundError if not found.
   */

  static async update() {  
    // unneeded for current project
  }

  /** Delete given character from database; returns result.
   *
   * Throws NotFoundError if company not found.
   **/

  static async remove() {
    // unneeded for current project
  }
}


export default CharacterDB;
