// anchor-link
function selectionAnchor(event) {
   event.preventDefault();

   const link = event.target;

   const targetId = link.getAttribute('href');
   const targetBlock = document.querySelector(targetId);



   if (targetBlock) {
      let block = targetBlock.scrollHeight < window.innerHeight ? "center" : "start";
      targetBlock.scrollIntoView({ behavior: "smooth", block });
      targetBlock.classList.add('highlighted');
      setTimeout(() => {
         targetBlock.classList.remove('highlighted');
      }, 3000);
   }
}

// .scrollIntoView({behavior: "smooth", block: "center", inline: "start"})

const anchorLinks = document.querySelectorAll(".anchor-link");
anchorLinks.forEach(link => {
   link.addEventListener("click", selectionAnchor);
});

const malenLinks = document.querySelectorAll('.paper__mal');
malenLinks.forEach(link => {
   link.addEventListener("click", selectionAnchor);
});

// img click
let scale = 1;
let nowImg = null;
const look = document.getElementById('look');
const lookBox = document.getElementById('look__box');

const isMobile = () => /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

// size

function lookScreenSize() {
   return {
      H: look.clientHeight,
      W: look.clientWidth,
   };
}

function lookBoxSize() {
   const coef = 0.8;
   return {
      H: Math.ceil(window.innerHeight * coef),
      W: Math.ceil(window.innerWidth * coef),
   };
}

function realImgSize(img, callback) {
   const realImg = new Image();
   realImg.src = img.src;

   realImg.onload = function () {
      const W = realImg.width;
      const H = realImg.height;
      callback({ W, H });
   };

   realImg.onerror = function () {
      callback({ W: 0, H: 0 });
   };
}

function resizeLookBox(m, b) {
   const size = { W: null, H: null };
   if (m.W <= b.W && m.H <= b.H) {
      size.W = m.W;
      size.H = m.H;
   } else if (m.W <= b.W && m.H > b.H) {
      size.W = (b.H / m.H) * m.W;
      size.H = b.H;
   } else if (m.W > b.W && m.H <= b.H) {
      size.W = b.W;
      size.H = (b.W / m.W) * m.H;
   } else if (m.W > b.W && m.H > b.H) {
      let y = m.H - b.H;
      let x = m.W - b.W;
      if (y == x) {
         size.W = b.W;
         size.H = b.H;
      } else if (y < x) {
         size.W = b.W;
         size.H = (b.W / m.W) * m.H;
      } else {
         size.W = (b.H / m.H) * m.W;
         size.H = b.H;
      }
   }
   size.W = +size.W.toFixed(2);
   size.H = +size.H.toFixed(2);
   return size;
}

function isBoxSizeRichtig(m, b) {
   return (m.W <= b.W && m.H <= b.H) ? true : false;
}

function resize(img) {
   const lookSize = lookScreenSize();
   const boxSize = lookBoxSize();
   realImgSize(img, malSize => {
      let size = resizeLookBox(malSize, boxSize);
      while (!isBoxSizeRichtig(size, boxSize)) {
         size = resizeLookBox(size, boxSize);
      }
      lookBox.style.width = size.W + 'px';
      lookBox.style.height = size.H + 'px';

      lookBox.style.top = ((lookSize.H - size.H) / 2) + 'px';
      lookBox.style.left = ((lookSize.W - size.W) / 2) + 'px';
   });
}

// looking

function lookingOn(img) {
   look.classList.add('look_on');
   look.style.backgroundColor = 'rgba(1, 1, 1, 0.8)';

   document.body.classList.add('hidden')
   document.body.style.paddingRight = isMobile() ? '0px' : '16px';

   resize(img);

   // let src = img.src.slice(1, img.lenght); // localhost
   let src = img.src; // github
   lookBox.style.backgroundImage = `url('` + src + `')`;
   lookBox.style.transform = 'scale(1)';
   lookBox.style.opacity = '1';
}

function lookingOff() {
   look.classList.remove('look_on');
   look.style.backgroundColor = 'transparent';

   document.body.classList.remove('hidden')
   document.body.style.paddingRight = '0px';

   lookBox.style.transform = 'scale(0.8)';
   lookBox.style.opacity = '0';

   scale = 1;
}

function looking(event) {
   const img = nowImg = {
      block: event.target,
      src: event.target.getAttribute('src'),
      alt: event.target.getAttribute('alt')
   }

   lookingOn(img);

   look.addEventListener('click', e => {
      if (e.target != lookBox) {
         lookingOff();
      }
   });
}

// img zoom

function zoomHandler(event) {
   const delta = event.deltaY || event.detail || event.wheelDelta;
   scale = delta > 0 ? (scale + 0.05) : (scale - 0.05);

   let transformSlace = 'scale(' + scale + ')';
   lookBox.style.transform = lookBox.style.WebkitTransform = lookBox.style.MsTransform = transformSlace;

   event.preventDefault();
}

function addOnWheel(handler) {
   if (look.addEventListener) {
      if ('onwheel' in document) {
         // IE9+, FF17+
         look.addEventListener("wheel", handler);
      } else if ('onmousewheel' in document) {
         // old variant
         look.addEventListener("mousewheel", handler);
      } else {
         // 3.5 <= Firefox < 17
         look.addEventListener("MozMousePixelScroll", handler);
      }
   } else {
      // IE8-
      look.attachEvent("onmousewheel", handler);
   }
}

// windows resize

window.addEventListener("resize", event => {
   if (look.classList.contains('look_on')) {
      resize(nowImg);
   }
}, false);

// start img

const malenImgs = document.querySelectorAll('.paper__img');
malenImgs.forEach(img => {
   img.addEventListener("click", looking);
});

addOnWheel(zoomHandler);
