const KEY="cvb:data:v1";
const KEY_DLC="cvb:dlc:enabled:v1";
const KEY_USERS="cvb:users:v1";
const KEY_SETTINGS="cvb:settings:v1";
const KEY_CONTENT_OVR="cvb:content:override:v1";
const KEY_LOCAL_DLCS="cvb:dlc:local:v1";

function nowISO(){return new Date().toISOString();}

const defaultUsers = [
  { id:"u1", name:"Admin (Demo)", email:"admin@empresa.com", role:"Administrador", password:"1234", perms:["*"], active:true },
  { id:"u2", name:"Financeiro", email:"fin@empresa.com", role:"Financeiro", password:"1234", perms:["dashboard","finance"], active:true },
  { id:"u3", name:"RH", email:"rh@empresa.com", role:"Recursos Humanos", password:"1234", perms:["dashboard","hr"], active:true },
  { id:"u4", name:"Projetos", email:"pm@empresa.com", role:"Projetos", password:"1234", perms:["dashboard","projects"], active:true },
];

const defaultSettings = {
  security:{
    // hide profile quick-picks on login screen (avoid exposing user list on public Pages)
    privacyMode: true,
    // optional "company code" to gate login on public hosting
    companyLockEnabled: false,
    companyLockHash: null, // sha-256 hex
    // optional: allow only emails on a domain (ex.: empresa.com)
    allowedEmailDomain: "",
    // optional: allow only specific emails (invite-only)
    allowlistEmails: []
  }
};

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
  notes:{quick:"Dica: no Admin você gerencia usuários (RBAC), ativa DLCs e edita conteúdo (Content Studio)."}
};

export const Storage={
  seedDefaults(){
    if(!localStorage.getItem(KEY)) localStorage.setItem(KEY,JSON.stringify(defaultData));
    if(!localStorage.getItem(KEY_DLC)) localStorage.setItem(KEY_DLC,JSON.stringify(["dlc.sample_analytics"]));
    if(!localStorage.getItem(KEY_USERS)) localStorage.setItem(KEY_USERS,JSON.stringify(defaultUsers));
    if(!localStorage.getItem(KEY_SETTINGS)) localStorage.setItem(KEY_SETTINGS,JSON.stringify(defaultSettings));
    if(!localStorage.getItem(KEY_LOCAL_DLCS)) localStorage.setItem(KEY_LOCAL_DLCS,JSON.stringify([]));
  },

  // Settings
  getSettings(){ try{ return JSON.parse(localStorage.getItem(KEY_SETTINGS)||"null")||structuredClone(defaultSettings);}catch{ return structuredClone(defaultSettings);} },
  saveSettings(settings){ localStorage.setItem(KEY_SETTINGS, JSON.stringify(settings||defaultSettings)); },

  // App data
  getData(){ try{ return JSON.parse(localStorage.getItem(KEY)||"null")||structuredClone(defaultData);}catch{ return structuredClone(defaultData);} },
  patchData(patch){ const cur=this.getData(); const next=deepMerge(cur,patch); next.meta.updatedAt=new Date().toISOString(); localStorage.setItem(KEY,JSON.stringify(next)); },

  // DLC
  getEnabledDLCs(){ try{return JSON.parse(localStorage.getItem(KEY_DLC)||"[]");}catch{return [];} },
  setDLCEnabled(id,en){ const s=new Set(this.getEnabledDLCs()); en?s.add(id):s.delete(id); localStorage.setItem(KEY_DLC,JSON.stringify([...s])); },

  // Users
  getUsers(){ try{ return JSON.parse(localStorage.getItem(KEY_USERS)||"[]"); }catch{ return []; } },
  saveUsers(users){ localStorage.setItem(KEY_USERS, JSON.stringify(users||[])); },
  upsertUser(user){
    const users=this.getUsers();
    const idx=users.findIndex(u=>u.id===user.id);
    if(idx>=0) users[idx]=user; else users.push(user);
    this.saveUsers(users);
  },
  removeUser(id){
    const users=this.getUsers().filter(u=>u.id!==id);
    this.saveUsers(users);
  },

  // Content Studio
  getContentOverride(){ try{ return JSON.parse(localStorage.getItem(KEY_CONTENT_OVR)||"null"); }catch{ return null; } },
  setContentOverride(ovr){ if(!ovr) localStorage.removeItem(KEY_CONTENT_OVR); else localStorage.setItem(KEY_CONTENT_OVR, JSON.stringify(ovr)); },

  // Local DLCs
  getLocalDlcs(){ try{ return JSON.parse(localStorage.getItem(KEY_LOCAL_DLCS)||"[]"); }catch{ return []; } },
  setLocalDlcs(list){ localStorage.setItem(KEY_LOCAL_DLCS, JSON.stringify(list||[])); },
  upsertLocalDlc(dlc){
    const list=this.getLocalDlcs();
    const idx=list.findIndex(d=>d.id===dlc.id);
    if(idx>=0) list[idx]=dlc; else list.push(dlc);
    this.setLocalDlcs(list);
  },
  removeLocalDlc(id){
    const list=this.getLocalDlcs().filter(d=>d.id!==id);
    this.setLocalDlcs(list);
  },

  // Backup
  exportAll(){ 
    return {
      schema:"cvb.backup.v4",
      exportedAt:new Date().toISOString(),
      data:this.getData(),
      enabledDlcs:this.getEnabledDLCs(),
      users:this.getUsers(),
      settings:this.getSettings(),
      contentOverride:this.getContentOverride(),
      localDlcs:this.getLocalDlcs(),
    };
  },
  importAll(pack){
    if(!pack) throw new Error("Backup inválido.");
    // backward compat
    if(pack.schema==="cvb.backup.v2" || pack.schema==="cvb.backup.v3"){
      localStorage.setItem(KEY,JSON.stringify(pack.data));
      localStorage.setItem(KEY_DLC,JSON.stringify(pack.enabledDlcs||[]));
      localStorage.setItem(KEY_USERS,JSON.stringify(pack.users||[]));
      if(pack.contentOverride) localStorage.setItem(KEY_CONTENT_OVR, JSON.stringify(pack.contentOverride)); else localStorage.removeItem(KEY_CONTENT_OVR);
      localStorage.setItem(KEY_LOCAL_DLCS, JSON.stringify(pack.localDlcs||[]));
      return;
    }
    if(pack.schema!=="cvb.backup.v4") throw new Error("Backup inválido (schema).");
    localStorage.setItem(KEY,JSON.stringify(pack.data));
    localStorage.setItem(KEY_DLC,JSON.stringify(pack.enabledDlcs||[]));
    localStorage.setItem(KEY_USERS,JSON.stringify(pack.users||[]));
    localStorage.setItem(KEY_SETTINGS,JSON.stringify(pack.settings||defaultSettings));
    if(pack.contentOverride) localStorage.setItem(KEY_CONTENT_OVR, JSON.stringify(pack.contentOverride)); else localStorage.removeItem(KEY_CONTENT_OVR);
    localStorage.setItem(KEY_LOCAL_DLCS, JSON.stringify(pack.localDlcs||[]));
  },

  hardReset(){
    localStorage.removeItem(KEY);
    localStorage.removeItem(KEY_DLC);
    localStorage.removeItem(KEY_USERS);
    localStorage.removeItem(KEY_SETTINGS);
    localStorage.removeItem(KEY_CONTENT_OVR);
    localStorage.removeItem(KEY_LOCAL_DLCS);
    localStorage.removeItem("cvb:auth:session:v1");
    localStorage.removeItem("cvb:auth:admin:v1");
  }
};

function deepMerge(t,p){ 
  if(typeof p!=="object"||p===null) return p; 
  if(Array.isArray(p)) return p.slice(); 
  const o={...(t||{})}; 
  for(const [k,v] of Object.entries(p)){ 
    o[k]=(v&&typeof v==="object"&&!Array.isArray(v))?deepMerge(o[k],v):v; 
  } 
  return o; 
}
