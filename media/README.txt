Put your photos, voice recordings and any other files for the letters in this folder.

Then point at them from messages.js using the path "media/your-filename":

  { label: "Letter 1",
    text:  `your message here`,
    photo: "media/beach-photo.jpg",
    audio: "media/voice-note.mp3" }

Filenames are case-sensitive on GitHub Pages, so "Photo.JPG" and "photo.jpg"
are different files. Stick to lowercase with no spaces to save yourself trouble.

Photos:  .jpg, .jpeg, .png, .gif  (resize to about 1200px wide first — a
         10MB photo straight off a phone makes the page slow to load)
Audio:   .mp3 or .m4a
