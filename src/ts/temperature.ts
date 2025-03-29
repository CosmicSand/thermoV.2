import SensorsResponse from "./login.types";

// Функція, яка оновлює значення температури датчиків

// export function currentTemperaturesUpdate(sensorsResponses: SensorsResponse) {
//   const ownersIdArray = Object.keys(sensorsResponses);

//   for (let ownerId of ownersIdArray) {
//     const ownersSensors = sensorsResponses[ownerId];
//     const sensorsIdArray = Object.keys(sensorsResponses[ownerId]);

//     for (let sensorId of sensorsIdArray) {
//       const parameters = ownersSensors[sensorId] as string[];
//       const temperature = parameters[1];
//       const currentTemperatureParagraph = document.querySelector(
//         `[data-temp='${sensorId}']`
//       ) as HTMLParagraphElement;

//       if (
//         currentTemperatureParagraph !== null &&
//         currentTemperatureParagraph.innerText &&
//         currentTemperatureParagraph.innerText !== Number(temperature).toFixed(1)
//       ) {
//         currentTemperatureParagraph.innerText = Number(temperature).toFixed(1);
//       }
//     }
//   }
// }

export function temperatureUpdate(sensorId: string, temperature: string) {
  const currentTemperatureParagraph = document.querySelector(
    `[data-temp='${sensorId}']`
  ) as HTMLParagraphElement;

  if (
    currentTemperatureParagraph !== null &&
    currentTemperatureParagraph.innerText &&
    currentTemperatureParagraph.innerText !== temperature
  ) {
    currentTemperatureParagraph.innerText = temperature;
  }
}
