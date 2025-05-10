import axios from "axios";

interface ImageGenerationOptions {
  prompt: string;
  image_generator_version?: "standard" | "hd" | "genius";
  negative_prompt?: string;
}

const API_BASE_URL = "http://localhost:5000/api";

export const generateImage = async ({
  prompt,
  image_generator_version = "standard",
  negative_prompt
}: ImageGenerationOptions) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/generate-image`, {
      prompt,
      image_generator_version,
      negative_prompt
    });
    return response.data.imageUrl;
  } catch (error) {
    console.error("Error generating image:", error);
    throw new Error("Failed to generate image. Please try again.");
  }
};
