import {
  IonContent,
  IonPage,
} from "@ionic/react";
import { Map } from "../../components/map";
import "./index.css";

export function Home() {
  return (
    <IonPage>
      <IonContent fullscreen>
        <Map />
      </IonContent>
    </IonPage>
  );
}
