import React, { useEffect, useState } from "react";
import "./styles.css";
import corazon from "./corazon.svg";

import { firestore, loginConGoogle, auth, logout } from "./firebase";

export default function App() {
  const [tweets, setTweets] = useState([]);
  const [tweet, setTweet] = useState({
    tweet: "",
    autor: "",
    uid: "",
    mail: ""
  });
  const [user, setUser] = useState(null);

  useEffect(() => {
    const desuscribir = firestore
      .collection("tweets")
      .onSnapshot((snapshot) => {
        const tweets = snapshot.docs.map((doc) => {
          return {
            tweet: doc.data().tweet,
            autor: doc.data().autor,
            id: doc.id,
            likes: doc.data().likes,
            email: doc.data().email,
            uid: doc.data().uid
          };
        });
        setTweets(tweets);
      });

    auth.onAuthStateChanged((user) => {
      setUser(user);
      console.log(user);
    });
    return () => desuscribir();
  }, []);

  const handleChange = (e) => {
    let nuevoTweet = {
      tweet: e.target.value,
      uid: user.uid,
      email: user.email,
      autor: user.displayName
    };
    setTweet(nuevoTweet);
  };

  const sendTweet = (e) => {
    e.preventDefault();
    // enviamos el tweet a la colección
    firestore.collection("tweets").add(tweet);
  };

  const deleteTweet = (id) => {
    // borramos el tweet en firebase
    firestore.doc(`tweets/${id}`).delete();
  };

  const likeTweet = (id, likes) => {
    if (!likes) likes = 0;
    // actualizamos el tweet en firebase
    firestore.doc(`tweets/${id}`).update({ likes: likes + 1 });
  };

  return (
    <div className="App">
      {user ? (
        <>
          <div className="user-profile">
            <img className="user-profile-pic" src={user.photoURL} alt="" />
            <p>¡Hola {user.displayName}!</p>
            <button onClick={logout}>Log out</button>
          </div>
        </>
      ) : (
        <button className="login-btn" onClick={loginConGoogle}>
          Login con google
        </button>
      )}
      <form className="formulario">
        <textarea
          name="tweet"
          onChange={handleChange}
          value={tweet.tweet}
          cols="30"
          rows="5"
          placeholder="escribe un tweet..."
        />
        <div className="input-group">
          <input
            name="autor"
            onChange={handleChange}
            //si hay un usuario logeado, que muestre el autor
            value={tweet.autor}
            type="text"
            placeholder="persona autora"
          />
          <button onClick={sendTweet}>Enviar tweet</button>
        </div>
      </form>
      <h1>Tweets:</h1>
      {tweets.map((tweet) => {
        return (
          <div className="tweet-container">
            <div className="tweet" key={tweet.id}>
              <div className="tweet-info">
                <p>{tweet.tweet}</p>
                <p className="tweet-autor">por: {tweet.autor}</p>
                <p className="tweet-autor" >{tweet.email}</p>
              </div>
              <div className="acciones">
                <span onClick={() => deleteTweet(tweet.id)} className="delete">
                  borrar
                </span>
                <span
                  onClick={() => likeTweet(tweet.id, tweet.likes)}
                  className="likes"
                >
                  <img height="13px" src={corazon} alt="" />
                  <span>{tweet.likes ? tweet.likes : 0}</span>
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
