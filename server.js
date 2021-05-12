require('dotenv').config()
const express = require('express');
const fs = require('fs');
const ytdl = require('ytdl-core');
const path = require("path");
const { v4: uuid } = require('uuid');
const { spawn } = require("child_process");
const pingmydyno = require("pingmydyno");
pingmydyno("https://jelfers.herokuapp.com");
const app = express()
const port = 5000

app.use(express.static(path.join(process.cwd(), "./client/build")));
app.use(express.static(path.join(process.cwd(), "./public")));

app.get('/ytdl/video/:_id', (req, res) => {
  const media = `${uuid()}.mp4`;
  ytdl(req.params._id).pipe(fs.createWriteStream(`./public/${media}`)).on("finish", () => {
    res.json({ data: { media: media }, error: null });
  })
  .on("error", (error) => {
    res.json({ data: null, error: error.message });
  });
  
});

app.get('/ytdl/audio/:_id', (req, res) => {
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
    res.json({ data: { media: media }, error: null });
  })
  .on("error", (error) => {
    res.json({ data: null, error: error.message });
  });

});


app.listen(process.env.PORT, () => {
  console.log(`PORT: ${process.env.PORT}`)
})
