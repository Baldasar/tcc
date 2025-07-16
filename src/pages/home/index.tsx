import { IonContent, IonPage, IonSpinner } from "@ionic/react";
import "./index.css";
import { useEffect } from "react";
import { getDisplayIntro, makeDatabase } from "../../services/db.service";
import Intro from "../../components/intro";
import Map from "../../components/map";
import { useIntroStore } from "../../state/intro";

export function Home() {
  const hasSeenIntro = useIntroStore((state) => state.hasSeenIntro);
  const setHasSeenIntro = useIntroStore((state) => state.setHasSeenIntro);

  const init = async () => {
    try {
      await makeDatabase();
      const viewed = await getDisplayIntro();
      setHasSeenIntro(viewed);
    } catch (error) {
      console.error("An error occurred during initialization:", error);
    }
  };

  useEffect(() => {
    init();
  }, []);

  if (hasSeenIntro === null) {
    return (
      <IonPage>
        <IonContent fullscreen className="relative bg-white">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex flex-col items-center space-y-4">
              <IonSpinner name="crescent" className="w-12 h-12 text-primary" />
              <p className="text-lg font-medium text-gray-700">Carregando...</p>
            </div>
          </div>
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <IonContent fullscreen>{!hasSeenIntro ? <Intro /> : <Map />}</IonContent>
    </IonPage>
  );
}
