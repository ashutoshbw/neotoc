// import "./tailwind-preflight.css";
import "./style.css";
import "./neotoc.css";
import "./neotoc-override.css";
import neotoc from "neotoc";

const breadcrumbDiv = document.querySelector(".breadcrumb");

neotoc({
  io: "article >> h* >> #sidebar",
  ellipsis: true,
  title: "On this page",
  onBreadcrumbChange(data) {
    if (breadcrumbDiv) {
      breadcrumbDiv.innerHTML = "";
      data.forEach((item) => {
        const a = document.createElement("a");
        a.append(item.content);
        a.href = item.hash;
        a.className = "breadcrumb-item";
        breadcrumbDiv.append(a);
      });
    }
  },
});
