const express = require('express');
const fetch = require('node-fetch');
require('dotenv').config(); // Load environment variables from .env file

const app = express();

const FLICKR_KEY = process.env.FLICKR_KEY;

app.get('/api/model-photos', async (req, res) => {
  const { model } = req.query;

  try {
    const flickrResponse = await fetch(
      `https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=${FLICKR_KEY}&format=json&nojsoncallback=1&text=model}`
    );
    const flickrData = await flickrResponse.json();
    if (flickrData.photos && flickrData.photos.photo) {
      const photos = flickrData.photos.photo.map(photo => ({
        id: photo.id,
        url: `https://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}.jpg`,
      }));
      res.json(photos);
    } else {
      res.status(404).json({ message: 'No photos found' });
    }
  } catch (error) {
    console.error('Error fetching model photos:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
