import Photo from "./Photo";
import { useState, useEffect } from "react";
export default function Album(props) {
  const [photos, setPhotos] = useState([]);
  useEffect(() => {
    async function getPhotos() {
      console.log(props.id, 'in useEffect of album');
      const response = await fetch(
        `http://localhost:3000/photos/?albumId=${props.id}`
      );
      const data = await response.json();
      console.log(data, props.id);
      setPhotos(data);
    }
    getPhotos();
  }, []);
  return (
    <>
      <h1>Album {props.id}</h1>
      {photos.length > 0 ? (
        photos.map((photo) => <Photo key={photo.id} path={photo.path_url} />)
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
