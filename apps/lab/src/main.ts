// import "./tailwind-preflight.css";
import "./style.css";
import "./neotoc.css";
import "./neotoc-override.css";
import neotoc from "neotoc";

neotoc({
  io: "article >> h* >> #sidebar",
  ellipsis: true,
  title: "On this page",
  autoFold: true,
});
