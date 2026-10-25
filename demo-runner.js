import { createDemoState } from './demo-data.js';

const WORKSPACE_KEY = 'researchlab.workspace.v1';
const BACKUP_KEY = 'researchlab.demo.backup.v1';
const $ = selector => document.querySelector(selector);
const frame = $('#appFrame');
const launcher = $('#launcher');
const startButton = $('#startButton');
const restoreButton = $('#restoreButton');
const message = $('#message');
const caption = $('#caption');
const done = $('#done');
let cancelled = false;

const scenes = [
  { page: 'dashboard', title: 'A clear view of the research', text: 'Projects, activity, and next steps in one workspace.', duration: 4300 },
  { page: 'planning', title: 'Start with a focused question', text: 'Organize research questions, objectives, and hypotheses.', duration: 4800 },
  { page: 'literature', title: 'Keep the evidence organized', text: 'Compare source notes, methods, findings, and research gaps.', target: '#literatureTable', duration: 5000 },
  { page: 'collection', title: 'Prepare the collection workflow', text: 'Keep questionnaire items, response logs, and field notes together.', target: '.panel', targetText: 'Response log', duration: 4700 },
  { page: 'data', title: 'Inspect the data before analysis', text: 'Review records, variables, missing values, and duplicate rows.', target: '#datasetTable', duration: 6500 },
  { page: 'statistics', title: 'Turn observations into summaries', text: 'Explore descriptive statistics and stored analysis results.', target: '#analysisOutput', duration: 6500 },
  { page: 'qualitative', title: 'Find patterns in open-ended text', text: 'Review researcher-defined codes, themes, and word frequency.', target: '.metric-list', duration: 5600 },
  { page: 'visualizations', title: 'Make the patterns easier to see', text: 'Charts are generated from the active synthetic dataset.', target: '.chart-container', duration: 6500 },
  { page: 'calculators', title: 'Plan the numbers responsibly', text: 'Estimate sample sizes, uncertainty, response rates, and effect sizes.', duration: 4400 },
  { page: 'reports', title: 'Bring the work into a report', text: 'Assemble methods, results, tables, interpretation, and limitations.', target: '#reportEditor', duration: 6200 },
  { page: 'references', title: 'Keep citations traceable', text: 'Store bibliographic details and prepare a reference list.', duration: 4300 },
  { page: 'tasks', title: 'Move the project forward', text: 'Track deliverables, priorities, due dates, and progress.', duration: 4300 },
  { page: 'settings', title: 'Keep the workspace portable', text: 'Manage preferences, backups, and project restoration.', duration: 4300 },
  { page: 'dashboard', title: 'One connected research workflow', text: 'From planning and analysis to visualization and reporting.', duration: 5000 }
];

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
function ensureBackup() {
  if (localStorage.getItem(BACKUP_KEY) !== null) return true;
  const raw = localStorage.getItem(WORKSPACE_KEY);
  const backup = JSON.stringify({ exists: raw !== null, raw });
  try {
    localStorage.setItem(BACKUP_KEY, backup);
    return true;
  } catch (error) {
    message.textContent = 'Could not back up the current workspace. Free browser storage and try again.';
    console.error('ResearchLab demo backup failed:', error);
    return false;
  }
}
function restoreWorkspace() {
  try { if (document.fullscreenElement && document.exitFullscreen) document.exitFullscreen().catch(() => {}); } catch {}
  const rawBackup = localStorage.getItem(BACKUP_KEY);
  if (rawBackup === null) {
    message.textContent = 'There is no previous workspace backup in this browser.';
    return;
  }
  try {
    const backup = JSON.parse(rawBackup);
    if (backup.exists) localStorage.setItem(WORKSPACE_KEY, backup.raw);
    else localStorage.removeItem(WORKSPACE_KEY);
    localStorage.removeItem(BACKUP_KEY);
    done.classList.remove('show');
    caption.classList.remove('show');
    launcher.classList.add('hidden');
    frame.src = `index.html?restored=${Date.now()}`;
  } catch (error) {
    message.textContent = 'Could not restore the previous workspace. The backup has been kept.';
    console.error('ResearchLab restore failed:', error);
  }
}
function showCaption(index, scene) {
  $('#captionKicker').textContent = `RESEARCHLAB  ·  ${String(index + 1).padStart(2, '0')} / ${String(scenes.length).padStart(2, '0')}`;
  $('#captionTitle').textContent = scene.title;
  $('#captionText').textContent = scene.text;
  caption.classList.add('show');
  clearTimeout(showCaption.timer);
  showCaption.timer = setTimeout(() => caption.classList.remove('show'), Math.min(2300, scene.duration * 0.45));
}
function currentFrameDocument() {
  try { return frame.contentDocument || frame.contentWindow.document; }
  catch { return null; }
}
async function goToScene(index, scene, duration) {
  const doc = currentFrameDocument();
  if (!doc) throw new Error('The ResearchLab frame could not be accessed. Open demo-runner.html and index.html from the same local server.');
  const nav = doc.querySelector(`.nav-item[data-page="${scene.page}"]`);
  if (!nav) throw new Error(`Navigation item not found: ${scene.page}`);
  nav.click();
  await sleep(240);
  const win = frame.contentWindow;
  win.scrollTo({ top: 0, behavior: 'instant' });
  const main = doc.querySelector('#mainContent');
  if (main) main.scrollTop = 0;
  showCaption(index, scene);

  // After a short establishing shot, gently move to the useful area on long/mobile pages.
  if (scene.target) {
    await sleep(Math.min(1100, Math.max(550, duration * 0.2)));
    let target = doc.querySelector(scene.target);
    if (scene.targetText && scene.target === '.panel') {
      target = [...doc.querySelectorAll('.panel')].find(el => el.textContent.includes(scene.targetText)) || target;
    }
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
  await sleep(Math.max(900, duration - (scene.target ? 1300 : 0)));
}
async function run() {
  // Ask Android Chromium to hide browser chrome for a cleaner recording, when supported.
  try { const fullscreenRequest = document.documentElement.requestFullscreen?.(); fullscreenRequest?.catch(() => {}); } catch {}
  cancelled = false;
  done.classList.remove('show');
  const fast = $('#runMode').value === 'fast';
  const scale = fast ? 0.53 : 1;
  startButton.disabled = true;
  restoreButton.hidden = true;
  message.textContent = 'Preparing a synthetic research project…';
  if (!ensureBackup()) { startButton.disabled = false; restoreButton.hidden = localStorage.getItem(BACKUP_KEY) === null; return; }
  try {
    localStorage.setItem(WORKSPACE_KEY, JSON.stringify(createDemoState()));
  } catch (error) {
    message.textContent = 'Could not save demo data. Browser storage may be full.';
    startButton.disabled = false;
    console.error('ResearchLab demo seed failed:', error);
    return;
  }
  frame.onload = async () => {
    frame.onload = null;
    await sleep(450);
    launcher.classList.add('hidden');
    message.textContent = '';
    try {
      for (let i = 0; i < scenes.length; i++) {
        if (cancelled) return;
        const scene = scenes[i];
        await goToScene(i, scene, Math.round(scene.duration * scale));
      }
      caption.classList.remove('show');
      done.classList.add('show');
      startButton.disabled = false;
    } catch (error) {
      console.error(error);
      caption.classList.remove('show');
      done.classList.add('show');
      message.textContent = error.message || 'The walkthrough stopped unexpectedly.';
      startButton.disabled = false;
    }
  };
  frame.src = `index.html?demo=${Date.now()}`;
}

startButton.addEventListener('click', run);
restoreButton.addEventListener('click', restoreWorkspace);
$('#replayButton').addEventListener('click', () => {
  launcher.classList.remove('hidden');
  done.classList.remove('show');
  caption.classList.remove('show');
  startButton.disabled = false;
  message.textContent = 'Ready for another take.';
  restoreButton.hidden = localStorage.getItem(BACKUP_KEY) === null;
});
$('#restoreDoneButton').addEventListener('click', restoreWorkspace);
restoreButton.hidden = localStorage.getItem(BACKUP_KEY) === null;
