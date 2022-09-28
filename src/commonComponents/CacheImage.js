import React, { useEffect } from 'react'
import PropTypes from "prop-types";

const CacheImage = ({img}) =>{

    useEffect(() => {
        const images = [ img ]
        cacheImages(images)
      },[])
      
      const cacheImages = async (scrArray) => {
           const promises = await scrArray.map((src) => {
             return new Promise(function (resolve, reject){
                const img = new Image()
                img.src = src;
                img.onload = resolve();
                img.onerror = reject();
             })
           })
           await Promise.all(promises)
      }

      return(
          <>
              {null}
          </>
      )
}

CacheImage.propTypes = {
    img: PropTypes.any,
};
  
export default CacheImage