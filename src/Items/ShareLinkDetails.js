import React from 'react'
import { Link } from 'react-router-dom'

const ShareLinkDetails = () => {
  return (
    <div className='itemCard' style={{paddingLeft: 10, paddingRight: 10}}>
        <h1>Share Links!</h1>
        <h3>What are they?</h3>
        <p>Share links are what is used on this site to share homebrew between users!</p>
        <p>All you have to do is recieve a share link from someone, then enter 
            it on <Link to='/items/share-link/add'>this</Link> page. 
            Their homebrew will then show up just like your own! </p>
        <p>When viewing any homebrew on this site, the creator's username will be shown.</p>
        <p>(Filtering items between 5e, homebrew, and shared homebrew is currently in the works.)</p>

        <h3>Where are Share Links Found?</h3>
        <p>There are two types of share links: <b>Item Share Links</b> and <b>User Share Links</b></p>
        <p>An <b>Item Share Link</b> is found in the Item Details page of the creator of the homebrew, 
            and will only add the single item to another user's list of items.
        </p>
        <p>A <b>User Share Link</b> is found in a user's profile, and will add all homebrew made by
        that user to another user's list, including all homebrew made in the future.
        </p>
        
        <h3>Removing Shared Items</h3>
        <p>When viewing the details of your own homebrew, it will also show any users who have access 
          to it, if any. This is split between accessible by <b>Item Share Link</b> and <br/>
          <b>User Share Link.</b></p>
        <p>Removing a user from your shared list will generate a new share link for you or your item,
          that all other users on your shared list will keep automatically.
        </p>
        <br></br>
    </div>
  )
}

export default ShareLinkDetails