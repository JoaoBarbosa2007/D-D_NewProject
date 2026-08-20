document.querySelectorAll(".site-nav a").forEach((link) => {
  if (link.pathname === window.location.pathname) link.classList.add("active");
});
