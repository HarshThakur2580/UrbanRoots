// // js/groot.js

// (function () {
//   const style = document.createElement('style');
//   style.textContent = `
//     #groot-btn {
//       position: fixed;
//       bottom: 30px;
//       right: 30px;
//       width: 65px;
//       height: 65px;
//       border-radius: 50%;
//       background: linear-gradient(135deg, #10b981, #059669);
//       color: white;
//       font-size: 30px;
//       display: flex;
//       align-items: center;
//       justify-content: center;
//       box-shadow: 0 10px 25px rgba(16, 185, 129, 0.4);
//       cursor: pointer;
//       z-index: 99999;
//       transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
//       border: 3px solid white;
//       overflow: hidden;
//       padding: 0;
//     }
//     #groot-btn:hover {
//       transform: scale(1.1) rotate(5deg);
//       box-shadow: 0 15px 35px rgba(16, 185, 129, 0.6);
//     }
//     #groot-panel {
//       position: fixed;
//       bottom: 110px;
//       right: 30px;
//       width: 380px;
//       height: 550px;
//       max-height: 80vh;
//       background: rgba(255, 255, 255, 0.9);
//       backdrop-filter: blur(25px);
//       -webkit-backdrop-filter: blur(25px);
//       border: 1px solid rgba(255, 255, 255, 1);
//       border-radius: 28px;
//       box-shadow: 0 20px 50px rgba(0,0,0,0.15);
//       z-index: 99998;
//       display: flex;
//       flex-direction: column;
//       overflow: hidden;
//       opacity: 0;
//       pointer-events: none;
//       transform: translateY(20px) scale(0.95);
//       transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
//       font-family: 'Inter', sans-serif;
//     }
//     #groot-panel.open {
//       opacity: 1;
//       pointer-events: all;
//       transform: translateY(0) scale(1);
//     }
//     #groot-header {
//       background: linear-gradient(135deg, #064e3b, #047857);
//       padding: 24px;
//       color: white;
//       display: flex;
//       align-items: center;
//       gap: 15px;
//     }
//     .groot-avatar {
//       background: rgba(255,255,255,0.15); 
//       width: 46px; 
//       height: 46px; 
//       border-radius: 50%; 
//       display: flex; 
//       align-items: center; 
//       justify-content: center; 
//       font-size: 22px;
//       border: 2px solid #34d399;
//       color: #a7f3d0;
//     }
//     #groot-header h3 { margin: 0; font-family: 'Poppins', sans-serif; font-size: 20px; font-weight: 800; letter-spacing: 0.5px; }
//     #groot-header p { margin: 0; font-size: 13px; color: #a7f3d0; font-weight: 500; }
//     #groot-close { margin-left: auto; background: none; border: none; color: rgba(255,255,255,0.7); font-size: 24px; cursor: pointer; transition: all 0.2s; padding: 0; }
//     #groot-close:hover { color: white; transform: scale(1.2); }
//     #groot-chat { flex: 1; padding: 24px; overflow-y: auto; display: flex; flex-direction: column; gap: 16px; }
//     .groot-msg { max-width: 85%; padding: 14px 18px; border-radius: 20px; font-size: 14px; line-height: 1.6; font-weight: 500; }
//     .groot-msg.bot { background: #f0fdf4; color: #064e3b; border: 1px solid #d1fae5; border-bottom-left-radius: 4px; align-self: flex-start; }
//     .groot-msg.user { background: #10b981; color: white; border-bottom-right-radius: 4px; align-self: flex-end; box-shadow: 0 4px 15px rgba(16,185,129,0.25); }
//     #groot-input-area { padding: 20px; border-top: 1px solid #f1f5f9; background: white; display: flex; gap: 12px; }
//     #groot-input { flex: 1; padding: 14px 18px; border-radius: 16px; border: 1px solid #e2e8f0; font-size: 14px; outline: none; transition: border-color 0.2s; background: #f8fafc; font-family: 'Inter', sans-serif; }
//     #groot-input:focus { border-color: #34d399; background: white; }
//     #groot-send { background: #10b981; color: white; border: none; width: 48px; height: 48px; border-radius: 16px; cursor: pointer; transition: all 0.2s; display: flex; justify-content: center; align-items: center; font-size: 16px; }
//     #groot-send:hover { transform: scale(1.05); background: #059669; box-shadow: 0 4px 10px rgba(5,150,105,0.3); }

//     @keyframes grootBounce {
//       0%, 100% { transform: translateY(0); }
//       50% { transform: translateY(-3px); }
//     }
//     .groot-msg.bot i.fa-ellipsis { animation: grootBounce 1s infinite; }

//     @media (max-width: 640px) {
//       #groot-panel { bottom: 0; right: 0; width: 100%; height: 85vh; border-bottom-left-radius: 0; border-bottom-right-radius: 0; }
//     }
//   `;
//   document.head.appendChild(style);

//   // Floating Button
//   const btn = document.createElement('div');
//   btn.id = 'groot-btn';
//   // Marvel Groot inspired icon (tree)
//   // btn.innerHTML = '<i class="fa-solid fa-tree"></i>';
//   // document.body.appendChild(btn);
//   btn.innerHTML = '<img src="images/groot1.jpg" alt="Groot" style="width: 100%; height: 100%; object-fit: cover;">';
//   document.body.appendChild(btn);

//   // Chat Panel
//   const panel = document.createElement('div');
//   panel.id = 'groot-panel';
//   panel.innerHTML = `
//     <div id="groot-header">
//       <div class="groot-avatar" style="overflow: hidden; padding: 0; border: 2px solid white;"><img src="images/groot1.jpg" style="width: 100%; height: 100%; object-fit: cover;"></div>
//       <div>
//         <h3>I am Groot</h3>
//         <p>Your AI Botany Assistant</p>
//       </div>
//       <button id="groot-close"><i class="fa-solid fa-xmark"></i></button>
//     </div>
//     <div id="groot-chat">
//       <div class="groot-msg bot animate-in"><strong>I am Groot!</strong> <br>(Hello! I am your AI assistant. How can I help your urban oasis flourish today?) <i class="fa-solid fa-seedling text-emerald-500"></i></div>
//     </div>
//     <form id="groot-input-area">
//       <input type="text" id="groot-input" placeholder="Ask Groot anything..." autocomplete="off">
//       <button type="submit" id="groot-send"><i class="fa-solid fa-paper-plane"></i></button>
//     </form>
//   `;
//   document.body.appendChild(panel);

//   // Toggle logic
//   const togglePanel = () => {
//     panel.classList.toggle('open');
//     if (panel.classList.contains('open')) {
//       document.getElementById('groot-input').focus();
//     }
//   };
//   btn.addEventListener('click', togglePanel);
//   document.getElementById('groot-close').addEventListener('click', togglePanel);

//   // Chat logic
//   const form = document.getElementById('groot-input-area');
//   const input = document.getElementById('groot-input');
//   const chat = document.getElementById('groot-chat');

//   form.addEventListener('submit', (e) => {
//     e.preventDefault();
//     const text = input.value.trim();
//     if (!text) return;

//     // Append User Message
//     const userDiv = document.createElement('div');
//     userDiv.className = 'groot-msg user animate-in';
//     userDiv.textContent = text;
//     chat.appendChild(userDiv);
//     input.value = '';
//     chat.scrollTop = chat.scrollHeight;

//     // Append Bot Typing Indicator
//     const typingDiv = document.createElement('div');
//     typingDiv.className = 'groot-msg bot animate-in';
//     typingDiv.innerHTML = '<i class="fa-solid fa-ellipsis"></i>';
//     chat.appendChild(typingDiv);
//     chat.scrollTop = chat.scrollHeight;

//     // Append Bot Response (Simulated AI)
//     setTimeout(() => {
//       typingDiv.remove();
//       const botDiv = document.createElement('div');
//       botDiv.className = 'groot-msg bot animate-in';
//       botDiv.innerHTML = `<strong>I am Groot.</strong> <br>(Based on my extensive botanical knowledge, "${text}" is a great topic. Ensure proper sunlight, consistent watering, and well-draining soil for optimal growth!) <i class="fa-solid fa-leaf text-emerald-500"></i>`;
//       chat.appendChild(botDiv);
//       chat.scrollTop = chat.scrollHeight;
//     }, 1500);
//   });
// })();
// js/groot.js

(function () {
  const style = document.createElement('style');
  style.textContent = `
    #groot-btn {
      position: fixed;
      bottom: 30px;
      right: 30px;
      width: 65px;
      height: 65px;
      border-radius: 50%;
      background: linear-gradient(135deg, #10b981, #059669);
      color: white;
      font-size: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 10px 25px rgba(16, 185, 129, 0.4);
      cursor: pointer;
      z-index: 99999;
      transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
      border: 3px solid white;
      overflow: hidden;
      padding: 0;
      /* Floating animation */
      animation: floatBall 2.5s ease-in-out infinite;
    }
    
    /* Floating ball type animation */
    @keyframes floatBall {
      0% {
        transform: translateY(0px) scale(1);
        box-shadow: 0 10px 25px rgba(16, 185, 129, 0.4);
      }
      50% {
        transform: translateY(-10px) scale(1.03);
        box-shadow: 0 20px 35px rgba(16, 185, 129, 0.6);
      }
      100% {
        transform: translateY(0px) scale(1);
        box-shadow: 0 10px 25px rgba(16, 185, 129, 0.4);
      }
    }
    
    /* Gentle pulse glow on hover */
    #groot-btn:hover {
      transform: scale(1.1) rotate(5deg);
      box-shadow: 0 15px 35px rgba(16, 185, 129, 0.7);
      animation-play-state: paused;
    }
    
    /* Subtle breathing ring effect */
    #groot-btn::before {
      content: '';
      position: absolute;
      top: -5px;
      left: -5px;
      right: -5px;
      bottom: -5px;
      border-radius: 50%;
      background: rgba(16, 185, 129, 0.3);
      z-index: -1;
      animation: pulseRing 2s ease-in-out infinite;
    }
    
    @keyframes pulseRing {
      0% {
        transform: scale(1);
        opacity: 0.4;
      }
      70% {
        transform: scale(1.2);
        opacity: 0;
      }
      100% {
        transform: scale(1);
        opacity: 0;
      }
    }
    
    #groot-panel {
      position: fixed;
      bottom: 110px;
      right: 30px;
      width: 380px;
      height: 550px;
      max-height: 80vh;
      background: rgba(255, 255, 255, 0.9);
      backdrop-filter: blur(25px);
      -webkit-backdrop-filter: blur(25px);
      border: 1px solid rgba(255, 255, 255, 1);
      border-radius: 28px;
      box-shadow: 0 20px 50px rgba(0,0,0,0.15);
      z-index: 99998;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      opacity: 0;
      pointer-events: none;
      transform: translateY(20px) scale(0.95);
      transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
      font-family: 'Inter', sans-serif;
    }
    #groot-panel.open {
      opacity: 1;
      pointer-events: all;
      transform: translateY(0) scale(1);
    }
    #groot-header {
      background: linear-gradient(135deg, #064e3b, #047857);
      padding: 24px;
      color: white;
      display: flex;
      align-items: center;
      gap: 15px;
    }
    .groot-avatar {
      background: rgba(255,255,255,0.15); 
      width: 46px; 
      height: 46px; 
      border-radius: 50%; 
      display: flex; 
      align-items: center; 
      justify-content: center; 
      font-size: 22px;
      border: 2px solid #34d399;
      color: #a7f3d0;
      overflow: hidden;
    }
    .groot-avatar img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    #groot-header h3 { margin: 0; font-family: 'Poppins', sans-serif; font-size: 20px; font-weight: 800; letter-spacing: 0.5px; }
    #groot-header p { margin: 0; font-size: 13px; color: #a7f3d0; font-weight: 500; }
    #groot-close { margin-left: auto; background: none; border: none; color: rgba(255,255,255,0.7); font-size: 24px; cursor: pointer; transition: all 0.2s; padding: 0; }
    #groot-close:hover { color: white; transform: scale(1.2); }
    #groot-chat { flex: 1; padding: 24px; overflow-y: auto; display: flex; flex-direction: column; gap: 16px; }
    .groot-msg { max-width: 85%; padding: 14px 18px; border-radius: 20px; font-size: 14px; line-height: 1.6; font-weight: 500; }
    .groot-msg.bot { background: #f0fdf4; color: #064e3b; border: 1px solid #d1fae5; border-bottom-left-radius: 4px; align-self: flex-start; }
    .groot-msg.user { background: #10b981; color: white; border-bottom-right-radius: 4px; align-self: flex-end; box-shadow: 0 4px 15px rgba(16,185,129,0.25); }
    #groot-input-area { padding: 20px; border-top: 1px solid #f1f5f9; background: white; display: flex; gap: 12px; }
    #groot-input { flex: 1; padding: 14px 18px; border-radius: 16px; border: 1px solid #e2e8f0; font-size: 14px; outline: none; transition: border-color 0.2s; background: #f8fafc; font-family: 'Inter', sans-serif; }
    #groot-input:focus { border-color: #34d399; background: white; }
    #groot-send { background: #10b981; color: white; border: none; width: 48px; height: 48px; border-radius: 16px; cursor: pointer; transition: all 0.2s; display: flex; justify-content: center; align-items: center; font-size: 16px; }
    #groot-send:hover { transform: scale(1.05); background: #059669; box-shadow: 0 4px 10px rgba(5,150,105,0.3); }
    
    @keyframes grootBounce {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-3px); }
    }
    .groot-msg.bot i.fa-ellipsis { animation: grootBounce 1s infinite; }

    @media (max-width: 640px) {
      #groot-panel { bottom: 0; right: 0; width: 100%; height: 85vh; border-bottom-left-radius: 0; border-bottom-right-radius: 0; }
    }
  `;
  document.head.appendChild(style);

  // Create audio element for Groot voice
  const grootAudio = new Audio();
  // You can replace this with your actual Groot MP3 file path
  // For demo, we'll use a simple "pop" sound, but you can change to 'groot.mp3'
  // The code expects the file at 'audio/groot.mp3' or you can update the path
  // To avoid console errors if file doesn't exist, we'll handle gracefully
  let audioLoaded = false;

  // Set audio source - UPDATE THIS PATH TO YOUR ACTUAL GROOT MP3 FILE
  // Option 1: Place your groot.mp3 in the project root or js folder
  // Option 2: Update this path to where your file is located
  const audioPath = 'images/groot.mp3';  // Change this to your actual file path
  grootAudio.src = audioPath;

  // Check if audio can be loaded, if not try alternative path
  grootAudio.addEventListener('canplaythrough', () => {
    audioLoaded = true;
  });

  grootAudio.addEventListener('error', () => {
    console.warn('Groot audio file not found at:', audioPath);
    console.warn('Please place your groot.mp3 file in the "audio" folder or update the path in groot.js');
    // Fallback: create a simple beep using Web Audio API if needed (optional)
  });

  // Function to play Groot sound with error handling
  function playGrootSound() {
    if (audioLoaded && grootAudio) {
      // Reset audio to start if it's already playing
      grootAudio.currentTime = 0;
      grootAudio.play().catch(err => {
        console.log('Audio play failed:', err);
        // Silent fail - don't break the experience
      });
    } else {
      // Try to load and play once
      grootAudio.load();
      grootAudio.play().catch(err => {
        console.log('Audio not available yet');
      });
    }
  }

  // Floating Button
  const btn = document.createElement('div');
  btn.id = 'groot-btn';
  btn.innerHTML = '<img src="images/groot1.jpg" alt="Groot" style="width: 100%; height: 100%; object-fit: cover;">';
  document.body.appendChild(btn);

  // Chat Panel
  const panel = document.createElement('div');
  panel.id = 'groot-panel';
  panel.innerHTML = `
    <div id="groot-header">
      <div class="groot-avatar" style="overflow: hidden; padding: 0; border: 2px solid white;"><img src="images/groot1.jpg" style="width: 100%; height: 100%; object-fit: cover;"></div>
      <div>
        <h3>I am Groot</h3>
        <p>Your AI Botany Assistant</p>
      </div>
      <button id="groot-close"><i class="fa-solid fa-xmark"></i></button>
    </div>
    <div id="groot-chat">
      <div class="groot-msg bot animate-in"><strong>I am Groot!</strong> <br>(Hello! I am your AI assistant. How can I help your urban oasis flourish today?) <i class="fa-solid fa-seedling text-emerald-500"></i></div>
    </div>
    <form id="groot-input-area">
      <input type="text" id="groot-input" placeholder="Ask Groot anything..." autocomplete="off">
      <button type="submit" id="groot-send"><i class="fa-solid fa-paper-plane"></i></button>
    </form>
  `;
  document.body.appendChild(panel);

  // Toggle logic with audio playback on click
  let isPanelOpen = false;

  const togglePanel = () => {
    panel.classList.toggle('open');
    isPanelOpen = panel.classList.contains('open');

    // Play Groot sound when clicked (the "I am Groot" voice)
    // This plays every time the button is clicked (both opening and closing)
    playGrootSound();

    if (isPanelOpen) {
      document.getElementById('groot-input').focus();
    }
  };

  btn.addEventListener('click', togglePanel);
  document.getElementById('groot-close').addEventListener('click', () => {
    panel.classList.remove('open');
    isPanelOpen = false;
    // Optional: Play sound on close as well
    playGrootSound();
  });

  // Chat logic
  const form = document.getElementById('groot-input-area');
  const input = document.getElementById('groot-input');
  const chat = document.getElementById('groot-chat');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;

    // Append User Message
    const userDiv = document.createElement('div');
    userDiv.className = 'groot-msg user animate-in';
    userDiv.textContent = text;
    chat.appendChild(userDiv);
    input.value = '';
    chat.scrollTop = chat.scrollHeight;

    // Append Bot Typing Indicator
    const typingDiv = document.createElement('div');
    typingDiv.className = 'groot-msg bot animate-in';
    typingDiv.innerHTML = '<i class="fa-solid fa-ellipsis"></i>';
    chat.appendChild(typingDiv);
    chat.scrollTop = chat.scrollHeight;

    // Append Bot Response (Simulated AI)
    setTimeout(() => {
      typingDiv.remove();
      const botDiv = document.createElement('div');
      botDiv.className = 'groot-msg bot animate-in';
      botDiv.innerHTML = `<strong>I am Groot.</strong> <br>(Based on my extensive botanical knowledge, "${text}" is a great topic. Ensure proper sunlight, consistent watering, and well-draining soil for optimal growth!) <i class="fa-solid fa-leaf text-emerald-500"></i>`;
      chat.appendChild(botDiv);
      chat.scrollTop = chat.scrollHeight;
    }, 1500);
  });
})();
