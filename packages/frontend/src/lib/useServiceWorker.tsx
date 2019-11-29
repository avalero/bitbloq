import React, {
  createContext,
  FC,
  useState,
  useEffect,
  useContext
} from "react";

if (typeof window !== "undefined") {
  // tslint:disable-next-line: no-implicit-dependencies
  import("worker-loader?name=service-worker.js!../service-worker/index.ts");
}

export const ServiceWorkerContext = createContext<ServiceWorker | null>(null);

export const ServiceWorkerProvider: FC = ({ children }) => {
  const [serviceWorker, setServiceWorker] = useState<ServiceWorker | null>(
    null
  );

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/service-worker.js", { scope: "/" })
        .then(registration => {
          if (registration.active) {
            console.log("activado");
            setServiceWorker(registration.active);
          }
        })
        .catch(registrationError => {
          console.log("SW registration failed: ", registrationError);
        });
    }
  }, []);

  return (
    <ServiceWorkerContext.Provider value={serviceWorker}>
      {children}
    </ServiceWorkerContext.Provider>
  );
};

const useServiceWorker = () => useContext(ServiceWorkerContext);

export default useServiceWorker;
