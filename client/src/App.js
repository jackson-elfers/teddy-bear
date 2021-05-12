import './styles';
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import getYouTubeID from "get-youtube-id";
const { v4: uuid } = require('uuid');

function Download(props) {
  const [id, setId] = useState(uuid());
  const [loading, setLoading] = useState(false);
  const [complete, setComplete] = useState(false);
  const [data, setData] = useState({});

  async function download(e) {
    e.preventDefault();
    const form = document.getElementById(`form${id}`);
    setLoading(true);
    try {
      const response = await axios.get(`${props.api_url}/${getYouTubeID(form.media_id.value)}`);
      if (response.data.error) {
        throw new Error(response.data.error.detail);
      }
      setLoading(false);
      setComplete(true);
      setData(response.data.data);
    }
    catch(e) {
      alert(e.message);
    }
  }

  if(loading) {
    return(
    <div>
      <img src={"./bonfire.gif"} alt="bonfire loading spinner." />
    </div>
    );
  }

  if(complete) {
    return(
    <div>
    <div className = "box">
      <a href = {`/${data.media}`} download>
       <p>Download Ready! Click to Begin...</p>
      </a>
    </div>
    <button onClick = {() => { setData({}); setComplete(false); }}>Discard</button>
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
      <Download api_url={`${process.env.REACT_APP_API}/ytdl/video`}/>
      <h3>Download YouTube Music (mp3):</h3>
      <Download api_url={`${process.env.REACT_APP_API}/ytdl/audio`}/>
      <a href="https://github.com/jackson-elfers/teddy-bear">
        Issues? Notify Jackson the Creator
      </a>
    </div>
  );
}

export default App;
