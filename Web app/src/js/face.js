document.addEventListener("DOMContentLoaded", function () {
  const analyzeButton = document.getElementById("analyzeButton");
  const imageUrlImg1 = document.getElementById("input-imagen-1");
  const imageUrlImg2 = document.getElementById("input-imagen-2");
  const imageUrlImg3 = document.getElementById("input-imagen-3");
  const resultDiv = document.getElementById("result");
  const coordenadasBox = document.getElementById("container");

  analyzeButton.addEventListener("click", analyzeImage);

  imageUrlImg1.addEventListener("input", () => {
    let imagen = document.getElementById("imagenObjeto");
    let link = document.getElementById("input-imagen-1").value;
    imagen.src = link;
  });

  imageUrlImg2.addEventListener("input", () => {
    let imagen = document.getElementById("imagenObjeto1");
    let link = document.getElementById("input-imagen-2").value;
    imagen.src = link;
  });

  imageUrlImg3.addEventListener("input", () => {
    let imagen = document.getElementById("imagenObjeto2");
    let link = document.getElementById("input-imagen-3").value;
    imagen.src = link;
  });

  function analyzeImage() {
    const Url =
      "https://democlasificacionytraduccion.cognitiveservices.azure.com/";
    const key = "689e1582511d4a4e87021c582feac9d2";
    const imageUrl1 = imageUrlImg1.value;
    const imageUrl2 = imageUrlImg2.value;
    const imageUrl3 = imageUrlImg3.value;

    if (!imageUrl1 || !imageUrl2 || !imageUrl3) {
      resultDiv.innerHTML = "Por favor ingrese una url...";
    }

    const header = new Headers();
    header.append("Ocp-Apim-Subscription-Key", key);
    header.append("Content-Type", "application/json");

    const body1 = JSON.stringify({ url: imageUrl1 });
    const body2 = JSON.stringify({ url: imageUrl2 });
    const body3 = JSON.stringify({ url: imageUrl3 });

    fetch(
      `${Url}face/v1.0/detect?returnfaceRecangle&&detectionModel=detection_01`,
      {
        method: "POST",
        headers: header,
        body: body1,
      }
    )
    .then((response) => response.json())
    .then((result) => {
      console.log(result);

      // Obtén la referencia a la imagen
      const imagen = document.getElementById("imagenObjeto");

      // Obtén el ancho y el alto de la imagen
      const imagenAncho = imagen.offsetWidth;
      const imagenAlto = imagen.offsetHeight;

      // Calcula el factor de escala en función del ancho de la imagen
      const escalaAncho = (imagenAncho * 0.3) / 100;

      result.forEach((face) => {
        const coordenadas = document.createElement("div");
        coordenadas.className = "coordenadas";

        // Calcula las dimensiones de las coordenadas en función del factor de escala
        const coordenadasAncho = face.faceRectangle.width * escalaAncho;
        const coordenadasAlto = face.faceRectangle.height * escalaAncho;

        // Calcula las posiciones de las coordenadas en función del factor de escala
        const coordenadasLeft = face.faceRectangle.left * escalaAncho;
        const coordenadasTop = face.faceRectangle.top * escalaAncho;

        coordenadas.style.height = `${coordenadasAlto}px`;
        coordenadas.style.width = `${coordenadasAncho}px`;
        coordenadas.style.top = `${coordenadasTop}px`;
        coordenadas.style.left = `${coordenadasLeft}px`;

        coordenadasBox.appendChild(coordenadas);
      });
    });


    fetch(
      `${Url}face/v1.0/detect?returnfaceRecangle&detectionModel=detection_01`,
      {
        method: "POST",
        headers: header,
        body: body2,
      }
    )
      .then((response) => response.json())
      .then((result) => {
        console.log(result);

        // Obtén la referencia a la imagen
        const imagen = document.getElementById("imagenObjeto1");

        // Obtén el ancho y el alto de la imagen
        const imagenAncho = imagen.offsetWidth;
        const imagenAlto = imagen.offsetHeight;

        // Calcula el factor de escala en función del ancho de la imagen
        const escalaAncho = (imagenAncho * 0.3) / 100;

        result.forEach((face) => {
          const coordenadas = document.createElement("div");
          coordenadas.className = "coordenadas";

          // Calcula las dimensiones de las coordenadas en función del factor de escala
          const coordenadasAncho = face.faceRectangle.width * escalaAncho;
          const coordenadasAlto = face.faceRectangle.height * escalaAncho;

          // Calcula las posiciones de las coordenadas en función del factor de escala
          const coordenadasLeft = face.faceRectangle.left * escalaAncho;
          const coordenadasTop = face.faceRectangle.top * escalaAncho;

          coordenadas.style.height = `${coordenadasAlto}px`;
          coordenadas.style.width = `${coordenadasAncho}px`;
          coordenadas.style.top = `${coordenadasTop}px`;
          coordenadas.style.left = `${coordenadasLeft}px`;

          coordenadasBox.appendChild(coordenadas);
        });
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
      console.log(result);

      // Obtén la referencia a la imagen
      const imagen = document.getElementById("imagenObjeto2");

      // Obtén el ancho y el alto de la imagen
      const imagenAncho = imagen.offsetWidth;
      const imagenAlto = imagen.offsetHeight;

      // Calcula el factor de escala en función del ancho de la imagen
      const escalaAncho = (imagenAncho * 0.3) / 100;

      result.forEach((face) => {
        const coordenadas = document.createElement("div");
        coordenadas.className = "coordenadas";

        // Calcula las dimensiones de las coordenadas en función del factor de escala
        const coordenadasAncho = face.faceRectangle.width * escalaAncho;
        const coordenadasAlto = face.faceRectangle.height * escalaAncho;

        // Calcula las posiciones de las coordenadas en función del factor de escala
        const coordenadasLeft = face.faceRectangle.left * escalaAncho;
        const coordenadasTop = face.faceRectangle.top * escalaAncho;

        coordenadas.style.height = `${coordenadasAlto}px`;
        coordenadas.style.width = `${coordenadasAncho}px`;
        coordenadas.style.top = `${coordenadasTop}px`;
        coordenadas.style.left = `${coordenadasLeft}px`;

        coordenadasBox.appendChild(coordenadas);
      });
    });

  }
});

// https://i.pinimg.com/originals/37/ea/96/37ea96c0d0ca2480a0084a2bd902bf67.jpg
