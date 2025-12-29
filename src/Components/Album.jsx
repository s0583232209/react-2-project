import Photo from "./Photo";
import { useState, useEffect } from "react";
export default function Album(props) {
  const [photos, setPhotos] = useState([]);
  const [show, setShow] = useState(false);
  useEffect(() => {
    async function getPhotos() {
      console.log(props.id);
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
      <button
        onClick={() => {
          setShow(!show);
        }}
      >
        Show Album #1
      </button>
      {photos.length > 0 && show ? (
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
