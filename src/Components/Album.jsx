import { useHref } from "react-router-dom";
import Photo from "./Photo";
import { useState, useEffect } from "react";
export default function Album(props) {
  console.log('in Album');
  
  const [photos, setPhotos] = useState([]);
  const [id, setId] = useState(null);
  const  href = useHref();
  useEffect(() => {
    
    console.log(href);
    let hrefIn = href.split("/");
    setId(hrefIn[hrefIn.length - 1])
    console.log(hrefIn[hrefIn.length - 1]);
  }, [href]);

  useEffect(() => {
    async function getPhotos() {
      console.log(id,'id');
      
      const response = await fetch(
        `http://localhost:3000/photos/?albumId=${id}`
      );
      const data = await response.json();
      setPhotos(data);
      console.log(data,"data");
      
    }
    getPhotos();
  }, [id]);
  return (
    <>
      <h1>Album {id}</h1>
      {/* <img src="/pictures/landscape2.jpg"></img> */}
      <br></br>
      {photos.length > 0 ? (
        photos.map((photo) => <Photo key={photo.id} path={photo.path} />)
      ) : (
        <p>no photos</p>
      )}
    </>
  );
}
// <Photo path='../src/assets/pictures/landscape1.jpg' />
// <Photo path='../src/assets/pictures/landscape25.jpg' />
// <Photo path='../src/assets/pictures/landscape35.jpg' />
// <Photo path='../src/assets/pictures/landscape45.jpg' />
// <Photo path='../src/assets/pictures/landscape55.jpg' />
// <Photo path='../src/assets/pictures/landscape65.jpg' />
// <Photo path='../src/assets/pictures/landscape75.jpg' />
// <Photo path='../src/assets/pictures/landscape85.jpg' />
// <Photo path='../src/assets/pictures/landscape95.jpg' />
// <Photo path='../src/assets/pictures/landscape51.jpg' />
// <Photo path='../src/assets/pictures/landscape11.jpg' />
// <Photo path='../src/assets/pictures/landscape12.jpg' />
