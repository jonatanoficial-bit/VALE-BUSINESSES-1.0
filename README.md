# Chamara Vale Businesses 1.0 — Core v0.3.0 (Etapa 3: Content Studio + DLC Builder)

Aplicação **mobile-first** em **HTML + CSS + JavaScript puro**, com UI/UX premium, arquitetura **Core + DLC**, Admin local, **RBAC** e agora um **Content Studio** para editar conteúdo sem backend.

## Rodar localmente
> Não abra via `file://` (usa `fetch()` do manifest). Use um servidor.

```bash
cd chamara_vale_businesses_v030
python -m http.server 5500
```

## Logins (MVP local)
- Senha padrão demo: `1234`
- Admin mode: `admin` (na área Admin)

## Etapa 3 (novidades)
### 1) Content Studio (Admin)
- Edita **label, hint, descrição, tags e order** de setores
- Edita **tutorial** (resumo + passos)
- Salva como **override** em `localStorage`
- Export/Import via **backup** (schema v3)

### 2) DLC Builder (local)
- Cria DLCs **locais** (manifest JSON + módulo placeholder)
- Você salva, ativa na lista de DLCs e **recarrega**
- Exporta manifest para versionar/compartilhar

## Backup (schema v3)
Export inclui:
- dados (finance/hr/projects)
- usuários (RBAC)
- DLCs habilitadas
- **contentOverride** (Content Studio)
- **localDlcs** (DLC Builder)

## GitHub Pages
Suba o conteúdo do projeto no repositório e habilite Pages (rotas por hash).
