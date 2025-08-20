(function () {
  // Create the launcher button
  const btn = document.createElement("button");
  btn.textContent = "PRESS HERE FOR MORE INFORMATION ON OUR RENTALS";
  Object.assign(btn.style, {
    position: "fixed", right: "20px", bottom: "20px", zIndex: "9999",
    padding: "12px 16px", border: "0", borderRadius: "8px",
    background: "#0ea5e9", color: "#fff", cursor: "pointer",
    boxShadow: "0 6px 16px rgba(0,0,0,.2)", fontFamily: "system-ui, Arial, sans-serif"
  });
  document.body.appendChild(btn);

  // Simple chat box
  const box = document.createElement("div");
  Object.assign(box.style, {
    position: "fixed", right: "20px", bottom: "80px",
    width: "340px", height: "460px", background: "#fff",
    border: "1px solid #e5e7eb", borderRadius: "12px",
    boxShadow: "0 10px 30px rgba(0,0,0,.15)", display: "none", overflow: "hidden",
    fontFamily: "system-ui, Arial, sans-serif"
  });
  box.innerHTML = `
    <div style="background:#0f172a;color:#fff;padding:10px 12px;font-weight:600;display:flex;justify-content:space-between;align-items:center">
      <span>Carnegie Cap LLC — Rentals</span>
      <button id="cc-close" style="background:transparent;border:0;color:#fff;font-size:18px;cursor:pointer">×</button>
    </div>
    <div id="cc-body" style="height:calc(100% - 96px);padding:10px;overflow:auto"></div>
    <div style="display:flex;gap:8px;padding:10px;border-top:1px solid #e5e7eb">
      <input id="cc-input" placeholder="Type here..." style="flex:1;padding:8px;border:1px solid #cbd5e1;border-radius:8px"/>
      <button id="cc-send" style="padding:8px 10px;border:0;border-radius:8px;background:#0ea5e9;color:#fff;cursor:pointer">Send</button>
    </div>
  `;
  document.body.appendChild(box);

  const body = box.querySelector("#cc-body");
  const input = box.querySelector("#cc-input");
  const send  = box.querySelector("#cc-send");
  const close = box.querySelector("#cc-close");

  function addMsg(who, text){
    const p = document.createElement("p");
    p.style.margin = "6px 0";
    p.innerHTML = `<b style="display:inline-block;min-width:48px">${who}:</b> ${text}`;
    body.appendChild(p);
    body.scrollTop = body.scrollHeight;
  }

  // Detect our own deployed base URL from the script tag
  const thisScript = document.currentScript || (function(){
    const s = document.getElementsByTagName("script");
    return s[s.length - 1];
  })();
  const BASE_URL = new URL(thisScript.src).origin;

  async function pingBackend(){
    try {
      const r = await fetch(`${BASE_URL}/api/ping`);
      if (r.ok) addMsg("Bot", "Hi! Would you like to see available rentals? (type: yes)");
      else addMsg("Bot", "Backend reachable but returned an error.");
    } catch {
      addMsg("Bot", "Backend is not reachable. We'll fix that next.");
    }
  }

  btn.onclick = () => {
    box.style.display = (box.style.display === "none" || !box.style.display) ? "block" : "none";
    if (box.style.display === "block" && body.children.length === 0) pingBackend();
  };
  close.onclick = () => box.style.display = "none";

  send.onclick = () => {
    const t = input.value.trim();
    if (!t) return;
    input.value = "";
    addMsg("You", t);
    if (/^yes\b/i.test(t)) addMsg("Bot", "Great! (Demo) Listings will appear here.");
    else addMsg("Bot", 'Please type "yes" to continue (demo).');
  };
  input.addEventListener("keydown", e => { if (e.key === "Enter") send.click(); });
})();
