import { uid, nowISO } from './utils.js';
const KEY='researchlab.workspace.v1';
function starterProject(){return {id:uid('project'),name:'Customer Satisfaction Study',description:'Explore customer experience, service quality, and product feedback.',status:'In progress',createdAt:nowISO(),updatedAt:nowISO(),questions:[],objectives:[],hypotheses:[],literature:[],surveyQuestions:[],responses:[],notes:[],datasets:[],activeDatasetId:null,analyses:[],codes:[],textItems:[],themes:[],references:[],tasks:[{id:uid('task'),title:'Define the research question',status:'To do',priority:'High',due:'',notes:'',createdAt:nowISO()}],report:{title:'Customer Satisfaction Study',content:''},activity:[{id:uid('activity'),title:'Workspace created',detail:'Your first research project is ready.',createdAt:nowISO()}]};}
function initialState(){const p=starterProject();return {version:1,activeProjectId:p.id,theme:'light',projects:[p],preferences:{autosave:true,confirmDeletes:true}};}
let state;
function normalizeState(raw){if(!raw||!Array.isArray(raw.projects)||!raw.projects.length)return initialState();raw.version=1;raw.projects=raw.projects.map(p=>({...starterProject(),...p,report:{title:p.name,content:'',...(p.report||{})},datasets:Array.isArray(p.datasets)?p.datasets:[],literature:Array.isArray(p.literature)?p.literature:[],references:Array.isArray(p.references)?p.references:[],tasks:Array.isArray(p.tasks)?p.tasks:[],activity:Array.isArray(p.activity)?p.activity:[]}));if(!raw.projects.some(p=>p.id===raw.activeProjectId))raw.activeProjectId=raw.projects[0].id;raw.preferences={autosave:true,confirmDeletes:true,...raw.preferences};return raw;}
try{state=normalizeState(JSON.parse(localStorage.getItem(KEY)||'null'));}catch{state=initialState();}
export function getState(){return state;}
export function saveState(){try{localStorage.setItem(KEY,JSON.stringify(state));document.dispatchEvent(new CustomEvent('researchlab:saved'));return true;}catch(e){document.dispatchEvent(new CustomEvent('researchlab:storage-error',{detail:e}));return false;}}
export function activeProject(){return state.projects.find(p=>p.id===state.activeProjectId)||state.projects[0];}
export function setActiveProject(id){if(state.projects.some(p=>p.id===id)){state.activeProjectId=id;saveState();}}
export function updateProject(patch){Object.assign(activeProject(),patch,{updatedAt:nowISO()});saveState();}
export function addActivity(title,detail=''){const p=activeProject();p.activity.unshift({id:uid('activity'),title,detail,createdAt:nowISO()});p.activity=p.activity.slice(0,30);p.updatedAt=nowISO();saveState();}
export function createProject(name,description=''){const p=starterProject();p.name=name.trim()||'Untitled research project';p.description=description.trim();p.report.title=p.name;state.projects.unshift(p);state.activeProjectId=p.id;saveState();addActivity('Project created',p.name);return p;}
export function replaceState(next){state=normalizeState(next);saveState();}
export function exportState(){return JSON.stringify(state,null,2);}
export function clearWorkspace(){state=initialState();saveState();}
