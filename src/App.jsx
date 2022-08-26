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


  const ChangeMap = () => {
    const map = useMap();
    map.setView([data.location.lat, data.location.lng]);
    map.flyTo([data.location.lat, data.location.lng], map.getMaxZoom());
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
      const currentIpResponse = await fetch(
        "https://api.ipify.org/?format=json"
      );

      const { ip: currentIp } = await currentIpResponse.json();

      busquedaIp = currentIp;
      console.log(busquedaIp);
    }

    if (busquedaIp) {
      console.log("entre a buscar la ip");
      const isIpAddress = validateIP(busquedaIp);
      const response = await fetch(
        `https://geo.ipify.org/api/v2/country,city?apiKey=at_JlF9smATksrkReNyCKG2ei8NSbU2x&${
          isIpAddress ? "ipAddress=" : "domain="
        }${busquedaIp.trim()}`
      );

      if (response.ok) {
        console.log("la respuesta fue ok");
        const datos = await response.json();
        setData(datos)
        console.log("esto es data en function", data);
      }

      if(!response.ok){
        alert("el dato recibido no es valido.")
      }
    }
  };

  useEffect(() => {  
   busqueda()
    console.log("esto es data en useEffect", data);
    console.log("la busqueda fue un exito");
    setTimeout( () => {
      setShowData(true);
    }, 500)
  }, []);

  const handleChange = (e) => {
    setIpAddress(e.target.value);
  };

  const handleSubmit = (e) => {
    console.log("ejecute el handleSubmit")
    e.preventDefault();
    busqueda(ipAddress);
    setTimeout(() => {
      setIpAddress("")
    }, 200);
  };

  return (
    <div>
      <header className="w-full h-80 z-10 bg-[url('./images/pattern-bg.png')] bg-cover bg-no-repeat flex flex-col justify-center items-center">
        <h1 className="text-4xl font-bold"> IP Address Tracker</h1>
        <div className="attribution">
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
        <form
          className="w-96 translate-y-6 flex flex-row"
          onSubmit={handleSubmit}
        >
          <input
            className="p-3 rounded-l-lg w-full"
            type={"text"}
            placeholder="Search for any IP address or domain"
            value={ipAddress}
            onChange={handleChange}
          />
          <button className="px-3 rounded-r-lg bg-gray-900">
            <img src={iconArrow} alt="enviar" />
          </button>
        </form>
        <div className="translate-y-28 z-20 flex flex-row bg-slate-50 p-3 rounded-md divide-x-2 divide-zinc-200">
          <article className="p-2 mx-3">
            <p className="text-md mb-7 text-gray-400 uppercase tracking-wide">
              IP Address
            </p>
            <h1 className="text-3xl text-gray-900">
              {showData ? `${data.ip}` : "Loading..."}
            </h1>
          </article>
          <article className="p-2 mx-3">
            <p className="text-md mb-7 text-gray-400 uppercase tracking-wide">
              Location
            </p>
            <h1 className="text-3xl text-gray-900">
              {showData
                ? `${data.location.country}, ${data.location.region}, ${data.location.city}`
                : "Loading..."}
            </h1>
          </article>
          <article className="p-2 mx-3">
            <p className="text-md mb-7 text-gray-400 uppercase tracking-wide">
              Timezone
            </p>
            <h1 className="text-3xl text-gray-900">
              {showData ? `UTC ${data.location.timezone}` : "Loading..."}
            </h1>
          </article>
          <article className="p-2 mx-3">
            <p className="text-md mb-7 text-gray-400 uppercase tracking-wide">
              ISP
            </p>
            <h1 className="text-3xl text-gray-900">
              {showData ? `${data.isp}` : "Loading..."}
            </h1>
          </article>
        </div>
      </header>
      <main className="h-[calc(100vh-320px)] z-0">
        {data && (
          <MapContainer
            center={[data.location.lat, data.location.lng]}
            zoom={20}
            scrollWheelZoom={true}
            className="h-[calc(100vh-320px)] z-0"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker
              position={[data.location.lat, data.location.lng]}
              icon={iconMarker}
            >
              <Popup>{`Latitud: ${data.location.lat} | Longitud: ${data.location.lng}`}</Popup>
            </Marker>


            <ChangeMap />


          </MapContainer>
        )}
      </main>
    </div>
  );
};

export default App;
