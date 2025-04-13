// Функція, яка оновлює значення температури датчиків

export function sensorsTemperatureUpdate(
  sensorId: string,
  temperature: string,
  typeOfSensor: string
) {
  if (typeOfSensor !== "sensor") return;
  const temperatureAfter = parseFloat(temperature);
  const currentTemperatureParagraph = document.querySelector(
    `[data-temp='${sensorId}']`
  ) as HTMLParagraphElement;
  if (temperatureAfter === -127)
    currentTemperatureParagraph.dataset.after = "-";
  if (currentTemperatureParagraph.dataset.after != null) {
    let currentTemperature = parseFloat(
      currentTemperatureParagraph.dataset.after
    );
    if (currentTemperature !== temperatureAfter && temperatureAfter !== -127) {
      currentTemperatureParagraph.dataset.after = temperatureAfter.toFixed(1);
    }
  }
}

// Функція, яка оновлює значення температур котла

export function boilerTemperatureUpdate(
  sensorId: string,
  temperatureIn: string,
  temperatureOut: string,
  typeOfSensor: string
) {
  if (typeOfSensor !== "boiler") return;
  const temperatureBefore = parseFloat(temperatureIn);
  const temperatureAfter = parseFloat(temperatureOut);
  const currentBoiler = document.querySelector(
    `[data-boiler = ${sensorId}]`
  ) as HTMLDivElement;

  if (temperatureBefore === -127) currentBoiler.dataset.before = "-";
  if (currentBoiler.dataset.before != null) {
    let currentTemperatureBefore = parseFloat(currentBoiler.dataset.before);
    if (
      currentTemperatureBefore !== parseFloat(temperatureBefore.toFixed(1)) &&
      temperatureBefore !== -127
    ) {
      currentBoiler.dataset.before = temperatureBefore.toFixed(1);
    }
  }

  if (temperatureAfter === -127) currentBoiler.dataset.after = "-";
  if (currentBoiler.dataset.after != null) {
    let currentTemperatureAfter = parseFloat(currentBoiler.dataset.after);
    if (
      currentTemperatureAfter !== temperatureAfter &&
      temperatureAfter !== -127
    ) {
      currentBoiler.dataset.after = temperatureAfter.toFixed(1);
    }
  }
}
