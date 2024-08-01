import { GoogleGenerativeAI } from "https://esm.run/@google/generative-ai";
import prompt from "./prompt.js";

const genAI = new GoogleGenerativeAI("<your-api-key-here>");

const formEl = document.querySelector("form");
const fileInputEl = document.querySelector("input[type=file]");

// submit action
formEl.addEventListener("submit", async (e) => {
  e.preventDefault();

  // check if image has been uploaded
  if (!fileInputEl.files[0]) {
    return;
  }
  // response
  const data = await run();
  console.log(data);
});

// Converts a File object to a GoogleGenerativeAI.Part object.
async function fileToGenerativePart(file) {
  const base64EncodedDataPromise = new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result.split(",")[1]);
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
}

async function run() {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const imageParts = await Promise.all(
    [...fileInputEl.files].map(fileToGenerativePart)
  );

  const result = await model.generateContent([prompt, ...imageParts]);
  const response = await result.response;
  const text = response.text();
  return text;
}
