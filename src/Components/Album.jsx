import { useHref, useNavigate, useParams } from "react-router-dom";
import Photo from "./Photo";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
export default function Album() {
  const navigate = useNavigate();
  const [photos, setPhotos] = useState([]);
  const href = useHref();
  const { register, handleSubmit } = useForm();
  const { id } = useParams();
  const [albumId, setAlbumId] = useState(id);
  const [userId, setUserId] = useState();
  const [visibleCount, setVisibleCount] = useState(JSON.parse(localStorage.getItem('visibleCountAlbum'))||8);
  useEffect(()=>{ 
    async function checkAccess(){
      const response = await fetch(`http://localhost:3000/albums/${albumId}?userId=${userId}`)
      console.log(response);
      
      if(!response.ok)
        navigate('/access_denied')
    }
    checkAccess()
  },[])
  useEffect(() => {
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
    localStorage.setItem("visibleCountAlbum", JSON.stringify(visibleCount));
  },[visibleCount]);
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
    const response = await fetch(`http://localhost:3000/photos/${id}`, {
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
  const visiblePhotos = photos.slice(0, visibleCount);
  console.log('Total photos:', photos.length);
  console.log('Visible count:', visibleCount);
  console.log('Should show button:', visibleCount < photos.length);

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
      {visiblePhotos.length > 0 ? (
        visiblePhotos.map((photo) => (
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
      {/* Debug info */}
      <p style={{ fontSize: '12px', color: '#666', textAlign: 'center' }}>
        Showing {visiblePhotos.length} of {photos.length} photos
      </p>
      
      {visibleCount < photos.length && (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          margin: '2rem 0'
        }}>
          <button
            onClick={() => {
              setVisibleCount(visibleCount + 10);
            }}
            style={{
              backgroundColor: '#a8dadc',
              color: '#064635',
              border: 'none',
              borderRadius: '6px',
              padding: '0.8rem 2rem',
              fontSize: '1rem',
              cursor: 'pointer',
              fontWeight: 'bold',
              transition: '0.2s',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = '#90c9d0';
              e.target.style.transform = 'translateY(-1px)';
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = '#a8dadc';
              e.target.style.transform = 'translateY(0)';
            }}
          >
            📷 Show More Photos
          </button>
        </div>
      )}
    </>
  );
}
