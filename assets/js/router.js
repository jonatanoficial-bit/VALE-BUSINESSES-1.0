export class Router{
  constructor({ onRoute }){ this.onRoute=onRoute; window.addEventListener("hashchange", ()=>this.handle()); }
  start(){ if(!location.hash) location.hash="#/login"; this.handle(); }
  go(name, params={}){
    if(name==="login") location.hash="#/login";
    if(name==="admin") location.hash="#/admin";
    if(name==="app"){ const m=params.module||"dashboard"; location.hash=`#/app/${encodeURIComponent(m)}`; }
  }
  handle(){
    const h=location.hash||"#/login";
    if(h.startsWith("#/app")){
      const parts=h.split("/").filter(Boolean);
      const module=decodeURIComponent(parts[2]||"dashboard");
      this.onRoute?.({name:"app", params:{module}});
      return;
    }
    if(h.startsWith("#/admin")){ this.onRoute?.({name:"admin", params:{}}); return; }
    this.onRoute?.({name:"login", params:{}});
  }
}
