import express from "express";
import axios from "axios";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();

// Configure CORS before any routes
app.use(cors({
  origin: ["http://localhost:8080", "http://localhost:5173", "http://localhost:3000"],
  methods: ['GET', 'POST'],
  credentials: true
}));

app.use(express.json());

// Nebius AI Studio API Key from .env
const NEBIUS_API_KEY = process.env.NEBIUS_API_KEY;

if (!NEBIUS_API_KEY) {
  console.error("ERROR: NEBIUS_API_KEY is not set in environment variables!");
}

app.post("/api/generate-image", async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required" });
  }

  try {
    // Verify API key is present
    if (!NEBIUS_API_KEY) {
      throw new Error("Nebius API key is not configured");
    }

    // High-quality positive prompts
    const positivePrompts = "masterpiece, best quality, ultra sharp, professional lighting, perfect composition, highly detailed";
    
    // Comprehensive negative prompts for better quality
    const negativePrompts = [
      // Quality issues
      "low quality, worst quality, jpeg artifacts, blurry, lowres",
      // Anatomical issues
      "bad anatomy, bad proportions, gross proportions, long neck, deformed, disfigured, mutated",
      // Limb issues
      "extra arms, extra legs, extra limbs, missing arms, missing legs, malformed limbs",
      // Hand and finger issues
      "poorly drawn hands, mutated hands, extra fingers, fused fingers, too many fingers",
      // Face issues
      "poorly drawn face, cloned face, ugly, dehydrated",
      // Composition issues
      "cropped, out of frame, cut off, duplicate, error",
      // Unwanted elements
      "watermark, signature, text, username, morbid",
      // Advanced quality issues
      "pixelated, compression artifacts, oversaturated, unnatural colors, artificial looking, poor lighting, bad shadows, noise, grain, unclear details, improper shading"
    ].join(", ");

    const finalPrompt = `${prompt}, ${positivePrompts}`;
    
    console.log("Making request to Nebius AI Studio with prompt:", finalPrompt);

    try {
      const response = await axios({
        method: 'post',
        url: 'https://api.studio.nebius.com/v1/images/generations',
        data: {
          model: "black-forest-labs/flux-schnell",
          prompt: finalPrompt,
          negative_prompt: negativePrompts,
          response_format: "b64_json",
          response_extension: "png",
          width: 1024,
          height: 1024,
          num_inference_steps: 4,
          seed: -1
        },
        headers: { 
          'Authorization': `Bearer ${NEBIUS_API_KEY}`,
          'Content-Type': 'application/json'
        },
        validateStatus: function (status) {
          return status >= 200 && status < 500;
        }
      });

      if (response.status !== 200) {
        console.error("Non-200 response from Nebius AI Studio:", response.data);
        throw new Error(`Nebius AI Studio returned status ${response.status}`);
      }

      if (!response.data || !response.data.data || !response.data.data[0]?.b64_json) {
        console.error("Invalid response from Nebius AI Studio:", response.data);
        throw new Error("Invalid response from image generation service");
      }

      // Convert base64 to URL
      const imageUrl = `data:image/png;base64,${response.data.data[0].b64_json}`;

      console.log("Successfully generated image");

      return res.json({ imageUrl });
    } catch (apiError) {
      console.error("API call failed:", apiError.message);
      if (apiError.response) {
        console.error("API response:", apiError.response.data);
      }
      throw apiError;
    }

  } catch (error) {
    console.error("Detailed image generation error:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      headers: error.response?.headers,
    });

    // Send a more informative error message to the client
    return res.status(500).json({ 
      error: "Failed to generate image", 
      details: error.response?.data?.error || error.message 
    });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Nebius API Key ${NEBIUS_API_KEY ? 'is' : 'is NOT'} configured`);
});