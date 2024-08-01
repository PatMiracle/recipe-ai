import prompt from "./prompt";

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_API_KEY);

const formEl = document.querySelector("form");
const fileInputEl = document.querySelector("input[type=file]");
const loader = document.querySelector(".loader");

formEl.addEventListener("submit", async (e) => {
  e.preventDefault();

  // check if image has been uploaded
  if (!fileInputEl.files[0]) {
    return;
  }

  loader.classList.remove("hidden");

  const text = await run();
  displayResult(text);
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

function displayResult(text) {
  loader.classList.add("hidden");

  const obj = JSON.parse(text);
  const result = document.getElementById("result");
  if (obj.error) {
    result.innerHTML = `${obj.error}`;
  } else {
    const { name, ingredients, steps, healthBenefits } = obj;
    result.innerHTML = `
    <h2>${name}</h2>
    <h4>Ingredients:</h4>
    <ol>
        ${ingredients
          .map((text) => {
            return `<li>${text}</li>`;
          })
          .join(" ")}
    </ol>
    <h4>Steps:</h4>
     <ol>
        ${steps
          .map((text) => {
            return `<li>${text}</li>`;
          })
          .join(" ")}
    </ol>
    ${
      healthBenefits &&
      `<h4>Health Benefits:</h4>
        <ol>
            ${healthBenefits
              .map((text) => {
                return `<li>${text}</li>`;
              })
              .join(" ")}
        </ol>`
    }
    `;
  }
}
