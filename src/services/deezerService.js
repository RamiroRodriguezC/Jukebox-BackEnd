const axios = require("axios");

const BASE_URL = "https://api.deezer.com";

async function fetch(path) {
  const { data } = await axios.get(`${BASE_URL}${path}`);
  if (data.error) {
    throw new Error(`Deezer API error: ${data.error.message}`);
  }
  return data;
}

function searchArtists(q, limit = 25, index = 0) {
  return fetch(`/search/artist?q=${encodeURIComponent(q)}&limit=${limit}&index=${index}`);
}

function searchAlbums(q, limit = 25, index = 0) {
  return fetch(`/search/album?q=${encodeURIComponent(q)}&limit=${limit}&index=${index}`);
}

function searchTracks(q, limit = 25, index = 0) {
  return fetch(`/search/track?q=${encodeURIComponent(q)}&limit=${limit}&index=${index}`);
}

function getArtist(id) {
  return fetch(`/artist/${id}`);
}

function getArtistAlbums(id, limit = 50, index = 0) {
  return fetch(`/artist/${id}/albums?limit=${limit}&index=${index}`);
}

function getArtistTopTracks(id, limit = 50, index = 0) {
  return fetch(`/artist/${id}/top?limit=${limit}&index=${index}`);
}

function getAlbum(id) {
  return fetch(`/album/${id}`);
}

function getAlbumTracks(id, limit = 50, index = 0) {
  return fetch(`/album/${id}/tracks?limit=${limit}&index=${index}`);
}

function getTrack(id) {
  return fetch(`/track/${id}`);
}

function getGlobalChart() {
  return fetch(`/chart/0`);
}

module.exports = {
  searchArtists,
  searchAlbums,
  searchTracks,
  getArtist,
  getArtistAlbums,
  getArtistTopTracks,
  getAlbum,
  getAlbumTracks,
  getTrack,
  getGlobalChart,
};
