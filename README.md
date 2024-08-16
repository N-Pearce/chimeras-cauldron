# Chimera's Cauldron!

This project was created by Nathan Pearce using React

## Deployed Site:
https://chimeras-cauldron.onrender.com/

## Scripts

Running `npm install` will install all required files. Running `npm run install` afterwards will run the project on localhost:3000

## Functionality

Chimera's Cauldron was intended for the creation and organization of Homebrewed D&D content between multiple users.
Upon signing in, a user will have access to the basic rules D&D content under the OPEN GAME LICENSE Version 1.0a. This content includes spells and magic items.
Users also have access to their own profile page, as well as a Characters tab.

### Spells

Each user can view all spells from the D&D basic rules, as well as search for them with the search bar, and view the details of the spell.
The Spells segment of this site uses the D&D API: https://www.dnd5eapi.co/

### Items

Each user can view all magic items from the D&D basic rules, as well as search for them with the search bar, and view the details of the item.
The Items segement of this site uses the same database as where the users are stored, as to simplify the calls to the basic rules items combines with the homebrew items.
Above the list of items, there are two buttons, "Add Homebrew Item", and "Add Share Link".

#### Creating Homebrew

Upon clicking on the "Add Homebrew Button", the user will be taken to a form where they can create and customize their own homebrew items. Upon submitting, that item will appear in their own list of items on the items page. Viewing the details of this item will show the user a share link, so long as the user is the creator of the item.

#### Sharing Homebrew

By sharing the share link found in the details page of a user's homebrew item, another user can copy and paste that link into the form that appears when "Add Share Link" is clicked. Once submitted, that item will appear in the new user's list of items, but will not show the share link to the item when that user views the details page.
When the creator of the item views the details page, the user will now see a list of all users who have access to the item via share links, whether by Item Share Links or User Share Links. 

#### User Share Links

Besides the share links found in the details page of an item, there are also User Share Links found found in each user's profile page. By sharing this share link with another user, that user will gain access to all homebrew created by the user who shared the link. This includes all homebrew that user creates in the future, so it is recomended to use this option carefully.

#### Removing Users From Your Shared List

By viewing the details page of a homebrew item you created, you will see a list of all users who have access to the item. This is seperated between users who have access from the specific Item Share Link, and who has access to it from your User Share Link. Next to each user's name, a remove button can be seen. By clicking this button, the database table that contains who can see what item will be updated to remove that user from the list. Additionally, the share link used, whether it be the Item Share Link or the User Share Link, will generate a new link, further preventing the removed user from access to the item. In the database table, each other user who has access to your item will automatically be given the new share link, maintining their access to the item.

### Characters

By creating a character (requiring only a name for them) a user will see an "Inventory" tab, an "Add to Inventory" tab, and a list of item slots. Attempting to choose an item to equip will show no items if the character has no items in their inventory, or if none of them are of the selected slot.

#### Adding an Item to the Inventory

By clicking "Add to Inventory", the user will see a screen similar to the Items screen, showing all items that user has access to. By adding an item to a character's inventory, that item will appear when clicking the "Inventory" tab, as well as appear when selecting an item to equip, if the item matches the slot chosen.

#### Updating Inventory

By clicking the "Inventory" tab, the user can adjust how many of each item their character has in their inventory, by +1, -1, or by clicking "Add/Remove Multiple", which takes them to a form to enter any amount to Add/Removes. The user can also remove the item from their inventory, removing the instance of the object from the list of items they can see when viewing the inventory.

#### Equipping an Item

Having items in a character's inventory will allow the user to equip the items on their character, even keeping track of how many items their character is currently attuned to. The items are seperated by slot, and will onyl appear in the slot in which they match. For instance, having the "Adamantine Armor", in the character's inventory (which is an Armor slot item), will allow the user to see that item in the list of items to equip when "Choose Armor" is selected.
Items can also be unequipped, and equipping a new item while one is already equipped will unequip the previous item to equip the new one.

### Profile

A user can see and even edit parts of their profile. The users Username, Password, and User Share Link cannot be updated, but removing another's access to your User Share Link will give you a new one.
