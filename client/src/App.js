import './styles';
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import getYouTubeID from "get-youtube-id";
import io from "socket.io-client";
const socket = io();
const { v4: uuid } = require('uuid');
const heartflakes = require('magic-heartflakes');
heartflakes();

function Download(props) {
  const [id, setId] = useState(uuid());
  const [ready, setReady] = useState(false);
  const [data, setData] = useState({});

  async function download(e) {
    e.preventDefault();
    const form = document.getElementById(`form${id}`);
    setData({ url: `${props.api_url}/${getYouTubeID(form.media_id.value)}/${uuid()}.${props.file_type}` });
    setReady(true);
  }

  if(ready) {
    return(
    <div>
    <div className = "box">
      <a href = {`${data.url}`} download>
       <p>Download Ready! Click to Begin...</p>
      </a>
    </div>
    <button onClick = {() => { setData({}); setReady(false); }}>Discard</button>
    </div>
    );
  }

  return (
  <div>
    <form id = {`form${id}`}>
          <textarea
            type="text"
            name="media_id"
            placeholder="https://www.youtube.com/watch?v=A02s8omM_hI"
          />
          <input
            onClick={download}
            type="button"
            value="Download"
          />
      </form>
  </div>
  );
}

function App() {
  return (
    <div className="App">
      <img src={"./197b365922d1ea3aa1a932ff9bbda4a6.png"} alt="YouTube logo." />
      <h3>Download YouTube Video (mp4):</h3>
      <Download api_url={`${process.env.REACT_APP_API}/ytdl/video`} file_type = "mp4"/>
      <h3>Download YouTube Music (mp3):</h3>
      <Download api_url={`${process.env.REACT_APP_API}/ytdl/audio`} file_type = "mp3"/>
      <a href="https://github.com/jackson-elfers/teddy-bear">
        Issues? Notify Jackson
      </a>
    </div>
  );
}

export default App;
