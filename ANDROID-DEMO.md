# ResearchLab product demo on Android + Termux

This package includes an Android-friendly demo runner, so a desktop computer or browser developer tools are not required. The runner opens ResearchLab in a same-origin frame, loads clearly labeled synthetic records, then walks through the real app screens.

## Recommended: run the guided demo without a browser console

1. Extract `researchlab-toolkit.zip` into a folder in Termux. For example, if the ZIP is in Downloads:

   ```sh
   pkg update
   pkg install python unzip
   termux-setup-storage
   cd ~/storage/downloads
   unzip researchlab-toolkit.zip
   cd researchlab
   ```

   If you extracted it elsewhere, `cd` into the folder that contains `index.html` and `demo-runner.html`.

2. Start the local web server:

   ```sh
   python -m http.server 8000 --bind 127.0.0.1
   ```

3. In your Android browser, open:

   ```text
   http://127.0.0.1:8000/demo-runner.html
   ```

4. Start Android's built-in screen recorder from Quick Settings, return to the browser, and tap **Start walkthrough**. Choose the normal or quick pace first.

5. The app will navigate through its dashboard, planning, literature, collection, data, statistics, qualitative analysis, visualizations, calculators, report builder, references, tasks, and settings. Avoid tapping the app while it is running.

The guided runner has a start screen and lower-third captions. It hides the start screen when the sequence begins. A completion control appears at the end; stop your screen recording before that overlay appears if you want a clean final frame.

## Workspace safety

Before it replaces the current app data with the demo project, the runner makes a local backup under `researchlab.demo.backup.v1`. Use **Restore previous workspace** at the end to put back the exact workspace that was present before the first demo run. Do not clear browser site data before restoring, or the backup will be removed.

All seeded people, feedback, source entries, and measurements are synthetic. The example bibliography is explicitly marked as placeholder material and must not be cited as real research.

## Optional: run the console script

If you already have a way to execute JavaScript in the page console, open `index.html` from the same local server and paste the entire contents of `demo.js`. It backs up the current workspace and runs the same guided navigation in the current tab. It relies on JavaScript module imports, so **do not open the app as a `file://` URL**; use the Termux HTTP server.

## Restore using the console

If you ran `demo.js` and want to restore the previous project, run this snippet on the same app origin:

```js
(() => {
  const backupKey = 'researchlab.demo.backup.v1';
  const workspaceKey = 'researchlab.workspace.v1';
  const backup = JSON.parse(localStorage.getItem(backupKey) || 'null');
  if (!backup) throw new Error('No ResearchLab demo backup was found.');
  if (backup.exists) localStorage.setItem(workspaceKey, backup.raw);
  else localStorage.removeItem(workspaceKey);
  localStorage.removeItem(backupKey);
  location.reload();
})();
```

## Video tips

- Record at 1080p if your Android device offers that option.
- Turn on Do Not Disturb to keep notifications out of the video.
- Use portrait orientation for a mobile-first walkthrough; landscape can show more analysis tables.
- Start the screen recorder before tapping **Start walkthrough**.
- The standard walkthrough takes about 75 seconds; quick mode takes about 40 seconds.
