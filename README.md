# ResearchLab · Research Analyst Toolkit

ResearchLab is a modular, browser-based workspace for research planning, literature tracking, data preparation, introductory statistical analysis, qualitative coding, visualization, and report drafting.

## Run it

The application uses native browser APIs and ES modules. No package installation or build step is required. Because browsers commonly restrict ES module imports from `file://` URLs, serve the folder locally:

```bash
cd researchlab
python3 -m http.server 8000
```

Then open **http://localhost:8000** in your browser. Stop the server with `Ctrl+C`.

Alternatively, use any static file server. It can also be deployed to static hosting without a backend.

## Main modules

- **Dashboard:** project overview, activity, quick navigation, and project status.
- **Research planning:** study brief, question and objective tracking, and null/alternative hypotheses.
- **Literature review:** manually curated source library, methodology and findings notes, gap notes, and a synthesis workspace.
- **Data collection:** questionnaire item builder, response log, and field notes. This does not host a public survey.
- **Data workspace:** CSV/JSON imports, data preview, missingness inspection, duplicate removal, whitespace trimming, numeric conversion, missing-value fill, removal of incomplete rows, calculated columns, CSV export, and restore-to-imported-copy.
- **Statistical analysis:** descriptive statistics, frequencies, t-based mean confidence intervals, one-sample t-test, Welch's two-sample t-test, one-way ANOVA, chi-square independence test, Pearson/Spearman correlation, simple linear regression, effect size (Cohen's d), and Cronbach's alpha. Analysis summaries are saved with the project.
- **Qualitative analysis:** researcher's text corpus, manually defined codebook, code assignment, theme notes with supporting codes, sentiment annotation, and basic word frequency.
- **Visualization studio:** bar charts, pie charts, histograms, line plots, scatterplots, and box plots. Charts export as SVG.
- **Research calculators:** sample size, proportion margin of error, response rate, percentage, weighted mean, and Cohen's d.
- **Report builder:** editable report draft, template structure, insertion of saved analysis summaries and chart captions, HTML export, and browser print/PDF.
- **References:** manual reference metadata, APA-like draft formatting, copy and CSV export.
- **Project tasks:** tasks, priority, due dates, progress, and status.
- **Settings & backup:** theme toggle, JSON workspace backup and restore, and project controls.

## Data and privacy

The workspace is stored in this browser's `localStorage`. There is no server-side account, database, or automatic device synchronization. Export backups regularly. Browser storage is not an encrypted vault, so do not store sensitive participant identifiers or confidential data in this prototype.

The interface uses local system-font fallbacks. No external runtime library or internet connection is required for the core app.

## Statistical limitations

This is an educational and practical starter toolkit, not a validated replacement for R, SPSS, Stata, SAS, NVivo, or a specialist citation manager. Verify results before using them in academic, clinical, legal, financial, or other high-stakes work. Tests have assumptions; p-values do not measure effect importance or establish causality. Cronbach's alpha does not prove unidimensionality or validity. The chi-square implementation reports the minimum expected cell count so the analyst can assess whether its approximation is suitable.

Chart behavior is intentionally simple: bar and pie charts summarize category frequencies, histograms use automatic bins, line charts use current row order, scatterplots require two numeric variables, and box plots show five-number summaries. Sort or prepare time variables before drawing a line chart.

## Developer notes

- `index.html`: application shell.
- `css/styles.css`: responsive design system and themes.
- `js/app.js`: navigation, events, modal actions, and app orchestration.
- `js/store.js`: browser persistence and project model.
- `js/utils.js`, `js/components.js`: shared helpers and UI primitives.
- `js/stats.js`: statistical functions.
- `js/charts.js`: SVG chart rendering.
- `js/pages/`: feature-specific modules.
- `tests/`: basic automated regression tests.

Run automated tests with Node.js 18 or later:

```bash
node --test tests/*.test.js
```

## Android product demo

This package now includes `demo-runner.html`, `demo-runner.js`, and `demo-data.js` for an Android/Termux-guided product walkthrough. Start the static server from this folder and open `http://127.0.0.1:8000/demo-runner.html`. Full instructions, workspace backup/restore notes, and the optional console script are in `ANDROID-DEMO.md`. The seeded demo records and source entries are synthetic placeholders, not real research.
