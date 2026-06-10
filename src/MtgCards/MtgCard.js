import React from 'react'
import './MtgCard.css'
import {Link} from 'react-router-dom'

import wlcard from './MtgCardImgs/wlcard.jpg'
import ulcard from './MtgCardImgs/ulcard.jpg'
import blcard from './MtgCardImgs/blcard.jpg'
import rlcard from './MtgCardImgs/rlcard.jpg'
import glcard from './MtgCardImgs/glcard.jpg'
import clcard from './MtgCardImgs/clcard.jpg'
import mlcard from './MtgCardImgs/mlcard.jpg'

const MtgCard = ({index, title, colors, jpg}) => {

// console.log(colors.includes("blue"))

  // const imageUrls = [
  //     "./MtgCardImgs/blcard.jpg",
  //     "./MtgCardImgs/ulcard.jpg",
  //     "./MtgCardImgs/wlcard.jpg",
  //     "/static/media/ulcard.fee7af568caae19406a4.jpg"
  //   ]

  function colorCombo() {
    console.log(colors)
    if (colors.length >= 3)
      return mlcard
    if (colors.includes("white"))
      return wlcard
    if (colors.includes("blue"))
      return ulcard
    if (colors.includes("red"))
      return rlcard
    if (colors.includes("green"))
      return glcard
    if (colors.includes("black"))
      return blcard
    return clcard
  }

  return (
    // <Link className={'card'} to={jpg}>
      <div className='mtgCard'>
        <p>{title}</p>
       <img src={colorCombo()} a={ulcard}></img>
      </div>
    // </Link>
  )
}

export default MtgCard