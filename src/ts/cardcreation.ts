// import { NodeArray } from "typescript";
// import { sensorsResponses } from "./mqtt";
import SensorsResponse from "./login.types";

const intObj: { [key: string]: NodeJS.Timeout } = {};
const monitor = document.querySelector<HTMLDivElement>(".monitor");

export function cardCreation(sensorsResponses: SensorsResponse) {
  const allKeysArray = Object.keys(sensorsResponses).toSorted((a, b) =>
    a.localeCompare(b)
  );

  const ownersNamesArray = allKeysArray;

  // Створюємо контейнери для сенсорів

  for (let ownerName of ownersNamesArray) {
    const divIdExistence = document.getElementById(ownerName);

    if (!divIdExistence) {
      monitor?.insertAdjacentHTML(
        "afterbegin",
        `<div class='control-area' id=${ownerName}><h2>${ownerName}</h2><div class="gateway" data-gateway=${ownerName}></div><div class="for-boilers" data-boiler=${ownerName}></div><div class="for-sensors" data-sensor=${ownerName}></div></div></div>`
      );
    }

    // Малюємо сенсори

    const sensorsArray = Object.keys(sensorsResponses[ownerName]);

    for (let sensor of sensorsArray) {
      const ownersControlArea = document.getElementById(
        ownerName
      ) as HTMLDivElement;
      const idCheckEl = document.getElementById(sensor);
      const sensorsNumberPosition = sensor.indexOf("_") - sensor.length + 1;
      const sensorsIdNumber = sensor.slice(sensorsNumberPosition);

      const isBoiler =
        Number(sensorsIdNumber) % 10 === 0 &&
        Number(sensorsIdNumber) % 100 !== 0;
      const isGateway = Number(sensorsIdNumber) % 100 === 0;
      const isSensor = !isBoiler && !isGateway;

      if (!ownersControlArea.contains(idCheckEl) && !isBoiler && !isGateway) {
        const ownersControlAreaForSensors = document.querySelector(
          `[data-sensor=${ownerName}]`
        ) as HTMLDivElement;
        const sensorParameters = sensorsResponses[ownerName][
          sensor
        ] as string[];
        const temperature = Number(Number(sensorParameters[1]).toFixed(1));

        const sensorElement = `<div class="sensor" data-name='${sensor}'  id='${sensor}'  data-alarmtime="3" data-high="60" data-low="15">
            <p class="parameter" data-name='${sensor}' data-temp='${sensor}'>${temperature}</p>
            <p class="sensor-name" data-name='${sensor}'>${sensorsIdNumber}</p>

            <div class="battery" data-id='${sensor}' data-battery=${batteryLevel(
          sensorParameters
        )}>
             <div class="low-level" data-red=${sensor}></div>
              <div class="medium-level drained" data-yellow=${sensor}></div>
              <div class="full-level drained" data-green=${sensor}></div>
            </div>
              <button class="tau visually-hidden" data-tau="">
               &#120533;
            </button>
             <button type="button" class="open-settings-btn visually-hidden"data-name='${sensor}' aria-label="Settings">
              &#9881;
            </button>
            <div class="settings visually-hidden">
             <button type="button" class="close-settings-btn" data-name='${sensor}'>&#10005;</button>
              <form class="settings-form" method="post">
                <label for="sensorsname">Sensor's name</label>
                <input id="sensorsname" type="text" class="sensorsname" />
                <h3 class="limits-title">Limits</h3>
                <div class="limits-inputs">
                  <label for="high-temp" class="high-temp-lbl"
                    >Up
                    <input id="high-temp" class="high-temp-limit" type="number"
                  /></label>

                  <label for="low-temp" class="low-temp-lbl"
                    >Down<input
                      id="low-temp"
                      class="low-temp-limit"
                      type="number"
                  /></label>

                  <label for="time" class="time-lbl"
                    >Time<input id="time" class="time-limit" type="number"
                  /></label>
                </div>
 <div class="settings-btn-container">
                  <button type="submit" class="apply-btn">Apply</button>
                  <button type="button" class="reset-btn">Reset</button>
                </div>
              </form>
            </div>
          </div>`;
        ownersControlAreaForSensors.insertAdjacentHTML(
          "beforeend",
          sensorElement
        );
      } else if (!ownersControlArea.contains(idCheckEl) && isBoiler) {
        const ownersControlAreaForBoilers = document.querySelector(
          `[data-boiler=${ownerName}]`
        ) as HTMLDivElement;
        const sensorParameters = sensorsResponses[ownerName][
          sensor
        ] as string[];
        const outTemperature = Number(Number(sensorParameters[1]).toFixed(1));
        const inTemperature = Number(Number(sensorParameters[2]).toFixed(1));
        // !outTemperature.toString().includes("-")
        let delta: number | string;
        if (outTemperature > 0 && inTemperature > 0) {
          delta = (outTemperature - inTemperature).toFixed(1);
        } else {
          delta = "";
        }

        const sensorBoilerElement = `<div class="padding"><div class="sensor boiler" id='${sensor}' data-in=${
          inTemperature > 0 ? inTemperature : "-"
        } data-out=${
          outTemperature > 0 ? outTemperature : "-"
        } data-active=${boilerIsActive(
          inTemperature,
          outTemperature
        )} data-alarmtime="180" data-high="80" data-low="15">
                        <p class="parameter"><span class='delta'>&#916;</span>${delta}</p>
                        <p class="parameter" data-time='${sensor}'>0</p>
            <p class="sensor-name">
              
              Boiler
            </p>

            <div class="battery" data-id='${sensor}' data-battery=${batteryLevel(
          sensorParameters
        )}>
              <div class="low-level" data-red=${sensor}></div>
              <div class="medium-level drained" data-yellow=${sensor}></div>
              <div class="full-level drained" data-green=${sensor}></div>
            </div>
          </div>
          <div class="settings visually-hidden">
              <form class="settings-form" method="post">
                <label for="sensorsname">Sensor's name</label>
                <input id="sensorsname" type="text" class="sensorsname" />
                <h3 class="limits-title">Limits</h3>
                <div class="limits-inputs">
                  <label for="high-temp" class="high-temp-lbl"
                    >Up
                    <input id="high-temp" class="high-temp-limit" type="number"
                  /></label>

                  <label for="low-temp" class="low-temp-lbl"
                    >Down<input
                      id="low-temp"
                      class="low-temp-limit"
                      type="number"
                  /></label>

                  <label for="time" class="time-lbl"
                    >Time<input id="time" class="time-limit" type="number"
                  /></label>
                </div>

                <button type="submit" class="apply-btn">Apply</button>
                <button type="button" class="reset-btn">Reset</button>
              </form>
            </div>
          </div>`;
        ownersControlAreaForBoilers.insertAdjacentHTML(
          "beforeend",
          sensorBoilerElement
        );
      } else if (!ownersControlArea.contains(idCheckEl) && isGateway) {
        const ownersControlAreaForGateway = document.querySelector(
          `[data-gateway=${ownerName}]`
        ) as HTMLDivElement;
        const sensorParameters = sensorsResponses[ownerName][
          sensor
        ] as string[];
        const accuLevel = Number(Number(sensorParameters[0]).toFixed(1));
        const isGrid = Number(Number(sensorParameters[1]) > 4);

        const sensorGatewayElement = `<div class="padding"><div class=" gateway-element" id='${sensor}' data-accu=${accuLevel} data-grid=${isGrid}>
                        <p class="parameter">${accuLevel}</p>
                        <p class="parameter">${isGrid}</p>
          

            <div class="battery" data-id='${sensor}' data-battery=${batteryLevel(
          sensorParameters,
          4.2,
          3.6
        )}>
              <div class="low-level" data-red=${sensor}></div>
              <div class="medium-level drained" data-yellow=${sensor}></div>
              <div class="full-level drained" data-green=${sensor}></div>
            </div>
          </div>
          </div>`;
        ownersControlAreaForGateway.insertAdjacentHTML(
          "beforeend",
          sensorGatewayElement
        );
      }
    }
  }
  currentTemperaturesShow(sensorsResponses);
  temperatureAlarm(sensorsResponses);
  currentBatteryLevelShow(sensorsResponses);
  timeSinceLastUpd(sensorsResponses);
}

function currentTemperaturesShow(sensorsResponses: SensorsResponse) {
  const ownersNamesArray = Object.keys(sensorsResponses).toSorted((a, b) =>
    a.localeCompare(b)
  );

  for (let ownerName of ownersNamesArray) {
    const ownersSensors = sensorsResponses[ownerName];
    const sensorsAndMethodsArray = Object.keys(
      sensorsResponses[ownerName]
    ).toSorted((a, b) => a.localeCompare(b));
    const indexOfMethodSubAdd = sensorsAndMethodsArray.indexOf("subAdd");
    const sensorsArray = sensorsAndMethodsArray.toSpliced(
      indexOfMethodSubAdd,
      1
    );

    for (let sensor of sensorsArray) {
      const sens = ownersSensors[sensor] as string[];
      const currentTemperature = sens[1];
      const currentSensor = document.querySelector<HTMLParagraphElement>(
        `[data-temp='${sensor}']`
      );

      if (
        currentSensor !== null &&
        currentSensor.innerText &&
        currentSensor.innerText !== Number(currentTemperature).toFixed(1)
      ) {
        currentSensor.innerText = Number(currentTemperature).toFixed(1);
      }
    }
  }
}

function currentBatteryLevelShow(sensorsResponses: SensorsResponse) {
  // Зроблено для перегляду всіх користувачів. Працює і для одного. Якщо суто для одного робити - то масив ти цикл зайві

  const ownersNamesArray = Object.keys(sensorsResponses).toSorted((a, b) =>
    a.localeCompare(b)
  );

  for (let ownerName of ownersNamesArray) {
    // const ownersSensors = sensorsResponses[ownerName];
    const sensorsArray = Object.keys(sensorsResponses[ownerName]).toSorted(
      (a, b) => a.localeCompare(b)
    );
    for (let sensor of sensorsArray) {
      //   const sens = ownersSensors[sensor] as string[];
      const battery = document.querySelector<HTMLDivElement>(
        `.battery[data-id=${sensor}]`
      );

      const redLevel = document.querySelector<HTMLDivElement>(
        `[data-red='${sensor}']`
      );

      const yellowLevel = document.querySelector<HTMLDivElement>(
        `[data-yellow='${sensor}']`
      );
      const greenLevel = document.querySelector<HTMLDivElement>(
        `[data-green='${sensor}']`
      );
      document.querySelector<HTMLDivElement>(".medium-level");

      if (battery !== null && Number(battery?.dataset.battery) === 0) {
        redLevel?.classList.add("drained");
        yellowLevel?.classList.add("drained");
        greenLevel?.classList.add("drained");
        battery?.classList.add("empty");
      } else if (battery !== null && Number(battery?.dataset.battery) <= 20) {
        redLevel?.classList.remove("drained");
        yellowLevel?.classList.add("drained");
        greenLevel?.classList.add("drained");
      } else if (
        battery !== null &&
        Number(battery?.dataset.battery) >= 20 &&
        Number(battery?.dataset.battery) <= 70
      ) {
        redLevel?.classList.remove("drained");
        redLevel?.classList.add("medium-level");
        yellowLevel?.classList.remove("drained");
        greenLevel?.classList.add("drained");
      } else if (battery !== null && Number(battery?.dataset.battery) > 70) {
        redLevel?.classList.remove("drained");
        redLevel?.classList.add("is-full");
        yellowLevel?.classList.remove("drained");
        yellowLevel?.classList.add("is-full");
        greenLevel?.classList.remove("drained");
      } else {
        console.log("dfdfdfdf");
      }
    }
  }
}

//   Функція конвертації напруги батареї у відсотки. За замовчанням в якості аргументів передаються значення  fullBattery = 4.5, emptyBattery= 3.2  - що справедливо для всіх сенсорів окрім gateway, для якого потрібно передавати під час виклику значення fullBattery = 4.2, emptyBattery= 3.6

function batteryLevel(
  sensorParameters: string[],
  fullBattery: number = 4.5,
  emptyBattery: number = 3.2
) {
  const currentBatteryLevel = (
    100 -
    ((fullBattery - Number(sensorParameters[0])) * 100) /
      (fullBattery - emptyBattery)
  ).toFixed(0);
  if (!currentBatteryLevel.includes("-")) {
    return Number(currentBatteryLevel) > 100
      ? 100
      : Number(currentBatteryLevel);
  } else {
    return 0;
  }
}

// Застосування класу isActive для котла, який знаходиться в роботі

function boilerIsActive(inTemperature: number, outTemperature: number) {
  if (outTemperature - inTemperature > 5 && outTemperature > 40) {
    return true;
  } else {
    return false;
  }
}

// Розрахунок часу, що минув після останнього оновлення параметрів

function timeSinceLastUpd(sensorsResponses: SensorsResponse) {
  const ownersNamesArray = Object.keys(sensorsResponses).toSorted((a, b) =>
    a.localeCompare(b)
  );

  for (let ownerName of ownersNamesArray) {
    const ownersSensors = sensorsResponses[ownerName];
    const sensorsArray = Object.keys(sensorsResponses[ownerName]).toSorted(
      (a, b) => a.localeCompare(b)
    );

    for (let sensor of sensorsArray) {
      const sensorsParams = ownersSensors[sensor] as string[];
      const updateTime = Number(sensorsParams[8]);
      const currentSensor = document.getElementById(sensor);
      const currentTauBtn = document.querySelector(`#${sensor} .tau`);
      //   const battery = document.querySelector(`.battery[data-id="${sensor}"]`);
      const currentSensorsTimeParagraph =
        document.querySelector<HTMLParagraphElement>(`[data-time='${sensor}']`);
      const alarm = currentSensor?.dataset.alarmtime;
      if (sensorsParams.length !== 9) {
        sensorsParams.push(Date.now().toString());
      }

      //   const intObj: { [key: string]: number } = {};
      //   console.log(intObj[sensor]);

      if (intObj[sensor]) {
        clearInterval(intObj[sensor]);
      }

      const int = setInterval(() => {
        // console.log(sensor);

        const timeLeft = (Date.now() - updateTime) / (1000 * 60);
        //   currentSensorsTimeParagraph.innerText = timeLeft.toFixed();
        // if (currentTauBtn) {
        //   (currentTauBtn as HTMLElement).innerText =
        //     Math.floor(timeLeft).toString();
        //   (currentTauBtn as HTMLElement).dataset.tau = timeLeft.toFixed(1);
        // }

        if (alarm && timeLeft > Number(alarm)) {
          (currentTauBtn as HTMLElement).innerText = (timeLeft - 0.5).toFixed(
            0
          );
          (currentTauBtn as HTMLElement).dataset.tau = (timeLeft - 0.5).toFixed(
            1
          );
          currentTauBtn?.classList.remove("visually-hidden");
          currentSensor.classList.add("sensor-time-alarm");
        } else {
          currentTauBtn?.classList.add("visually-hidden");
          currentSensor?.classList.remove("sensor-time-alarm");
        }
      }, 1000);

      intObj[sensor] = int;

      //   console.log(intObj);
    }
  }
}

// Функція сигналізації по температурі (збільшення/зменшення відносно допустимої)

function temperatureAlarm(sensorsResponses: SensorsResponse): void {
  const ownersNamesArray = Object.keys(sensorsResponses).toSorted((a, b) =>
    a.localeCompare(b)
  );
  for (let ownerName of ownersNamesArray) {
    const ownersSensors = sensorsResponses[ownerName];
    const sensorsArray = Object.keys(ownersSensors).toSorted((a, b) =>
      a.localeCompare(b)
    );
    for (let sensor of sensorsArray) {
      const sensorsData = sensorsResponses[ownerName][sensor];

      if (sensorsData.includes("isGateway")) continue;

      const currentSensor = document.getElementById(sensor);
      const alarmHigh = Number(currentSensor?.dataset.high);
      const alarmLow = Number(currentSensor?.dataset.low);
      const currentTempreature = Number(sensorsData[1]);
      if (alarmHigh <= currentTempreature) {
        currentSensor?.classList.add("over-heated-alarm");
        currentSensor?.classList.add("blink-over-heated-alarm");
      } else {
        currentSensor?.classList.remove("over-heated-alarm");
        currentSensor?.classList.remove("blink-over-heated-alarm");
      }
      if (alarmLow >= currentTempreature) {
        currentSensor?.classList.add("freezing-cold-alarm");
        currentSensor?.classList.add("blink-freezing-cold-alarm");
      } else {
        currentSensor?.classList.remove("freezing-cold-alarm");
        currentSensor?.classList.remove("blink-freezing-cold-alarm");
      }
    }
  }
}
