const acc =
  "pk.eyJ1Ijoia2Fzc2lld29uZyIsImEiOiJjandvZmozNTcwbjE2NDhxcXJkdDk4cTQzIn0.M_IAIl2WS48X0B_yAeiGww";

const request = (route, callback) => {
  fetch(`https://api.mapbox.com/${route}access_token=${acc}`)
    .then((res) => res.json())
    .then(
      (res) => callback(res),
      (error) => console.log(error)
    );
};

export default request;
