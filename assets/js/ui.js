import { Auth } from "./auth.js";
const icons={spark:(s=20)=>svg(`<path d="M11.5 2l1.1 3.2L16 6.3l-3.4 1.1L11.5 11 10.4 7.4 7 6.3l3.4-1.1L11.5 2z"/><path opacity=".6" d="M6 12l.8 2.3L9 15.1l-2.2.8L6 18l-.8-2.1L3 15.1l2.2-.8L6 12z"/><path opacity=".55" d="M16 12l.8 2.3 2.2.8-2.2.8L16 18l-.8-2.1-2.2-.8 2.2-.8L16 12z"/>`,s),
logout:(s=20)=>svg(`<path d="M10 7V5a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-7a2 2 0 0 1-2-2v-2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M15 12H3m0 0 3-3M3 12l3 3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`,s),
shield:(s=20)=>svg(`<path d="M12 2l7 4v6c0 5-3 9-7 10-4-1-7-5-7-10V6l7-4z" stroke="currentColor" stroke-width="2" fill="none"/>`,s),
dash:(s=20)=>svg(`<path d="M4 13h6V4H4v9zm10 7h6V11h-6v9zM4 20h6v-5H4v5zm10-9h6V4h-6v7z" fill="currentColor" opacity=".9"/>`,s),
finance:(s=20)=>svg(`<path d="M12 3v18M7 8h9a3 3 0 1 1 0 6H8a3 3 0 1 0 0 6h10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`,s),
hr:(s=20)=>svg(`<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" stroke="currentColor" stroke-width="2" fill="none"/>`,s),
projects:(s=20)=>svg(`<path d="M8 6h13M8 12h13M8 18h13" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M3 6h.01M3 12h.01M3 18h.01" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>`,s),
book:(s=20)=>svg(`<path d="M4 19a2 2 0 0 0 2 2h14V5a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v14z" stroke="currentColor" stroke-width="2" fill="none"/><path d="M8 7h8M8 11h8M8 15h6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>`,s),
plug:(s=20)=>svg(`<path d="M9 2v6M15 2v6M7 8h10v3a5 5 0 0 1-5 5v6H10v-6a5 5 0 0 1-5-5V8z" stroke="currentColor" stroke-width="2" fill="none" stroke-linejoin="round"/>`,s),
gear:(s=20)=>svg(`<path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z" stroke="currentColor" stroke-width="2" fill="none"/>`,s)};
function svg(paths,size=20){return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" aria-hidden="true">${paths}</svg>`;}
function el(html){const t=document.createElement("template");t.innerHTML=html.trim();return t.content.firstElementChild;}
let root=null;

export const UI={
  mountBaseShell(node){
    root=node;
    root.innerHTML=`
      <div class="topbar"><div class="inner container">
        <div class="brandmark" aria-hidden="true"></div>
        <div class="brandname"><strong>Empresarial</strong><span id="top-subtitle">Gestão premium para PMEs</span></div>
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
  setAdminMode(on){root.querySelector("#top-admin").classList.toggle("active",!!on);},
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

  renderLogin({onLogin,onGoAdmin,demoUsers}){
    const content=root.querySelector("#content"); content.innerHTML="";
    root.querySelector("#top-logout").classList.add("hidden");
    root.querySelector("#top-admin").classList.remove("hidden");
    root.querySelector("#top-admin").onclick=onGoAdmin;

    const card=el(`
      <div class="container"><div class="card pad" style="max-width:720px;margin:16px auto;">
        <div class="row" style="gap:12px;align-items:flex-start;">
          <div style="min-width:44px;height:44px" class="brandmark"></div>
          <div class="col" style="gap:6px;">
            <h2 style="margin:0;font-size:18px;">Entrar</h2>
            <p>Comece pelo básico (passo a passo) ou use como painel avançado.</p>
            <div class="row" style="flex-wrap:wrap;">
              <span class="pill">${icons.book(18)} Tutorial</span>
              <span class="pill">${icons.plug(18)} DLC</span>
              <span class="pill">${icons.shield(18)} Admin</span>
            </div>
          </div>
        </div>
        <hr class="hr"/>
        <div class="grid">
          <div class="card pad" style="background:rgba(255,255,255,.04);">
            <h3>Login rápido (demo)</h3>
            <p class="muted">Selecione um perfil. Senha opcional: <span class="kbd">1234</span></p>
            <div class="col" style="gap:10px;margin-top:10px;">
              ${demoUsers.map(u=>`<button class="btn" data-user="${u.id}">${icons.spark(18)} ${esc(u.role)} • ${esc(u.name)}</button>`).join("")}
            </div>
          </div>
          <div class="card pad" style="background:rgba(255,255,255,.04);">
            <h3>Login por e-mail</h3>
            <div class="col" style="gap:10px;margin-top:10px;">
              <input class="input" id="email" placeholder="E-mail (ex.: fin@empresa.com)" inputmode="email"/>
              <input class="input" id="pass" placeholder="Senha (demo: 1234)" type="password"/>
              <button class="btn primary" id="loginbtn">${icons.spark(18)} Entrar</button>
              <button class="btn ghost" id="adminbtn">${icons.shield(18)} Abrir Admin</button>
            </div>
          </div>
        </div>
      </div></div>
    `);
    content.appendChild(card);

    content.querySelectorAll("[data-user]").forEach(b=>b.addEventListener("click",()=>onLogin({userId:b.getAttribute("data-user"), password:content.querySelector("#pass").value})));
    content.querySelector("#loginbtn").addEventListener("click",()=>onLogin({email:content.querySelector("#email").value, password:content.querySelector("#pass").value}));
    content.querySelector("#adminbtn").addEventListener("click",onGoAdmin);
  },

  renderAdmin({coreVersion,contentMeta,enabledDlcs,availableDlcs,onAdminLogin,onAdminLogout,onToggleDlc,onResetApp,onExport,onImport,onBackToApp}){
    const content=root.querySelector("#content"); content.innerHTML="";
    root.querySelector("#top-logout").classList.add("hidden");
    const enabled=new Set(enabledDlcs||[]);
    const rows=(availableDlcs||[]).map(d=>{
      const on=enabled.has(d.id);
      return `<tr>
        <td><strong>${esc(d.name)}</strong><div class="muted2" style="margin-top:2px;">${esc(d.id)}</div></td>
        <td>${esc(d.version)}<div class="muted2" style="margin-top:2px;">compat: ${esc(d.compatibleCore||"*")}</div></td>
        <td>${on?`<span class="badge">${icons.spark(16)} Ativa</span>`:`<span class="badge">${icons.plug(16)} Disponível</span>`}</td>
        <td style="text-align:right;"><button class="btn small ${on?"danger":"primary"}" data-dlc="${esc(d.id)}" data-on="${on?"1":"0"}">${on?"Desativar":"Ativar"}</button></td>
      </tr>`;
    }).join("");

    const node=el(`<div class="container"><div class="card pad" style="margin:16px auto;max-width:980px;">
      <div class="row" style="align-items:flex-start;">
        <div class="col" style="gap:6px;">
          <h2 style="margin:0;">Admin</h2>
          <p class="muted">DLCs e backup (localStorage + JSON).</p>
          <div class="row" style="flex-wrap:wrap;">
            <span class="badge">${icons.spark(16)} Core v${esc(coreVersion)}</span>
            <span class="badge">${icons.plug(16)} Conteúdo v${esc(contentMeta?.contentVersion||"—")}</span>
          </div>
        </div>
        <div class="spacer"></div>
        <button class="btn" id="backbtn">Voltar</button>
      </div>
      <hr class="hr"/>
      <div class="split">
        <div class="card pad" style="background:rgba(255,255,255,.04);">
          <h3>Acesso</h3>
          <p class="muted">Senha admin (MVP): <span class="kbd">admin</span></p>
          <div class="row" style="margin-top:10px;">
            <input class="input" id="adminpass" placeholder="Senha admin" type="password" style="flex:1;">
            <button class="btn primary" id="adminlogin">${icons.shield(18)} Ativar</button>
            <button class="btn" id="adminlogout">Sair</button>
          </div>
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
        </div>
      </div>
      <hr class="hr"/>
      <div class="card pad" style="background:rgba(255,255,255,.04);">
        <div class="row"><h3 style="margin:0;">DLCs</h3><div class="spacer"></div><span class="muted2">recarregue para aplicar</span></div>
        <div style="overflow:auto;margin-top:10px;">
          <table class="table" style="min-width:720px;"><thead><tr><th>Nome</th><th>Versão</th><th>Status</th><th></th></tr></thead><tbody>${rows||`<tr><td colspan="4">Nenhuma DLC.</td></tr>`}</tbody></table>
        </div>
      </div>
    </div></div>`);
    content.appendChild(node);

    node.querySelector("#backbtn").addEventListener("click",onBackToApp);
    node.querySelector("#adminlogin").addEventListener("click",()=>onAdminLogin({adminPassword:node.querySelector("#adminpass").value}));
    node.querySelector("#adminlogout").addEventListener("click",()=>{onAdminLogout(); UI.toast("Admin","Desativado.");});
    node.querySelector("#export").addEventListener("click",onExport);
    node.querySelector("#reset").addEventListener("click",onResetApp);
    node.querySelector("#import").addEventListener("change",(e)=>{const f=e.target.files?.[0]; if(f) onImport(f); e.target.value="";});
    node.querySelectorAll("[data-dlc]").forEach(b=>b.addEventListener("click",()=>{const id=b.getAttribute("data-dlc"); const on=b.getAttribute("data-on")==="1"; onToggleDlc(id,!on);}));    
  },

  renderApp({user,module,modules,data,tutorials,onLogout,onNavigate,onSaveData}){
    root.querySelector("#top-logout").classList.remove("hidden");
    const onLogoutEvt=()=>onLogout?.(); window.addEventListener("ui:logout", onLogoutEvt, {once:true});
    renderNav(modules, module.id, onNavigate);
    const content=root.querySelector("#content"); content.innerHTML=""; content.appendChild(renderModule(user,module,modules,data,tutorials,onSaveData));
  }
};

function renderNav(modules, activeId, onNavigate){
  const sidebar=root.querySelector("#sidebar"), tabs=root.querySelector("#tabs");
  sidebar.innerHTML=`<div class="sidehint">${icons.spark(18)} Setores</div>` + modules.map(m=>`
    <div class="sideitem ${m.id===activeId?"active":""}" data-nav="${esc(m.id)}">
      <span style="width:22px;display:inline-flex;justify-content:center">${iconFor(m.id)}</span>
      <div style="display:flex;flex-direction:column;line-height:1.1;">
        <strong style="font-size:13px;color:${m.id===activeId?"rgba(234,240,255,.95)":"rgba(234,240,255,.82)"}">${esc(m.label)}</strong>
        <span class="muted2" style="font-size:11px">${esc(m.hint||"")}</span>
      </div>
      <div class="spacer"></div>
      ${m.__dlc?`<span class="badge">${icons.plug(16)} DLC</span>`:""}
    </div>`).join("");
  sidebar.querySelectorAll("[data-nav]").forEach(b=>b.addEventListener("click",()=>onNavigate(b.getAttribute("data-nav"))));
  tabs.innerHTML=modules.slice(0,5).map(m=>`<button class="tab ${m.id===activeId?"active":""}" data-tab="${esc(m.id)}">${iconFor(m.id)} <span>${esc((m.label||"").split(" ")[0])}</span></button>`).join("");
  tabs.querySelectorAll("[data-tab]").forEach(b=>b.addEventListener("click",()=>onNavigate(b.getAttribute("data-tab"))));
}
function iconFor(id){ if(id==="dashboard") return icons.dash(18); if(id==="finance") return icons.finance(18); if(id==="hr") return icons.hr(18); if(id==="projects") return icons.projects(18); return icons.spark(18); }

function renderModule(user,module,modules,data,tutorials,onSaveData){
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
    <p style="margin-top:10px;">${esc(t.summary)}</p>
    <div class="row" style="flex-wrap:wrap;margin-top:10px;">${t.steps.slice(0,3).map((s,i)=>`<span class="pill">${esc((i+1)+". "+s)}</span>`).join("")}</div>
  </div>`));

  if(module.id==="dashboard") wrap.appendChild(dashboardView(data));
  else if(module.id==="finance") wrap.appendChild(financeView(data,onSaveData));
  else if(module.id==="hr") wrap.appendChild(hrView(data,onSaveData));
  else if(module.id==="projects") wrap.appendChild(projectsView(data,onSaveData));
  else if(module.id==="analytics") wrap.appendChild(analyticsView(data));
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
      <div class="kpi"><div><strong>R$ ${fmt(cash+openR-openP)}</strong><div class="muted2">Projeção simples</div></div>
      <span class="pill">${icons.book(18)} Dica: cadastre tudo</span></div>
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
    const item={id:cid(),desc,amount,due,status:"open"};
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
    const item={id:cid(),name,role,type:node.querySelector("#type").value,salary:money(node.querySelector("#salary").value),start:node.querySelector("#start").value};
    onSaveData({hr:{employees:[...(hr.employees||[]),item]}});
  });
  node.querySelector("#addH").addEventListener("click",()=>{
    const role=node.querySelector("#hrole").value.trim(), when=node.querySelector("#when").value.trim();
    if(!role||!when){ UI.toast("Atenção","Informe cargo e mês."); return; }
    const item={id:cid(),role,when,budget:money(node.querySelector("#budget").value),reason:node.querySelector("#reason").value.trim()};
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
    const item={id:cid(),name,status:node.querySelector("#status").value,owner:node.querySelector("#owner").value.trim(),due:node.querySelector("#due").value};
    onSaveData({projects:{list:[...(pr.list||[]),item]}});
  });
  return node;
}
function analyticsView(data){
  const fin=data.finance; const openR=sumOpen(fin.receivables), openP=sumOpen(fin.payables), cash=+fin.cash?.balance||0;
  const proj=cash+openR-openP;
  return el(`<div class="card pad"><div class="grid">
    <div class="card pad" style="background:rgba(255,255,255,.04);">
      <h3>Analytics (DLC)</h3><p class="muted">Exemplo de expansão via manifest.</p>
      <div class="row" style="flex-wrap:wrap;margin-top:10px;">
        <span class="badge">${icons.spark(16)} Projeção: <strong>R$ ${fmt(proj)}</strong></span>
        <span class="badge">${icons.spark(16)} Caixa: <strong>R$ ${fmt(cash)}</strong></span>
      </div>
      <hr class="hr"/><p class="muted2">Próxima etapa: gráficos e alertas.</p>
    </div>
    <div class="card pad" style="background:rgba(255,255,255,.04);">
      <h3>Saúde financeira</h3><p class="muted">Semáforo rápido (MVP).</p>
      <div class="row" style="margin-top:12px;flex-wrap:wrap;">
        ${health(proj,openP)}
      </div>
    </div>
  </div></div>`);
}
function health(proj,openP){
  const r=openP?proj/openP:2;
  if(r>=1.5) return `<span class="badge" style="border-color:rgba(51,209,122,.35);background:rgba(51,209,122,.12);color:rgba(234,240,255,.92)">${icons.spark(16)} Verde • confortável</span>`;
  if(r>=1.0) return `<span class="badge" style="border-color:rgba(247,201,72,.35);background:rgba(247,201,72,.12);color:rgba(234,240,255,.92)">${icons.spark(16)} Amarelo • atenção</span>`;
  return `<span class="badge" style="border-color:rgba(255,77,109,.35);background:rgba(255,77,109,.12);color:rgba(234,240,255,.92)">${icons.spark(16)} Vermelho • risco</span>`;
}
function fmt(n){return Number(n||0).toLocaleString("pt-BR",{minimumFractionDigits:0,maximumFractionDigits:0});}
function sumOpen(a){return (a||[]).filter(x=>x.status==="open").reduce((s,i)=>s+(+i.amount||0),0);}
function money(s){const v=String(s||"").replace(/[^0-9,.-]/g,"").replace(",","."); const n=Number(v); return Number.isFinite(n)?n:0;}
function cid(){try{return crypto.randomUUID();}catch{return "id_"+Math.random().toString(16).slice(2);}}
function esc(x){return String(x??"").replace(/[&<>"']/g,s=>({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" }[s]));}
function escAttr(x){return esc(x).replace(/\n/g," ");} 
