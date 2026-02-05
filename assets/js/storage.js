const KEY="empresarial:data:v1";
const KEY_DLC="empresarial:dlc:enabled:v1";
function nowISO(){return new Date().toISOString();}
const defaultData={
  meta:{createdAt:nowISO(),updatedAt:nowISO()},
  company:{name:"Minha Empresa",cnpj:"",regime:"Simples Nacional",currency:"BRL"},
  finance:{
    month:new Date().toISOString().slice(0,7),
    cash:{balance:12000},
    receivables:[{id:"r1",desc:"Venda #1021",amount:3200,due:new Date().toISOString().slice(0,10),status:"open"}],
    payables:[{id:"p1",desc:"Internet",amount:180,due:new Date().toISOString().slice(0,10),status:"open"}],
    budget:{marketing:800,payroll:6000,tools:700,misc:500}
  },
  hr:{
    employees:[
      {id:"e1",name:"Ana Souza",role:"Atendimento",type:"CLT",salary:2600,start:"2025-11-04"},
      {id:"e2",name:"João Lima",role:"Dev",type:"PJ",salary:8500,start:"2026-01-10"}
    ],
    hiringPlan:[{id:"h1",role:"Vendas",when:"2026-03",reason:"Aumentar receita",budget:3500}]
  },
  projects:{list:[
    {id:"pr1",name:"Site institucional",status:"em andamento",due:"2026-02-28",owner:"João Lima"},
    {id:"pr2",name:"Implantar CRM",status:"planejado",due:"2026-04-10",owner:"Ana Souza"}
  ]},
  ops:{routines:[{id:"op1",title:"Fechamento mensal",cadence:"Mensal",owner:"Financeiro",checklist:["Conferir caixa","Emitir DRE simples","Revisar metas"]}]},
  notes:{quick:"Dica: use o Admin para ativar DLCs e exportar/importar backups."}
};
export const Storage={
  seedDefaults(){ if(!localStorage.getItem(KEY)) localStorage.setItem(KEY,JSON.stringify(defaultData)); if(!localStorage.getItem(KEY_DLC)) localStorage.setItem(KEY_DLC,JSON.stringify(["dlc.sample_analytics"])); },
  getData(){ try{ return JSON.parse(localStorage.getItem(KEY)||"null")||structuredClone(defaultData);}catch{ return structuredClone(defaultData);} },
  patchData(patch){ const cur=this.getData(); const next=deepMerge(cur,patch); next.meta.updatedAt=new Date().toISOString(); localStorage.setItem(KEY,JSON.stringify(next)); },
  getEnabledDLCs(){ try{return JSON.parse(localStorage.getItem(KEY_DLC)||"[]");}catch{return [];} },
  setDLCEnabled(id,en){ const s=new Set(this.getEnabledDLCs()); en?s.add(id):s.delete(id); localStorage.setItem(KEY_DLC,JSON.stringify([...s])); },
  exportAll(){ return {schema:"empresarial.backup.v1",exportedAt:new Date().toISOString(),data:this.getData(),enabledDlcs:this.getEnabledDLCs()}; },
  importAll(pack){ if(!pack||pack.schema!=="empresarial.backup.v1") throw new Error("Backup inválido."); localStorage.setItem(KEY,JSON.stringify(pack.data)); localStorage.setItem(KEY_DLC,JSON.stringify(pack.enabledDlcs||[])); },
  hardReset(){ localStorage.removeItem(KEY); localStorage.removeItem(KEY_DLC); localStorage.removeItem("empresarial:auth:session:v1"); localStorage.removeItem("empresarial:auth:admin:v1"); }
};
function deepMerge(t,p){ if(typeof p!=="object"||p===null) return p; if(Array.isArray(p)) return p.slice(); const o={...(t||{})}; for(const [k,v] of Object.entries(p)){ o[k]=(v&&typeof v==="object"&&!Array.isArray(v))?deepMerge(o[k],v):v; } return o; }
