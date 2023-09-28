document.addEventListener("DOMContentLoaded", function () {
  const analyzeButton = document.getElementById("analyzeButton");
  const imageUrlImg1 = document.getElementById("input-imagen-1");
  const imageUrlImg2 = document.getElementById("input-imagen-2");
  const imageUrlImg3 = document.getElementById("input-imagen-3");

  const detection1 = document.getElementById("container1");
  const detection2 = document.getElementById("container2");
  const detection3 = document.getElementById("container3");

  const resultDiv = document.getElementById("result");
  const descriptionDiv1 = document.getElementById("description1");
  const descriptionDiv2 = document.getElementById("description2");
  const descriptionDiv3 = document.getElementById("description3");

  const imagen1 = document.getElementById("imagenObjeto");
  const imagen2 = document.getElementById("imagenObjeto1");
  const imagen3 = document.getElementById("imagenObjeto2");

  const coordenadasDiv = document.getElementById("coordenadas");

  analyzeButton.addEventListener("click", analyzeImage);

  imageUrlImg1.addEventListener("input", () => {
    let link = document.getElementById("input-imagen-1").value;
    imagen1.src = link;
  });

  imageUrlImg2.addEventListener("input", () => {
    let link = document.getElementById("input-imagen-2").value;
    imagen2.src = link;
  });

  imageUrlImg3.addEventListener("input", () => {
    let link = document.getElementById("input-imagen-3").value;
    imagen3.src = link;
  });

  function analyzeImage() {
    const Url =
      "https://democlasificacionytraduccion.cognitiveservices.azure.com/";
    const key = "689e1582511d4a4e87021c582feac9d2";
    const imageUrl1 = imageUrlImg1.value;
    const imageUrl2 = imageUrlImg2.value;
    const imageUrl3 = imageUrlImg3.value;

    if (!imageUrl1 || !imageUrl2 || !imageUrl3) {
      resultDiv.innerHTML = "Por favor ingrese todas las url...";
    }

    const header = new Headers();
    header.append("Ocp-Apim-Subscription-Key", key);
    header.append("Content-Type", "application/json");

    const body1 = JSON.stringify({ url: imageUrl1 });
    const body2 = JSON.stringify({ url: imageUrl2 });
    const body3 = JSON.stringify({ url: imageUrl3 });

    fetch(
      `${Url}face/v1.0/detect?returnfaceRecangle&detectionModel=detection_01`,
      {
        method: "POST",
        headers: header,
        body: body1,
      }
    )
      .then((response) => response.json())
      .then((result) => {
        const item = result.length;
        console.log(item);
        console.log(result);
        descriptionDiv3.innerHTML = `en total hay ${item} caras`;

        for (let i = 0; i < item; i++) {
          const divCoordenadas = document.createElement("div");
          const altoImg = imagen1.height;

          console.log(altoImg);
          divCoordenadas.className = "coordenadas";
          divCoordenadas.id = "coordenadas";

          divCoordenadas.style.height = `${result[i].faceRectangle.height}px`;
          divCoordenadas.style.width = `${result[i].faceRectangle.width}px`;
          divCoordenadas.style.top = `${
            result[i].faceRectangle.top - altoImg
          }px`;
          divCoordenadas.style.left = `${result[i].faceRectangle.left}px`;

          detection1.appendChild(divCoordenadas);
        }
      });

    axios.post(Url, body2, { header }).then((response) => {
      const items = response.predictions;

      // Crear un canvas para mostrar las coordenadas de detección
      const canvas = document.createElement("canvas");
      canvas.width = newImg.width;
      canvas.height = newImg.height;
      const context = canvas.getContext("2d");
      context.drawImage(newImg, 0, 0);

      // Dibujar las coordenadas de detección en el canvas
      items.forEach((element) => {
        if (element.probability > 0.9) {
          const porcentaje = probabilidad * 100;

          // Las coordenadas de detección generalmente se encuentran en element.boundingBox
          const boundingBox = element.boundingBox;

          const originalImgWidth = newImg.naturalWidth;
          const originalImgHeight = newImg.naturalHeight;

          context.rect(
            boundingBox.left * originalImgWidth,
            boundingBox.top * originalImgHeight,
            boundingBox.width * originalImgWidth,
            boundingBox.height * originalImgHeight
          );
          context.lineWidth = 2;
          context.strokeStyle = "red";
          context.fillStyle = "red";
          context.stroke();

          context.fillStyle = "red"; // Color y opacidad del fondo
          context.fillRect(
            boundingBox.left * originalImgWidth,
            boundingBox.top * originalImgHeight - 20, // Ajustar la posición vertical del fondo
            context.measureText(nombre).width + 65, // Ancho del fondo (basado en el texto)
            20 // Altura del fondo
          );

          // Agregar etiqueta al cuadro de detección
          context.font = "16px Arial";
          context.fillStyle = "white";
          context.fillText(
            nombre,
            boundingBox.left * originalImgWidth,
            boundingBox.top * originalImgHeight + -5
          );

          // Agregar otro comentario aquí
          // Puedes personalizar el estilo del texto y su posición
          context.font = "16px Arial";
          context.fillStyle = "white";
          context.fillText(
            porcentaje.toFixed(0) + "%",
            boundingBox.left * originalImgWidth + 52,
            boundingBox.top * originalImgHeight - 5
          );
          console.log("Prediccion realizada con exito...");
        }
      });

      // Limpiar el contenido anterior y agregar la nueva imagen con las coordenadas de detección
      imagenContainer.innerHTML = "";
      imagenContainer.appendChild(canvas);
    });

    fetch(
      `${Url}face/v1.0/detect?returnfaceRecangle&detectionModel=detection_01`,
      {
        method: "POST",
        headers: header,
        body: body3,
      }
    )
      .then((response) => response.json())
      .then((result) => {
        const item = result.length;
        console.log(item);
        console.log(result);
        descriptionDiv3.innerHTML = `en total hay ${item} caras`;

        for(let i = 0; i < item; i++) {
          const divCoordenadas = document.createElement("div");
          const altoImg = imagen3.height;

          console.log(altoImg);
          divCoordenadas.className = "coordenadas";
          divCoordenadas.id = "coordenadas";

          divCoordenadas.style.height = `${result[i].faceRectangle.height}px`;
          divCoordenadas.style.width = `${result[i].faceRectangle.width}px`;
          divCoordenadas.style.top = `${result[i].faceRectangle.top - altoImg}px`;
          divCoordenadas.style.left = `${result[i].faceRectangle.left}px`;

          detection3.appendChild(divCoordenadas);
        }
      });
  }
});
