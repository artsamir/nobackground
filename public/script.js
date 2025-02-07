const imageUpload = document.getElementById('imageUpload');
const removeButton = document.getElementById('removeButton');
const imagePreview = document.getElementById('imagePreview');
const processingAnimation = document.getElementById('processingAnimation');

imageUpload.addEventListener('change', (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
        const img = document.createElement('img');
        img.src = e.target.result;
        img.style.maxWidth = '100%';
        img.style.maxHeight = '100%';
        imagePreview.innerHTML = ''; // Clear previous preview
        imagePreview.appendChild(img);
    };
    reader.readAsDataURL(file);
});

removeButton.addEventListener('click', async () => {
    const file = imageUpload.files[0];
    if (!file) {
        alert("Please select an image.");
        return;
    }

    const formData = new FormData();
    formData.append('image', file);

    // ✅ Show animation **inside** the preview box
    processingAnimation.style.display = 'flex';

    // Hide any previous image while processing
    imagePreview.querySelector('img')?.remove();

    // Simulate a delay of 3 seconds before making the request
    setTimeout(async () => {
        try {
            const response = await fetch('https://nobackground-kms6.onrender.com/remove-background', { // ✅ Update this
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error('Failed to process image.');
            }

            const blob = await response.blob();
            const newImg = document.createElement('img');
            newImg.src = URL.createObjectURL(blob);
            newImg.style.maxWidth = '100%';
            newImg.style.maxHeight = '100%';

            // ✅ Hide animation and show the processed image
            processingAnimation.style.display = 'none';
            imagePreview.innerHTML = ''; // Clear previous image
            imagePreview.appendChild(newImg);
        } catch (error) {
            console.error("Error:", error);
            alert("Error removing background.");
            processingAnimation.style.display = 'none';
        }
    }, 3000); // ✅ Delay for 3 seconds
});
