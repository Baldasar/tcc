import { useState } from "react";
import { IonButton, IonContent } from "@ionic/react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import { Geolocation } from "@capacitor/geolocation";

import "swiper/css";
import "swiper/css/pagination";
import "./styles.css";
import { useIntroStore } from "../../state/intro";
import { setIntroStatus } from "../../services/db.service";

const steps = [
  {
    id: "1",
    title: "Geolocalização",
    description:
      "Para que o aplicativo funcione corretamente, precisamos da sua localização.",
    next: true,
    requestLocation: true,
  },
  {
    id: "2",
    title: "Tudo certo",
    description: "Agora você pode visualizar os locais próximos a você.",
    next: false,
  },
];

export default function Intro() {
  const markIntroAsSeen = useIntroStore((state) => state.markIntroAsSeen);

  const [locationPermission, setLocationPermission] = useState(false);

  const pagination = {
    clickable: true,
    renderBullet: (index, className) =>
      `<span class="${className}">${index + 1}</span>`,
  };

  const handleShareLocation = async () => {
    const perm = await Geolocation.requestPermissions();

    if (perm.location === "granted") {
      setLocationPermission(true);
    }
  };

  const closeIntroduction = () => {
    markIntroAsSeen();
  };

  return (
    <IonContent fullscreen>
      <Swiper pagination={pagination} modules={[Pagination]}>
        {steps.map((step) => (
          <SwiperSlide key={step.id} className="swiper-slide">
            <div className="flex flex-col justify-between items-center h-screen p-5 box-border">
              <h2 className="text-center text-2xl font-bold text-black my-3">
                {step.title}
              </h2>
              <p className="text-center text-black my-3 max-w-lg">
                {step.description}
              </p>

              <div className="flex flex-col justify-center items-center w-full mt-auto">
                {step.requestLocation && !locationPermission && (
                  <div className="flex justify-center items-center gap-3 mt-5 mb-12">
                    <IonButton
                      expand="block"
                      className="w-auto bg-blue-600 hover:bg-blue-700 text-white"
                      onClick={() => handleShareLocation()}
                    >
                      Compartilhar localização
                    </IonButton>
                  </div>
                )}

                {!step.next && (
                  <div className="flex justify-center items-center gap-3 mt-5 mb-12">
                    <IonButton
                      expand="block"
                      className="w-auto bg-blue-600 hover:bg-blue-700 text-white"
                      onClick={() => closeIntroduction()}
                    >
                      Ir para o mapa
                    </IonButton>
                    <IonButton
                      fill="outline"
                      className="w-auto"
                      onClick={() => closeIntroduction()}
                    >
                      Ir para o tutorial
                    </IonButton>
                  </div>
                )}
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </IonContent>
  );
}
