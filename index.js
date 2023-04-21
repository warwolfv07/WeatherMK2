const express = require("express");
const configObj = require("./config.js");

const app = express();

app.listen(3000, () => console.log("listening at 3000"));

app.use(express.static("public"));
app.use(express.json({ limit: "1mb" }));

//API to return weather data based on latitude and longitude
app.post("/data", async (request, response) => {
  const weatherInfo = await (
    await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${request.body.lat}&lon=${request.body.long}&appid=${configObj.API_KEY}&units=metric`
    )
  ).json();

  response.json({
    data: weatherInfo,
  });
});

//API to return list of cities with their coordinates
app.post("/geo", async (request, response) => {
  const data = await (
    await fetch(
      `https://api.openweathermap.org/geo/1.0/direct?q=${request.body.cityName}&limit=5&appid=${configObj.API_KEY}`
    )
  ).json();

  const cityList = [];

  data.forEach((city) => {
    let displayName = "";
    if (city.state) {
      displayName = `${city.name}, ${city.state}`;
    } else {
      displayName = `${city.name}, ${city.country}`;
    }
    const name = city.name;
    const lat = city.lat;
    const lon = city.lon;

    cityList.push({
      displayName,
      name,
      lat,
      lon,
    });
  });

  response.json({
    data: cityList,
  });
});
