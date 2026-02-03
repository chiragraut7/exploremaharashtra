export const fetchMHData = async (endpoint: string) => {
  try {
    const response = await fetch(endpoint, {
      headers: {
        // 🛡️ Sends the public version of the key for the handshake
        'x-admin-token': process.env.NEXT_PUBLIC_ADMIN_SECRET_KEY || ''
      }
    });

    const result = await response.json();

    // If the API failed or returned 401, return an empty array
    if (!response.ok || !result.success) {
      console.error(`Handshake failed for ${endpoint}:`, result.message);
      return [];
    }

    return result.data || [];
  } catch (error) {
    console.error(`Network error on ${endpoint}:`, error);
    return [];
  }
};