import { Storage } from "./storage.js";

async function fetchJSON(path){
  const res=await fetch(path,{cache:"no-store"});
  if(!res.ok) throw new Error(`Falha ao carregar: ${path}`);
  return res.json();
}
async function tryFetchJSON(path){ try{return await fetchJSON(path);}catch{return null;} }

export const ContentLoader={
  async loadAll({corePath,dlcRoot,enabled,coreVersion}){
    const coreBase=await fetchJSON(corePath);

    const override = Storage.getContentOverride();
    const core = applyOverride(coreBase, override);

    const dlcIndex=core.dlcIndex||[];
    const dlcs=[];
    for(const entry of dlcIndex){
      const p=`${dlcRoot}/${entry}/manifest.json`;
      const m=await tryFetchJSON(p);
      if(m) dlcs.push({...m,__folder:entry,__manifestPath:p});
    }

    const localDlcs = (Storage.getLocalDlcs()||[]).map(d=>({ ...d, __local:true }));
    for(const d of localDlcs) dlcs.push(d);

    const enabledSet=new Set(enabled||[]);
    const activeDlcs=dlcs.filter(d=>enabledSet.has(d.id) && isCompatible(d, coreVersion));

    const modules=[...(core.modules||[])];
    for(const d of activeDlcs) for(const m of (d.modules||[])) modules.push({...m,__dlc:d.id});
    modules.sort((a,b)=>(a.order??999)-(b.order??999));

    return { 
      meta:{coreId:core.id,coreName:core.name,coreVersion,contentVersion:core.contentVersion,activeDlcs:activeDlcs.map(d=>({id:d.id,name:d.name,version:d.version,local:!!d.__local}))}, 
      modules, 
      tutorials:core.tutorials||{}, 
      dlcs 
    };
  }
};

function applyOverride(core, override){
  if(!override) return core;
  const out = structuredClone(core);

  if(override.modules){
    const map = new Map((out.modules||[]).map(m=>[m.id,m]));
    for(const om of override.modules){
      const base = map.get(om.id);
      if(base) map.set(om.id, { ...base, ...om });
      else map.set(om.id, om);
    }
    out.modules = [...map.values()];
  }
  if(override.tutorials){
    out.tutorials = { ...(out.tutorials||{}), ...(override.tutorials||{}) };
  }
  if(override.dlcIndex){
    out.dlcIndex = override.dlcIndex;
  }
  return out;
}

function isCompatible(dlc, coreVersion){
  const c=dlc.compatibleCore||"*";
  if(c==="*") return true;
  if(/^>=/.test(c)){ const min=c.replace(">=","").trim(); return semverGte(coreVersion,min); }
  return true;
}
function semverGte(a,b){
  const pa=a.split(".").map(n=>parseInt(n,10)), pb=b.split(".").map(n=>parseInt(n,10));
  for(let i=0;i<3;i++){ const da=pa[i]||0, db=pb[i]||0; if(da>db) return true; if(da<db) return false; }
  return true;
}
