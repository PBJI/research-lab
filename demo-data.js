/* Synthetic demo workspace data for ResearchLab. All records are illustrative, not real research. */
const isoNow = () => new Date().toISOString();
const dateOffset = days => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
};
const average = values => values.reduce((sum, value) => sum + value, 0) / Math.max(1, values.length);
const sampleSd = values => {
  if (values.length < 2) return 0;
  const m = average(values);
  return Math.sqrt(values.reduce((sum, value) => sum + (value - m) ** 2, 0) / (values.length - 1));
};
const median = values => {
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
};

export function createDemoState() {
  const createdAt = isoNow();
  const datasetId = 'demo-dataset-customer-satisfaction';
  const segmentNames = ['New customer', 'Returning', 'Premium'];
  const feedback = [
    'Easy to use and affordable',
    'Support took too long',
    'Good value for money',
    'The interface could be simpler',
    'Reliable and convenient',
    'Checkout was straightforward',
    'Delivery updates were unclear',
    'Good quality for the price'
  ];
  const rows = Array.from({ length: 36 }, (_, i) => {
    const age = 22 + (i * 7) % 39;
    const segment = segmentNames[i % segmentNames.length];
    const satisfaction = Math.max(1, Math.min(5, Math.round(2.3 + (i % 5) * 0.55 + (i % 3) * 0.25)));
    const spend = Math.round(220 + age * 12 + (i % 7) * 85 + (segment === 'Premium' ? 650 : segment === 'Returning' ? 220 : 0));
    return {
      respondent_id: `R-${String(i + 1).padStart(3, '0')}`,
      age,
      segment,
      satisfaction,
      monthly_spend_inr: spend,
      recommend_likelihood: Math.max(0, Math.min(10, Math.round(satisfaction * 1.7 + (i % 4) - 1))),
      feedback: feedback[i % feedback.length]
    };
  });
  // Intentionally leave one missing value and include one exact duplicate to show data-quality tools.
  rows[7].satisfaction = '';
  rows.push({ ...rows[0] });
  const columns = ['respondent_id', 'age', 'segment', 'satisfaction', 'monthly_spend_inr', 'recommend_likelihood', 'feedback'];
  const numericSatisfaction = rows.map(row => row.satisfaction).filter(value => value !== '' && value !== null && value !== undefined && Number.isFinite(Number(value))).map(Number);
  const stats = {
    n: numericSatisfaction.length,
    mean: average(numericSatisfaction),
    median: median(numericSatisfaction),
    sd: sampleSd(numericSatisfaction),
    min: Math.min(...numericSatisfaction),
    max: Math.max(...numericSatisfaction)
  };
  const stamp = n => new Date(Date.now() - n * 86400000).toISOString();
  const dataset = {
    id: datasetId,
    name: 'Customer satisfaction · synthetic sample',
    format: 'Sample CSV',
    columns,
    originalColumns: [...columns],
    rows: rows.map(row => ({ ...row })),
    originalRows: rows.map(row => ({ ...row })),
    importedAt: createdAt,
    sourceFile: 'researchlab-synthetic-demo.csv'
  };
  const codeIds = {
    value: 'demo-code-value',
    usability: 'demo-code-usability',
    support: 'demo-code-support',
    reliability: 'demo-code-reliability'
  };
  const textItems = [
    { id: 'demo-text-1', title: 'Respondent R-004', text: 'The price feels fair and the product does what I need.', memo: 'Illustrative response; sample only.', sentiment: 'Positive', codeIds: [codeIds.value], createdAt: stamp(5) },
    { id: 'demo-text-2', title: 'Respondent R-009', text: 'I waited too long for support to answer a simple question.', memo: 'Illustrative response; sample only.', sentiment: 'Negative', codeIds: [codeIds.support], createdAt: stamp(4) },
    { id: 'demo-text-3', title: 'Respondent R-013', text: 'The application is useful, but finding the right setting is confusing.', memo: 'Illustrative response; sample only.', sentiment: 'Mixed', codeIds: [codeIds.usability], createdAt: stamp(4) },
    { id: 'demo-text-4', title: 'Respondent R-018', text: 'It has been reliable over several months and saves me time.', memo: 'Illustrative response; sample only.', sentiment: 'Positive', codeIds: [codeIds.reliability], createdAt: stamp(3) },
    { id: 'demo-text-5', title: 'Respondent R-024', text: 'Good value, although the checkout steps could be shorter.', memo: 'Illustrative response; sample only.', sentiment: 'Mixed', codeIds: [codeIds.value, codeIds.usability], createdAt: stamp(2) },
    { id: 'demo-text-6', title: 'Respondent R-031', text: 'The team solved the issue after I followed up a second time.', memo: 'Illustrative response; sample only.', sentiment: 'Neutral', codeIds: [codeIds.support], createdAt: stamp(1) }
  ];
  const literature = [
    {
      id: 'demo-literature-1', title: 'Example source record: Customer experience survey', authors: 'Illustrative demo entry', year: '2024',
      topic: 'Customer satisfaction', method: 'Survey', type: 'Report', url: '',
      summary: 'Example summary field showing how an analyst can record methods, measures, and findings after reviewing a real source.',
      gap: 'Demonstration only. Replace with a verified publication and a researcher-written synthesis.', createdAt: stamp(4)
    },
    {
      id: 'demo-literature-2', title: 'Example source record: Service quality interviews', authors: 'Illustrative demo entry', year: '2023',
      topic: 'Service quality', method: 'Semi-structured interviews', type: 'Journal article', url: '',
      summary: 'Example record used to demonstrate comparison of qualitative methods and reported themes across sources.',
      gap: 'Demonstration only. This is not a real bibliographic citation.', createdAt: stamp(3)
    },
    {
      id: 'demo-literature-3', title: 'Example source record: Digital product usability', authors: 'Illustrative demo entry', year: '2022',
      topic: 'Usability', method: 'Mixed methods', type: 'Conference paper', url: '',
      summary: 'A placeholder entry illustrates how evidence notes can be organized by topic, methodology, and main finding.',
      gap: 'Demonstration only. Add a verified source before using this workspace for actual research.', createdAt: stamp(2)
    }
  ];
  const analysis = {
    id: 'demo-analysis-descriptive', title: 'Descriptive statistics · satisfaction', test: 'describe', testLabel: 'Descriptive statistics',
    datasetId, datasetName: dataset.name, variables: ['satisfaction'],
    results: { n: stats.n, mean: stats.mean, median: stats.median, sd: stats.sd, minimum: stats.min, maximum: stats.max },
    details: [],
    interpretation: `In this synthetic demo dataset, ${stats.n} numeric satisfaction ratings have a mean of ${stats.mean.toFixed(2)} on a five-point scale. These generated values are illustrative and are not empirical evidence.`,
    createdAt: stamp(1)
  };
  const resultTiles = [
    ['Valid observations', stats.n], ['Mean', stats.mean.toFixed(2)], ['Median', stats.median.toFixed(2)], ['Sample SD', stats.sd.toFixed(2)], ['Minimum', stats.min], ['Maximum', stats.max]
  ].map(([label, value]) => `<div class="result-item"><span>${label}</span><strong>${value}</strong></div>`).join('');
  const lastAnalysisHtml = `<div class="result-block"><h3>Descriptive statistics · satisfaction</h3><div class="result-grid">${resultTiles}</div><div class="callout" style="margin-top:12px"><span>ⓘ</span><div>${analysis.interpretation}</div></div><p class="light-copy" style="margin-bottom:0">Saved demonstration result · ${dataset.name}</p></div>`;
  const reportContent = `
    <h1>Customer Satisfaction Study</h1>
    <p><em>ResearchLab product demonstration · Synthetic data</em></p>
    <div style="padding:12px 14px;background:#f3f2ff;border-left:3px solid #7774ed;border-radius:6px;color:#55518b"><strong>Demo disclaimer.</strong> This workspace uses generated synthetic records and placeholder source entries. Nothing here should be cited or presented as real research evidence.</div>
    <h2>Abstract</h2>
    <p>This example demonstrates a workflow for organizing customer satisfaction research, inspecting a dataset, summarizing numeric responses, analyzing open-ended feedback, and preparing a report.</p>
    <h2>1. Research question</h2>
    <p>How do customers describe their satisfaction with a digital product, and which parts of the experience appear most often in their feedback?</p>
    <h2>2. Methodology</h2>
    <p>For product demonstration only, the workspace contains ${rows.length} generated records. One satisfaction value is intentionally missing and one exact duplicate row is included to demonstrate data-quality checks. The example also contains six synthetic text excerpts for qualitative coding.</p>
    <h2>3. Descriptive results</h2>
    <table><thead><tr><th>Measure</th><th>Value</th></tr></thead><tbody>
      <tr><td>Valid satisfaction ratings</td><td>${stats.n}</td></tr><tr><td>Mean rating</td><td>${stats.mean.toFixed(2)} / 5</td></tr><tr><td>Median rating</td><td>${stats.median.toFixed(2)} / 5</td></tr><tr><td>Sample standard deviation</td><td>${stats.sd.toFixed(2)}</td></tr>
    </tbody></table>
    <p>These figures are calculated from the generated values solely to illustrate the reporting workflow. They do not describe actual customers.</p>
    <h2>4. Qualitative workflow</h2>
    <p>Example codes include Value for money, Usability friction, Support response, and Reliability. A researcher should review each excerpt in context, document code definitions, and keep an audit trail for theme development.</p>
    <h2>5. Limitations</h2>
    <p>The sample is synthetic and is not designed to represent any population. No causal inference or generalizable conclusion can be drawn from these example records.</p>
    <h2>6. Conclusion</h2>
    <p>The demonstration connects planning, evidence organization, data inspection, statistical summaries, qualitative coding, visualization, and reporting in one local workspace.</p>
    <h2>References</h2><p>Placeholder source records only. Replace with verified, read, and accurately cited publications before using this report for real research.</p>`;

  const project = {
    id: 'demo-project-customer-satisfaction',
    name: 'Customer Satisfaction Study',
    description: 'Explore customer experience, service quality, and product feedback. This project is seeded with synthetic demonstration data.',
    status: 'In progress', methodology: 'Mixed methods', scope: 'Illustrative dataset only. No real respondents or publications are represented.',
    createdAt: stamp(7), updatedAt: createdAt,
    questions: [
      { id: 'demo-question-1', title: 'Which aspects of the product experience appear most often in customer feedback?', createdAt: stamp(6) },
      { id: 'demo-question-2', title: 'How do satisfaction ratings vary across customer segments?', createdAt: stamp(5) }
    ],
    objectives: [
      { id: 'demo-objective-1', title: 'Summarize satisfaction ratings and inspect missing values.', createdAt: stamp(6) },
      { id: 'demo-objective-2', title: 'Organize open-ended feedback into transparent codes and themes.', createdAt: stamp(5) }
    ],
    hypotheses: [
      { id: 'demo-hypothesis-1', title: 'Satisfaction and recommendation intent', nullText: 'There is no association between satisfaction rating and recommendation likelihood.', altText: 'Satisfaction rating is associated with recommendation likelihood.', createdAt: stamp(4) }
    ],
    literature,
    synthesis: 'Demo synthesis note: compare constructs, sampling, measures, findings, and limitations in verified sources. The source entries in this project are placeholders, not publications.',
    showLiteratureForm: false,
    surveyQuestions: [
      { id: 'demo-survey-1', prompt: 'How satisfied are you with your overall product experience?', type: 'Likert scale (1–5)', variable: 'satisfaction', options: '1 = Very dissatisfied; 5 = Very satisfied', createdAt: stamp(5) },
      { id: 'demo-survey-2', prompt: 'How likely are you to recommend this product?', type: 'Numeric', variable: 'recommend_likelihood', options: '', createdAt: stamp(4) },
      { id: 'demo-survey-3', prompt: 'What should we improve first?', type: 'Long answer', variable: 'feedback', options: '', createdAt: stamp(3) }
    ],
    responses: [
      { id: 'demo-response-1', respondent: 'R-004', date: dateOffset(-4), text: 'The price feels fair and the product does what I need.', tags: 'value; product fit', createdAt: stamp(4) },
      { id: 'demo-response-2', respondent: 'R-009', date: dateOffset(-3), text: 'I waited too long for support to answer a simple question.', tags: 'support; response time', createdAt: stamp(3) },
      { id: 'demo-response-3', respondent: 'R-013', date: dateOffset(-2), text: 'The application is useful, but finding the right setting is confusing.', tags: 'usability; navigation', createdAt: stamp(2) },
      { id: 'demo-response-4', respondent: 'R-018', date: dateOffset(-1), text: 'It has been reliable over several months and saves me time.', tags: 'reliability; convenience', createdAt: stamp(1) }
    ],
    notes: [
      { id: 'demo-note-1', title: 'Pilot review · demo note', body: 'Example field note: verify question wording with a pilot group before real data collection. This is an illustrative note.', createdAt: stamp(3) }
    ],
    datasets: [dataset], activeDatasetId: datasetId,
    analyses: [analysis], lastAnalysisHtml,
    codes: [
      { id: codeIds.value, name: 'Value for money', definition: 'Mention of affordability, price fairness, or value.', color: '#5d5bd8' },
      { id: codeIds.usability, name: 'Usability friction', definition: 'Difficulty finding, understanding, or completing a product task.', color: '#4e83d8' },
      { id: codeIds.support, name: 'Support response', definition: 'Comment about support access, speed, or helpfulness.', color: '#d98535' },
      { id: codeIds.reliability, name: 'Reliability', definition: 'Comment about consistency or dependable performance.', color: '#17a48b' }
    ],
    textItems,
    themes: [
      { id: 'demo-theme-1', name: 'Effort shapes the experience', definition: 'Illustrative theme linking friction in navigation and slow support responses. Review context and contradictory evidence before finalizing a real theme.', codeIds: [codeIds.usability, codeIds.support] },
      { id: 'demo-theme-2', name: 'Value supports satisfaction', definition: 'Illustrative theme grouping comments about affordability and reliable day-to-day use.', codeIds: [codeIds.value, codeIds.reliability] }
    ],
    references: [
      { id: 'demo-ref-1', author: 'Illustrative demo entry', year: '2024', title: 'Example reference: Customer experience survey', source: 'ResearchLab synthetic demo; not a real publication', type: 'Report', doi: '', url: '', notes: 'Placeholder only. Replace with verified bibliographic metadata.', createdAt: stamp(3) },
      { id: 'demo-ref-2', author: 'Illustrative demo entry', year: '2023', title: 'Example reference: Service quality interviews', source: 'ResearchLab synthetic demo; not a real publication', type: 'Journal article', doi: '', url: '', notes: 'Placeholder only. Not a real citation.', createdAt: stamp(2) }
    ],
    tasks: [
      { id: 'demo-task-1', title: 'Define the research question', status: 'Done', priority: 'High', due: dateOffset(-3), notes: 'Confirm the question is focused and researchable.', createdAt: stamp(6) },
      { id: 'demo-task-2', title: 'Review and organize sources', status: 'In progress', priority: 'High', due: dateOffset(2), notes: 'Replace placeholder entries with verified publications.', createdAt: stamp(4) },
      { id: 'demo-task-3', title: 'Inspect and clean the dataset', status: 'In progress', priority: 'High', due: dateOffset(3), notes: 'Review the intentionally seeded missing value and duplicate.', createdAt: stamp(2) },
      { id: 'demo-task-4', title: 'Review report limitations', status: 'To do', priority: 'Normal', due: dateOffset(5), notes: 'Keep findings proportionate to the design and data.', createdAt: stamp(1) }
    ],
    savedCharts: [
      { id: 'demo-chart-segments', title: 'Respondents by customer segment', type: 'bar', xCol: 'segment', yCol: 'satisfaction', note: 'Synthetic sample; counts by segment.', datasetId, datasetName: dataset.name, createdAt: stamp(1) },
      { id: 'demo-chart-satisfaction-recommend', title: 'Satisfaction and recommendation intent', type: 'scatter', xCol: 'satisfaction', yCol: 'recommend_likelihood', note: 'Synthetic sample; association is not causation.', datasetId, datasetName: dataset.name, createdAt }
    ],
    calculatorResults: {},
    report: { title: 'Customer Satisfaction Study · Demo report', content: reportContent },
    activity: [
      { id: 'demo-activity-1', title: 'Descriptive analysis saved', detail: 'Synthetic satisfaction ratings summarized.', createdAt: stamp(1) },
      { id: 'demo-activity-2', title: 'Qualitative codes reviewed', detail: 'Four researcher-defined demo codes are available.', createdAt: stamp(2) },
      { id: 'demo-activity-3', title: 'Sample dataset loaded', detail: '37 synthetic rows × 7 columns, including demo data-quality issues.', createdAt: stamp(3) },
      { id: 'demo-activity-4', title: 'Research question added', detail: 'Customer feedback and satisfaction across segments.', createdAt: stamp(5) }
    ]
  };
  return {
    version: 1,
    activeProjectId: project.id,
    theme: 'light',
    projects: [project],
    preferences: { autosave: true, confirmDeletes: true }
  };
}
