import React from 'react'
import './SearchBar.css'

const SearchBar = ({setTerm}) => {

    async function handleChange(evt) {
        setTerm(evt.target.value)
    }

    return (
        <form>
            <input name='searchTerm' placeholder='Enter search term...' onChange={handleChange}></input>
        </form>
    )
}

export default SearchBar