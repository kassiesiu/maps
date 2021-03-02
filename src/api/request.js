const request = (route, callback) => {
  fetch(
    `https://api.mapbox.com/${route}access_token=${process.env.REACT_APP_MAP_BOX_API_KEY}`
  )
    .then((res) => res.json())
    .then(
      (res) => callback(res),
      (error) => console.log(error)
    );
};

export default request;
