// import { NodeArray } from "typescript";
// import { sensorsResponses } from "./mqtt";
import SensorsResponse from "./login.types";
import { temperatureAlarm } from "./alarm";
import { timeSinceLastUpd } from "./time";
import { currentBatteryLevelShow, batteryLevel } from "./battery";

// const intObj: { [key: string]: NodeJS.Timeout } = {};
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
      // const isSensor = !isBoiler && !isGateway;

      if (!ownersControlArea.contains(idCheckEl) && !isBoiler && !isGateway) {
        const ownersControlAreaForSensors = document.querySelector(
          `[data-sensor=${ownerName}]`
        ) as HTMLDivElement;
        const sensorParameters = sensorsResponses[ownerName][
          sensor
        ] as string[];
        const temperature = Number(Number(sensorParameters[1]).toFixed(1));

        const sensorElement = `<div class="sensor" data-sensor="true" data-name='${sensor}'  id='${sensor}'  data-alarmtime="1"  data-high="60" data-low="15" data-current=${temperature}>
            <p class="parameter" data-name='${sensor}' data-temp='${sensor}'>${temperature}</p>
            <p class="sensor-name" data-name='${sensor}'>${sensorsIdNumber}</p>

            <div class="battery" data-id='${sensor}' data-battery=${batteryLevel(
          sensorParameters
        )}>
             <div class="low-level" data-red=${sensor}></div>
              <div class="medium-level drained" data-yellow=${sensor}></div>
              <div class="full-level drained" data-green=${sensor}></div>
            </div>
              <button class="tau hidden" data-tau="">
               &#120533;
            </button>
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

        const sensorBoilerElement = `<div class="sensor boiler" id=${sensor} data-boiler=${sensor} data-in=${
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
          <div class="settings hidden">
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
          `;
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

        const sensorGatewayElement = `<div class="padding"><div class="gateway-element" id='${sensor}' data-accu=${accuLevel} data-grid=${isGrid}>
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

// Застосування класу isActive для котла, який знаходиться в роботі

function boilerIsActive(inTemperature: number, outTemperature: number) {
  if (outTemperature - inTemperature > 5 && outTemperature > 40) {
    return true;
  } else {
    return false;
  }
}
