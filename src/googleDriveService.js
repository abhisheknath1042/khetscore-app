const CLIENT_ID = '922551789022-kg9s2vb0nj61isej2deh838t9p3vjb96.apps.googleusercontent.com';
// eslint-disable-next-line no-unused-vars
const API_KEY = 'AIzaSyCiEfJYOFG_0pKJ11hYXtNnZ9F8OJHmCzE'; // Optional but recommended for public API calls
const DISCOVERY_DOCS = ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'];
const SCOPES = 'https://www.googleapis.com/auth/drive.file';

let tokenClient;
let gapiInited = false;
let gisInited = false;

// Load the Google API client library
export const loadGoogleApi = () => {
  return new Promise((resolve, reject) => {
    // Load GAPI
    const gapiScript = document.createElement('script');
    gapiScript.src = 'https://apis.google.com/js/api.js';
    gapiScript.onload = () => {
      window.gapi.load('client', async () => {
        try {
          await window.gapi.client.init({
            discoveryDocs: DISCOVERY_DOCS,
          });
          gapiInited = true;
          maybeResolve();
        } catch (err) {
          reject(err);
        }
      });
    };
    gapiScript.onerror = reject;
    document.body.appendChild(gapiScript);

    // Load GIS (Google Identity Services)
    const gisScript = document.createElement('script');
    gisScript.src = 'https://accounts.google.com/gsi/client';
    gisScript.onload = () => {
      tokenClient = window.google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPES,
        callback: '', // Will be set later
      });
      gisInited = true;
      maybeResolve();
    };
    gisScript.onerror = reject;
    document.body.appendChild(gisScript);

    function maybeResolve() {
      if (gapiInited && gisInited) {
        resolve();
      }
    }
  });
};

// Request access token
const getAccessToken = () => {
  return new Promise((resolve, reject) => {
    tokenClient.callback = (response) => {
      if (response.error) {
        reject(response);
      } else {
        resolve(response.access_token);
      }
    };
    
    if (window.gapi.client.getToken() === null) {
      // Prompt user to select account and consent
      tokenClient.requestAccessToken({ prompt: 'consent' });
    } else {
      // Skip consent for existing session
      tokenClient.requestAccessToken({ prompt: '' });
    }
  });
};

// Upload file to Google Drive
export const uploadToGoogleDrive = async (csvContent, fileName) => {
  try {
    // Get access token
    await getAccessToken();
    
    const file = new Blob([csvContent], { type: 'text/csv' });
    
    const metadata = {
      name: fileName,
      mimeType: 'text/csv',
    };

    const form = new FormData();
    form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
    form.append('file', file);

    const response = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${window.gapi.client.getToken().access_token}`,
      },
      body: form,
    });

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    const result = await response.json();
    return {
      success: true,
      fileId: result.id,
      fileName: result.name,
      webViewLink: `https://drive.google.com/file/d/${result.id}/view`
    };
  } catch (error) {
    console.error('Google Drive upload error:', error);
    throw error;
  }
};