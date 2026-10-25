/*
 * ResearchLab console demo automation.
 * Open ResearchLab over HTTP, paste this entire file into that page's console, and press Enter.
 * It saves a copy of the current workspace before loading synthetic demo content.
 */
(async () => {
  const WORKSPACE_KEY = 'researchlab.workspace.v1';
  const BACKUP_KEY = 'researchlab.demo.backup.v1';
  const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
  const root = new URL('./', location.href);
  const storeUrl = new URL('js/store.js', root).href;
  const demoDataUrl = new URL('demo-data.js', root).href;
  const { replaceState } = await import(storeUrl);
  const { createDemoState } = await import(demoDataUrl);

  if (localStorage.getItem(BACKUP_KEY) === null) {
    const raw = localStorage.getItem(WORKSPACE_KEY);
    try {
      localStorage.setItem(BACKUP_KEY, JSON.stringify({ exists: raw !== null, raw }));
    } catch (error) {
      throw new Error('Could not back up the current workspace. Free browser storage before running the demo.');
    }
  }

  replaceState(createDemoState());
  console.clear();
  console.log('%cResearchLab demo prepared', 'font-weight:bold;font-size:16px;color:#7774ed');
  console.log('Synthetic data loaded. Your previous workspace was backed up in localStorage.');

  const scenes = [
    ['dashboard', 'Research overview', 4300],
    ['planning', 'Questions and hypotheses', 4800],
    ['literature', 'Literature review', 5000],
    ['collection', 'Data collection', 4700],
    ['data', 'Data workspace', 6500],
    ['statistics', 'Statistical analysis', 6500],
    ['qualitative', 'Qualitative analysis', 5600],
    ['visualizations', 'Visualization studio', 6500],
    ['calculators', 'Research calculators', 4400],
    ['reports', 'Report builder', 6200],
    ['references', 'References', 4300],
    ['tasks', 'Project tasks', 4300],
    ['settings', 'Settings and backup', 4300],
    ['dashboard', 'ResearchLab complete workflow', 5000]
  ];
  const caption = document.createElement('div');
  caption.id = 'researchlab-demo-caption';
  Object.assign(caption.style, {
    position: 'fixed', left: '16px', right: '16px', bottom: '18px', zIndex: '99999',
    padding: '13px 16px', borderRadius: '14px', color: '#f6f6ff', background: 'rgba(20,22,36,.93)',
    border: '1px solid rgba(255,255,255,.15)', boxShadow: '0 12px 35px rgba(0,0,0,.22)',
    font: '12px/1.45 system-ui,sans-serif', opacity: '0', transition: 'opacity .2s ease', pointerEvents: 'none'
  });
  document.body.append(caption);
  const showCaption = (index, title) => {
    caption.innerHTML = `<div style="color:#aaa7ff;font-size:9px;font-weight:800;letter-spacing:1.5px;margin-bottom:4px">RESEARCHLAB · ${String(index + 1).padStart(2, '0')} / ${scenes.length}</div><strong style="font-size:14px">${title}</strong>`;
    caption.style.opacity = '1';
    clearTimeout(showCaption.timer);
    showCaption.timer = setTimeout(() => caption.style.opacity = '0', 1900);
  };
  const scrollToTarget = selector => {
    const target = document.querySelector(selector);
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  // Re-render the current app from the seeded state.
  document.querySelector('.nav-item[data-page="dashboard"]')?.click();
  await sleep(350);
  for (let i = 0; i < scenes.length; i++) {
    const [page, title, duration] = scenes[i];
    const nav = document.querySelector(`.nav-item[data-page="${page}"]`);
    if (!nav) {
      console.warn(`Skipping missing navigation item: ${page}`);
      continue;
    }
    nav.click();
    window.scrollTo({ top: 0, behavior: 'instant' });
    const main = document.querySelector('#mainContent');
    if (main) main.scrollTop = 0;
    showCaption(i, title);
    await sleep(850);
    const targets = {
      literature: '#literatureTable', collection: '#responseText', data: '#datasetTable',
      statistics: '#analysisOutput', qualitative: '.metric-list', visualizations: '.chart-container',
      reports: '#reportEditor'
    };
    if (targets[page]) scrollToTarget(targets[page]);
    await sleep(Math.max(900, duration - 850));
    console.log(`Demo scene ${i + 1}/${scenes.length}: ${title}`);
  }
  caption.remove();
  console.log('%cDemo walkthrough complete.', 'font-weight:bold;color:#17a48b');
  console.log('To restore your previous workspace, run the restore snippet in ANDROID-DEMO.md or use demo-runner.html.');
})();
