import {
  SiFacebook,
  SiYoutube,
  SiGoogle,
  SiInstagram,
  SiGmail,
  SiWhatsapp,
  SiGoogleads,
  SiGoogleanalytics,
  SiMailchimp,
  SiSemrush,
} from "react-icons/si";
import { FaLinkedin } from "react-icons/fa6";

// Custom Canva icon component (Simple Icons does not distribute Canva due to trademark policies)
const SiCanva = (props) => (
  <svg
    stroke="currentColor"
    fill="currentColor"
    strokeWidth="0"
    role="img"
    viewBox="0 0 24 24"
    height="1em"
    width="1em"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <title>Canva</title>
    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12s12-5.373 12-12S18.627 0 12 0M6.962 7.68c.754 0 1.337.549 1.405 1.2c.069.583-.171 1.097-.822 1.406c-.343.171-.48.172-.549.069c-.034-.069 0-.137.069-.206c.617-.514.617-.926.548-1.508c-.034-.378-.308-.618-.583-.618c-1.2 0-2.914 2.674-2.674 4.629c.103.754.549 1.646 1.509 1.646c.308 0 .65-.103.96-.24c.5-.264.799-.47 1.097-.8c-.073-.885.704-2.046 1.851-2.046c.515 0 .926.205.96.583c.068.514-.377.582-.514.582s-.378-.034-.378-.17c-.034-.138.309-.07.275-.378c-.035-.206-.24-.274-.446-.274c-.72 0-1.131.994-1.029 1.611c.035.275.172.549.447.549c.205 0 .514-.31.617-.755c.068-.308.343-.514.583-.514c.102 0 .17.034.205.171v.138c-.034.137-.137.548-.102.651c0 .069.034.171.17.171c.092 0 .436-.18.777-.459c.117-.59.253-1.298.253-1.357c.034-.24.137-.48.617-.48c.103 0 .171.034.205.171v.138l-.136.617c.445-.583 1.097-.994 1.508-.994c.172 0 .309.102.309.274c0 .103 0 .274-.069.446c-.137.377-.309.96-.412 1.474c0 .137.035.274.207.274s.685-.206 1.096-.754l.007-.004c-.002-.068-.007-.134-.007-.202c0-.411.035-.754.104-.994c.068-.274.411-.514.617-.514c.103 0 .205.069.205.171c0 .035 0 .103-.034.137c-.137.446-.24.857-.24 1.269c0 .24.034.582.102.788c0 .034.035.069.07.069c.068 0 .548-.445.89-1.028c-.308-.206-.48-.549-.48-.96c0-.72.446-1.097.858-1.097c.343 0 .617.24.617.72c0 .308-.103.65-.274.96h.102a.77.77 0 0 0 .584-.24a.3.3 0 0 1 .134-.117c.335-.425.83-.74 1.41-.74c.48 0 .924.205.959.582c.068.515-.378.618-.515.618l-.002-.002c-.138 0-.377-.035-.377-.172s.309-.068.274-.376c-.034-.206-.24-.275-.446-.275c-.686 0-1.13.891-1.028 1.611c.034.275.171.583.445.583c.206 0 .515-.308.652-.754c.068-.274.343-.514.583-.514c.103 0 .17.034.205.171c0 .069 0 .206-.137.652c-.17.308-.171.48-.137.617c.034.274.171.48.309.583c.034.034.068.102.068.102c0 .069-.034.138-.137.138c-.034 0-.446-.172-.823-.481c-.48.343-1.028.652-1.371.652c-.308 0-.617-.171-.72-.48c-.068-.206-.102-.446-.137-.686c-.24-.034-.48-.103-.685-.24c-.378-.24-.72-.549-1.098-.789c-.308.583-.788.995-1.336.995c-.343 0-.652-.103-.926-.274c-.411-.274-.685-.48-1.028-.857c.034.72-.514 1.68-1.576 1.68c-.618 0-1.132-.377-1.338-.96c-.342.617-.891.96-1.542.96c-.48 0-.926-.172-1.27-.481c-.513-.48-.822-1.131-.891-1.851c-.069-.788.206-1.542.754-2.125c.548-.583 1.268-.926 2.056-.994c.515-.035 1.029.034 1.509.206c.308.103.583.24.857.411c.411-1.337 1.817-2.365 3.393-2.365c.617 0 1.234.172 1.748.48c.172.103.343.206.514.343c.103.069.206.137.309.206c.034-.685-.411-1.268-1.165-1.508c-.412-.138-.858-.206-1.303-.206c-1.371 0-2.64 1.028-3.085 2.365c-.24-.137-.48-.274-.754-.377c-.514-.206-1.062-.275-1.576-.24c-1.132.069-2.195.583-2.915 1.405c-.72.823-1.096 1.886-.994 2.982c.103 1.098.685 2.058 1.576 2.675c.892.617 1.989.823 3.018.549c.891-.24 1.646-.823 2.16-1.577c.308.411.754.72 1.234.926c.48.206 1.028.308 1.576.308c1.372 0 2.64-1.028 3.086-2.366c.24.137.48.275.754.378c.514.205 1.063.274 1.577.24c1.131-.069 2.194-.583 2.914-1.405c.72-.823 1.097-1.886.994-2.983c-.103-1.097-.685-2.057-1.577-2.674c-.891-.617-1.988-.823-3.017-.549c-.891.24-1.646.823-2.16 1.577c-.343-.48-.823-.823-1.337-1.097c-.515-.274-1.098-.411-1.68-.411c-1.028 0-2.023.411-2.743 1.131c-.308-.514-.788-.857-1.337-.994c-.172-.034-.343-.034-.514-.034zm3.943 3.6c.412 0 .823.137 1.166.377c.343.24.617.583.788.995c.172.411.206.857.103 1.302c-.103.446-.343.857-.686 1.166c-.343.308-.754.514-1.2 .582-.446.069-.891 0-1.303-.171-.411-.171-.754-.446-1.028-.788c-.275-.343-.446-.755-.48-1.166c-.035-.411.069-.823.31-1.166c.24-.342.583-.617.994-.788c.411-.171.858-.24 1.303-.24z" />
  </svg>
);

const icons = [
  // Left Perimeter & Margin (framing the hero copy & features)
  { Icon: SiCanva, color: "#00C4CC", top: "18%", left: "3.5%", duration: "7.5s", delay: "0s" },
  { Icon: SiSemrush, color: "#FF642D", top: "11%", left: "42%", duration: "9s", delay: "1.2s" },
  { Icon: SiMailchimp, color: "#FFE01B", top: "44%", left: "2.5%", duration: "10s", delay: "2.5s" },
  { Icon: SiYoutube, color: "#FF0000", top: "67%", left: "3.5%", duration: "8s", delay: "1.5s" },
  { Icon: SiGoogleads, color: "#4285F4", top: "90%", left: "24%", duration: "8.5s", delay: "2s" },
  { Icon: SiWhatsapp, color: "#25D366", top: "72%", left: "54%", duration: "9.5s", delay: "3s" },

  // Right Perimeter (framing the application form corners & flanks)
  { Icon: SiFacebook, color: "#1877F2", top: "13%", right: "33%", duration: "8s", delay: "1.8s" },
  { Icon: SiGoogle, color: "#4285F4", top: "13%", right: "4.5%", duration: "10s", delay: "0.5s" },
  { Icon: SiGoogleanalytics, color: "#E37400", top: "47%", right: "35%", duration: "7.5s", delay: "1.2s" },
  { Icon: SiGmail, color: "#EA4335", top: "51%", right: "2%", duration: "8.5s", delay: "0.8s" },
  { Icon: SiInstagram, color: "#E4405F", top: "86%", right: "33%", duration: "9s", delay: "2.2s" },
  { Icon: FaLinkedin, color: "#0A66C2", top: "86%", right: "4.5%", duration: "7s", delay: "0.5s" },
];

const FloatingIcons = () => {
  return (
    <div
      className="pointer-events-none absolute inset-0 -z-0 overflow-hidden hidden md:block"
      aria-hidden="true"
    >
      {icons.map(({ Icon, color, duration, delay, ...position }, index) => (
        <div
          key={index}
          className="absolute flex items-center justify-center rounded-[14px] bg-white/95 backdrop-blur-md border border-black/[0.06] shadow-[0_10px_25px_-4px_rgba(0,0,0,0.08),0_4px_6px_-2px_rgba(0,0,0,0.04)] w-[clamp(38px,3.2vw,50px)] h-[clamp(38px,3.2vw,50px)] will-change-transform"
          style={{
            position: "absolute",
            top: position.top,
            left: position.left,
            right: position.right,
            bottom: position.bottom,
            animation: `floatCard ${duration} ease-in-out infinite ${delay}`,
          }}
        >
          <Icon
            style={{ color }}
            className="w-[clamp(20px,1.8vw,26px)] h-[clamp(20px,1.8vw,26px)] shrink-0"
          />
        </div>
      ))}

      <style>{`
        @keyframes floatCard {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-10px) rotate(3deg);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          @keyframes floatCard {
            0%, 100% {
              transform: none;
            }
          }
        }
      `}</style>
    </div>
  );
};

export default FloatingIcons;
