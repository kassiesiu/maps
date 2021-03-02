const acc = process.env.MAP_BOX_API_KEY;

const request = (route, callback) => {
  fetch(`https://api.mapbox.com/${route}access_token=${acc}`)
    .then((res) => res.json())
    .then(
      (res) => callback(res),
      (error) => console.log(error)
    );
};

export default request;
