# Chamara Vale Businesses 1.0 — Core v0.3.1

Projeto **mobile-first** em **HTML + CSS + JavaScript puro** com UI premium AAA, arquitetura **Core + DLC**, Admin local, RBAC, Content Studio e camadas de segurança para uso público.

## Build
- Core: v0.3.1
- Build: 2026-02-13 14:07:19 (BRT)

> A partir desta versão, o build fica visível na UI (Topbar e Login).

## Rodar localmente
> Não abra via `file://` (usa `fetch()` do manifest). Use um servidor.

```bash
cd chamara_vale_businesses_v031
python -m http.server 5500
```

Acesse: `http://localhost:5500`

## Logins (MVP local)
- Senha padrão demo: `1234`
- Admin mode: `admin` (na área Admin)

## Segurança (importante)
### GitHub Pages é público no plano Free
GitHub Pages no **GitHub Free** funciona para repositórios **públicos**. Para site privado, precisa plano pago ou camada externa.  
Recomendação para proteger acesso (sem backend próprio):
- **Cloudflare Access / Zero Trust** na frente do site (com domínio próprio), ou
- **Firebase Auth + Firestore** (dados protegidos por regras).

### Camadas locais implementadas (não substituem backend)
No Admin → **Segurança**:
- **Privacidade**: esconde lista de perfis na tela de login
- **Company Lock**: exige “código da empresa” para logar
- Restrição por **domínio** e/ou **lista de e-mails**

## Content Studio (Admin)
- Edita label/hint/descrição/tags/order
- Edita tutorial (resumo + passos)
- Salva override no localStorage
- Export/Import via backup

## DLC Builder (Admin)
- Cria DLC local com novos módulos (placeholder)
- Ativa na lista de DLCs e recarrega
- Exporta manifest

## Backup (schema v4)
Export inclui:
- dados (finance/hr/projects/ops)
- usuários (RBAC)
- **settings** (segurança)
- DLCs habilitadas
- contentOverride (Content Studio)
- localDlcs (DLC Builder)

## GitHub Pages
1. Suba o projeto no repositório
2. Settings → Pages → Deploy from branch
3. Abra a URL do Pages

> Rotas por hash (`#/app/...`) são compatíveis com Pages.
