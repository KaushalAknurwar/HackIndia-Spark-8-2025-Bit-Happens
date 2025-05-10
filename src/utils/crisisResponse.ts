// Crisis keywords to detect emergency situations
const crisisKeywords = [
  "suicidal",
  "can't do this anymore",
  "kill myself",
  "want to die",
  "end it all",
  "no reason to live",
  "I'm done"
];

// Check if a message contains crisis keywords
export const isCrisisMessage = (text: string): boolean => {
  return crisisKeywords.some((kw) => text.toLowerCase().includes(kw.toLowerCase()));
};

// Get user's current location
export const getCurrentLocation = (): Promise<{ lat: number; lng: number }> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      },
      (error) => {
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    );
  });
};

// Send crisis alert via API
export const sendCrisisAlert = async (username: string, coords: { lat: number; lng: number }): Promise<{ success: boolean; message: string }> => {
  try {
    console.log('Sending crisis alert with coordinates:', coords);
    
    const response = await fetch('http://localhost:3001/api/crisis-alert', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        latitude: coords.lat,
        longitude: coords.lng,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to send crisis alert');
    }

    console.log("✅ Crisis alert sent successfully:", data);
    return {
      success: true,
      message: 'Help is on the way. Please stay with us while we connect you with support.'
    };
  } catch (err) {
    console.error("❌ Failed to send crisis alert:", err);
    return {
      success: false,
      message: 'We\'re having trouble sending your location. Please try again or contact emergency services directly.'
    };
  }
};

// Handle crisis situation
export const handleCrisisSituation = async (username: string): Promise<{ success: boolean; message: string }> => {
  try {
    const coords = await getCurrentLocation();
    return await sendCrisisAlert(username, coords);
  } catch (error) {
    console.error("❌ Crisis handling failed:", error);
    return {
      success: false,
      message: 'We\'re having trouble getting your location. Please try again or contact emergency services directly.'
    };
  }
}; 