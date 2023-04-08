const locationBtn = document.querySelector("#locate");
const displayPanel = document.querySelector(".information");
const searchText = document.querySelector(".location");
const searchList = document.querySelector(".dropdown");

locationBtn.addEventListener("click", (e) => {
  const location = locateViaGeolocation();
});

searchText.addEventListener("input", async (e) => {
  //console.log(e.target.value);
  const location = await getCityList(e.target.value);
  console.log(location);
  addLiForSearch(location);
});

function locateViaGeolocation() {
  if (!navigator.geolocation) {
    console.log("Geolocation is not supported by your browser");
  } else {
    const options = {
      enableHighAccuracy: true,
    };
    navigator.geolocation.getCurrentPosition(success, error, options);
  }
}

function success(position) {
  const lat = position.coords.latitude;
  const long = position.coords.longitude;

  const coordinates = { lat, long };
  requestWeatherData(coordinates);
  displayPanel.innerHTML = "";
  displayPanel.innerHTML = `Latitude: ${lat}, longitude: ${long}`;
}
function error() {
  displayPanel.innerHTML = "";
  displayPanel.innerHTML = `Unable to get location`;
}

async function getCityList(cityName) {
  if (cityName != "") {
    const postOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    };
    const cityObject = { cityName };
    postOptions.body = JSON.stringify(cityObject);
    const response = await (await fetch("/geo", postOptions)).json();
    return response.data;
  }
}

async function requestWeatherData(coordinates) {
  const postOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  };
  postOptions.body = JSON.stringify(coordinates);
  console.log(postOptions);
  const response = await (await fetch("/data", postOptions)).json();
  displayPanel.innerHTML = JSON.stringify(response.data);
}

function addLiForSearch(locationArray) {
  searchList.innerHTML = "";
  const list = document.createElement("ul");
  list.className = "cities";
  searchList.appendChild(list);

  locationArray.forEach((location) => {
    const item = document.createElement("li");
    item.innerHTML = location.displayName;
    list.appendChild(item);
    item.addEventListener("click", (e) => {
      console.log(location);
    });
  });
}
