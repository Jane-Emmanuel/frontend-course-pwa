const lessonSelect = document.getElementById("lessonSelect");
const codeDisplay = document.getElementById("codeDisplay");
const iframe = document.getElementById("livePreview");

// Load lessons.json dynamically
fetch("./lessons.json")
  .then(res => res.json())
  .then(data => {
    data.lessons.forEach((lesson, i) => {
      const opt = document.createElement("option");
      opt.value = i;
      opt.textContent = `${lesson.category}: ${lesson.title}`;
      lessonSelect.appendChild(opt);
    });
    loadLesson(0, data.lessons);
  })
  .catch(err => {
    codeDisplay.textContent = "⚠️ Could not load lessons.json";
    console.error(err);
  });

// Typing + live preview
function typeCode(content, callback) {
  codeDisplay.textContent = "";
  let i = 0;
  const speed = 30;

  function type() {
    if (i < content.length) {
      codeDisplay.textContent += content.charAt(i);
      i++;
      iframe.srcdoc = codeDisplay.textContent;
      requestAnimationFrame(type);
    } else if (callback) callback();
  }

  type();
}

// Load specific lesson
function loadLesson(index, lessons) {
  const lesson = lessons[index];
  typeCode(lesson.sampleCode);
}

lessonSelect.addEventListener("change", e => {
  const idx = e.target.value;
  fetch("./lessons.json")
    .then(r => r.json())
    .then(d => loadLesson(idx, d.lessons));
});

// Fetch version footer
fetch("./version.json")
  .then(res => res.json())
  .then(data => {
    document.getElementById("app-version").textContent = `Version ${data.version}`;
  })
  .catch(() => {
    document.getElementById("app-version").textContent = "Version info unavailable";
  });

// Register service worker
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("service-worker.js");
}
