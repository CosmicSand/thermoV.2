console.log(import.meta.env.VITE_PROTOCOL);

function loginToMqtt(e: Event) {
  e.preventDefault();
  const loginInput = document.querySelector<HTMLInputElement>("#username");
  const passwordInput = document.querySelector<HTMLInputElement>("#password");
  console.log({
    username: loginInput?.value,
    password: passwordInput?.value,
    protocol: import.meta.env.VITE_PROTOCOL,
  });
}

export default loginToMqtt;
