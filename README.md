# Race Finish Tracker

A simple, fast race timing app for 5k races. Built with React for easy deployment and cross-platform access.

## Features

- ⏱️ **Real-time timer** - Start/stop race timing
- 🏁 **One-click finish recording** - Press button to record each finisher
- 👤 **Name entry** - Enter runner names immediately or skip for later
- 📊 **Live results** - See finish order and times in real-time
- 💾 **Data persistence** - Results saved locally in browser
- 📱 **Mobile-friendly** - Works on phones, tablets, and computers

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

### Building for Production

```bash
npm run build
```

This creates a `build` folder with the production-ready app.

## How to Use

1. **Start the Race**: Click "Start Race" to begin timing
2. **Record Finishers**: As runners finish, click "Record Finisher" for each one
3. **Enter Names**: Enter runner names when prompted (or skip to add later)
4. **View Results**: See live results with finish order and times
5. **Reset**: Click "Reset Race" to start a new race

## Deployment

The app can be deployed to any static hosting service:
- Netlify
- Vercel
- GitHub Pages
- AWS S3
- Any web server

Just upload the contents of the `build` folder.

## Browser Support

Works on all modern browsers:
- Chrome
- Firefox
- Safari
- Edge

## License

MIT License - feel free to use for your races!
