    (function(){
      var track = document.getElementById('mc-carousel');
      var dots  = document.querySelectorAll('.mc-dot');
      if(!track) return;
      var ORIG = 6, PER_PAGE = 3, cur = 0;

      /* Clone all cards for seamless right-loop */
      Array.from(track.children).forEach(function(c){ track.appendChild(c.cloneNode(true)); });
      var TOTAL = track.children.length; // now 12

      function cardW(){ return track.children[0] ? track.children[0].offsetWidth + 16 : 0; }

      function goTo(idx, animate){
        track.style.transition = animate ? 'transform .5s cubic-bezier(.25,.46,.45,.94)' : 'none';
        track.style.transform  = 'translateX(-' + (idx * cardW()) + 'px)';
        cur = idx;
        updateDots();
      }

      window.mcScroll = function(dir){
        goTo(cur + dir, true);
        // After animation: if inside clone zone, silently reset to original
        setTimeout(function(){
          if(cur >= ORIG)       goTo(cur - ORIG, false);
          else if(cur < 0)      goTo(cur + ORIG, false);
        }, 520);
      };

      function updateDots(){
        var page = Math.floor(((cur % ORIG) + ORIG) % ORIG / PER_PAGE);
        var pages = Math.ceil(ORIG / PER_PAGE);
        dots.forEach(function(d,i){
          var active = i === page % pages;
          d.classList.toggle('bg-white/70', active);
          d.classList.toggle('w-4', active);
          d.classList.toggle('bg-white/25', !active);
          d.classList.toggle('w-1.5', !active);
        });
      }

      /* Auto-advance every 10 s; pause on hover */
      var timer = setInterval(function(){ mcScroll(1); }, 10000);
      track.closest('.relative').addEventListener('mouseenter', function(){ clearInterval(timer); });
      track.closest('.relative').addEventListener('mouseleave', function(){
        timer = setInterval(function(){ mcScroll(1); }, 10000);
      });
    })();