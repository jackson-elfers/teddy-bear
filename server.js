require('dotenv').config()
const express = require('express');
const fs = require('fs');
const ytdl = require('ytdl-core');
const path = require("path");
const { v4: uuid } = require('uuid');
const { spawn } = require("child_process");
const pingmydyno = require("pingmydyno");
const secure = require("express-force-https");
const app = express();

const port = 5000

app.use(express.static(path.join(process.cwd(), "./client/build")));
app.use(express.static(path.join(process.cwd(), "./public")));
app.use(secure);
pingmydyno("https://jelfers.herokuapp.com");

app.get('/ytdl/video/:_id', (req, res) => {
  const io = req.app.get('socketio');
  const media = `${uuid()}.mp4`;
  ytdl(req.params._id).pipe(fs.createWriteStream(`./public/${media}`)).on("finish", () => {
    io.emit(`/ready/${media}`, { data: {}, error: null });
  })
  .on("error", (error) => {
    io.emit(`/ready/${media}`, { data: {}, error: error.message });
  });
  res.json({ data: { media: media }, error: null });
});

app.get('/ytdl/audio/:_id', (req, res) => {
  const io = req.app.get('socketio');
  const media = `${uuid()}.mp3`;
  const ffmpeg = spawn("ffmpeg", [
        "-f",
        "mp4",
        "-i",
        "pipe:",
        "-f",
        "mp3",
        "pipe:"
  ]);
  ytdl(req.params._id).pipe(ffmpeg.stdin);
  ffmpeg.stdout.pipe(fs.createWriteStream(`./public/${media}`)).on("finish", () => {
    io.emit(`/ready/${media}`, { data: {}, error: null });
  })
  .on("error", (error) => {
    io.emit(`/ready/${media}`, { data: {}, error: error.message });
  });
  res.json({ data: { media: media }, error: null });
});


const server = app.listen(process.env.PORT, () => {
  console.log(`PORT: ${process.env.PORT}`)
})

// sockets
const io = require('socket.io')(server);
app.set('socketio', io);