import test from 'node:test';
import assert from 'node:assert/strict';
const pageNames=['dashboard','planning','literature','collection','data','statistics','qualitative','visualizations','calculators','reports','references','tasks','settings'];
const pages=await Promise.all(pageNames.map(n=>import(`../js/pages/${n}.js`)));
const rows=Array.from({length:6},(_,i)=>({respondent_id:`R${i+1}`,segment:['A','B'][i%2],score:i+1,score2:6-i,feedback:['good service','slow delivery'][i%2]}));
const dataset={id:'dataset_test',name:'Test dataset',columns:Object.keys(rows[0]),originalColumns:Object.keys(rows[0]),rows,originalRows:rows.map(r=>({...r})),format:'CSV',importedAt:new Date().toISOString()};
const project={id:'project_test',name:'Test research project',description:'Render smoke test',status:'In progress',createdAt:new Date().toISOString(),updatedAt:new Date().toISOString(),questions:[],objectives:[],hypotheses:[],literature:[],surveyQuestions:[],responses:[],notes:[],datasets:[dataset],activeDatasetId:dataset.id,analyses:[],codes:[],textItems:[],themes:[],references:[],tasks:[],report:{title:'Test research project',content:''},activity:[],savedCharts:[{id:'chart_test',title:'Segment counts',type:'bar',xCol:'segment',yCol:'score',datasetId:dataset.id,datasetName:dataset.name,createdAt:new Date().toISOString()}]};
const state={version:1,projects:[project],activeProjectId:project.id,theme:'light',preferences:{}};
test('all feature pages render HTML from a populated project',()=>{
  for(let i=0;i<pages.length;i++){
    const html=pages[i].render({state,project});
    assert.equal(typeof html,'string',`${pageNames[i]} should return HTML`);
    assert.ok(html.length>200,`${pageNames[i]} should render useful content`);
    assert.ok(!html.includes('undefined'),`${pageNames[i]} should not display undefined values`);
  }
});
