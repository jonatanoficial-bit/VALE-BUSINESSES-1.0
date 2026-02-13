import { Storage } from "./storage.js";
const KEY_SESSION="cvb:auth:session:v1";
const KEY_ADMIN="cvb:auth:admin:v1";

async function sha256Hex(text){
  const data = new TextEncoder().encode(String(text||""));
  const buf = await crypto.subtle.digest("SHA-256", data);
  const arr = Array.from(new Uint8Array(buf));
  return arr.map(b=>b.toString(16).padStart(2,"0")).join("");
}

export const Auth={
  getSession(){ try{return JSON.parse(localStorage.getItem(KEY_SESSION)||"null");}catch{return null;} },
  getUsersSafe(){ return Storage.getUsers().map(({password, ...u})=>u); },

  async loginLocal({email,password,userId,companyKey}){
    const settings = Storage.getSettings();
    const sec = settings.security || {};

    // Gate: company key
    if(sec.companyLockEnabled){
      const input = String(companyKey||"");
      if(!input) return {ok:false,error:"Informe o código da empresa."};
      const h = await sha256Hex(input);
      if(!sec.companyLockHash || h !== sec.companyLockHash) return {ok:false,error:"Código da empresa inválido."};
    }

    const users=Storage.getUsers();
    let user=null;

    if(userId){
      user=users.find(u=>u.id===userId);
      if(!user) return {ok:false,error:"Usuário não encontrado."};
      if(user.active===false) return {ok:false,error:"Usuário desativado."};
      // FIX: always require password
      if(String(password||"") !== String(user.password||"")) return {ok:false,error:"Senha incorreta."};
    }else{
      user=users.find(u=>u.email.toLowerCase()===String(email||"").toLowerCase());
      if(!user) return {ok:false,error:"E-mail não cadastrado."};
      if(user.active===false) return {ok:false,error:"Usuário desativado."};
      if(String(password||"") !== String(user.password||"")) return {ok:false,error:"Senha incorreta."};
    }

    // Gate: allowlist / domain
    const uemail = String(user.email||"").toLowerCase();
    if(sec.allowedEmailDomain){
      const dom = String(sec.allowedEmailDomain||"").trim().toLowerCase();
      if(dom && !uemail.endsWith("@"+dom)) return {ok:false,error:`Acesso restrito ao domínio @${dom}.`};
    }
    if(Array.isArray(sec.allowlistEmails) && sec.allowlistEmails.length){
      const allow = sec.allowlistEmails.map(x=>String(x).toLowerCase().trim()).filter(Boolean);
      if(!allow.includes(uemail)) return {ok:false,error:"Usuário não está na lista autorizada."};
    }

    const session={id:user.id,name:user.name,email:user.email,role:user.role,perms:user.perms,loggedAt:new Date().toISOString()};
    localStorage.setItem(KEY_SESSION, JSON.stringify(session));
    return {ok:true, session};
  },

  logout(){ localStorage.removeItem(KEY_SESSION); },

  isAdminMode(){ return localStorage.getItem(KEY_ADMIN)==="1"; },
  async adminLoginLocal({adminPassword}){
    if(String(adminPassword||"")!=="admin") return {ok:false,error:"Senha admin padrão é 'admin' (troque depois)."};
    localStorage.setItem(KEY_ADMIN,"1");
    return {ok:true};
  },
  adminLogout(){ localStorage.removeItem(KEY_ADMIN); },

  async setCompanyKey(newKey){
    const settings = Storage.getSettings();
    settings.security = settings.security || {};
    if(!newKey){
      settings.security.companyLockEnabled = false;
      settings.security.companyLockHash = null;
      Storage.saveSettings(settings);
      return {ok:true, disabled:true};
    }
    settings.security.companyLockEnabled = true;
    settings.security.companyLockHash = await sha256Hex(String(newKey));
    Storage.saveSettings(settings);
    return {ok:true};
  }
};
