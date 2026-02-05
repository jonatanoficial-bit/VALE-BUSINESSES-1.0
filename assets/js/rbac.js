export const RBAC = {
  canAccessModule(user, moduleId){
    if(!user) return false;
    const perms = user.perms || [];
    if(perms.includes("*")) return true;
    if(moduleId === "dashboard") return perms.includes("dashboard") || perms.length>0;
    return perms.includes(moduleId);
  },
  filterModulesForUser(user, modules){
    return (modules||[]).filter(m => this.canAccessModule(user, m.id));
  }
};
