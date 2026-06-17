/**
 * Music API Service
 * Combines Deezer (for Charts/Playlists via JSONP) and iTunes (for Search)
 * to bypass Deezer's aggressive regional search blocking.
 */

const DEEZER_BASE_URL = 'https://api.deezer.com';

const fetchJsonp = (url) => {
  return new Promise((resolve, reject) => {
    const callbackName = 'deezer_cb_' + Math.round(1000000 * Math.random());
    
    // Create global callback
    window[callbackName] = (data) => {
      resolve(data);
      cleanup();
    };

    const script = document.createElement('script');
    script.src = url + (url.includes('?') ? '&' : '?') + 'output=jsonp&callback=' + callbackName;
    
    const cleanup = () => {
      if (script.parentNode) script.parentNode.removeChild(script);
      delete window[callbackName];
    };

    script.onerror = () => {
      reject(new Error('JSONP request failed'));
      cleanup();
    };

    document.body.appendChild(script);
  });
};

export const deezerApi = {
  /**
   * Search for tracks
   * Uses iTunes API as it does not geo-block search results like Deezer does,
   * but maps the data to match the exact Deezer schema our UI expects.
   * @param {string} query 
   * @returns {Promise<Array>} Array of track objects
   */
  async searchTracks(query) {
    if (!query) return [];
    try {
      const response = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(query)}&entity=song&limit=30`);
      if (!response.ok) throw new Error('Search failed');
      const data = await response.json();
      
      // Map iTunes schema -> Deezer schema
      return data.results.map(track => ({
        id: track.trackId,
        title: track.trackName,
        artist: { name: track.artistName },
        album: { 
          title: track.collectionName, 
          // Upgrade 100x100 resolution to 300x300 for premium UI
          cover_medium: track.artworkUrl100 ? track.artworkUrl100.replace('100x100bb', '300x300bb') : '' 
        },
        preview: track.previewUrl,
        duration: Math.floor((track.trackTimeMillis || 0) / 1000)
      }));
    } catch (error) {
      console.error('API Search Error:', error);
      throw error;
    }
  },

  /**
   * Fetch the top charts from Deezer (Tracks, Albums, Playlists)
   */
  async getCharts() {
    try {
      const data = await fetchJsonp(`${DEEZER_BASE_URL}/chart/0`);
      if (data.error) throw new Error(data.error.message || 'API Error');
      return data;
    } catch (error) {
      console.error('Deezer API Chart Error:', error);
      throw error;
    }
  },

  /**
   * Fetch details for a specific playlist from Deezer
   */
  async getPlaylist(id) {
    try {
      const data = await fetchJsonp(`${DEEZER_BASE_URL}/playlist/${id}`);
      if (data.error) throw new Error(data.error.message || 'API Error');
      return data;
    } catch (error) {
      console.error('Deezer API Playlist Error:', error);
      throw error;
    }
  }
};
