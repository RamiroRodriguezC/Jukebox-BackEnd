function normalizeArtist(raw) {
  return {
    _id: raw.id,
    nombre: raw.name,
    url_foto: raw.picture_medium || raw.picture || "",
    pais: raw.country || "",
  };
}

function normalizeAlbum(raw) {
  return {
    _id: raw.id,
    titulo: raw.title,
    url_portada: raw.cover_medium || raw.cover || "",
    anio: raw.release_date ? raw.release_date.split("-")[0] : "",
    autores: raw.artist ? [{ _id: raw.artist.id, nombre: raw.artist.name }] : [],
    generos: raw.genres?.data?.map(g => g.name) || [],
    cantReseñas: 0,
    promedioRating: 0,
  };
}

function normalizeAlbumWithTracks(raw, tracksRaw) {
  const album = normalizeAlbum(raw);
  album.canciones = (tracksRaw?.data || tracksRaw || []).map(t => ({
    ...normalizeTrack(t),
    generos: album.generos,
  }));
  return album;
}

function normalizeTrack(raw) {
  return {
    _id: raw.id,
    titulo: raw.title,
    duracion: raw.duration,
    preview: raw.preview || "",
    autores: raw.artist ? [{ _id: raw.artist.id, nombre: raw.artist.name }] : [],
    generos: [],
    album: raw.album
      ? { _id: raw.album.id, titulo: raw.album.title, url_portada: raw.album.cover_medium || "" }
      : null,
  };
}

function normalizeArtistList(list) {
  return (list?.data || list || []).map(normalizeArtist);
}

function normalizeAlbumList(list) {
  return (list?.data || list || []).map(normalizeAlbum);
}

function normalizeTrackList(list) {
  return (list?.data || list || []).map(normalizeTrack);
}

module.exports = {
  normalizeArtist,
  normalizeAlbum,
  normalizeAlbumWithTracks,
  normalizeTrack,
  normalizeArtistList,
  normalizeAlbumList,
  normalizeTrackList,
};
