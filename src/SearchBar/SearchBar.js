import React from 'react'
import './SearchBar.css'

const SearchBar = ({setTerm}) => {

    async function handleChange(evt) {
        setTerm(evt.target.value)
    }

    return (
        <div>
            <form>
                <input name='searchTerm' placeholder='Enter search term...' onChange={handleChange}></input>
            </form>
        </div>
    )
}

export default SearchBar