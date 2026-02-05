import { Storage } from "./storage.js";
const KEY_SESSION="cvb:auth:session:v1";
const KEY_ADMIN="cvb:auth:admin:v1";

export const Auth={
  getSession(){ try{return JSON.parse(localStorage.getItem(KEY_SESSION)||"null");}catch{return null;} },
  getUsersSafe(){ return Storage.getUsers().map(({password, ...u})=>u); },

  async loginLocal({email,password,userId}){
    const users=Storage.getUsers();
    let user=null;
    if(userId){
      user=users.find(u=>u.id===userId);
      if(!user) return {ok:false,error:"Usuário não encontrado."};
      if(user.active===false) return {ok:false,error:"Usuário desativado."};
      if(password && password!==user.password) return {ok:false,error:"Senha incorreta."};
    }else{
      user=users.find(u=>u.email.toLowerCase()===String(email||"").toLowerCase());
      if(!user) return {ok:false,error:"E-mail não cadastrado."};
      if(user.active===false) return {ok:false,error:"Usuário desativado."};
      if(password!==user.password) return {ok:false,error:"Senha incorreta."};
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
  adminLogout(){ localStorage.removeItem(KEY_ADMIN); }
};
