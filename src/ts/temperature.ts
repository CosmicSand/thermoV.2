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

export function temperatureUpdate(
  sensorId: string,
  temperatureIn: string,
  temperatureOut: string,
  typeOfSensor: string
) {
  const temperatureBefore = parseFloat(temperatureIn);
  const temperatureAfter = parseFloat(temperatureOut);

  switch (typeOfSensor) {
    case "sensor":
      const currentTemperatureParagraph = document.querySelector(
        `[data-temp='${sensorId}']`
      ) as HTMLParagraphElement;

      if (
        currentTemperatureParagraph !== null &&
        currentTemperatureParagraph.innerText &&
        Number(currentTemperatureParagraph.dataset.current) !== temperatureAfter
      ) {
        currentTemperatureParagraph.innerText = temperatureAfter.toFixed(1);
      }
      break;
    case "boiler":
      const currentBoiler = document.querySelector(
        `[data-boiler = ${sensorId}]`
      ) as HTMLDivElement;

      let currentTemperatureBefore = Number(currentBoiler.dataset.before);
      if (
        currentTemperatureBefore !== temperatureBefore &&
        temperatureBefore !== -127
      ) {
        currentBoiler.dataset.before = temperatureBefore.toFixed(1);
      } else if (temperatureBefore == -127) {
        currentBoiler.dataset.before = "-";
      }

      let currentTemperatureAfter = Number(currentBoiler.dataset.after);
      if (
        currentTemperatureAfter !== temperatureAfter &&
        temperatureAfter !== -127
      ) {
        currentBoiler.dataset.after = temperatureAfter.toFixed(1);
      } else if (temperatureAfter == -127) {
        currentBoiler.dataset.after = "-";
      }
      break;
  }
}
