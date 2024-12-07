export const sendAudioToWhisper = async (uri: string, groqApiKey: string) => {
  console.log("Groq API Key:", groqApiKey);
  
  try {
    // Create blob from uri
    const response = await fetch(uri);
    const blob = await response.blob();

    const formData = new FormData();
    formData.append("file", blob, "recording.wav");
    formData.append("model", "whisper-large-v3-turbo");
    formData.append("temperature", "0");
    formData.append("response_format", "json");
    // formData.append("language", "en");

    const apiResponse = await fetch(
      "https://api.groq.com/openai/v1/audio/transcriptions",
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${groqApiKey}`,
        },
        body: formData
      }
    );
    
    if (!apiResponse.ok) {
      const errorData = await apiResponse.json();
      throw new Error(`API Error: ${JSON.stringify(errorData)}`);
    }
    
    const data = await apiResponse.json();
    return data.text;
  } catch (error) {
    console.error('Error in sendAudioToWhisper:', error);
    throw error;
  }
};