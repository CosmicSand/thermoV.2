import mqtt from "mqtt";
import { v4 as uuidv4 } from "uuid";
import SensorsResponse from "./login.types";
// import { cardCreation } from "./cardcreation";

export const sensorsResponses: SensorsResponse = {} as SensorsResponse;

const infoSection = document.querySelector<HTMLDivElement>(".greetings");

const loginArea = document.querySelector<HTMLDivElement>(".login");

function fetch(username: string, password: string) {
  {
    const client = mqtt.connect("mqtt://sgh.com.ua", {
      hostname: "sgh.com.ua", // Адреса MQTT брокера
      port: import.meta.env.VITE_PORT, // Порт MQTT брокера
      protocol: import.meta.env.VITE_PROTOCOL, // Протокол підключення ws (WebSocket)
      path: "/ws", // Шлях до MQTT брокера
      username, // Ім'я користувача
      password, // Пароль користувача
      clientId: "websocket_monitor", // Ідентифікатор клієнта (може бути випадковим ім'ям)
      keepalive: 60, // Час утримання з'єднання (60 секунд)
      reconnectPeriod: 5000, // Період перепідключення (5 секунд)
      clean: true,
    });

    //     client.on('error', (error) => {
    //   console.error('Произошла ошибка:', error);
    // });

    client.on("connect", () => {
      console.log("Підключено");
      client.subscribe("rcit/#");
    });
    loginArea?.classList.add("hidden");
    infoSection?.classList.remove("hidden");
    client.on("message", (_, message) => {
      const messageStr = message.toString();
      // console.log(messageStr);
      if (messageStr) {
        currentTemperatures(messageStr);
        // cardCreation(sensorsResponses);
      }
    });
  }
}

// Функція, яка створює об'єкт користувачів та точок контролю для кожного окремо

function currentTemperatures(messageStr: string) {
  if (messageStr.includes(":")) return;
  const currentResponse = messageStr.split(";");
  const ownerId = currentResponse[0];
  const sensorId = ownerId + "_" + currentResponse[1];
  const sensorData = currentResponse
    .toSpliced(currentResponse.length - 1, 1)
    .slice(2);
  sensorData.push(uuidv4());

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
  console.log(sensorsResponses);
  return sensorsResponses;
}

export default fetch;

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
