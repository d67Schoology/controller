(function () {
  if (window.vcLoaded) return;
  window.vcLoaded = true;

  const loadSettings = () => {
    try {
      return JSON.parse(localStorage.getItem("vc_settings") || '{"joysticks": [], "buttons": [], "transparency": 0.4, "tint": "#000000"}');
    } catch (e) { return {}; }
  };

  const saveSettings = (settings) => {
    localStorage.setItem("vc_settings", JSON.stringify(settings));
  };

  const settings = loadSettings();
  const buttons = [];
  const joysticks = [];
  
  const makeButton = (label, x, y, key) => {
    const btn = document.createElement("div");
    btn.textContent = label;
    btn.style.position = "fixed";
    btn.style.left = x + "px";
    btn.style.top = y + "px";
    btn.style.width = "12vw";
    btn.style.height = "12vw";
    btn.style.background = `rgba(255,255,255,${settings.transparency})`;
    btn.style.color = "#000";
    btn.style.borderRadius = "50%";
    btn.style.textAlign = "center";
    btn.style.lineHeight = "12vw";
    btn.style.zIndex = 999999;
    btn.style.touchAction = "none";

    btn.onpointerdown = () => {
      const down = new KeyboardEvent("keydown", { key });
      const up = new KeyboardEvent("keyup", { key });
      document.dispatchEvent(down);
      setTimeout(() => document.dispatchEvent(up), 100);
    };

    document.body.appendChild(btn);
    buttons.push({ label, x, y, key });
  };

  const makeJoystick = (x, y, keyLeft, keyRight) => {
    const joystick = document.createElement("div");
    joystick.style.position = "fixed";
    joystick.style.left = x + "px";
    joystick.style.top = y + "px";
    joystick.style.width = "16vw";
    joystick.style.height = "16vw";
    joystick.style.background = `rgba(255,255,255,${settings.transparency})`;
    joystick.style.borderRadius = "50%";
    joystick.style.border = "3px solid #ccc";
    joystick.style.zIndex = 999999;

    const thumb = document.createElement("div");
    thumb.style.position = "absolute";
    thumb.style.width = "8vw";
    thumb.style.height = "8vw";
    thumb.style.backgroundColor = "#00bcd4";
    thumb.style.borderRadius = "50%";
    thumb.style.left = "50%";
    thumb.style.top = "50%";
    thumb.style.transform = "translate(-50%, -50%)";
    joystick.appendChild(thumb);

    let isDragging = false;
    let startX = 0, startY = 0;

    joystick.ontouchstart = (e) => {
      e.preventDefault();
      isDragging = true;
      startX = e.touches[0].clientX - joystick.offsetLeft;
      startY = e.touches[0].clientY - joystick.offsetTop;
      document.addEventListener("touchmove", moveJoystick);
      document.addEventListener("touchend", stopJoystick);
    };

    function moveJoystick(e) {
      if (!isDragging) return;
      joystick.style.left = e.touches[0].clientX - startX + "px";
      joystick.style.top = e.touches[0].clientY - startY + "px";

      const moveEvent = new KeyboardEvent("keydown", { key: keyLeft });
      document.dispatchEvent(moveEvent);
    }

    function stopJoystick() {
      isDragging = false;
      document.removeEventListener("touchmove", moveJoystick);
      document.removeEventListener("touchend", stopJoystick);
    }

    document.body.appendChild(joystick);
    joysticks.push({ x, y, keyLeft, keyRight });
  };

  // Default controls
  makeButton("A", 5, window.innerHeight - 20, "a");
  makeButton("B", 20, window.innerHeight - 20, "b");

  makeJoystick(5, window.innerHeight - 50, "ArrowLeft", "ArrowRight");

  // Settings page to manage layout
  const settingsPage = document.createElement("div");
  settingsPage.style.position = "fixed";
  settingsPage.style.top = "10%";
  settingsPage.style.left = "10%";
  settingsPage.style.width = "80%";
  settingsPage.style.background = "rgba(0,0,0,0.8)";
  settingsPage.style.color = "white";
  settingsPage.style.padding = "20px";
  settingsPage.style.borderRadius = "10px";
  settingsPage.style.zIndex = 9999999;
  settingsPage.style.display = "none"; // Initially hidden

  const transparencySlider = document.createElement("input");
  transparencySlider.type = "range";
  transparencySlider.min = 0;
  transparencySlider.max = 1;
  transparencySlider.step = 0.05;
  transparencySlider.value = settings.transparency;
  transparencySlider.oninput = () => {
    settings.transparency = parseFloat(transparencySlider.value);
    saveSettings(settings);
  };

  const tintPicker = document.createElement("input");
  tintPicker.type = "color";
  tintPicker.value = settings.tint;
  tintPicker.oninput = () => {
    settings.tint = tintPicker.value;
    saveSettings(settings);
  };

  const closeSettings = document.createElement("button");
  closeSettings.textContent = "Close Settings";
  closeSettings.onclick = () => settingsPage.style.display = "none";

  settingsPage.appendChild(transparencySlider);
  settingsPage.appendChild(tintPicker);
  settingsPage.appendChild(closeSettings);
  document.body.appendChild(settingsPage);

  const toggleSettings = document.createElement("div");
  toggleSettings.textContent = "⚙️";
  toggleSettings.style.position = "fixed";
  toggleSettings.style.bottom = "10px";
  toggleSettings.style.right = "10px";
  toggleSettings.style.width = "12vw";
  toggleSettings.style.height = "12vw";
  toggleSettings.style.borderRadius = "50%";
  toggleSettings.style.background = "rgba(0,0,0,0.6)";
  toggleSettings.style.color = "white";
  toggleSettings.style.textAlign = "center";
  toggleSettings.style.lineHeight = "12vw";
  toggleSettings.style.zIndex = 99999999;
  toggleSettings.onclick = () => {
    settingsPage.style.display = settingsPage.style.display === "none" ? "block" : "none";
  };
  document.body.appendChild(toggleSettings);
})();

