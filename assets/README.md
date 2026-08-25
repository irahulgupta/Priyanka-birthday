# 📂 assets — drop your files in here

Use **exactly these file names** and the website picks them up automatically.
Anything you leave out is handled gracefully: no broken images, no errors.

| File name             | What it is                        | Required? |
| --------------------- | --------------------------------- | --------- |
| `friend.jpg`          | Main round portrait in the hero   | Recommended (a placeholder shows without it) |
| `photo1.jpg`          | Memory gallery photo 1            | Optional  |
| `photo2.jpg`          | Memory gallery photo 2            | Optional  |
| `photo3.jpg`          | Memory gallery photo 3            | Optional  |
| `photo4.jpg`          | Memory gallery photo 4            | Optional  |
| `birthday-video.mp4`  | The surprise video                | Optional (a friendly note shows instead) |
| `birthday-music.mp3`  | Background song                   | Optional (music button says "No music file") |

## Tips

- **friend.jpg** looks best square-ish (e.g. 800×800). It is cropped to a circle.
- **Gallery photos** are cropped to 4:3, so keep the subject near the centre.
- **Video** must be `.mp4` with H.264 video + AAC audio for browsers to play it.
- Keep the video under ~50 MB so it loads quickly.
- Filenames are case sensitive on some systems. Use lowercase exactly as above.
- Want different names or more gallery photos? Edit `birthdayConfig` at the top
  of `../script.js`.
