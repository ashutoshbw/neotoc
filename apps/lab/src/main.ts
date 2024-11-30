// import "./tailwind-preflight.css";
import "./style.css";
import "./neotoc.css";
import neotoc from "neotoc";

const toc = neotoc({ io: "article >> h* >> #sidebar", autoFold: true });
console.log(toc);
