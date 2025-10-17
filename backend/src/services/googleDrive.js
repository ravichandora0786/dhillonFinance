// ../services/googleDrive.js
import { google } from "googleapis";
import fs from "fs";
import path from "path";

// ================= CONFIG =================
export const CLIENT_ID = process.env.DRIVE_CLIENT_ID;
export const CLIENT_SECRET = process.env.DRIVE_CLIENT_SECRET;
export const REDIRECT_URI = process.env.DRIVE_REDIRECT_URI;
export const FOLDER_ID = process.env.DRIVE_FOLDER_ID;

// Tokens from environment (instead of file)
export const ACCESS_TOKEN = process.env.DRIVE_ACCESS_TOKEN;
export const REFRESH_TOKEN = process.env.DRIVE_REFRESH_TOKEN;
export const EXPIRY_DATE = process.env.DRIVE_EXPIRY_DATE
  ? Number(process.env.DRIVE_EXPIRY_DATE)
  : null;

export const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

// ====== LEGACY FILE PATH (optional fallback, not used but kept) ======
const TOKEN_PATH = path.join(process.cwd(), "tokens.json");

/**
 * Load tokens — from ENV first, fallback to file if exists
 * @returns {Object|null}
 */
export const loadTokens = () => {
  // Prefer ENV tokens
  if (ACCESS_TOKEN && REFRESH_TOKEN) {
    const tokens = {
      access_token: ACCESS_TOKEN,
      refresh_token: REFRESH_TOKEN,
      expiry_date: EXPIRY_DATE,
    };
    oAuth2Client.setCredentials(tokens);
    return tokens;
  }

  // Fallback: check if tokens.json exists
  if (fs.existsSync(TOKEN_PATH)) {
    const tokens = JSON.parse(fs.readFileSync(TOKEN_PATH));
    oAuth2Client.setCredentials(tokens);
    return tokens;
  }

  //No tokens found
  return null;
};

/**
 * Generate Google OAuth2 login URL
 * @returns {string} authUrl
 */
export const getAuthUrl = () => {
  return oAuth2Client.generateAuthUrl({
    access_type: "offline", // refresh token required
    scope: ["https://www.googleapis.com/auth/drive.file"],
    prompt: "consent", // ensures refresh token returned first time
  });
};

/**
 * Upload file to Google Drive
 * @param {string} filePath - local path to file
 * @param {string} fileName - desired name on Drive
 * @returns {Promise<Object>} uploaded file info
 */
export const uploadToDrive = async (filePath, fileName) => {
  const tokens = loadTokens();
  if (!tokens) throw new Error("Google Drive not authorized.");

  const drive = google.drive({ version: "v3", auth: oAuth2Client });

  const fileMetadata = { name: fileName, parents: [FOLDER_ID] };
  const media = { body: fs.createReadStream(filePath) };

  const response = await drive.files.create({
    requestBody: fileMetadata,
    media,
    fields: "id, name, mimeType",
  });

  return response.data; // { id, name, mimeType }
};

/**
 * Get authenticated Google Drive client with auto-refresh
 * @returns {Promise<import("googleapis").drive_v3.Drive>} drive client
 */
export const getGoogleDriveClient = async () => {
  const tokens = loadTokens();
  if (!tokens) {
    throw new Error("Google Drive not authorized. Please login first.");
  }

  oAuth2Client.setCredentials(tokens);

  // Refresh token if expired
  if (!tokens.expiry_date || tokens.expiry_date < Date.now()) {
    const { credentials } = await oAuth2Client.refreshAccessToken();

    // Keep the old refresh token if Google doesn't return a new one
    const newTokens = {
      ...tokens,
      access_token: credentials.access_token,
      expiry_date: credentials.expiry_date,
      refresh_token: credentials.refresh_token || tokens.refresh_token,
    };

    oAuth2Client.setCredentials(newTokens);

    console.log("Google Drive access token refreshed!");

    // ⚙️ (Optional) If you want to log it for manual .env update:
    console.log(" New Access Token:", credentials.access_token);
    console.log(" New Expiry Date:", credentials.expiry_date);
  }

  return google.drive({ version: "v3", auth: oAuth2Client });
};
