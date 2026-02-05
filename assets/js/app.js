import { Router } from "./router.js";
import { Auth } from "./auth.js";
import { Storage } from "./storage.js";
import { ContentLoader } from "./contentLoader.js";
import { UI } from "./ui.js";

const CORE_VERSION="0.1.0";
const state={ user:null, content:null, routes:null, activeModule:"dashboard" };

async function bootstrap(){
  Storage.seedDefaults();
  UI.mountBaseShell(document.querySelector("#app"));

  state.content = await ContentLoader.loadAll({
    corePath:"./content/core/manifest.json",
    dlcRoot:"./content/dlc",
    enabled:Storage.getEnabledDLCs(),
    coreVersion:CORE_VERSION,
  });

  state.user = Auth.getSession();
  state.routes = new Router({ onRoute:(r)=>render(r) });
  state.routes.start();
}

function render(route){
  UI.setTopbarMeta({
    subtitle: state.user ? `${state.user.name} • ${state.user.role}` : "Mobile-first • Premium AAA UI",
    badges: [{text:`Core v${CORE_VERSION}`},{text:`Conteúdo ${state.content?.meta?.contentVersion ?? "—"}`}]
  });

  if(route.name==="login"){
    UI.renderLogin({
      onLogin: async(payload)=>{
        const res=await Auth.loginLocal(payload);
        if(!res.ok){ UI.toast("Falha no login", res.error||"Verifique os dados."); return; }
        state.user = Auth.getSession();
        UI.toast("Bem-vindo!","Sessão iniciada.");
        state.routes.go("app",{module:"dashboard"});
      },
      onGoAdmin: ()=>state.routes.go("admin"),
      demoUsers: Auth.getDemoUsers(),
    });
    return;
  }

  if(route.name==="admin"){
    UI.renderAdmin({
      coreVersion:CORE_VERSION,
      contentMeta: state.content.meta,
      enabledDlcs: Storage.getEnabledDLCs(),
      availableDlcs: state.content.dlcs,
      onAdminLogin: async(payload)=>{
        const res=await Auth.adminLoginLocal(payload);
        if(!res.ok){ UI.toast("Acesso negado", res.error||"Senha incorreta."); return; }
        UI.toast("Admin","Modo administrador ativado.");
        UI.setAdminMode(true);
      },
      onAdminLogout: ()=>{ Auth.adminLogout(); UI.setAdminMode(false); },
      onToggleDlc: (id,en)=>{ Storage.setDLCEnabled(id,en); UI.toast("DLC", en?"Ativada. Recarregue.":"Desativada. Recarregue."); },
      onResetApp: ()=>{ Storage.hardReset(); UI.toast("Reset","Dados apagados. Recarregue."); },
      onExport: ()=>{ UI.downloadJSON(Storage.exportAll(), `empresarial-backup-${new Date().toISOString().slice(0,10)}.json`); UI.toast("Exportado","Backup baixado."); },
      onImport: async(file)=>{ Storage.importAll(JSON.parse(await file.text())); UI.toast("Importado","Backup restaurado. Recarregue."); },
      onBackToApp: ()=>state.routes.go("app",{module:"dashboard"}),
    });
    return;
  }

  if(route.name==="app"){
    if(!state.user){ state.routes.go("login"); return; }
    const moduleId=route.params.module||"dashboard";
    state.activeModule=moduleId;
    const modules=state.content.modules;
    const module=modules.find(m=>m.id===moduleId)||modules[0];
    UI.renderApp({
      user:state.user,
      module,
      modules,
      data:Storage.getData(),
      tutorials:state.content.tutorials,
      onLogout: ()=>{ Auth.logout(); state.user=null; UI.toast("Sessão encerrada","Até logo!"); state.routes.go("login"); },
      onNavigate: (id)=>state.routes.go("app",{module:id}),
      onSaveData: (patch)=>{ Storage.patchData(patch); UI.toast("Salvo","Alterações registradas."); state.routes.go("app",{module:state.activeModule}); }
    });
    return;
  }

  state.routes.go(state.user ? "app":"login");
}
bootstrap();
