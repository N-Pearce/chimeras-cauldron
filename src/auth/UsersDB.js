import bcrypt from "bcryptjs"
import {v4 as uuid} from 'uuid'
import supabase from "../api-homebrew/supabaseClient"

const BCRYPT_WORK_FACTOR = process.env.NODE_ENV !== "test" ? 
  +process.env.REACT_APP_BCRYPT_WORK_FACTOR : 1;
const HASH_SALT = process.env.REACT_APP_HASH_SALT
const {NotFoundError, UnauthorizedError, BadRequestError} = require("../api-homebrew/expressError");


/** Related functions for users. */

class UserDB {
  /** authenticate user with username, password.
   *
   * Returns { username, first_name, last_name, email, is_admin }
   *
   * Throws UnauthorizedError is user not found or wrong password.
   **/

  static async authenticate(username, password) {
    // try to find the user first
    const result = await supabase.from("users")
                            .select(`username, 
                                password, 
                                first_name, 
                                last_name, 
                                email, 
                                is_admin`)
                            .eq("username", username);

    const user = result.data[0];

    if (user) {
        // compare hashed password to a new hash from password
        const isValid = await bcrypt.compare(`${password}${HASH_SALT}`, user.password);
        if (isValid === true) {
            delete user.password;
            return user;
        }
    }

    throw new UnauthorizedError("Invalid username/password");
}

  /** Register user with data.
   *
   * Returns { username, hashedPasword, firstName, lastName, email, isAdmin, shareLink }
   *
   * Throws BadRequestError on duplicates.
   **/

  static async register({username, password, first_name, last_name, email, is_admin}) {
    // checks duplicate username first
    const duplicateCheck = await supabase
      .from("users")
      .select("username")
      .eq("username", username)

    if (duplicateCheck.data[0]) {
      throw new BadRequestError(`Duplicate username: ${username}`);
    }

    const hashedPassword = await bcrypt.hash(`${password}${HASH_SALT}`, BCRYPT_WORK_FACTOR)
    const shareLink = uuid()

    const result = await supabase
      .from("users")
      .insert({
        username: username,
        password: hashedPassword,
        first_name: first_name,
        last_name: last_name,
        email: email,
        is_admin: false,
        share_link: shareLink
      })
      .select()

    const user = result.data[0]

    return user;
  }

  /** Find all users.
   *
   * Returns [{ username, first_name, last_name, email, is_admin }, ...]
   **/

  static async findAll() {
    // unneeded for current project
  }

  /** Given a username, return data about user.
   *
   * Returns { username, first_name, last_name, is_admin, share_link }
   *
   * Throws NotFoundError if user not found.
   **/

  static async get(username) {
    const result = await supabase.from("users")
                                .select(`username,
                                    first_name,
                                    last_name,
                                    email,
                                    share_link,
                                    is_admin`)
                                .eq("username", username)

    const user = result.data[0];
    if (!user) throw new NotFoundError(`No user: ${username}`);

    return user;
  }

  /** Update user data with `data`.
   *
   * Data can include:
   *   { firstName, lastName, email }
   *
   * Returns { firstName, lastName, email }
   *
   * Throws NotFoundError if not found.
   *
   */

  static async update(username, data) {
    if (data.password) {
      data.password = await bcrypt.hash(`${data.password}${HASH_SALT}`, BCRYPT_WORK_FACTOR);
    }
    const {first_name, last_name, email} = data
    const result = await supabase
      .from("users")
      .update({
        first_name: first_name,
        last_name: last_name,
        email: email
      })
      .eq("username", username)
      .select()

    const user = result.data[0];
    if (!user) throw new NotFoundError(`No user: ${username}`);

    delete user.password;
    return user;
  }

  /** Delete given user from database; returns undefined. */

  static async remove(username) {
    // unneeded for current project
  }

  /**
   * Creates a hashed passkey to save in localStorage
   * 
   * Used for keeping user logged in on page reload
   */

  static async setHashedPasskey(username){
    const hashedPasskey = await bcrypt.hash(`${username}${HASH_SALT}`, BCRYPT_WORK_FACTOR)
    return hashedPasskey
  } 

  /**
   * Validates the passkey from localStorage to ensure it's the correct user's
   */

  static async validatePasskey(username, passkey){
    return await bcrypt.compare(`${username}${HASH_SALT}`, passkey);
  }

  /** 
   * Determines if the share link is an item or user share link, saving that as link_type
   * 
   * Inserts {user, link_type, share_link} into shared_links where user is the username of 
   * the user that the link was shared to.
   */

  static async addShareLink(shareLink, user){

    let link = shareLink.share_link.trim()
    let link_type = link.slice(0,4)
    let share_link = link.slice(5)

    if (link_type !== 'user' && link_type !== 'item') 
      throw new BadRequestError("link must start with item or user")

    await supabase
    .from('shared_links')
    .insert({
      user,
      link_type,
      share_link
    })
  }
}


export default UserDB;
