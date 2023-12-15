const generateForm = document.querySelector(".generate-form");
const imageGallery = document.querySelector(".image-gallery");

const OPENAI_API_KEY = "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";
let isImageGenerating = false;
const updateImageCard = (imgDateArray) => {
    imgDateArray.forEach((imgObject, index) => {
        const imgCard = imageGallery.querySelectorAll(".img-card")[index];
        const imgElement = imgCard.querySelector("img");
        const downloadBtn = imgCard.querySelector(".download-btn")

        const aiGeneratedImg = `data:image/jpeg;base64,${imgObject.b64_json}`;
        imgElement.src = aiGeneratedImg;
        

        imgElement.onload = () => {
            imgCard.classList.remove("loading");
            downloadBtn.setAttribute("href", aiGeneratedImg);
            downloadBtn.setAttribute("download", `${new Date().getTime()}.jpg`);
        }
    });
}

const generateAiImages = async (userPrompt, userImgQuantity) => {
    try {

        const response = await fetch("https://api.openai.com/v1/images/generations", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                prompt: userPrompt,
                n: parseInt(userImgQuantity),
                size: "512x512",
                response_format: "b64_json"
            })
        });

        if(!response.ok) throw new Error("Failed to generate image! Please try again.");

        const { data } = await response.json();
        updateImageCard([...data]);
    } catch (error) {
        alert(error.message);
    } finally {
        isImageGenerating = false;
    }
}

const handleFormSubmission = (e) => {
    e.preventDefault();
    if(isImageGenerating) return;
    isImageGenerating = true;
    

    const userPrompt = e.srcElement[0].value;
    const userImgQuantity = e.srcElement[1].value;


    const imgCardMarkup = Array.from({length: userImgQuantity}, () =>
    `<div class="img-card loading">
    <img src="images/loader.svg" alt="image">
    <a href="#" class="download-btn">
        <img src="images/download.svg" alt="download icon">
    </a>
</div>`
    ).join("");

    imageGallery.innerHTML = imgCardMarkup;
    generateAiImages(userPrompt, userImgQuantity);
}

generateForm.addEventListener("submit", handleFormSubmission);