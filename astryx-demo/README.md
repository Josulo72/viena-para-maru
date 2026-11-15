# astryx-demo

Prueba mínima de [Astryx](https://github.com/meta/astryx) (sistema de diseño de Meta, React 19 + StyleX) con Vite y el tema `neutral`.

Requiere Node 22 o superior.

```bash
cd astryx-demo
npm install
npm run dev        # servidor local, normalmente http://localhost:5173
npm run build      # build de producción en dist/
```

## CLI de Astryx

```bash
npm run astryx -- search "login form"
npm run astryx -- component Button
npm run astryx -- template dashboard
npm run astryx -- init
```

Usa siempre el paquete con scope `@astryxdesign/cli`. El paquete `astryx` sin scope en npm es otro proyecto.
