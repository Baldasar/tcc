import { LineString, Point } from "ol/geom";
import { fromLonLat, toLonLat } from "ol/proj";
import { useRef, useState } from "react";
import {
  RFeature,
  RLayerVector,
  RMap,
  ROSM,
  ROverlay,
} from "rlayers";
import { RStyle, RIcon } from "rlayers/style";
import "./index.css";
import {
  IonButton,
  IonFab,
  IonFabButton,
  IonIcon,
  IonSearchbar,
} from "@ionic/react";
import { add } from "ionicons/icons";
import busIcon from "../../utils/icons/bus.png";

export function Map() {
  const mapRef = useRef<RMap | null>(null);
  const [start, setStart] = useState<[number, number] | null>(null);
  const [destination, setDestination] = useState<[number, number] | null>(null);

  const [startAddress, setStartAddress] = useState<string>("");
  const [destinationAddress, setDestinationAddress] = useState<string>("");

  const [route, setRoute] = useState<[number, number][] | null>(null);

  async function getAddressFromCoordinates(coords: [number, number]) {
    const [lon, lat] = coords;
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&addressdetails=1`
    );
    const data = await response.json();
    return data.address?.road || "";
  }

  const handleDragEnd = async (
    type: "start" | "destination",
    coords: [number, number]
  ) => {
    const newAddress = await getAddressFromCoordinates(coords);

    if (type === "start" && newAddress !== startAddress) {
      setStartAddress(newAddress);
    } else if (type === "destination" && newAddress !== destinationAddress) {
      setDestinationAddress(newAddress);
    }
  };

  async function searchByAddress(
    address: string,
    type: "start" | "destination"
  ) {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&street=${encodeURIComponent(
        address
      )}&city=${encodeURIComponent("Criciúma")}&dedupe=0`
    );
    const data = await response.json();
    if (data.length > 0) {
      const { lat, lon, display_name } = data[0];
      const regex = /^[^,]+/;
      const nome = display_name.match(regex)?.[0];
      if (type === "start") {
        setStart([parseFloat(lon), parseFloat(lat)]);
        setStartAddress(nome);
      } else {
        setDestination([parseFloat(lon), parseFloat(lat)]);
        setDestinationAddress(nome);
      }
    }
  }

  async function getRoute() {
    if (start && destination) {
      const url = `https://router.project-osrm.org/route/v1/driving/${start[0]},${start[1]};${destination[0]},${destination[1]}?overview=full&geometries=geojson`;

      try {
        const response = await fetch(url);
        const data = await response.json();
        const routeGeoJson = data.routes[0].geometry;
        setRoute(routeGeoJson.coordinates);
      } catch (error) {
        console.error("Erro ao calcular a rota:", error);
      }
    }
  }

  return (
    <>
      <IonSearchbar
        value={startAddress}
        onIonInput={(e) => setStartAddress(e.detail.value!)}
        debounce={500}
        placeholder="PONTO DE INICIO"
        showClearButton="focus"
      />
      <IonButton onClick={() => searchByAddress(startAddress, "start")}>
        Buscar
      </IonButton>
      <IonSearchbar
        value={destinationAddress}
        onIonInput={(e) => setDestinationAddress(e.detail.value!)}
        debounce={500}
        placeholder="DESTINO"
        showClearButton="focus"
      />
      <IonButton
        onClick={() => searchByAddress(destinationAddress, "destination")}
      >
        Buscar
      </IonButton>
      <IonButton onClick={getRoute}>Calcular Rota</IonButton>

      <IonFab slot="fixed" vertical="bottom" horizontal="center">
        <IonFabButton>
          <IonIcon icon={add}></IonIcon>
        </IonFabButton>
      </IonFab>

      <RMap
        key="map"
        ref={mapRef}
        width={"100%"}
        height={"100%"}
        noDefaultControls={true}
        initial={{ center: [-5495978.50530453, -3334841.7245624186], zoom: 14 }}
      >
        <ROSM />
        {/* <RLayerTileWebGL
          url={
            "https://apps.geo360.com.br/dados/criciuma/2024_v2_tiles/{z}/{x}/{y}.webp"
          }
        /> */}
        <RLayerVector zIndex={10}>
          {start && (
            <RFeature
              geometry={new Point(fromLonLat(start))}
              onPointerEnter={(e) => {
                e.map.getTargetElement().style.cursor = "move";
              }}
              onPointerLeave={(e) => {
                e.map.getTargetElement().style.cursor = "initial";
              }}
              onPointerDrag={(e) => {
                const coords = e.map.getCoordinateFromPixel(e.pixel);
                e.target.setGeometry(new Point(coords));
                return false;
              }}
              onPointerDragEnd={(e) => {
                const coords = e.map.getCoordinateFromPixel(e.pixel);
                setStart(toLonLat(coords) as [number, number]);
                handleDragEnd("start", toLonLat(coords) as [number, number]);
                return false;
              }}
            >
              <RStyle>
                <RIcon src={busIcon}  />
              </RStyle>
              <ROverlay className="pointer-events-none absolute w-max select-none rounded-lg border border-gray-300 bg-white p-4 font-sans shadow-md">Ponto de inicio</ROverlay>
            </RFeature>
          )}
          {destination && (
            <RFeature
              geometry={new Point(fromLonLat(destination))}
              onPointerEnter={(e) => {
                e.map.getTargetElement().style.cursor = "move";
              }}
              onPointerLeave={(e) => {
                e.map.getTargetElement().style.cursor = "initial";
              }}
              onPointerDrag={(e) => {
                const coords = e.map.getCoordinateFromPixel(e.pixel);
                e.target.setGeometry(new Point(coords));
                return false;
              }}
              onPointerDragEnd={(e) => {
                const coords = e.map.getCoordinateFromPixel(e.pixel);
                setDestination(toLonLat(coords) as [number, number]);
                handleDragEnd(
                  "destination",
                  toLonLat(coords) as [number, number]
                );
                return false;
              }}
            >
              <ROverlay className="example-overlay">Ponto de destino</ROverlay>
            </RFeature>
          )}
          {route && (
            <RFeature
              geometry={new LineString(route.map((coord) => fromLonLat(coord)))}
            />
          )}
        </RLayerVector>
      </RMap>
    </>
  );
}
