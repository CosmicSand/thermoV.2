import mqtt from "mqtt";
import { SensorsResponse, LoginData } from "./login.types";
import { StatesForSorting } from "./sorting.types";
// import { cardCreation } from "./cardcreation";
// import { sorting } from "./sorting";

const TYPES_0F_EQUIPMENT = {
  SENSOR: "sensor",
  BOILER: "boiler",
  GATEWAY: "gateway",
};

export let sensorsResponses: SensorsResponse = {};

export const statesForSorting = {} as StatesForSorting;

export function fetch(loginData: LoginData) {
  const { username, password } = loginData;
  sensorsResponses = {} as SensorsResponse;

  const client = mqtt.connectAsync("mqtt://sgh.com.ua", {
    hostname: "sgh.com.ua", // Адреса MQTT брокера
    port: import.meta.env.VITE_PORT, // Порт MQTT брокера
    protocol: import.meta.env.VITE_PROTOCOL, // Протокол підключення ws (WebSocket)
    path: "/ws", // Шлях до MQTT брокера
    username, // Ім'я користувача
    password, // Пароль користувача
    clientId: "websocket_monitor", // Ідентифікатор клієнта (може бути випадковим ім'ям)
    keepalive: 60, // Час утримання з'єднання (60 секунд)
    reconnectPeriod: 5000, // Період перепідключення (5 секунд)
    // connectTimeout: 5000,
    manualConnect: false,
    clean: true,
  });

  return client;
}

// Функція, яка додає до об'єкту користувачів та точки контролю для кожного окремо, а також оновлює дані кожної з точок при надходженні нових значень

export function addToAndRefreshObject(messageStr: string) {
  if (messageStr.includes(":")) return;

  // Трансформація повідомлення в зручну форму. Відокремлення власника та сенсора

  const currentResponse = messageStr.split(";");
  const ownerId = currentResponse[0];
  // const sensorNumber: number = Number(currentResponse[1]);
  // const sensorId = ownerId + "_" + sensorNumber;
  // const sensorData = currentResponse.slice(2);
  const sensorData = currentResponse
    .slice(1)
    .map((sensor, i) => {
      if (i === 0 || sensor.includes("-")) {
        return parseInt(sensor).toString();
      } else {
        return Number(parseFloat(sensor).toFixed(1))
          ? parseFloat(sensor).toFixed(1)
          : sensor;
      }
    })
    .toSpliced(4, 2);

  const sensorNumber: number = Number(sensorData[0]);
  const sensorId = ownerId + "_" + sensorNumber;
  // console.log(sensorData);

  if (sensorNumber % 10 === 0 && sensorNumber % 100 !== 0) {
    sensorData.push(TYPES_0F_EQUIPMENT.BOILER);
  } else if (sensorNumber % 100 === 0) {
    sensorData.push(TYPES_0F_EQUIPMENT.GATEWAY);
  } else {
    sensorData.push(TYPES_0F_EQUIPMENT.SENSOR);
  }
  sensorData.push(Date.now().toString());

  // Додавання та оновлення даних (у разі наявних)

  const keysOfSensorsResponses = Object.keys(sensorsResponses);

  if (!keysOfSensorsResponses.includes(ownerId)) {
    sensorsResponses[ownerId] = {
      [sensorId]: sensorData,
    };
  } else {
    keysOfSensorsResponses.forEach((key) => {
      if (key === ownerId) {
        sensorsResponses[ownerId][sensorId] = sensorData;
      }
    });
  }
  // console.log(sensorsResponses);

  return sensorsResponses;
}

export function isNeedsAutoSorting(sensorsResponses: SensorsResponse) {
  const ownersIdArray = Object.keys(sensorsResponses);
  for (let ownerId of ownersIdArray) {
    const sensorsIdArray = Object.keys(sensorsResponses[ownerId]);
    //   Array of all sensors excluding boilers and gateways
    let arrayOfSensors: string[] = [];
    for (let sensorId of sensorsIdArray) {
      const number = sensorsResponses[ownerId][sensorId][0];
      if (!number.includes("0")) {
        arrayOfSensors.push(number);
      }
    }
    const allSensors: NodeListOf<Element> = document.querySelectorAll(
      `[data-sensor=${ownerId}] > [data-sensor='true']`
    );
    if (arrayOfSensors.length !== allSensors.length) {
      statesForSorting[ownerId] = true;
    } else {
      statesForSorting[ownerId] = false;
    }
  }
}

// export function saveSensorsResponsestoLocalStorage(loginData: LoginData) {
//   const { topic } = loginData;
//   setInterval(() => {
//     localStorage.setItem(
//       `${THERMO_SENSOR_RESPONSE}${topic ? "_" + topic : ""}`,
//       JSON.stringify(sensorsResponses)
//     );
//   }, 300000);
// }
// export function createSensorResponsesObj(topic?: string) {
//   const storedData = localStorage.getItem(
//     `${THERMO_SENSOR_RESPONSE}${topic ? "_" + topic : ""}`
//   );
//   return storedData
//     ? ({
//         ...JSON.parse(storedData),
//       } as SensorsResponse)
//     : ({} as SensorsResponse);
// }

// ==== LogIn ===

// console.log(import.meta.env.VITE_PROTOCOL);

// function loginToMqtt(e: Event) {
//   e.preventDefault();
//   const loginInput = document.querySelector<HTMLInputElement>("#username");
//   const passwordInput = document.querySelector<HTMLInputElement>("#password");
//   console.log({
//     username: loginInput?.value,
//     password: passwordInput?.value,
//
//   });
// }

// export default loginToMqtt;
