// import "./tailwind-preflight.css";
import "./style.css";
import "./neotoc.css";
import neotoc from "neotoc";

neotoc({
  io: "article >> h* >> #sidebar",
  theme: "parchment-light",
  ellipsis: true,
});
neotoc({
  io: "article >> h* >> #sidebar-1",
  theme: "parchment-dark",
  ellipsis: true,
});
