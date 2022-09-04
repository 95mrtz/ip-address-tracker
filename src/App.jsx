import { useEffect, useState } from "react";
import "./App.css";

import { MapContainer, TileLayer, useMap, Marker, Popup } from "react-leaflet";

import { Marker as LeafletMarker, icon } from "leaflet";

import "leaflet/dist/leaflet.css";
import L from "leaflet";

import iconArrow from "./images/icon-arrow.svg";
import IconLocation from "./images/icon-location.svg";

const iconMarker = L.icon({
  iconUrl: IconLocation,
  iconSize: L.point(46, 56),
});



const App = () => {
  const [ipAddress, setIpAddress] = useState("");
  const [showData, setShowData] = useState(false);
  const [data, setData] = useState(null);
  const [coords, setCoords] = useState([37.8025, 122.271]);

  const ChangeMap = ( { coordenadas} ) => {
    const map = useMap();
    map.setView(coordenadas, map.getZoom());
    return null;
  };


  const validateIP = (ip) => {
    const ipRegex =
      /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

    return ipRegex.test(ip) ? true : false;
  };

  const busqueda = async (ip = "") => {
    console.log("entre");
    let busquedaIp = ip;

    if (!busquedaIp) {
      console.log("entre a busqueda primera vez");

        const response = await fetch(
          "https://api.ipify.org/?format=json"
        );

        const { ip: ipActual } = await response.json();

        busquedaIp = ipActual;
        console.log(busquedaIp);
    }

    if (busquedaIp) {
        console.log("entre a buscar la ip");
        const isIpAddress = validateIP(busquedaIp);
        const response = await fetch(
          `https://geo.ipify.org/api/v2/country,city?apiKey=at_Qf1CQWKZ3IRwjq383S2VIN4cG8D5k&${
            isIpAddress ? "ipAddress=" : "domain="
          }${busquedaIp.trim()}`
        );

        if (response.ok) {
          console.log("la respuesta fue ok");
          const datos = await response.json();
          setData(datos);
          setCoords([datos.location.lat, datos.location.lng])
          setShowData(true)
        }

        if(!response.ok){
          alert("Hey!, this is not a IP o a domain!, enter a valid data... idiot.")
          console.error(response.status);
        }
    }
  };

  useEffect(() => {
    busqueda();
  }, []);

  const handleChange = (e) => {
    setIpAddress(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    busqueda(ipAddress);
    setTimeout(() => {
      setIpAddress("");
    }, 200);
  };

  return (
    <div className="relative">
      <header className="w-full h-60 z-10 bg-[url('./images/pattern-bg.png')] bg-cover bg-no-repeat flex flex-col justify-start items-center">
        <div className="contribution">
          Challenge by{" "}
          <a href="https://www.frontendmentor.io?ref=challenge" target="_blank">
            Frontend Mentor
          </a>
          . Coded by{" "}
          <a
            href="https://hctmanuelortiz-portfolio.vercel.app/"
            target="_blank"
          >
            {" "}
            Manuel Ortiz{" "}
          </a>
          .
        </div>
        <h1 className="text-lg lg:text-4xl font-bold mb-5"> IP Address Tracker</h1>
        <form
          className="w-3/4 lg:w-1/2 flex flex-col justify-center"
          onSubmit={handleSubmit}
        >
          <div className="flex flex-row">
            <input
            className="p-3 rounded-l-lg w-full text-sm lg:text-lg"
            type={"text"}
            placeholder="Search for any IP address or domain"
            value={ipAddress}
            onChange={handleChange}
          />
          <button className="px-3 rounded-r-lg bg-gray-900">
            <img src={iconArrow} alt="enviar" />
          </button>
          </div>
          <span className="font-light text-center text-sm lg:text-lg">Example: Enter 1.1.1.1 o www.google.com</span>
        </form>
      </header>
      <div className="centrar-div z-20 grid grid-rows-2 grid-cols-2 sm:flex sm:flex-col lg:flex-row text-center lg:text-start  bg-slate-50 p-1 lg:p-3 rounded-md divide-y-2 lg:divide-y-0 lg:divide-x-2 divide-zinc-200">
          <article className="p-2 mx-[4px] sm:mx-3">
            <p className="text-[10px] sm:text-sm lg:text-md mb-1 sm:mb-3 lg:mb-7 text-gray-400 uppercase tracking-wide">
              IP Address
            </p>
            <h1 className="text-[12px] sm:text-sm lg:text-2xl text-gray-900 text-bold">
              {showData ? `${data.ip}` : "Loading..."}
            </h1>
          </article>
          <article className="p-2 mx-[4px] sm:mx-3">
          <p className="text-[10px] sm:text-sm lg:text-md mb-1 sm:mb-3 lg:mb-7 text-gray-400 uppercase tracking-wide">
              Location
            </p>
            <h1 className="text-[12px] sm:text-sm lg:text-2xl text-gray-900 text-bold">
              {showData
                ? `${data.location.country}, ${data.location.region}, ${data.location.city}`
                : "Loading..."}
            </h1>
          </article>
          <article className="p-2 mx-[4px] sm:mx-3">
          <p className="text-[10px] sm:text-sm lg:text-md mb-1 sm:mb-3 lg:mb-7 text-gray-400 uppercase tracking-wide">
              Timezone
            </p>
            <h1 className="text-[12px] sm:text-sm lg:text-2xl text-gray-900 text-bold">
              {showData ? `UTC ${data.location.timezone}` : "Loading..."}
            </h1>
          </article>
          <article className="p-2 mx-[4px] sm:mx-3">
          <p className="text-[10px] sm:text-sm lg:text-md mb-1 sm:mb-3 lg:mb-7 text-gray-400 uppercase tracking-wide">
              ISP
            </p>
            <h1 className="text-[12px] sm:text-sm lg:text-2xl text-gray-900 text-bold">
              {showData ? `${data.isp}` : "Loading..."}
            </h1>
          </article>
        </div>
      <main className="h-[calc(100vh-240px)] z-0">
        {showData ? (
          data && (
            <MapContainer
              center={coords}
              zoom={15}
              maxZoom={18}
              minZoom={1}
              scrollWheelZoom={true}
              className="h-[calc(100vh-240px)] z-0"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker
                
                position={coords}
                icon={iconMarker}
              >
                <Popup>{`Latitud: ${data.location.lat} | Longitud: ${data.location.lng}`}</Popup>
              </Marker>
              <ChangeMap coordenadas={coords} />
            </MapContainer>
          )
        ) : (
          <p className="text-center"> cargando mapa... </p>
        )}
      </main>
    </div>
  );
};

export default App;
