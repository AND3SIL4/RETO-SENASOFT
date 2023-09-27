document.addEventListener("DOMContentLoaded", function () {
    const analyzeButton = document.getElementById("analyzeButton");
    const imageUrlImg = document.getElementById("imageUrl");
    const resultDiv = document.getElementById("result");
    const coordenadasDiv = document.getElementById("coordenadas");

    analyzeButton.addEventListener("click", analyzeImage);
    analyzeButton.addEventListener("click", cargarImagen);

    function cargarImagen() {
        const imagen = document.getElementById("imagenObjeto");
        const link = document.getElementById("imageUrl").value;
        imagen.src = link;
    }

    function analyzeImage() {
        const Url = "URL";
        const key = "KEY   ";
        const imageUrl = imageUrlImg.value;

        if (!imageUrl) {
            resultDiv.innerHTML = "Por favor ingrese una url...";
        }

        const header = new Headers();
        header.append("Prediction-key", key);
        header.append("Content-Type", 'application/json');

        const body = JSON.stringify({ url: imageUrl });

        fetch(
            `${Url}/face/v1.0/detect?returnfaceRecangle&detectionModel=detection_01`,
            {
                method: "POST",
                headers: header,
                body: body,
            }
        )
            .then((response) => response.json())
            .then((result) => {
                console.log(result[0].faceRectangle);

                coordenadasDiv.style.height = `${result[0].faceRectangle.height}px`;
                coordenadasDiv.style.width = `${result[0].faceRectangle.width}px`;
                coordenadasDiv.style.top = `${result[0].faceRectangle.top}px`;
                coordenadasDiv.style.left = `${result[0].faceRectangle.left}px`;
            });
    }
})

// https://i.pinimg.com/originals/37/ea/96/37ea96c0d0ca2480a0084a2bd902bf67.jpg