(function () {
  if (window.vcLoaded) return;
  window.vcLoaded = true;

  const loadSettings = () => {
    try {
      return JSON.parse(localStorage.getItem("vc_settings") || "{}");
    } catch (e) { return {}; }
  };

  const saveSettings = (settings) => {
    localStorage.setItem("vc_settings", JSON.stringify(settings));
  };

  const settings = loadSettings();
  const buttons = [];

  const makeButton = (label, x, y, key) => {
    const btn = document.createElement("div");
    btn.textContent = label;
    btn.style.position = "fixed";
    btn.style.left = x + "px";
    btn.style.top = y + "px";
    btn.style.width = "60px";
    btn.style.height = "60px";
    btn.style.background = "rgba(255,255,255,0.4)";
    btn.style.color = "#000";
    btn.style.borderRadius = "50%";
    btn.style.textAlign = "center";
    btn.style.lineHeight = "60px";
    btn.style.zIndex = 999999;
    btn.style.touchAction = "none";

    btn.onpointerdown = () => {
      const down = new KeyboardEvent("keydown", { key });
      const up = new KeyboardEvent("keyup", { key });
      document.dispatchEvent(down);
      setTimeout(() => document.dispatchEvent(up), 100);
    };

    let isDragging = false;
    btn.onpointerdown = (e) => {
      isDragging = true;
      const startX = e.clientX - btn.offsetLeft;
      const startY = e.clientY - btn.offsetTop;
      const move = (e) => {
        if (!isDragging) return;
        btn.style.left = (e.clientX - startX) + "px";
        btn.style.top = (e.clientY - startY) + "px";
      };
      const stop = () => {
        isDragging = false;
        document.removeEventListener("pointermove", move);
        document.removeEventListener("pointerup", stop);
      };
      document.addEventListener("pointermove", move);
      document.addEventListener("pointerup", stop);
    };

    document.body.appendChild(btn);
    buttons.push({ label, x, y, key });
  };

  makeButton("A", 50, window.innerHeight - 100, "a");
  makeButton("B", 120, window.innerHeight - 100, "b");
  makeButton("⇦", 20, 20, "ArrowLeft");
  makeButton("⇨", 100, 20, "ArrowRight");

  window.addEventListener("beforeunload", () => {
    saveSettings({ buttons });
  });
})();

