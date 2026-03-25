import LCDScreen from "./lcd-screen";

export default function Hero() {
  return (
    <section className="mt-2 font-bitcount">
      <LCDScreen statusLabel="ALL SYSTEMS UP AND RUNNING">
        <h1 className="text-4xl font-bold tracking-tight">
          Ressurser for Arduino-prosjektet
        </h1>
      </LCDScreen>
    </section>
  );
}
