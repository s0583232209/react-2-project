import { useHref, useNavigate, useParams } from "react-router-dom";
import Photo from "./Photo";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
export default function Album(props) {
  const navigate = useNavigate();
  const [photos, setPhotos] = useState([]);
  const href = useHref();
  const { register, handleSubmit } = useForm();
  const { id } = useParams();
  const [albumId, setAlbumId] = useState(id);
  const [userId, setUserId] = useState();
  useEffect(() => {
    console.log("in href");

    let hrefIn = href.split("/");
    console.log(hrefIn[hrefIn.length - 2]);
    setUserId(hrefIn[hrefIn.length - 2]);
  }, [href]);
  useEffect(() => {
    console.log("in user id", userId);

    console.log(userId, albumId);
    const sessionId =
      JSON.parse(sessionStorage.getItem("current-user"))?.id || false;
    if (!sessionId) navigate("/login");
    if (userId !== sessionId && userId !== undefined)
      navigate("/access_denied");
  }, [userId]);

  useEffect(() => {
    async function getPhotos() {
      const response = await fetch(
        `http://localhost:3000/photos/?albumId=${albumId}`
      );
      const data = await response.json();
      setPhotos(data);
    }
    getPhotos();
  }, [id]);
  async function deletePhoto(id) {
    const response = await fetch(`http://localhost:3000/photos/${albumId}`, {
      method: "DELETE",
    });
    if (response.ok)
      setPhotos((prev) => prev.filter((photo) => photo.id != id));
    else console.log("error:" + response.status);
  }
  async function changeTitle(id, newTitle) {
    let photo = photos.find((photo) => photo.id == id);
    photo.title = newTitle;
    const response = await fetch(`http://localhost:3000/photos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(photo),
    });
    if (response.ok)
      setPhotos((prev) =>
        prev.map((photo) => {
          if (photo.id == id) photo.title = newTitle;
          return photo;
        })
      );
  }
  async function addPhoto(data) {
    const response = await fetch(`http://localhost:3000/photos`, {
      method: "POST",
      headers: { "content-Type": "application/json" },
      body: JSON.stringify({ albumId: `${albumId}`, path: `${data.URL}` }),
    });
    if (response.ok) {
      const newPhoto = await response.json();
      setPhotos((prev) => [...prev, newPhoto]);
    }
  }

  return (
    <>
      <h1>Album {albumId} component</h1>
      <form onSubmit={handleSubmit(addPhoto)}>
        <label htmlFor="url">Enter URL</label>
        <input
          type="text"
          id="url"
          name="url"
          placeholder="url"
          {...register("URL")}
          required
        ></input>
        <button>Add</button>
      </form>
      {photos.length > 0 ? (
        photos.map((photo) => (
          <Photo
            title={photo.title}
            key={photo.id}
            path={photo.path}
            id={photo.id}
            delete={deletePhoto}
            changeTitle={changeTitle}
          />
        ))
      ) : (
        <p>no photos</p>
      )}
  
    </>
  );
}
