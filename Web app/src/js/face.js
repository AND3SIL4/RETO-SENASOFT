document.addEventListener("DOMContentLoaded", function () {
    const analyzeButton = document.getElementById("analyzeButton");
    const imageUrlImg1 = document.getElementById("input-imagen-1");
    const imageUrlImg2 = document.getElementById("input-imagen-2");
    const imageUrlImg3 = document.getElementById("input-imagen-3");
    const resultDiv = document.getElementById("result");
    const coordenadasDiv = document.getElementById("coordenadas");

    analyzeButton.addEventListener("click", analyzeImage);
    analyzeButton.addEventListener("click", cargarImagen);

    function cargarImagen() {
        const imagen = document.getElementById("imagenObjeto");
        const link = document.getElementById("input-imagen-1").value;
        imagen.src = link;
    }

    function analyzeImage() {
        const Url = "https://democlasificacionytraduccion.cognitiveservices.azure.com/";
        const key = "689e1582511d4a4e87021c582feac9d2";
        const imageUrl1 = imageUrlImg1.value;
        const imageUrl2 = imageUrlImg2.value;
        const imageUrl3 = imageUrlImg3.value;


        if (!imageUrl1 || !imageUrl2 || !imageUrl3) {
            resultDiv.innerHTML = "Por favor ingrese una url...";
        }

        const header = new Headers();
        header.append("Prediction-key", key);
        header.append("Content-Type", 'application/json');

        const body1 = JSON.stringify({ url: imageUrl1 });
        const body2 = JSON.stringify({ url: imageUrl2 });
        const body3 = JSON.stringify({ url: imageUrl3 });


        fetch(
            `${Url}face/v1.0/detect?returnfaceRectangle&detectionModel=detection_01`,
            {
                method: "POST",
                headers: header,
                body: body1,
            }
        )
            .then((response) => response.json())
            .then((result) => {
                console.log(result);

                coordenadasDiv.style.height = `${result[0].faceRectangle.height}px`;
                coordenadasDiv.style.width = `${result[0].faceRectangle.width}px`;
                coordenadasDiv.style.top = `${result[0].faceRectangle.top}px`;
                coordenadasDiv.style.left = `${result[0].faceRectangle.left}px`;
            });
    }
})

// https://i.pinimg.com/originals/37/ea/96/37ea96c0d0ca2480a0084a2bd902bf67.jpg