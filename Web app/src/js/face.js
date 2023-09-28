document.addEventListener("DOMContentLoaded", function () {
  const analyzeButton = document.getElementById("analyzeButton");
  const imageUrlImg1 = document.getElementById("input-imagen-1");
  const imageUrlImg2 = document.getElementById("input-imagen-2");
  const imageUrlImg3 = document.getElementById("input-imagen-3"); 
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
      alert("Por favor ingrese todas las url...");
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

        const texto = `<p>en total hay ${item} caras <br> Cuadro Delimitador: </p>`
        descriptionDiv1.innerHTML = texto;

        for (let i = 0; i < item; i++) {
          const divCoordenadas = document.createElement("div");

          divCoordenadas.className = "description-face-rectangle";

          const delimiter = `<p>Alto ${result[i].faceRectangle.top}px <br> derecha ${result[i].faceRectangle.left}px <br> Alto ${result[i].faceRectangle.height}px <br> Ancho ${result[i].faceRectangle.width}px </p>`;

          divCoordenadas.innerHTML = delimiter;

          descriptionDiv1.appendChild(divCoordenadas);
        }
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
          const item = result.length;
          console.log(item);
          console.log(result);
          descriptionDiv2.innerHTML = `En total hay ${item} caras`;
          for (let i = 0; i < item; i++) {
            const divCoordenadas = document.createElement("div");
  
            divCoordenadas.className = "description-face-rectangle";
  
            const delimiter = `<p>Alto ${result[i].faceRectangle.top}px <br> derecha ${result[i].faceRectangle.left}px <br> Alto ${result[i].faceRectangle.height}px <br> Ancho ${result[i].faceRectangle.width}px </p>`;
  
            divCoordenadas.innerHTML = delimiter;
  
            descriptionDiv2.appendChild(divCoordenadas);
          }
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
        for (let i = 0; i < item; i++) {
          const divCoordenadas = document.createElement("div");

          divCoordenadas.className = "description-face-rectangle";

          const delimiter = `<p>Alto ${result[i].faceRectangle.top}px <br> derecha ${result[i].faceRectangle.left}px <br> Alto ${result[i].faceRectangle.height}px <br> Ancho ${result[i].faceRectangle.width}px </p>`;

          divCoordenadas.innerHTML = delimiter;

          descriptionDiv3.appendChild(divCoordenadas);
        }
      });
  }
});
