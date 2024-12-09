// import "./tailwind-preflight.css";
import "./style.css";
import "./neotoc.css";
import neotoc from "neotoc";

neotoc({
  io: "article >> h* >> #sidebar",
  theme: "moonlight-dark",
  ellipsis: true,
});
neotoc({
  io: "article >> h* >> #sidebar-1",
  theme: "vinci-dark",
  ellipsis: true,
});
