import { Auth } from "./auth.js";
import { Storage } from "./storage.js";
import { RBAC } from "./rbac.js";

const icons={
  spark:(s=20)=>svg(`<path d="M11.5 2l1.1 3.2L16 6.3l-3.4 1.1L11.5 11 10.4 7.4 7 6.3l3.4-1.1L11.5 2z"/><path opacity=".6" d="M6 12l.8 2.3L9 15.1l-2.2.8L6 18l-.8-2.1L3 15.1l2.2-.8L6 12z"/><path opacity=".55" d="M16 12l.8 2.3 2.2.8-2.2.8L16 18l-.8-2.1-2.2-.8 2.2-.8L16 12z"/>`,s),
  logout:(s=20)=>svg(`<path d="M10 7V5a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-7a2 2 0 0 1-2-2v-2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M15 12H3m0 0 3-3M3 12l3 3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`,s),
  shield:(s=20)=>svg(`<path d="M12 2l7 4v6c0 5-3 9-7 10-4-1-7-5-7-10V6l7-4z" stroke="currentColor" stroke-width="2" fill="none"/>`,s),
  dash:(s=20)=>svg(`<path d="M4 13h6V4H4v9zm10 7h6V11h-6v9zM4 20h6v-5H4v5zm10-9h6V4h-6v7z" fill="currentColor" opacity=".9"/>`,s),
  finance:(s=20)=>svg(`<path d="M12 3v18M7 8h9a3 3 0 1 1 0 6H8a3 3 0 1 0 0 6h10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`,s),
  hr:(s=20)=>svg(`<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" stroke="currentColor" stroke-width="2" fill="none"/>`,s),
  projects:(s=20)=>svg(`<path d="M8 6h13M8 12h13M8 18h13" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M3 6h.01M3 12h.01M3 18h.01" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>`,s),
  book:(s=20)=>svg(`<path d="M4 19a2 2 0 0 0 2 2h14V5a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v14z" stroke="currentColor" stroke-width="2" fill="none"/><path d="M8 7h8M8 11h8M8 15h6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>`,s),
  plug:(s=20)=>svg(`<path d="M9 2v6M15 2v6M7 8h10v3a5 5 0 0 1-5 5v6H10v-6a5 5 0 0 1-5-5V8z" stroke="currentColor" stroke-width="2" fill="none" stroke-linejoin="round"/>`,s),
  gear:(s=20)=>svg(`<path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z" stroke="currentColor" stroke-width="2" fill="none"/><path d="M19.4 15a8 8 0 0 0 .1-2l2-1.3-2-3.4-2.3.7a7.6 7.6 0 0 0-1.7-1l-.3-2.4H10l-.3 2.4a7.6 7.6 0 0 0-1.7 1L5.7 8.3 3.7 11.7l2 1.3a8 8 0 0 0 0 2l-2 1.3 2 3.4 2.3-.7a7.6 7.6 0 0 0 1.7 1l.3 2.4h4.8l.3-2.4a7.6 7.6 0 0 0 1.7-1l2.3.7 2-3.4-2-1.3z" stroke="currentColor" stroke-width="2" fill="none" opacity=".8"/>`,s),
  users:(s=20)=>svg(`<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" stroke="currentColor" stroke-width="2" fill="none"/><path d="M17 11a3 3 0 1 0-2.2-5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>`,s),
  pencil:(s=20)=>svg(`<path d="M12 20h9" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>`,s),
  plus:(s=20)=>svg(`<path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>`,s),
  trash:(s=20)=>svg(`<path d="M3 6h18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M8 6V4h8v2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M6 6l1 16h10l1-16" stroke="currentColor" stroke-width="2" stroke-linejoin="round" fill="none"/>`,s),
};

function svg(paths,size=20){return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" aria-hidden="true">${paths}</svg>`;}
function el(html){const t=document.createElement("template");t.innerHTML=html.trim();return t.content.firstElementChild;}
function esc(x){return String(x??"").replace(/[&<>"']/g,s=>({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" }[s]));}
function escAttr(x){return esc(x).replace(/\n/g," ");}

let root=null;

export const UI={
  mountBaseShell(node){
    root=node;
    root.innerHTML=`
      <div class="topbar"><div class="inner container">
        <div class="brandmark" aria-hidden="true"></div>
        <div class="brandname"><strong>Chamara Vale Businesses</strong><span id="top-subtitle">Gestão premium para PMEs</span></div>
        <div class="spacer"></div>
        <span id="top-badges" class="row" style="gap:8px"></span>
        <button id="top-logout" class="iconbtn hidden" title="Sair" aria-label="Sair">${icons.logout(20)}</button>
        <button id="top-admin" class="iconbtn" title="Admin" aria-label="Admin">${icons.shield(20)}</button>
      </div></div>
      <main class="main"><aside class="sidebar" id="sidebar"></aside><section class="content" id="content" style="flex:1;min-width:0;"></section></main>
      <nav class="bottombar"><div class="tabs" id="tabs"></div></nav>
    `;
    root.querySelector("#top-admin").addEventListener("click",()=>location.hash="#/admin");
    root.querySelector("#top-logout").addEventListener("click",()=>window.dispatchEvent(new CustomEvent("ui:logout")));
  },
  setTopbarMeta({subtitle,badges=[]}){
    root.querySelector("#top-subtitle").textContent=subtitle||"";
    root.querySelector("#top-badges").innerHTML=badges.map(b=>`<span class="badge">${icons.spark(16)} ${esc(b.text)}</span>`).join("");
  },
  toast(title,msg){
    const host=document.querySelector("#toasts");
    const n=el(`<div class="toast"><strong>${esc(title)}</strong><p>${esc(msg||"")}</p></div>`);
    host.appendChild(n); setTimeout(()=>n.remove(),3400);
  },
  downloadJSON(obj,filename){
    const blob=new Blob([JSON.stringify(obj,null,2)],{type:"application/json"});
    const url=URL.createObjectURL(blob); const a=document.createElement("a");
    a.href=url; a.download=filename||"export.json"; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
  },

  renderLogin({onLogin,onGoAdmin,usersSafe}){
    const content=root.querySelector("#content"); content.innerHTML="";
    root.querySelector("#top-logout").classList.add("hidden");
    root.querySelector("#top-admin").classList.remove("hidden");
    root.querySelector("#top-admin").onclick=onGoAdmin;

    const list = usersSafe.filter(u=>u.active!==false).slice(0,8);
    const card=el(`
      <div class="container"><div class="card pad" style="max-width:760px;margin:16px auto;">
        <div class="row" style="gap:12px;align-items:flex-start;">
          <div style="min-width:44px;height:44px" class="brandmark"></div>
          <div class="col" style="gap:6px;">
            <h2 style="margin:0;font-size:18px;">Entrar</h2>
            <p>Agora com <span class="kbd">RBAC</span> e <span class="kbd">Content Studio</span>.</p>
            <div class="row" style="flex-wrap:wrap;">
              <span class="pill">${icons.users(18)} Usuários</span>
              <span class="pill">${icons.shield(18)} Admin</span>
              <span class="pill">${icons.pencil(18)} Conteúdo</span>
            </div>
          </div>
        </div>

        <hr class="hr"/>

        <div class="grid">
          <div class="card pad" style="background:rgba(255,255,255,.04);">
            <h3>Entrar por perfil</h3>
            <p class="muted">Senha padrão demo: <span class="kbd">1234</span></p>
            <div class="col" style="gap:10px;margin-top:10px;">
              ${list.map(u=>`<button class="btn" data-user="${escAttr(u.id)}">${icons.spark(18)} ${esc(u.role)} • ${esc(u.name)}</button>`).join("")}
            </div>
          </div>

          <div class="card pad" style="background:rgba(255,255,255,.04);">
            <h3>Login por e-mail</h3>
            <p class="muted">MVP local. Depois liga Firebase/Auth.</p>
            <div class="col" style="gap:10px;margin-top:10px;">
              <input class="input" id="email" placeholder="E-mail" inputmode="email" autocomplete="username"/>
              <input class="input" id="pass" placeholder="Senha" type="password" autocomplete="current-password"/>
              <button class="btn primary" id="loginbtn">${icons.spark(18)} Entrar</button>
              <button class="btn ghost" id="adminbtn">${icons.shield(18)} Abrir Admin</button>
            </div>
            <p class="muted2" style="margin-top:10px;">Dica: no Admin você cria usuários, permissões e edita conteúdo.</p>
          </div>
        </div>
      </div></div>
    `);
    content.appendChild(card);

    content.querySelectorAll("[data-user]").forEach(b=>b.addEventListener("click",()=>onLogin({userId:b.getAttribute("data-user"), password:content.querySelector("#pass").value})));
    content.querySelector("#loginbtn").addEventListener("click",()=>onLogin({email:content.querySelector("#email").value, password:content.querySelector("#pass").value}));
    content.querySelector("#adminbtn").addEventListener("click",onGoAdmin);
  },

  renderAdmin({coreVersion,contentMeta,enabledDlcs,availableDlcs,modulesCatalog,onAdminLogin,onAdminLogout,onToggleDlc,onResetApp,onExport,onImport,onBackToApp}){
    const content=root.querySelector("#content"); content.innerHTML="";
    root.querySelector("#top-logout").classList.add("hidden");

    const enabled=new Set(enabledDlcs||[]);
    const dlcRows=(availableDlcs||[]).map(d=>{
      const on=enabled.has(d.id);
      const badge = d.__local ? `<span class="badge">${icons.spark(16)} Local</span>` : `<span class="badge">${icons.plug(16)} Arquivo</span>`;
      return `<tr>
        <td><strong>${esc(d.name)}</strong><div class="muted2" style="margin-top:2px;">${esc(d.id)}</div></td>
        <td>${esc(d.version||"—")}<div class="muted2" style="margin-top:2px;">compat: ${esc(d.compatibleCore||"*")}</div></td>
        <td>${on?`<span class="badge">${icons.spark(16)} Ativa</span>`:`<span class="badge">${icons.plug(16)} Disponível</span>`} ${badge}</td>
        <td style="text-align:right;"><button class="btn small ${on?"danger":"primary"}" data-dlc="${escAttr(d.id)}" data-on="${on?"1":"0"}">${on?"Desativar":"Ativar"}</button></td>
      </tr>`;
    }).join("");

    const users=Storage.getUsers();
    const userRows = users.map(u=>`
      <tr>
        <td><strong>${esc(u.name)}</strong><div class="muted2" style="margin-top:2px;">${esc(u.email)}</div></td>
        <td>${esc(u.role)}<div class="muted2" style="margin-top:2px;">${u.active===false?"desativado":"ativo"}</div></td>
        <td>${esc((u.perms||[]).includes("*") ? "*" : (u.perms||[]).join(", "))}</td>
        <td style="text-align:right;">
          <button class="btn small" data-edit-user="${escAttr(u.id)}">${icons.users(18)} Editar</button>
          <button class="btn small danger" data-del-user="${escAttr(u.id)}">${icons.trash(18)} Remover</button>
        </td>
      </tr>
    `).join("");

    const node=el(`<div class="container"><div class="card pad" style="margin:16px auto;max-width:1100px;">
      <div class="row" style="align-items:flex-start;">
        <div class="col" style="gap:6px;">
          <h2 style="margin:0;">Admin</h2>
          <p class="muted">Etapa 3: <span class="kbd">Content Studio</span> + <span class="kbd">DLC Builder (local)</span></p>
          <div class="row" style="flex-wrap:wrap;">
            <span class="badge">${icons.spark(16)} Core v${esc(coreVersion)}</span>
            <span class="badge">${icons.plug(16)} Conteúdo v${esc(contentMeta?.contentVersion||"—")}</span>
            <span class="badge">${icons.users(16)} Usuários: <strong style="color:rgba(234,240,255,.92)">${users.length}</strong></span>
          </div>
        </div>
        <div class="spacer"></div>
        <button class="btn" id="backbtn">Voltar</button>
      </div>

      <hr class="hr"/>

      <div class="split">
        <div class="card pad" style="background:rgba(255,255,255,.04);">
          <h3>Acesso</h3>
          <p class="muted">Senha admin padrão (MVP): <span class="kbd">admin</span></p>
          <div class="row" style="margin-top:10px;">
            <input class="input" id="adminpass" placeholder="Senha admin" type="password" style="flex:1;">
            <button class="btn primary" id="adminlogin">${icons.shield(18)} Ativar</button>
            <button class="btn" id="adminlogout">Sair</button>
          </div>
          <p class="muted2" style="margin-top:10px;">Admin mode libera editar conteúdo e criar DLC local.</p>
        </div>

        <div class="card pad" style="background:rgba(255,255,255,.04);">
          <h3>Backup</h3>
          <div class="row" style="flex-wrap:wrap;margin-top:10px;">
            <button class="btn primary" id="export">${icons.spark(18)} Exportar</button>
            <label class="btn" style="display:inline-flex;align-items:center;gap:8px;">${icons.plug(18)} Importar
              <input id="import" type="file" accept="application/json" style="display:none;">
            </label>
            <button class="btn danger" id="reset">${icons.gear(18)} Reset</button>
          </div>
          <p class="muted2" style="margin-top:10px;">Export inclui: dados + DLCs + usuários + conteúdo (override) + DLCs locais.</p>
        </div>
      </div>

      <hr class="hr"/>

      <div class="grid">
        <div class="card pad" style="background:rgba(255,255,255,.04);">
          <div class="row">
            <h3 style="margin:0;">Usuários (RBAC)</h3>
            <div class="spacer"></div>
            <button class="btn small primary" id="newUser">${icons.users(18)} Novo</button>
          </div>
          <p class="muted" style="margin-top:8px;">Setores disponíveis: <span class="kbd">${esc(modulesCatalog.join(", "))}</span></p>

          <div style="overflow:auto;margin-top:10px;">
            <table class="table" style="min-width: 920px;">
              <thead><tr><th>Usuário</th><th>Perfil</th><th>Permissões</th><th></th></tr></thead>
              <tbody>${userRows||`<tr><td colspan="4">Sem usuários.</td></tr>`}</tbody>
            </table>
          </div>
        </div>

        <div class="card pad" style="background:rgba(255,255,255,.04);">
          <div class="row">
            <h3 style="margin:0;">Content Studio</h3>
            <div class="spacer"></div>
            <button class="btn small primary" id="editContent">${icons.pencil(18)} Editar</button>
          </div>
          <p class="muted">Edite nomes, descrições e tutorial dos setores (salva em <span class="kbd">localStorage</span> como override).</p>
          <div class="row" style="flex-wrap:wrap;margin-top:10px;">
            <span class="badge">${icons.spark(16)} Sem backend</span>
            <span class="badge">${icons.spark(16)} Exportável</span>
          </div>

          <hr class="hr"/>

          <div class="row">
            <h3 style="margin:0;">DLC Builder (local)</h3>
            <div class="spacer"></div>
            <button class="btn small" id="newDlc">${icons.plus(18)} Nova DLC</button>
          </div>
          <p class="muted">Crie DLCs locais (ex.: “Setor Qualidade”, “Compliance”, “Metas”).</p>
        </div>
      </div>

      <hr class="hr"/>

      <div class="card pad" style="background:rgba(255,255,255,.04);">
        <div class="row"><h3 style="margin:0;">DLCs</h3><div class="spacer"></div><span class="muted2">recarregue para aplicar</span></div>
        <div style="overflow:auto;margin-top:10px;">
          <table class="table" style="min-width: 920px;">
            <thead><tr><th>Nome</th><th>Versão</th><th>Status</th><th></th></tr></thead>
            <tbody>${dlcRows||`<tr><td colspan="4">Nenhuma DLC.</td></tr>`}</tbody>
          </table>
        </div>
      </div>
    </div></div>`);

    content.appendChild(node);

    // Wiring
    node.querySelector("#backbtn").addEventListener("click",onBackToApp);
    node.querySelector("#adminlogin").addEventListener("click",()=>onAdminLogin({adminPassword:node.querySelector("#adminpass").value}));
    node.querySelector("#adminlogout").addEventListener("click",()=>{onAdminLogout(); UI.toast("Admin","Desativado.");});
    node.querySelector("#export").addEventListener("click",onExport);
    node.querySelector("#reset").addEventListener("click",onResetApp);
    node.querySelector("#import").addEventListener("change",(e)=>{const f=e.target.files?.[0]; if(f) onImport(f); e.target.value="";});

    node.querySelectorAll("[data-dlc]").forEach(b=>b.addEventListener("click",()=>{const id=b.getAttribute("data-dlc"); const on=b.getAttribute("data-on")==="1"; onToggleDlc(id,!on);}));    

    node.querySelector("#newUser").addEventListener("click",()=>openUserEditor({ modulesCatalog }));

    node.querySelectorAll("[data-edit-user]").forEach(b=>b.addEventListener("click",()=>{
      const id=b.getAttribute("data-edit-user");
      const u=Storage.getUsers().find(x=>x.id===id);
      if(u) openUserEditor({ user:u, modulesCatalog });
    }));

    node.querySelectorAll("[data-del-user]").forEach(b=>b.addEventListener("click",()=>{
      const id=b.getAttribute("data-del-user");
      if(!Auth.isAdminMode()){ UI.toast("Admin","Ative o modo admin para remover."); return; }
      if(id==="u1"){ UI.toast("Protegido","Usuário Admin (Demo) não pode ser removido no MVP."); return; }
      Storage.removeUser(id);
      UI.toast("Usuário","Removido. Reabrindo...");
      setTimeout(()=>location.reload(), 250);
    }));

    node.querySelector("#editContent").addEventListener("click",()=>{
      if(!Auth.isAdminMode()){ UI.toast("Admin","Ative o modo admin para editar conteúdo."); return; }
      openContentStudio({ modulesCatalog });
    });

    node.querySelector("#newDlc").addEventListener("click",()=>{
      if(!Auth.isAdminMode()){ UI.toast("Admin","Ative o modo admin para criar DLC."); return; }
      openDlcBuilder();
    });
  },

  renderApp({user,module,modules,data,tutorials,onLogout,onNavigate,onSaveData}){
    root.querySelector("#top-logout").classList.remove("hidden");
    window.addEventListener("ui:logout", ()=>onLogout?.(), {once:true});

    const visibleModules = RBAC.filterModulesForUser(user, modules);
    renderNav(visibleModules, module.id, onNavigate);

    const content=root.querySelector("#content");
    content.innerHTML="";
    content.appendChild(renderModule(user,module,data,tutorials,onSaveData));
  }
};

function openUserEditor({ user=null, modulesCatalog=[] }){
  if(!Auth.isAdminMode()){ UI.toast("Admin","Ative o modo admin para editar/criar usuários."); return; }
  const isNew = !user;
  const u = user ? structuredClone(user) : { id: "u_"+cryptoId(), name:"", email:"", role:"", password:"", perms:["dashboard"], active:true };

  const overlay = el(`<div style="position:fixed;inset:0;z-index:200;background:rgba(0,0,0,.55);backdrop-filter:blur(8px);display:grid;place-items:center;padding:16px;">
    <div class="card pad" style="width:min(860px, 100%);">
      <div class="row">
        <h3 style="margin:0;">${icons.users(18)} ${isNew?"Novo usuário":"Editar usuário"}</h3>
        <div class="spacer"></div>
        <button class="btn small" id="close">Fechar</button>
      </div>

      <hr class="hr"/>

      <div class="split">
        <div class="card pad" style="background:rgba(255,255,255,.04);">
          <h3>Dados</h3>
          <div class="col" style="gap:10px;margin-top:10px;">
            <input class="input" id="name" placeholder="Nome" value="${escAttr(u.name)}">
            <input class="input" id="email" placeholder="E-mail" value="${escAttr(u.email)}">
            <input class="input" id="role" placeholder="Cargo/Perfil (ex.: Financeiro)" value="${escAttr(u.role)}">
            <input class="input" id="pass" placeholder="Senha" type="password" value="${escAttr(u.password)}">
            <label class="row" style="gap:10px;align-items:center;">
              <input type="checkbox" id="active" ${u.active===false?"":"checked"} style="width:18px;height:18px;">
              <span class="muted">Ativo</span>
            </label>
          </div>
        </div>

        <div class="card pad" style="background:rgba(255,255,255,.04);">
          <h3>Permissões (RBAC)</h3>
          <p class="muted">Marque os setores que este usuário pode acessar.</p>

          <div class="row" style="flex-wrap:wrap;margin-top:10px;">
            <button class="btn small" id="grantAll">${icons.spark(18)} Grant *</button>
            <button class="btn small" id="clearAll">Limpar</button>
          </div>

          <div class="col" style="gap:10px;margin-top:10px;max-height:320px;overflow:auto;padding-right:6px;">
            ${modulesCatalog.map(m=>`
              <label class="row" style="gap:10px;padding:10px 12px;border:1px solid rgba(255,255,255,.10);border-radius:16px;background:rgba(255,255,255,.04);">
                <input type="checkbox" data-perm="${escAttr(m)}" style="width:18px;height:18px;" ${u.perms?.includes("*") || u.perms?.includes(m) ? "checked":""}>
                <span class="muted" style="font-size:13px;">${esc(m)}</span>
              </label>
            `).join("")}
          </div>
        </div>
      </div>

      <hr class="hr"/>
      <div class="row">
        <button class="btn primary" id="save">${icons.spark(18)} Salvar</button>
        <div class="spacer"></div>
        ${!isNew?`<span class="muted2">id: ${esc(u.id)}</span>`:""}
      </div>
    </div>
  </div>`);
  document.body.appendChild(overlay);

  overlay.querySelector("#close").addEventListener("click",()=>overlay.remove());
  overlay.querySelector("#grantAll").addEventListener("click",()=>overlay.querySelectorAll("[data-perm]").forEach(cb=>cb.checked=true));
  overlay.querySelector("#clearAll").addEventListener("click",()=>overlay.querySelectorAll("[data-perm]").forEach(cb=>cb.checked=false));

  overlay.querySelector("#save").addEventListener("click",()=>{
    const name=overlay.querySelector("#name").value.trim();
    const email=overlay.querySelector("#email").value.trim();
    const role=overlay.querySelector("#role").value.trim();
    const password=overlay.querySelector("#pass").value;
    const active=overlay.querySelector("#active").checked;

    if(!name || !email || !role){ UI.toast("Atenção","Preencha nome, e-mail e perfil."); return; }
    if(!password){ UI.toast("Atenção","Defina uma senha (MVP)."); return; }

    const perms=[];
    overlay.querySelectorAll("[data-perm]").forEach(cb=>{ if(cb.checked) perms.push(cb.getAttribute("data-perm")); });
    const updated={...u, name, email, role, password, active, perms: perms.length?perms:["dashboard"]};

    Storage.upsertUser(updated);
    UI.toast("Usuário","Salvo. Recarregando...");
    setTimeout(()=>location.reload(), 250);
  });
}

function openContentStudio({ modulesCatalog }){
  const override = Storage.getContentOverride() || { modules:[], tutorials:{} };
  const coreModules = modulesCatalog.map(id=>({id}));

  // Build editable list: merge any override module fields
  const map = new Map((override.modules||[]).map(m=>[m.id,m]));
  const list = modulesCatalog.map(id=>({ id, ...(map.get(id)||{}) }));

  const overlay = el(`<div style="position:fixed;inset:0;z-index:210;background:rgba(0,0,0,.55);backdrop-filter:blur(8px);display:grid;place-items:center;padding:16px;">
    <div class="card pad" style="width:min(1100px, 100%);">
      <div class="row">
        <h3 style="margin:0;">${icons.pencil(18)} Content Studio</h3>
        <div class="spacer"></div>
        <button class="btn small" id="close">Fechar</button>
      </div>
      <p class="muted">Edite títulos, descrições, tags e tutorial por setor. (salva como override local)</p>

      <hr class="hr"/>

      <div class="split">
        <div class="card pad" style="background:rgba(255,255,255,.04);">
          <div class="row">
            <h3 style="margin:0;">Setores</h3>
            <div class="spacer"></div>
            <button class="btn small" id="add">${icons.plus(18)} Novo setor</button>
          </div>
          <div style="overflow:auto;margin-top:10px;">
            <table class="table" style="min-width:520px;">
              <thead><tr><th>ID</th><th>Label</th><th></th></tr></thead>
              <tbody id="rows"></tbody>
            </table>
          </div>
          <p class="muted2" style="margin-top:10px;">Clique em “Editar” para configurar.</p>
        </div>

        <div class="card pad" style="background:rgba(255,255,255,.04);">
          <h3>Ajuda</h3>
          <p class="muted">Quando salvar, recarregue a página para aplicar em todo o app.</p>
          <div class="row" style="flex-wrap:wrap;margin-top:10px;">
            <span class="badge">${icons.spark(16)} override</span>
            <span class="badge">${icons.spark(16)} exportável</span>
          </div>

          <hr class="hr"/>
          <div class="row" style="flex-wrap:wrap;">
            <button class="btn primary" id="saveAll">${icons.spark(18)} Salvar override</button>
            <button class="btn" id="clear">${icons.trash(18)} Limpar override</button>
          </div>
        </div>
      </div>
    </div>
  </div>`);
  document.body.appendChild(overlay);

  const tbody = overlay.querySelector("#rows");
  function renderRows(){
    tbody.innerHTML = list.map(m=>`<tr>
      <td><strong>${esc(m.id)}</strong></td>
      <td>${esc(m.label||"—")}</td>
      <td style="text-align:right;">
        <button class="btn small" data-edit="${escAttr(m.id)}">${icons.pencil(18)} Editar</button>
      </td>
    </tr>`).join("");
    tbody.querySelectorAll("[data-edit]").forEach(b=>b.addEventListener("click",()=>openModuleEditor(b.getAttribute("data-edit"))));
  }
  renderRows();

  function openModuleEditor(id){
    const idx=list.findIndex(x=>x.id===id);
    const m = list[idx] || {id};

    const t = (override.tutorials||{})[id] || { summary:"", steps:["","",""] };

    const modal = el(`<div style="position:fixed;inset:0;z-index:220;background:rgba(0,0,0,.55);backdrop-filter:blur(8px);display:grid;place-items:center;padding:16px;">
      <div class="card pad" style="width:min(980px, 100%);">
        <div class="row">
          <h3 style="margin:0;">${icons.pencil(18)} Editar setor • <span class="kbd">${esc(id)}</span></h3>
          <div class="spacer"></div>
          <button class="btn small" id="close">Fechar</button>
        </div>

        <hr class="hr"/>

        <div class="split">
          <div class="card pad" style="background:rgba(255,255,255,.04);">
            <h3>Meta</h3>
            <div class="col" style="gap:10px;margin-top:10px;">
              <input class="input" id="label" placeholder="Label (nome)" value="${escAttr(m.label||"")}">
              <input class="input" id="hint" placeholder="Hint (resumo curto)" value="${escAttr(m.hint||"")}">
              <input class="input" id="order" placeholder="Order (número)" inputmode="numeric" value="${escAttr(String(m.order??""))}">
              <textarea class="input" id="desc" placeholder="Descrição">${esc(m.description||"")}</textarea>
              <input class="input" id="tags" placeholder="Tags (separadas por vírgula)" value="${escAttr((m.tags||[]).join(", "))}">
            </div>
          </div>

          <div class="card pad" style="background:rgba(255,255,255,.04);">
            <h3>Tutorial</h3>
            <div class="col" style="gap:10px;margin-top:10px;">
              <textarea class="input" id="tsum" placeholder="Resumo do tutorial">${esc(t.summary||"")}</textarea>
              <input class="input" id="s1" placeholder="Passo 1" value="${escAttr(t.steps?.[0]||"")}">
              <input class="input" id="s2" placeholder="Passo 2" value="${escAttr(t.steps?.[1]||"")}">
              <input class="input" id="s3" placeholder="Passo 3" value="${escAttr(t.steps?.[2]||"")}">
            </div>
          </div>
        </div>

        <hr class="hr"/>
        <div class="row">
          <button class="btn primary" id="save">${icons.spark(18)} Salvar setor</button>
          <button class="btn danger" id="remove">${icons.trash(18)} Remover override deste setor</button>
          <div class="spacer"></div>
          <span class="muted2">Obs: remover override não apaga o setor do core.</span>
        </div>
      </div>
    </div>`);
    document.body.appendChild(modal);

    modal.querySelector("#close").addEventListener("click",()=>modal.remove());
    modal.querySelector("#save").addEventListener("click",()=>{
      const label=modal.querySelector("#label").value.trim();
      const hint=modal.querySelector("#hint").value.trim();
      const order=Number(modal.querySelector("#order").value||"");
      const description=modal.querySelector("#desc").value.trim();
      const tags=modal.querySelector("#tags").value.split(",").map(x=>x.trim()).filter(Boolean);

      list[idx] = { id, label, hint, description, tags, order: Number.isFinite(order)?order:undefined };

      override.modules = list.filter(x=>x.label || x.hint || x.description || (x.tags||[]).length || Number.isFinite(x.order));
      override.tutorials = override.tutorials || {};
      override.tutorials[id] = {
        summary: modal.querySelector("#tsum").value.trim(),
        steps: [modal.querySelector("#s1").value.trim(), modal.querySelector("#s2").value.trim(), modal.querySelector("#s3").value.trim()].filter(Boolean)
      };

      UI.toast("Content Studio","Setor salvo (override).");
      renderRows();
      modal.remove();
    });

    modal.querySelector("#remove").addEventListener("click",()=>{
      override.modules = (override.modules||[]).filter(x=>x.id!==id);
      if(override.tutorials) delete override.tutorials[id];
      const current = list[idx];
      list[idx] = { id }; // clear local fields
      UI.toast("Content Studio","Override removido deste setor.");
      renderRows();
      modal.remove();
    });
  }

  overlay.querySelector("#add").addEventListener("click",()=>{
    const id = prompt("ID do novo setor (ex.: compliance):");
    if(!id) return;
    const clean = id.trim().toLowerCase().replace(/[^a-z0-9_-]/g,"");
    if(!clean){ UI.toast("Atenção","ID inválido."); return; }
    if(list.some(x=>x.id===clean)){ UI.toast("Atenção","ID já existe."); return; }
    list.push({id:clean,label:"Novo setor",hint:"em breve",description:"Setor criado via Content Studio.",tags:["novo"],order:999});
    renderRows();
    UI.toast("Content Studio","Setor criado (override). Edite os detalhes.");
  });

  overlay.querySelector("#saveAll").addEventListener("click",()=>{
    Storage.setContentOverride(override);
    UI.toast("Content Studio","Override salvo. Recarregue a página para aplicar.");
  });
  overlay.querySelector("#clear").addEventListener("click",()=>{
    Storage.setContentOverride(null);
    UI.toast("Content Studio","Override limpo. Recarregue a página.");
  });
  overlay.querySelector("#close").addEventListener("click",()=>overlay.remove());
}

function openDlcBuilder(){
  const overlay = el(`<div style="position:fixed;inset:0;z-index:215;background:rgba(0,0,0,.55);backdrop-filter:blur(8px);display:grid;place-items:center;padding:16px;">
    <div class="card pad" style="width:min(980px, 100%);">
      <div class="row">
        <h3 style="margin:0;">${icons.plug(18)} DLC Builder (local)</h3>
        <div class="spacer"></div>
        <button class="btn small" id="close">Fechar</button>
      </div>
      <p class="muted">Crie uma DLC local com novos módulos (placeholder). Depois você implementa o módulo no core.</p>

      <hr class="hr"/>

      <div class="split">
        <div class="card pad" style="background:rgba(255,255,255,.04);">
          <h3>Dados da DLC</h3>
          <div class="col" style="gap:10px;margin-top:10px;">
            <input class="input" id="id" placeholder="ID (ex.: dlc.qualidade)" value="dlc.${cryptoId().slice(0,8)}">
            <input class="input" id="name" placeholder="Nome (ex.: Qualidade Pack)" value="DLC Local">
            <input class="input" id="version" placeholder="Versão" value="1.0.0">
            <input class="input" id="compat" placeholder="Compat (ex.: >=0.1.0)" value=">=0.1.0">
          </div>
        </div>

        <div class="card pad" style="background:rgba(255,255,255,.04);">
          <h3>Módulo dentro da DLC</h3>
          <div class="col" style="gap:10px;margin-top:10px;">
            <input class="input" id="mid" placeholder="module id (ex.: quality)" value="module_${cryptoId().slice(0,6)}">
            <input class="input" id="mlabel" placeholder="Label" value="Novo Setor (DLC)">
            <input class="input" id="mhint" placeholder="Hint" value="em breve">
            <textarea class="input" id="mdesc" placeholder="Descrição">Módulo placeholder criado via DLC local.</textarea>
            <input class="input" id="mtags" placeholder="Tags (vírgula)" value="DLC, setor">
            <input class="input" id="morder" placeholder="Order (número)" inputmode="numeric" value="900">
          </div>
        </div>
      </div>

      <hr class="hr"/>
      <div class="row" style="flex-wrap:wrap;">
        <button class="btn primary" id="save">${icons.spark(18)} Salvar DLC local</button>
        <button class="btn" id="export">${icons.spark(18)} Exportar manifest</button>
        <div class="spacer"></div>
        <span class="muted2">Após salvar: ative a DLC na lista e recarregue.</span>
      </div>
    </div>
  </div>`);
  document.body.appendChild(overlay);

  overlay.querySelector("#close").addEventListener("click",()=>overlay.remove());

  function build(){
    const id = overlay.querySelector("#id").value.trim();
    const name = overlay.querySelector("#name").value.trim();
    const version = overlay.querySelector("#version").value.trim() || "1.0.0";
    const compatibleCore = overlay.querySelector("#compat").value.trim() || "*";
    const mid = overlay.querySelector("#mid").value.trim();
    const label = overlay.querySelector("#mlabel").value.trim();
    const hint = overlay.querySelector("#mhint").value.trim();
    const description = overlay.querySelector("#mdesc").value.trim();
    const tags = overlay.querySelector("#mtags").value.split(",").map(x=>x.trim()).filter(Boolean);
    const order = Number(overlay.querySelector("#morder").value||"");
    if(!id || !name || !mid || !label) return { ok:false, error:"Preencha ID, Nome, module id e label." };

    const dlc = { id, name, version, compatibleCore, modules:[{ id: mid, label, hint, description, tags, order: Number.isFinite(order)?order:999 }] };
    return { ok:true, dlc };
  }

  overlay.querySelector("#save").addEventListener("click",()=>{
    const r=build();
    if(!r.ok){ UI.toast("Atenção", r.error); return; }
    Storage.upsertLocalDlc(r.dlc);
    UI.toast("DLC Builder","DLC local salva. Ative na lista e recarregue.");
  });

  overlay.querySelector("#export").addEventListener("click",()=>{
    const r=build();
    if(!r.ok){ UI.toast("Atenção", r.error); return; }
    UI.downloadJSON(r.dlc, `${r.dlc.id}.manifest.json`);
    UI.toast("Exportado","Manifest baixado.");
  });
}

function renderNav(modules, activeId, onNavigate){
  const sidebar=root.querySelector("#sidebar"), tabs=root.querySelector("#tabs");
  sidebar.innerHTML=`<div class="sidehint">${icons.spark(18)} Setores liberados</div>` + modules.map(m=>`
    <div class="sideitem ${m.id===activeId?"active":""}" data-nav="${escAttr(m.id)}">
      <span style="width:22px;display:inline-flex;justify-content:center">${iconFor(m.id)}</span>
      <div style="display:flex;flex-direction:column;line-height:1.1;">
        <strong style="font-size:13px;color:${m.id===activeId?"rgba(234,240,255,.95)":"rgba(234,240,255,.82)"}">${esc(m.label)}</strong>
        <span class="muted2" style="font-size:11px">${esc(m.hint||"")}</span>
      </div>
      <div class="spacer"></div>
      ${m.__dlc?`<span class="badge">${icons.plug(16)} DLC</span>`:""}
    </div>`).join("");
  sidebar.querySelectorAll("[data-nav]").forEach(b=>b.addEventListener("click",()=>onNavigate(b.getAttribute("data-nav"))));

  tabs.innerHTML=modules.slice(0,5).map(m=>`<button class="tab ${m.id===activeId?"active":""}" data-tab="${escAttr(m.id)}">${iconFor(m.id)} <span>${esc((m.label||"").split(" ")[0])}</span></button>`).join("");
  tabs.querySelectorAll("[data-tab]").forEach(b=>b.addEventListener("click",()=>onNavigate(b.getAttribute("data-tab"))));
}

function iconFor(id){
  if(id==="dashboard") return icons.dash(18);
  if(id==="finance") return icons.finance(18);
  if(id==="hr") return icons.hr(18);
  if(id==="projects") return icons.projects(18);
  return icons.spark(18);
}

// Views (same as v0.2, trimmed)
function renderModule(user,module,data,tutorials,onSaveData){
  const wrap=el(`<div class="col" style="gap:12px;min-width:0;"></div>`);
  wrap.appendChild(el(`<div class="card pad"><div class="row" style="align-items:flex-start;">
    <div class="col" style="gap:6px;">
      <h2 style="margin:0;font-size:18px;">${esc(module.label)}</h2>
      <p class="muted">${esc(module.description||"")}</p>
      <div class="row" style="flex-wrap:wrap;">${(module.tags||[]).map(t=>`<span class="badge">${icons.spark(16)} ${esc(t)}</span>`).join("")}</div>
    </div>
    <div class="spacer"></div><span class="badge">${icons.spark(16)} ${esc(user.role)}</span>
  </div></div>`));

  const t=tutorials?.[module.id];
  if(t) wrap.appendChild(el(`<div class="card pad" style="background:rgba(255,255,255,.04);">
    <div class="row"><h3 style="margin:0;">${icons.book(18)} Tutorial rápido</h3><div class="spacer"></div><span class="muted2">iniciante/avançado</span></div>
    <p style="margin-top:10px;">${esc(t.summary||"")}</p>
    <div class="row" style="flex-wrap:wrap;margin-top:10px;">${(t.steps||[]).slice(0,3).map((s,i)=>`<span class="pill">${esc((i+1)+". "+s)}</span>`).join("")}</div>
  </div>`));

  if(module.id==="dashboard") wrap.appendChild(dashboardView(data));
  else if(module.id==="finance") wrap.appendChild(financeView(data,onSaveData));
  else if(module.id==="hr") wrap.appendChild(hrView(data,onSaveData));
  else if(module.id==="projects") wrap.appendChild(projectsView(data,onSaveData));
  else wrap.appendChild(el(`<div class="card pad"><p class="muted">Setor pronto na arquitetura. Implementação completa nas próximas etapas.</p></div>`));
  return wrap;
}

function dashboardView(data){
  const fin=data.finance;
  const openR=sumOpen(fin.receivables), openP=sumOpen(fin.payables), cash=+fin.cash?.balance||0;
  return el(`<div class="grid">
    <div class="card pad">
      <h3>Visão do mês</h3>
      <div class="row" style="flex-wrap:wrap;margin-top:10px;">
        <span class="badge">${icons.finance(16)} Caixa: <strong style="color:rgba(234,240,255,.92)">R$ ${fmt(cash)}</strong></span>
        <span class="badge">${icons.spark(16)} A receber: <strong style="color:rgba(234,240,255,.92)">R$ ${fmt(openR)}</strong></span>
        <span class="badge">${icons.spark(16)} A pagar: <strong style="color:rgba(234,240,255,.92)">R$ ${fmt(openP)}</strong></span>
      </div>
      <hr class="hr"/>
      <div class="row"><div><strong style="font-size:18px">R$ ${fmt(cash+openR-openP)}</strong><div class="muted2">Projeção simples</div></div>
      <div class="spacer"></div><span class="pill">${icons.book(18)} Dica: cadastre tudo</span></div>
    </div>
    <div class="card pad">
      <h3>Checklist — Próximos passos</h3>
      <p class="muted">Para sair da informalidade com consistência.</p>
      <div class="col" style="margin-top:10px;">
        ${["Cadastrar colaboradores (RH)","Lançar contas a pagar/receber","Planejar contratações e investimentos","Criar projetos com prazos"].map(x=>`
          <label class="row" style="gap:10px;padding:10px 12px;border:1px solid rgba(255,255,255,.10);border-radius:16px;background:rgba(255,255,255,.04);">
            <input type="checkbox" style="width:18px;height:18px;"><span class="muted" style="font-size:13px;">${esc(x)}</span>
          </label>`).join("")}
      </div>
    </div>
  </div>`);
}

function financeView(data,onSaveData){
  const fin=data.finance;
  const node=el(`<div class="card pad"><div class="split">
    <div class="card pad" style="background:rgba(255,255,255,.04);">
      <h3>Caixa & Orçamento</h3><p class="muted">MVP — evolui para DRE/centros de custo.</p>
      <div class="col" style="margin-top:10px;">
        <label class="muted2">Saldo em caixa</label>
        <input class="input" id="cash" inputmode="decimal" value="${escAttr(String(fin.cash?.balance??0))}">
        <div class="row" style="gap:10px;margin-top:8px;">
          <button class="btn primary" id="saveCash">${icons.spark(18)} Salvar</button>
          <span class="muted2">Atualiza o Dashboard.</span>
        </div>
      </div>
      <hr class="hr"/>
      <h3>Orçamento mensal</h3>
      <div class="col" style="margin-top:10px;">
        ${Object.entries(fin.budget||{}).map(([k,v])=>`<div class="row">
          <span class="pill" style="min-width:140px;justify-content:center;">${esc(k)}</span>
          <input class="input" style="flex:1" data-budget="${escAttr(k)}" value="${escAttr(String(v))}" inputmode="decimal">
        </div>`).join("")}
        <button class="btn" id="saveBudget">${icons.spark(18)} Salvar orçamento</button>
      </div>
    </div>
    <div class="card pad" style="background:rgba(255,255,255,.04);">
      <h3>Contas a pagar/receber</h3><p class="muted">Cadastre tudo (mesmo pequeno).</p>
      <div class="row" style="margin-top:10px;flex-wrap:wrap;">
        <span class="badge">${icons.spark(16)} A receber: <strong>R$ ${fmt(sumOpen(fin.receivables))}</strong></span>
        <span class="badge">${icons.spark(16)} A pagar: <strong>R$ ${fmt(sumOpen(fin.payables))}</strong></span>
      </div>
      <hr class="hr"/>
      <div class="col" style="gap:10px;">
        <div class="row" style="gap:10px;flex-wrap:wrap;">
          <input class="input" id="desc" placeholder="Descrição" style="flex:1">
          <input class="input" id="amount" placeholder="Valor" inputmode="decimal" style="width:140px">
          <input class="input" id="due" type="date" style="width:160px">
        </div>
        <div class="row" style="gap:10px;flex-wrap:wrap;">
          <button class="btn primary" id="addR">${icons.spark(18)} + Receber</button>
          <button class="btn" id="addP">${icons.spark(18)} + Pagar</button>
          <span class="muted2">MVP: status open.</span>
        </div>
      </div>
      <hr class="hr"/>
      <h3>Lançamentos (abertos)</h3>
      <div style="overflow:auto;">
        <table class="table" style="min-width:620px;">
          <thead><tr><th>Tipo</th><th>Descrição</th><th>Venc.</th><th>Valor</th></tr></thead>
          <tbody id="rows"></tbody>
        </table>
      </div>
    </div>
  </div></div>`);
  const rows=[];
  for(const r of (fin.receivables||[]).filter(x=>x.status==="open")) rows.push({type:"Receber",...r});
  for(const p of (fin.payables||[]).filter(x=>x.status==="open")) rows.push({type:"Pagar",...p});
  rows.sort((a,b)=>String(a.due||"").localeCompare(String(b.due||"")));
  node.querySelector("#rows").innerHTML=rows.map(x=>`<tr><td><strong>${esc(x.type)}</strong></td><td>${esc(x.desc)}</td><td>${esc(x.due||"—")}</td><td>R$ ${fmt(+x.amount||0)}</td></tr>`).join("")||`<tr><td colspan="4">Sem lançamentos.</td></tr>`;

  node.querySelector("#saveCash").addEventListener("click",()=>onSaveData({finance:{cash:{balance:money(node.querySelector("#cash").value)}}}));
  node.querySelector("#saveBudget").addEventListener("click",()=>{
    const b={}; node.querySelectorAll("[data-budget]").forEach(i=>b[i.getAttribute("data-budget")]=money(i.value));
    onSaveData({finance:{budget:b}});
  });
  const add=(k)=>{
    const desc=node.querySelector("#desc").value.trim();
    const amount=money(node.querySelector("#amount").value);
    const due=node.querySelector("#due").value;
    if(!desc||!amount){ UI.toast("Atenção","Preencha descrição e valor."); return; }
    const item={id:cryptoId(),desc,amount,due,status:"open"};
    if(k==="r") onSaveData({finance:{receivables:[...(fin.receivables||[]),item]}});
    else onSaveData({finance:{payables:[...(fin.payables||[]),item]}});
  };
  node.querySelector("#addR").addEventListener("click",()=>add("r"));
  node.querySelector("#addP").addEventListener("click",()=>add("p"));
  return node;
}

function hrView(data,onSaveData){
  const hr=data.hr;
  const node=el(`<div class="card pad"><div class="split">
    <div class="card pad" style="background:rgba(255,255,255,.04);">
      <h3>Colaboradores</h3><p class="muted">Cadastro mínimo.</p>
      <div class="col" style="gap:10px;margin-top:10px;">
        <div class="row" style="gap:10px;flex-wrap:wrap;">
          <input class="input" id="name" placeholder="Nome" style="flex:1">
          <input class="input" id="role" placeholder="Cargo" style="flex:1">
        </div>
        <div class="row" style="gap:10px;flex-wrap:wrap;">
          <select class="input" id="type" style="width:160px;"><option>CLT</option><option>PJ</option><option>Estágio</option><option>Freela</option></select>
          <input class="input" id="salary" placeholder="Salário (R$)" inputmode="decimal" style="width:180px">
          <input class="input" id="start" type="date" style="width:180px">
        </div>
        <button class="btn primary" id="add">${icons.spark(18)} Adicionar</button>
      </div>
      <hr class="hr"/>
      <div style="overflow:auto;">
        <table class="table" style="min-width:620px;"><thead><tr><th>Nome</th><th>Cargo</th><th>Vínculo</th><th>R$</th><th>Início</th></tr></thead><tbody id="rows"></tbody></table>
      </div>
    </div>
    <div class="card pad" style="background:rgba(255,255,255,.04);">
      <h3>Plano de contratação</h3><p class="muted">Planeje sem “susto”.</p>
      <div class="col" style="gap:10px;margin-top:10px;">
        <div class="row" style="gap:10px;flex-wrap:wrap;">
          <input class="input" id="hrole" placeholder="Cargo" style="flex:1">
          <input class="input" id="when" placeholder="Mês (YYYY-MM)" value="${escAttr(new Date().toISOString().slice(0,7))}" style="width:160px">
        </div>
        <div class="row" style="gap:10px;flex-wrap:wrap;">
          <input class="input" id="budget" placeholder="Orçamento (R$)" inputmode="decimal" style="width:180px">
          <input class="input" id="reason" placeholder="Motivo" style="flex:1">
        </div>
        <button class="btn" id="addH">${icons.spark(18)} Adicionar plano</button>
      </div>
      <hr class="hr"/>
      <div style="overflow:auto;">
        <table class="table" style="min-width:620px;"><thead><tr><th>Cargo</th><th>Mês</th><th>Orçamento</th><th>Motivo</th></tr></thead><tbody id="hrows"></tbody></table>
      </div>
    </div>
  </div></div>`);
  node.querySelector("#rows").innerHTML=(hr.employees||[]).map(e=>`<tr><td><strong>${esc(e.name)}</strong></td><td>${esc(e.role)}</td><td>${esc(e.type)}</td><td>R$ ${fmt(+e.salary||0)}</td><td>${esc(e.start||"—")}</td></tr>`).join("")||`<tr><td colspan="5">Sem colaboradores.</td></tr>`;
  node.querySelector("#hrows").innerHTML=(hr.hiringPlan||[]).map(h=>`<tr><td><strong>${esc(h.role)}</strong></td><td>${esc(h.when)}</td><td>R$ ${fmt(+h.budget||0)}</td><td>${esc(h.reason||"")}</td></tr>`).join("")||`<tr><td colspan="4">Sem plano.</td></tr>`;
  node.querySelector("#add").addEventListener("click",()=>{
    const name=node.querySelector("#name").value.trim(), role=node.querySelector("#role").value.trim();
    if(!name||!role){ UI.toast("Atenção","Informe nome e cargo."); return; }
    const item={id:cryptoId(),name,role,type:node.querySelector("#type").value,salary:money(node.querySelector("#salary").value),start:node.querySelector("#start").value};
    onSaveData({hr:{employees:[...(hr.employees||[]),item]}});
  });
  node.querySelector("#addH").addEventListener("click",()=>{
    const role=node.querySelector("#hrole").value.trim(), when=node.querySelector("#when").value.trim();
    if(!role||!when){ UI.toast("Atenção","Informe cargo e mês."); return; }
    const item={id:cryptoId(),role,when,budget:money(node.querySelector("#budget").value),reason:node.querySelector("#reason").value.trim()};
    onSaveData({hr:{hiringPlan:[...(hr.hiringPlan||[]),item]}});
  });
  return node;
}

function projectsView(data,onSaveData){
  const pr=data.projects;
  const node=el(`<div class="card pad"><div class="split">
    <div class="card pad" style="background:rgba(255,255,255,.04);">
      <h3>Projetos</h3><p class="muted">Prazos e responsáveis.</p>
      <div class="col" style="gap:10px;margin-top:10px;">
        <div class="row" style="gap:10px;flex-wrap:wrap;">
          <input class="input" id="name" placeholder="Nome do projeto" style="flex:1">
          <select class="input" id="status" style="width:180px;"><option>planejado</option><option>em andamento</option><option>em risco</option><option>concluído</option></select>
        </div>
        <div class="row" style="gap:10px;flex-wrap:wrap;">
          <input class="input" id="owner" placeholder="Responsável" style="flex:1">
          <input class="input" id="due" type="date" style="width:180px">
        </div>
        <button class="btn primary" id="add">${icons.spark(18)} Adicionar</button>
      </div>
      <hr class="hr"/>
      <div style="overflow:auto;">
        <table class="table" style="min-width:620px;"><thead><tr><th>Projeto</th><th>Status</th><th>Prazo</th><th>Responsável</th></tr></thead><tbody id="rows"></tbody></table>
      </div>
    </div>
    <div class="card pad" style="background:rgba(255,255,255,.04);">
      <h3>Rotinas operacionais</h3><p class="muted">Checklist de operação.</p>
      <div style="overflow:auto;margin-top:10px;">
        <table class="table" style="min-width:620px;"><thead><tr><th>Rotina</th><th>Cadência</th><th>Dono</th><th>Checklist</th></tr></thead><tbody id="oprows"></tbody></table>
      </div>
      <hr class="hr"/><p class="muted2">Próxima etapa: Kanban, metas e alertas.</p>
    </div>
  </div></div>`);
  node.querySelector("#rows").innerHTML=(pr.list||[]).map(p=>`<tr><td><strong>${esc(p.name)}</strong></td><td>${esc(p.status)}</td><td>${esc(p.due||"—")}</td><td>${esc(p.owner||"—")}</td></tr>`).join("")||`<tr><td colspan="4">Sem projetos.</td></tr>`;
  const op=data.ops?.routines||[];
  node.querySelector("#oprows").innerHTML=op.map(r=>`<tr><td><strong>${esc(r.title)}</strong></td><td>${esc(r.cadence)}</td><td>${esc(r.owner)}</td><td>${esc((r.checklist||[]).slice(0,3).join(" • "))}${(r.checklist||[]).length>3?"…":""}</td></tr>`).join("")||`<tr><td colspan="4">Sem rotinas.</td></tr>`;
  node.querySelector("#add").addEventListener("click",()=>{
    const name=node.querySelector("#name").value.trim(); if(!name){ UI.toast("Atenção","Informe o nome do projeto."); return; }
    const item={id:cryptoId(),name,status:node.querySelector("#status").value,owner:node.querySelector("#owner").value.trim(),due:node.querySelector("#due").value};
    onSaveData({projects:{list:[...(pr.list||[]),item]}});
  });
  return node;
}

function fmt(n){return Number(n||0).toLocaleString("pt-BR",{minimumFractionDigits:0,maximumFractionDigits:0});}
function sumOpen(a){return (a||[]).filter(x=>x.status==="open").reduce((s,i)=>s+(+i.amount||0),0);}
function money(s){const v=String(s||"").replace(/[^0-9,.-]/g,"").replace(",","."); const n=Number(v); return Number.isFinite(n)?n:0;}
function cryptoId(){ try{return crypto.randomUUID();}catch{ return "id_"+Math.random().toString(16).slice(2); } }
