import mqtt from "mqtt";
import { v4 as uuidv4 } from "uuid";
import SensorsResponse from "./login.types";
import { cardCreation } from "./cardcreation";

export const sensorsResponses: SensorsResponse = {} as SensorsResponse;
const userTopic = import.meta.env.VITE_USER;

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
      client.subscribe(`rcit/${userTopic}/`);
    });

    client.on("message", (_, message) => {
      const messageStr = message.toString().slice(0, -1);
      // console.log(messageStr);

      if (messageStr) {
        addToAndRefreshObject(messageStr);
        cardCreation(sensorsResponses);
      }
    });
  }
}

// Функція, яка додає до об'єкту користувачів та точки контролю для кожного окремо, а також оновлює дані кожної з точок при надходженні нових значень

function addToAndRefreshObject(messageStr: string) {
  if (messageStr.includes(":")) return;

  // Трансформація повідомлення в зручну форму. Відокремлення власника та сенсора

  const currentResponse = messageStr.split(";");
  const ownerId = currentResponse[0];
  const sensorNumber: number = Number(currentResponse[1]);

  const sensorId = ownerId + "_" + sensorNumber;

  const sensorData = currentResponse.slice(2);
  if (sensorNumber % 10 === 0 && sensorNumber % 100 !== 0) {
    sensorData.push("isBoiler");
  } else if (sensorNumber % 100 === 0) {
    sensorData.push("isGateway");
  } else {
    sensorData.push("isSensor");
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
