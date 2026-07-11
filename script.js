const noteInput = document.getElementById('note-input');
const binTrigger = document.getElementById('bin-trigger');
const paperPage = document.getElementById('paper-page');
const resetBtn = document.getElementById('reset-btn');

// Activate dustbin button only when there is actual text typed
noteInput.addEventListener('input', () => {
  binTrigger.disabled = noteInput.value.trim().length === 0;
});

// Easing Math calculations for smooth physics movement
function easeIn(t) { return t * t * t; }
function easeInOut(t) { return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t; }

function runTossSequence() {
  binTrigger.disabled = true; 
  
  const startTime = performance.now();
  const duration = 900; // Flight duration in milliseconds
  
  // Find where your custom dustbin image button is located on the screen
  const binRect = binTrigger.getBoundingClientRect();
  const paperRect = paperPage.getBoundingClientRect();
  
  // Calculate exactly how far the ball needs to travel to hit the center of the bin
  const dx = binRect.left - paperRect.left - (paperRect.width / 4); 
  const dy = binRect.top - paperRect.top;

  // --- TRANSFORMATION CHANGES START HERE ---
  noteInput.style.opacity = '0'; // Hide text inputs instantly
  
  // FIX: Clear the container's solid white background color and round borders
  paperPage.style.backgroundColor = "transparent"; 
  paperPage.style.borderRadius = "0";
  paperPage.style.boxShadow = "none";
  
  // Load the crumpled transparent ball
  paperPage.style.backgroundImage = "url('crumpled.png')"; 
  paperPage.style.backgroundSize = "contain";
  paperPage.style.backgroundRepeat = "no-repeat";
  paperPage.style.backgroundPosition = "center";

  function animateFrame(now) {
    const elapsed = now - startTime;
    const t = Math.min(elapsed / duration, 1); // Progress from 0 to 1

    // Parabolic Arc Formula mapping paths right toward your dustbin icon
    const cx = dx * easeIn(t);
    const cy = (dy * easeIn(t)) - 250 * Math.sin(t * Math.PI); // Creates the upward toss arc

    const scale = 1 - 0.85 * easeInOut(t); // Shrinks the ball as it goes "into" the bin
    const rot = 720 * t; // Keeps the ball spinning beautifully while flying
    
    // Apply position, shrink, and spin
    paperPage.style.transform = `translate(${cx}px, ${cy}px) scale(${scale}) rotate(${rot}deg)`;
    
    // Smoothly fade away right as it reaches the mouth of the bin
    paperPage.style.opacity = t > 0.80 ? 1 - (t - 0.80) / 0.20 : 1; 

    if (elapsed < duration) {
      requestAnimationFrame(animateFrame);
    } else {
      resetWorkspace();
    }
  }

  requestAnimationFrame(animateFrame);
}

function resetWorkspace() {
  noteInput.value = '';
  noteInput.style.opacity = '1';
  paperPage.style.transform = 'none';
  paperPage.style.opacity = '1';
  
  // RESTORE: Bring back the flat notebook look when the text resets
  paperPage.style.backgroundColor = "#ffffff";        
  paperPage.style.borderRadius = "4px";
  paperPage.style.boxShadow = "0px 4px 12px rgba(0,0,0,0.08)";
  
  paperPage.style.backgroundImage = "url('notebook.png')"; 
  paperPage.style.backgroundSize = "100% 100%";
  paperPage.style.backgroundRepeat = "no-repeat";
  binTrigger.disabled = true;
}

binTrigger.addEventListener('click', runTossSequence);
resetBtn.addEventListener('click', resetWorkspace);