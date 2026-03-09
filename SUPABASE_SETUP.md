# Backend con Supabase — Brief H&P

Los códigos **CERVERA**, **HERRERA** y **PATRONI** funcionan como cuentas: los datos se guardan en Supabase y se sincronizan entre todos los dispositivos (PC, móvil, etc.).

## 1. Crear proyecto en Supabase

1. Entra en [supabase.com](https://supabase.com) y crea una cuenta si no tienes.
2. **New project**: elige organización, nombre (ej. `herrerapatronibrief`), contraseña de DB y región.
3. Espera a que el proyecto esté listo.

## 2. Crear la tabla `briefs`

En el dashboard de Supabase: **SQL Editor** → New query. Pega y ejecuta:

```sql
create table if not exists public.briefs (
  user_id text primary key,
  state jsonb not null default '{}',
  report text,
  saved_at bigint not null default (extract(epoch from now()) * 1000)::bigint,
  submitted_at text,
  updated_at timestamptz not null default now()
);

-- Opcional: actualizar updated_at al hacer upsert
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists briefs_updated_at on public.briefs;
create trigger briefs_updated_at
  before update on public.briefs
  for each row execute function public.set_updated_at();

-- Permitir que el backend (service role) haga todo; no exponer anon key para escritura
comment on table public.briefs is 'Briefs por usuario (cervera, herrera, patroni). Solo acceso desde API con service_role.';
```

Luego en **Table Editor** → **briefs** deberías ver la tabla vacía con columnas `user_id`, `state`, `report`, `saved_at`, `submitted_at`, `updated_at`.

## 3. Variables de entorno en Vercel

En el proyecto de Vercel (**herrerapatronibrief**): **Settings** → **Environment Variables**.

Añade:

| Name | Value | Environment |
|------|--------|-------------|
| `SUPABASE_URL` | `https://xxxxx.supabase.co` | Production (y Preview si quieres) |
| `SUPABASE_SERVICE_ROLE_KEY` | La clave **service_role** (secret) | Production (y Preview si quieres) |

Dónde encontrarlas en Supabase: **Project Settings** (ícono engranaje) → **API**:
- **Project URL** → `SUPABASE_URL`
- **Project API keys** → **service_role** (secret) → `SUPABASE_SERVICE_ROLE_KEY`

No uses la clave `anon` pública para el backend; la `service_role` bypassa RLS y solo debe usarse en el servidor (Vercel).

## 4. Redeploy en Vercel

Después de guardar las variables:
- Haz un **push** a `main` para que se redepliegue, o  
- En Vercel: **Deployments** → último deployment → **Redeploy**.

## 5. Comportamiento esperado

- **Cliente (index.html):** Al entrar con CERVERA/HERRERA/PATRONI en Vercel, carga los datos desde la API (Supabase) y al guardar/enviar los sube. Si abres en otro dispositivo con el mismo código, ves lo mismo.
- **Admin (admin.html):** Refrescar y “Ver brief” leen desde la misma API (Supabase).
- **Local (localhost):** Sigue usando solo `localStorage`; no llama a la API.

Si algo falla, revisa en Vercel **Functions** → logs del deployment, o en Supabase **Logs** → API.
