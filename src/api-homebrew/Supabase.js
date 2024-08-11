import UserDB from '../auth/UsersDB';
import CharacterDB from '../Characters/CharacterDB';
import ItemDB from '../Items/ItemDB';
import InventoryDB from '../Characters/Inventory/InventoryDB';

/** home for all Database call functions */

class Supabase {
    
    /*
      Users
    */
    
    static async authenticate(username, password){
        return await UserDB.authenticate(username, password)
    }

    static async register(signupData){
        return await UserDB.register(signupData)
    }

    static async getUser(username){
        return await UserDB.get(username)
    }

    static async updateUser(username, data){
        return await UserDB.update(username, data)
    }

    static async setHashedPasskey(username){
        return await UserDB.setHashedPasskey(username)
    }

    static async validatePasskey(username, passkey){
        return await UserDB.validatePasskey(username, passkey)
    }

    /*
      Characters
    */

    static async getCharacters(user){
        return await CharacterDB.findAll({user})
    }

    static async addCharacter(formData){
        return await CharacterDB.create(formData)
    }
    
    static async getCharacterName(character_id){
        return await CharacterDB.getName(character_id)
    }

    /*
        Items
    */

    static async getItems(name='', user){
        return await ItemDB.findAll(name, user)
    }

    static async getItem(index){
        return await ItemDB.get(index)
    }

    static async addItem(formData, source, user){
        return await ItemDB.create(formData, source, user)
    }

    /*
        Inventory
    */

    static async getInventory(CharacterId){
        return await InventoryDB.getInventory(CharacterId)
    }

    static async getInventoryItem(id){
        return await InventoryDB.getItem(id)
    }

    static async addToInventory(item, characaterId){
        return await InventoryDB.add(item, characaterId)
    }

    static async updateInventory(id, num_items){
        return await InventoryDB.update(id, num_items)
    }

    static async removeFromInventory(id){
        return await InventoryDB.remove(id)
    }

    static async findInventoryItem(characaterId, index){
        return await InventoryDB.findItemFromDetails(characaterId, index)
    }

    /*
        Equipped - Inventory
    */

    static async equipItem(inventoryId, slot, characterId){
        return await InventoryDB.equipItem(inventoryId, slot, characterId)
    }

    static async getAllEquipped(characterId){
        return await InventoryDB.getAllEquipped(characterId)
    }

    static async removeFromEquipped(inventoryId){
        return await InventoryDB.removeFromEquipped(inventoryId)
    }

    /*
        Share Links
    */

    static async addShareLink(shareLink, user){
        return await UserDB.addShareLink(shareLink, user)
    }

    static async getSharedUsers(shareLink, user){
        return await ItemDB.getSharedUsers(shareLink, user)
    }

    static async removeSharedUser(shareLink, linkType, user, userToRemove){
        return await ItemDB.removeSharedUser(shareLink, linkType, user, userToRemove)
    }
}

export default Supabase