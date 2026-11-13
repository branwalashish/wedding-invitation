# 💍 सुरुचि संग विक्की — Wedding Invitation Website

A mobile-first, aesthetic digital Indian wedding invitation website for **Suruchi Kumari weds Vikky Kumar** on **24 November 2026 (Tuesday)**. Designed specifically for sharing via WhatsApp with family and friends.

---

## ✨ Features

- **Royal Envelope Opening Experience**:
  - Starts with an authentic Indian wedding card / wax-seal envelope with Lord Ganesha motif.
  - Tapping **"निमंत्रण खोलें / Open Invitation"** unlocks audio and smoothly reveals the invitation card.
- **Audio Engine ("Aaj Sajeya" + Shehnai Fallback)**:
  - Supports looping background music from `assets/audio/aaj-sajeya.mp3`.
  - Built-in Web Audio API melodic Shehnai/Santoor synthesizer fallback so music plays immediately even before an MP3 file is added!
  - Floating vinyl record controller with animated sound equalizer waves (Play/Pause/Mute).
  - Automatically pauses when switching tabs or placing phone in pocket, resuming on return.
- **Aesthetic Royal Indian Theme**:
  - Palette: Royal Maroon (`#72111E`), Heritage Gold (`#D4AF37`), Ivory/Cream (`#FFFDF9`), Saffron & Rose.
  - Traditional motifs: Lord Ganesha, Shubh Kalash, Tilak, Haldi Urli, Dholak, Hawan Kund, Mandalas, and Royal Silhouette.
  - Interactive falling rose petals and golden sparkles canvas animation (with toggle).
- **All Ceremonies & Details Included**:
  1. **श्री गणेशाय नमः & Shlokas**: Vakratunda Mahakaya, Mangalam Bhagavan Vishnuh, and the auspicious couplet.
  2. **The Couple & Lineage**: Bride & Groom profile cards with parent names, hometowns, and districts.
  3. **Mangalik Karyakram (Timeline)**:
     - 19.11.2026 (गुरुवार): तिलक
     - 22.11.2026 (रविवार): मड़वा, हल्दी एवं मटकोर
     - 23.11.2026 (सोमवार): संगीत एवं मेंहदी
     - 24.11.2026 (मंगलवार): बारात आगमन, प्रीतिभोज एवं रात्रि में शुभ विवाह
  4. **Live Countdown Timer**: Real-time days, hours, minutes, seconds countdown to 24 November 2026.
  5. **Bal Manuhar**: Heartwarming poem by little sister **श्रृष्टि**.
  6. **Venue & Navigation**:
     - Residence address: गोनावाँ रोड, हरनौत, जिला– नालंदा (बिहार) – 803110.
     - One-click Google Maps directions button & embedded interactive map.
     - One-click "Copy Address" button with visual toast feedback.
  7. **Family & Welcome Committee**: आकांक्षी (श्री पप्पू प्रसाद), स्वागतकर्ता, दर्शनाभिलाषी, एवं प्रेषक.
  8. **Instant RSVP & Contact**:
     - One-click WhatsApp RSVP ("हम आ रहे हैं") with pre-filled message.
     - Tap-to-call buttons for `7480054663` & `7480942905`.
  9. **One-Click "Add to Google Calendar"** for all events.
  10. **Bilingual Support (हिंदी / English)**: Instant one-click language toggle.
  11. **WhatsApp & Social Media Sharing**:
     - Includes Open Graph tags & crisp 1200×630 `og-preview.png` preview card.
     - One-click "Share on WhatsApp" button with pre-written warm text and web link.

---

## 📁 Directory Structure

```
wedding-invitation/
├── index.html                  # Main invitation single-page website
├── music/                      # 🎵 Dedicated music folder (drop aaj-sajeya.mp3 here)
│   └── README.txt
├── css/
│   └── style.css               # Royal Indian wedding styles & animations
├── js/
│   └── main.js                 # Countdown, Audio engine, Petals canvas, RSVP, Calendar
├── assets/
│   ├── audio/
│   │   └── aaj-sajeya.mp3      # Also supported: assets/audio/aaj-sajeya.mp3
│   └── images/
│       ├── ganesha.svg         # Lord Ganesha vector emblem
│       ├── kalash.svg          # Sacred Kalash vector
│       ├── tilak.svg           # Tilak ceremony icon
│       ├── haldi.svg           # Haldi ceremony icon
│       ├── dholak.svg          # Sangeet & Mehndi icon
│       ├── vivah.svg           # Hawan kund & Varmala icon
│       ├── couple-art.svg      # Royal bride & groom illustration
│       ├── mandala.svg         # Traditional decorative mandala
│       ├── og-preview.png      # WhatsApp link preview card (1200×630)
│       └── og-preview.jpg      # WhatsApp link preview card fallback
├── wedding-invitation-plan.md  # Original project plan
└── README.md                   # This documentation
```

---

## 🎵 Adding the "Aaj Sajeya" Song

To play your wedding song:
1. Copy your MP3 file into the **`music/`** folder:
   ```
   wedding-invitation/music/aaj-sajeya.mp3
   ```
   *(You can also place it in `assets/audio/aaj-sajeya.mp3`, or name it `music.mp3` or `song.mp3` — all are supported!)*
2. When guests tap **"निमंत्रण खोलें / Open Invitation"**, the song will play smoothly on loop!
*(If the file is not yet placed, the site automatically plays an auspicious classical Indian Shehnai/Santoor melody so guests always hear festive music).*

---

## 🚀 How to Preview & Test Locally

You can test this website locally with any static web server:

### Option 1: Using Node.js (Built-in)
```powershell
npx serve .
```
or
```powershell
node -e "const http=require('http'),fs=require('fs'),path=require('path');http.createServer((req,res)=>{let f=req.url==='/'?'index.html':req.url.slice(1);fs.readFile(f,(e,d)=>{if(e){res.statusCode=404;res.end('Not found');}else{res.setHeader('Content-Type',f.endsWith('.css')?'text/css':f.endsWith('.js')?'text/javascript':f.endsWith('.svg')?'image/svg+xml':'text/html');res.end(d);}})}).listen(3000,()=>console.log('Open http://localhost:3000'))"
```

### Option 2: Using Python
```powershell
python -m http.server 3000
```

Then open `http://localhost:3000` in your web browser or test on a mobile device.

---

## 🌐 Free 1-Minute Deployment for WhatsApp Sharing

To get a shareable HTTPS link to send to family and friends on WhatsApp:

### A. Netlify Drop (Fastest — 30 seconds, No code needed)
1. Go to [app.netlify.com/drop](https://app.netlify.com/drop).
2. Drag and drop the `wedding-invitation` folder.
3. Your wedding website is instantly live with a free SSL link like `https://suruchi-weds-vikky.netlify.app`.

### B. Vercel
```bash
npx vercel
```

### C. GitHub Pages
1. Push this folder to a GitHub repository (e.g. `wedding-invitation`).
2. Go to **Settings > Pages > Branch: main > Save**.
3. Link will be: `https://<username>.github.io/wedding-invitation/`.

---

## 📱 WhatsApp Link Sharing Recommendation

When sending the link on WhatsApp, use this warm format:

```text
💍 *सुरुचि संग विक्की* के पावन परिणयोत्सव का सस्नेह निमंत्रण! 🌸

॥ श्री गणेशाय नमः ॥
स्नेही स्वजन,
परमपिता परमेश्वर की असीम अनुकम्पा से, सुरुचि कुमारी एवं विक्की कुमार के शुभ विवाह के मांगलिक अवसर पर आप सपरिवार सादर आमंत्रित हैं।

📅 मुख्य दिवस: 24 नवंबर 2026 (मंगलवार)
🏡 स्थान: गोनावाँ रोड, हरनौत, नालंदा (बिहार)

संगीत व संपूर्ण कार्यक्रम सहित डिजिटल निमंत्रण पत्र देखने के लिए नीचे दिए गए लिंक को खोलें:
👉 https://your-domain.netlify.app
```
