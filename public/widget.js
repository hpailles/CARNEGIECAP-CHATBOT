(function () {
  // figure out our own Vercel base URL from the script tag
  var thisScript = document.currentScript || (function() {
    var scripts = document.getElementsByTagName('script');
    return scripts[scripts.length - 1];
  })();
  var BASE_URL = new URL(thisScript.src).origin;

  // ---- styles
  var style = document.createElement('style');
  style.textContent = `
    #ccap-chat-launcher{position:fixed;right:20px;bottom:20px;padding:12px 14px;border:0;border-radius:999px;box-shadow:0 4px 12px rgba(0,0,0,.15);cursor:pointer;font-family:system-ui,Arial,sans-serif}
    #ccap-chat{position:fixed;right:20px;bottom:80px;width:340px;height:460px;background:#fff;border:1px solid #e5e7eb;border-radius:12px;box-shadow:0 10px 30px rgba(0,0,0,.15);display:none;overflow:hidden;font-family:system-ui,Arial,sans-serif}
    #ccap-head{background:#0f172a;color:#fff;padding:10px 12px;font-weight:600;display:flex;align-items:center;justify-content:space-between}
    #ccap-body{height:calc(100% - 96px);padding:10px;overflow:auto}
    #ccap-input{display:flex;gap:8px;padding:10px;border-top:1px solid #e5e7eb}
    #ccap-input input{flex:1;padding:8px;border:1px solid #cbd5e1;border-radius:8px}
    #ccap-input button{padding:8px 10px;border:0;border-radius:8px;background:#0ea5e9;color:#fff;cursor:pointer}
    .msg{margin:6px 0}
    .msg b{display:inline-block;min-width:48px}
  `;
  document.head.appendChild(style);

  // ---- launcher button
  var btn = document.createElement('button');
  btn.id = 'ccap-chat-launcher';
  btn.textContent = 'PRESS HERE FOR MORE INFORMATION ON OUR RENTALS';
  document.body.appendChild(btn);

  // ---- chat window
  var box = document.createElement('div');
  box.id = 'ccap-chat';
  box.innerHTML = `
    <div id="ccap-head">
      <span>Carnegie Cap LLC — Rentals</span>
      <button id="ccap-close" style="background:transparent;border:0;color:#fff;cursor:pointer;font-size:18px;">×</button>
    </div>
    <div id="ccap-body"></div>
    <div id="ccap-input">
      <input id="ccap-text" placeholder="Type here..." />
      <button id="ccap-send">Send</button>
    </div>
  `;
  document.body.appendChild(box);

  var body = box.querySelector('#ccap-body');
  var input = box.querySelector('#ccap-text');
  var send  = box.querySelector('#ccap-send');
  var close = box.querySelector('#ccap-close');

  function addMsg(who, text){
    var p = document.createElement('p');
    p.className = 'msg';
    p.innerHTML = '<b>'+who+':</b> '+text;
    body.appendChild(p);
    body.scrollTop = body.scrollHeight;
  }

  function ping(){
    // absolute URL so it works from GoDaddy pages
    fetch(BASE_URL + '/api/ping')
      .then(r => r.json())
      .then(d => {
        addMsg('Bot', 'Hi! Would you like to see available rentals? (type: yes)');
      })
      .catch(() => {
        addMsg('Bot', 'The chatbot backend is not reachable yet. Please verify deployment.');
      });
  }

  function sendToBot(text){
    // for now just echo; you’ll replace with /api/chatbot later
    addMsg('You', text);
    if (/^yes\b/i.test(text)) {
      addMsg('Bot', 'Great! (Demo) The full listings feature will go here.');
    } else {
      addMsg('Bot', 'Please type "yes" to continue (demo).');
    }
  }

  btn.onclick = function(){
    box.style.display = (box.style.display === 'none' || !box.style.display) ? 'block' : 'none';
    if (box.style.display === 'block' && body.children.length === 0) ping();
  };
  close.onclick = function(){ box.style.display = 'none'; };

  send.onclick = function(){
    var t = input.value.trim();
    if (!t) return;
    input.value = '';
    sendToBot(t);
  };
  input.addEventListener('keydown', function(e){
    if(e.key === 'Enter') send.click();
  });
})();
