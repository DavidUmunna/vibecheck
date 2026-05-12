function togglePill(el) {
  el.classList.toggle('active');
}

function toggleFinding(el) {
  el.classList.toggle('open');
}

const logs = [
  { type: 'info', msg: 'Resolving target host...' },
  { type: 'ok',   msg: 'Host reachable — TLS valid' },
  { type: 'info', msg: 'Crawling exposed JavaScript bundles...' },
  { type: 'err',  msg: 'ALERT: Secret key pattern detected in main.chunk.js' },
  { type: 'info', msg: 'Probing /api/* endpoint structure...' },
  { type: 'err',  msg: 'ALERT: /api/admin/users returned 200 without auth token' },
  { type: 'info', msg: 'Checking database configuration headers...' },
  { type: 'err',  msg: 'ALERT: Supabase RLS not detected on payments table' },
  { type: 'info', msg: 'Scanning for prompt injection chains...' },
  { type: 'warn', msg: 'WARNING: User input → LLM → DB write path found' },
  { type: 'info', msg: 'Checking HTTP security headers...' },
  { type: 'warn', msg: 'WARNING: CORS open to * — CSP missing' },
  { type: 'info', msg: 'Testing rate limiting on auth endpoints...' },
  { type: 'warn', msg: 'NOTE: No rate limiting on /api/auth/login' },
  { type: 'ok',   msg: 'Scan complete — generating report...' },
];

const steps = [
  'RESOLVING HOST',
  'CRAWLING BUNDLES',
  'PROBING ENDPOINTS',
  'CHECKING DATABASE',
  'TESTING LLM PATHS',
  'SCANNING HEADERS',
  'TESTING RATE LIMITS',
  'GENERATING REPORT'
];

let logIndex = 0;
let scanInterval;
let progressVal = 0;

function addLog(entry) {
  const stream = document.getElementById('logStream');
  const line = document.createElement('div');
  line.className = `log-line ${entry.type}`;
  const now = new Date();
  const ts = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}:${String(now.getSeconds()).padStart(2,'0')}`;
  line.innerHTML = `<span class="ts">[${ts}]</span><span class="msg">${entry.msg}</span>`;
  const cursor = stream.querySelector('.log-cursor');
  if (cursor) cursor.remove();
  stream.appendChild(line);
  const c = document.createElement('span');
  c.className = 'log-cursor';
  stream.appendChild(c);
  stream.scrollTop = stream.scrollHeight;
}

function startScan() {
  const url = document.getElementById('urlInput').value.trim() || 'demo-app.vercel.app';
  document.getElementById('scanBtn').disabled = true;
  document.getElementById('scanBtn').textContent = 'Scanning...';
  document.getElementById('progressArea').classList.add('visible');
  document.getElementById('resultsArea').classList.remove('visible');
  document.getElementById('logStream').innerHTML = '';
  logIndex = 0;
  progressVal = 0;

  let stepIndex = 0;
  document.getElementById('progressLabel').textContent = steps[0];

  scanInterval = setInterval(() => {
    if (logIndex < logs.length) {
      addLog(logs[logIndex]);
      logIndex++;

      progressVal = Math.min(95, Math.round((logIndex / logs.length) * 100));
      document.getElementById('progressBar').style.width = progressVal + '%';
      document.getElementById('progressPct').textContent = progressVal + '%';

      stepIndex = Math.floor((logIndex / logs.length) * (steps.length - 1));
      document.getElementById('progressLabel').textContent = steps[stepIndex];
    } else {
      clearInterval(scanInterval);
      document.getElementById('progressBar').style.width = '100%';
      document.getElementById('progressPct').textContent = '100%';
      document.getElementById('progressLabel').textContent = 'COMPLETE';

      setTimeout(() => {
        document.getElementById('resultsArea').classList.add('visible');
        document.getElementById('resultsArea').scrollIntoView({ behavior: 'smooth', block: 'start' });
        document.getElementById('scanBtn').disabled = false;
        document.getElementById('scanBtn').textContent = 'Scan again →';
      }, 600);
    }
  }, 280);
}

document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('urlInput').addEventListener('keydown', function (e) {
    if (e.key === 'Enter') startScan();
  });
});
