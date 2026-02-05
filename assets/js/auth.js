const KEY_SESSION="empresarial:auth:session:v1";
const KEY_ADMIN="empresarial:auth:admin:v1";
const DEMO_USERS=[
  {id:"u1",name:"Admin (Demo)",email:"admin@empresa.com",role:"Administrador",password:"1234",perms:["*"]},
  {id:"u2",name:"Financeiro",email:"fin@empresa.com",role:"Financeiro",password:"1234",perms:["finance","dashboard"]},
  {id:"u3",name:"RH",email:"rh@empresa.com",role:"Recursos Humanos",password:"1234",perms:["hr","dashboard"]},
  {id:"u4",name:"Projetos",email:"pm@empresa.com",role:"Projetos",password:"1234",perms:["projects","dashboard"]},
];
export const Auth={
  getDemoUsers(){ return DEMO_USERS.map(({password,...u})=>u); },
  getSession(){ try{return JSON.parse(localStorage.getItem(KEY_SESSION)||"null");}catch{return null;} },
  async loginLocal({email,password,userId}){
    let user=null;
    if(userId){ user=DEMO_USERS.find(u=>u.id===userId); if(!user) return {ok:false,error:"Usuário demo não encontrado."}; if(password && password!==user.password) return {ok:false,error:"Senha incorreta."}; }
    else{ user=DEMO_USERS.find(u=>u.email.toLowerCase()===String(email||"").toLowerCase()); if(!user) return {ok:false,error:"E-mail não cadastrado (demo)."}; if(password!==user.password) return {ok:false,error:"Senha incorreta."}; }
    const session={id:user.id,name:user.name,email:user.email,role:user.role,perms:user.perms,loggedAt:new Date().toISOString()};
    localStorage.setItem(KEY_SESSION, JSON.stringify(session));
    return {ok:true, session};
  },
  logout(){ localStorage.removeItem(KEY_SESSION); },
  isAdminMode(){ return localStorage.getItem(KEY_ADMIN)==="1"; },
  async adminLoginLocal({adminPassword}){ if(String(adminPassword||"")!=="admin") return {ok:false,error:"Senha admin padrão é 'admin'."}; localStorage.setItem(KEY_ADMIN,"1"); return {ok:true}; },
  adminLogout(){ localStorage.removeItem(KEY_ADMIN); }
};
