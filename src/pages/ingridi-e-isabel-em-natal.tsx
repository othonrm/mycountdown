import { useEffect, useMemo, useRef, useState } from "react";
import html2canvas from "html2canvas";

export default function Countdown() {
  const countdown = {
    displayName: "Viagem à Natal! \n 🛫🌴🏖️",
    datetime: "2024-11-28T08:00:00-03:00",
    backgroundImage: "/assets/images/ingridi-sogra-1.jpeg",
  };

  const countdownDate = useMemo(
    () => new Date(countdown.datetime),
    [countdown.datetime]
  );

  const [timeLeft, setTimeLeft] = useState({
    years: 0,
    months: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const difference = countdownDate.getTime() - now.getTime();
      const years = Math.floor(difference / (1000 * 60 * 60 * 24 * 365));
      const months = Math.floor(
        (difference % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24 * 30)
      );
      const days = Math.floor(
        (difference % (1000 * 60 * 60 * 24 * 30)) / (1000 * 60 * 60 * 24)
      );
      const hours = Math.floor(
        (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);
      setTimeLeft({
        years,
        months,
        days,
        hours,
        minutes,
        seconds,
      });
    };

    updateCountdown();

    const countdownInterval = setInterval(updateCountdown, 1000);
    return () => {
      clearInterval(countdownInterval);
    };
  }, [countdownDate]);

  const timeLeftDisplay = [
    timeLeft.days > 0 ? `${timeLeft.days} dias,` : "",
    timeLeft.hours.toString().padStart(2, "0"),
    "horas,",
    timeLeft.minutes.toString().padStart(2, "0"),
    "minutos e",
    timeLeft.seconds.toString().padStart(2, "0"),
    "segundos",
  ].join(" ");

  const screenshotRef = useRef(null);

  const captureScreenshot = async () => {
    if (screenshotRef.current) {
      const hiddenElements = document.querySelectorAll(".screenshot-hidden");
      hiddenElements.forEach((el) => {
        (el as HTMLElement).style.display = "none";
      });

      const canvas = await html2canvas(screenshotRef.current, {
        scale: window.devicePixelRatio,
      });
      const image = canvas.toDataURL("image/png");

      hiddenElements.forEach((el) => {
        (el as HTMLElement).style.display = "";
      });

      // Only download on local
      if (window.location.hostname === "localhost") {
        const link = document.createElement("a");
        link.href = image;
        link.download = "screenshot.png";
        link.click();
        return;
      }

      // Or for sharing, if using the Web Share API
      if (navigator.share) {
        try {
          // Remove line breaks from the display name
          const displayNameSingleLine = countdown.displayName.replace(
            /\n/g,
            " "
          );

          await navigator.share({
            title: `Minha contagem regressiva para ${displayNameSingleLine}`,
            text: `Faltam ${timeLeftDisplay} \n Venha conferir e fazer a sua ${window.location.href}`,
            files: [
              new File(
                [await fetch(image).then((res) => res.blob())],
                "screenshot.png",
                { type: "image/png" }
              ),
            ],
          });
        } catch (error) {
          console.error("Error sharing:", error);
        }
      }
    }
  };

  return (
    <div
      className="relative"
      style={{
        backgroundImage: `url(${countdown.backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
      ref={screenshotRef}
    >
      <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 text-gray-800">
        <main className="bg-white bg-opacity-60 rounded-md shadow-lg p-6 relative flex flex-col gap-8 row-start-2 items-center text-center max-w-screen-sm">
          <h1 className="text-4xl sm:text-5xl font-bold text-center">Faltam</h1>

          <div className="flex gap-4 items-center flex-wrap justify-center">
            <span className="text-4xl sm:text4xl font-bold">
              {/* {timeLeft.days > 0 ? `${timeLeft.days} dias` : ""}
              <br /> */}
              {timeLeftDisplay}
            </span>
            <p className="text-gray-600 text-xs">
              (
              {countdownDate.toLocaleString("pt-BR", {
                weekday: "short",
                day: "numeric",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
              )
            </p>
          </div>

          <h1 className="text-4xl font-bold text-center whitespace-pre-line leading-normal">
            Para a {countdown.displayName}
          </h1>

          <div className="flex gap-4 items-center flex-col sm:flex-row">
            <button
              className="screenshot-hidden hover:text-white rounded-full border border-solid border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44"
              onClick={captureScreenshot}
            >
              Compartilhar no Instagram
            </button>
          </div>
        </main>
        <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
          <a
            className="screenshot-hidden rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-white/70 text-foreground gap-2 hover:bg-white text-xs sm:text-sm h-8 sm:h-10 px-4 sm:px-5"
            href="/new"
            target="_blank"
            rel="noopener noreferrer"
          >
            Criar minha contagem
          </a>
        </footer>
      </div>
    </div>
  );
}
