@AGENTS.md
# VantaOS Forum — Design System Instructions

## Identidad Visual

VantaOS es un foro con estética de sistema operativo ficticio. El nombre evoca el negro absoluto (vanta black) con auroras y gradients encima. No es fintech genérico — es un OS vivo, oscuro, y con personalidad propia.

**NO hacer:**
- Fondos gris oscuro genérico (#1a1a1a con texto blanco)
- Cards con border-radius grande y sombra azul
- Gradients lineales básicos de dos colores
- Tipografía Inter/Roboto sin criterio
- Botones con glow azul eléctrico por defecto
- Cualquier cosa que parezca un SaaS dashboard de 2022

---

## Paleta de Color

```css
/* Fondos */
--vanta-base: #050508;          /* Negro casi absoluto, base de todo */
--vanta-surface: #0a0a12;       /* Superficie de cards y paneles */
--vanta-elevated: #0f0f1a;      /* Elementos elevados */

/* Aurora Mesh Gradients */
--aurora-1: #1a0533;            /* Violeta profundo */
--aurora-2: #0d1f3c;            /* Azul noche */
--aurora-3: #0a2e1f;            /* Verde bosque oscuro */
--aurora-4: #2d0a3e;            /* Púrpura */

/* Acentos */
--accent-primary: #7c3aed;      /* Violeta vibrante */
--accent-secondary: #06b6d4;    /* Cyan frío */
--accent-tertiary: #10b981;     /* Verde aurora */
--accent-warm: #f59e0b;         /* Ámbar para alertas/badges */

/* Texto */
--text-primary: #f1f5f9;
--text-secondary: #94a3b8;
--text-muted: #475569;

/* Bordes */
--border-subtle: rgba(255,255,255,0.06);
--border-glow: rgba(124,58,237,0.3);
```

---

## Mesh Gradient Background

El fondo global del sitio debe tener un mesh gradient animado, no estático.

```css
body {
  background-color: var(--vanta-base);
  background-image:
    radial-gradient(ellipse 80% 50% at 20% 10%, rgba(26,5,51,0.8) 0%, transparent 60%),
    radial-gradient(ellipse 60% 40% at 80% 80%, rgba(13,31,60,0.7) 0%, transparent 50%),
    radial-gradient(ellipse 40% 60% at 60% 30%, rgba(10,46,31,0.5) 0%, transparent 50%),
    radial-gradient(ellipse 70% 30% at 10% 90%, rgba(45,10,62,0.6) 0%, transparent 60%);
  animation: meshShift 20s ease-in-out infinite alternate;
}

@keyframes meshShift {
  0%   { background-position: 0% 0%, 100% 100%, 50% 0%, 0% 100%; }
  100% { background-position: 10% 20%, 90% 80%, 60% 40%, 20% 70%; }
}
```

---

## Tipografía

```css
/* Headings: monospace con personalidad de sistema */
--font-display: 'JetBrains Mono', 'Fira Code', monospace;

/* Body: legible pero no genérico */
--font-body: 'Inter', 'DM Sans', sans-serif;

/* UI labels, badges, stats */
--font-ui: 'JetBrains Mono', monospace;
```

**Reglas:**
- Títulos de sección en monospace, uppercase con letter-spacing amplio
- Números y stats siempre en monospace (se ven como datos del sistema)
- Cuerpo de posts en sans-serif para legibilidad
- Tamaños de fuente usando escala modular (no saltos arbitrarios)

---

## Cards y Surfaces

Glassmorphism oscuro, no blanco/claro.

```css
.card {
  background: rgba(10, 10, 18, 0.7);
  backdrop-filter: blur(12px) saturate(150%);
  border: 1px solid var(--border-subtle);
  border-radius: 8px; /* No exagerar el radius */
  box-shadow:
    0 0 0 1px rgba(124,58,237,0.05),
    0 4px 24px rgba(0,0,0,0.4),
    inset 0 1px 0 rgba(255,255,255,0.04);
}

.card:hover {
  border-color: var(--border-glow);
  box-shadow:
    0 0 0 1px rgba(124,58,237,0.15),
    0 8px 32px rgba(0,0,0,0.5),
    0 0 24px rgba(124,58,237,0.08);
  transition: all 0.3s ease;
}
```

---

## Animaciones (nivel MEDIO)

Usar **Framer Motion** en Next.js.

**Permitido:**
- Scroll-triggered reveals (fade + translate Y, no exagerar)
- Gradients animados en background (lento, 15-25s)
- Hover con glow sutil en cards y botones
- Transiciones de página con fade
- Counter animations en stats del dashboard

**NO hacer:**
- Partículas flotando constantemente
- Glitch effects en texto de cuerpo
- Animaciones que bloqueen la lectura
- Parallax agresivo en móvil

```js
// Ejemplo de scroll reveal con Framer Motion
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};
```

---

## Secciones del Proyecto

### Feed de Posts
- Lista de threads con card glassmorphism
- Metadata en monospace (fecha, replies, views como stats de sistema)
- Categoría como badge con color de acento
- Hover revela borde con glow sutil

### Categorías
- Grid de categorías con icon + nombre + count
- Cada categoría puede tener su propio acento de color dentro de la paleta
- Fondo con mesh gradient único por categoría (variación sutil)

### Perfiles
- Header con aurora gradient personalizado por usuario
- Stats del usuario en monospace (posts, joined, reputation)
- Avatar con ring de acento animado en hover

### Dashboard / Stats
- Números grandes en monospace con counter animation al entrar en viewport
- Gráficos con colores de la paleta aurora (evitar Chart.js defaults)
- Grid asimétrico, no columnas iguales de 4

---

## Componentes UI

### Botones
```css
/* Primary */
.btn-primary {
  background: linear-gradient(135deg, var(--accent-primary), #5b21b6);
  border: 1px solid rgba(124,58,237,0.4);
  color: white;
  font-family: var(--font-ui);
  letter-spacing: 0.05em;
  text-transform: uppercase;
  font-size: 0.75rem;
}

/* Ghost */
.btn-ghost {
  background: transparent;
  border: 1px solid var(--border-subtle);
  color: var(--text-secondary);
}
.btn-ghost:hover {
  border-color: var(--accent-primary);
  color: var(--text-primary);
}
```

### Badges / Tags
- Pequeños, monospace, uppercase
- Background con opacidad baja del color de acento
- Sin border-radius excesivo (4px máximo)

### Inputs / Forms
- Fondo: `rgba(255,255,255,0.03)`
- Border: `var(--border-subtle)`
- Focus: border glow con `--accent-primary`
- Placeholder en `--text-muted`

---

## Layout

- **Sidebar izquierda** para navegación (categorías, links del OS)
- **Feed central** como columna principal
- **Panel derecho** para stats, usuarios activos, trending
- En móvil: sidebar colapsable como drawer
- Espaciado base: 8px grid
- No centrar hero sections — layouts con tensión visual asimétrica

---

## Lo que hace a VantaOS único

1. El nombre del sitio se renderiza como si fuera un proceso del sistema: `vantaos://forum`
2. Los timestamps se muestran en formato técnico: `2026-05-26T14:32:00Z`
3. Las categorías pueden tener prefijos tipo path: `/tech/`, `/meta/`, `/offtopic/`
4. El cursor puede tener un trail sutil (opcional, solo desktop)
5. Loading states con efecto de "scanning" tipo terminal