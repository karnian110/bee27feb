/**
 * Utility functions for handling image URLs safely
 */

const DEFAULT_PLACEHOLDER = "https://via.placeholder.com/150?text=No+Image";

/**
 * Get a safe profile picture URL with fallback
 * @param {string} profilePicture - The profile picture URL
 * @param {string} fallback - Optional fallback URL
 * @returns {string} Safe image URL
 */
export function getSafeProfilePicture(profilePicture, fallback = DEFAULT_PLACEHOLDER) {
  if (!profilePicture || typeof profilePicture !== "string") {
    return fallback;
  }

  // If it's a valid URL, return it
  try {
    new URL(profilePicture);
    return profilePicture;
  } catch {
    return fallback;
  }
}

/**
 * Check if a URL is safe to use
 * @param {string} url - The URL to check
 * @returns {boolean} Whether the URL is valid
 */
export function isValidImageUrl(url) {
  if (!url || typeof url !== "string") {
    return false;
  }

  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Get image with error handling for Next.js Image component
 * @param {string} src - Image source URL
 * @param {Function} onError - Optional error callback
 * @returns {object} Image props object
 */
export function getImageProps(src, onError) {
  return {
    src: getSafeProfilePicture(src),
    alt: "User profile picture",
    onError: (e) => {
      // Fallback to placeholder on error
      if (e.target) {
        e.target.src = DEFAULT_PLACEHOLDER;
      }
      if (typeof onError === "function") {
        onError(e);
      }
    },
  };
}
