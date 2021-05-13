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

pingmydyno("https://jelfers.herokuapp.com");

app.get('/ytdl/video/:_id/:file_name', (req, res) => {
  ytdl(req.params._id).pipe(res);
});

app.get('/ytdl/audio/:_id/:file_name', (req, res) => {
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
  ffmpeg.stdout.pipe(res);
});

app.listen(process.env.PORT, () => {
  app.use(express.static(path.join(process.cwd(), "./client/build")));
  app.use(express.static(path.join(process.cwd(), "./public")));
  app.use(secure);
  console.log(`PORT: ${process.env.PORT}`);
});