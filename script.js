// === 星点背景 ===
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const DENSITY = 0.002;
const SPEED = 0.3;
const pixelSize = 2;

const stars = [];
const totalStars = canvas.width * canvas.height * DENSITY;

for (let i = 0; i < totalStars; i++) {
  stars.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    speed: Math.random() * SPEED + 0.1,
    size: Math.random() * 1.5 + 1
  });
}

function drawStars() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  stars.forEach(star => {
    ctx.fillStyle = "white";
    ctx.fillRect(star.x, star.y, pixelSize, pixelSize);
    star.y += star.speed;
    if (star.y > canvas.height) {
      star.y = 0;
      star.x = Math.random() * canvas.width;
    }
  });
}
setInterval(drawStars, 30);

// === 问题文字浮现动画 ===
const questions = [
  "What does BLI do?",
  "Do you need a cybersecurity course?",
  "Are you missing some certificates to prove your ability in your job search?",
  "BLI can help develop more professional skills you need."
];

const bubbleContainer = document.getElementById('bubble-container');
const activePositions = [];

let currentIndex = 0;

function spawnFloatingQuestion() {
  const text = questions[currentIndex];
  currentIndex = (currentIndex + 1) % questions.length;

  const el = document.createElement('div');
  el.classList.add('floating-text');
  el.innerText = text;

  document.body.appendChild(el); // 临时挂载用于获取宽高
  const elRect = el.getBoundingClientRect();
  el.remove(); // 移除后再决定要不要添加

  const logoRect = document.getElementById('logo').getBoundingClientRect();
  const btnRect = document.getElementById('start-btn').getBoundingClientRect();

  const maxWidth = window.innerWidth - elRect.width;
  const maxHeight = window.innerHeight - elRect.height;

  let left = 0;
  let top = 0;
  let maxAttempts = 30;
  let tries = 0;
  let valid = false;

  while (tries < maxAttempts && !valid) {
    left = Math.random() * maxWidth;
    top = Math.random() * maxHeight;

    const testRect = {
      left,
      right: left + elRect.width,
      top,
      bottom: top + elRect.height,
    };

    // 🔒 是否与 Logo 或按钮区域重叠
    const overlaps = (rect1, rect2) => {
      return !(
        rect1.right < rect2.left ||
        rect1.left > rect2.right ||
        rect1.bottom < rect2.top ||
        rect1.top > rect2.bottom
      );
    };

    const inLogoZone = overlaps(testRect, logoRect);
    const inBtnZone = overlaps(testRect, btnRect);

    const overlapOther = activePositions.some(pos => {
      const dx = Math.abs(pos.left - left);
      const dy = Math.abs(pos.top - top);
      return dx < elRect.width && dy < elRect.height;
    });

    if (!inLogoZone && !inBtnZone && !overlapOther) {
      valid = true;
    }

    tries++;
  }

  if (!valid) return; // 放弃此次生成，避免卡住

  el.style.left = `${left}px`;
  el.style.top = `${top}px`;
  bubbleContainer.appendChild(el);
  activePositions.push({ top, left });

  // 删除元素与记录
  setTimeout(() => {
    el.remove();
    const idx = activePositions.findIndex(p => p.top === top && p.left === left);
    if (idx !== -1) activePositions.splice(idx, 1);
  }, 6000);
}

setInterval(spawnFloatingQuestion, 2000); // 每 2 秒生成一条

// === 启动按钮显示与跳转 ===
const startBtn = document.getElementById('start-btn');
setTimeout(() => {
  startBtn.style.display = 'block';
}, 2000);

startBtn.addEventListener('click', () => {
  window.location.href = 'catalog.html'; // 可替换为你的目标页
});