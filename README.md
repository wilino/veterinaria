# VetCare Pro

Base frontend de la Fase 1 del sistema clínico veterinario. Está construida con HTML5, Bootstrap 5.3, jQuery 3.7 y CSS propio basado en el sistema visual de VetCare Pro.

## Vistas disponibles

- `index.html`: superficie pública y entrada al sistema.
- `client/dashboard.html`: ejemplo de portal de cliente.
- `vet/dashboard.html`: ejemplo de portal veterinario.
- `admin/dashboard.html`: ejemplo de portal administrativo.

## Ejecutar localmente

Desde la raíz del proyecto, servir los archivos con un servidor estático:

```bash
python3 -m http.server 8080
```

Después abrir `http://localhost:8080`.

## Convenciones

- Componentes propios con prefijo `vc-`.
- Eventos jQuery mediante atributos `data-action`; no se usan manejadores inline.
- Datos de demostración y adaptador de API separados de las vistas.
- Los directorios `docs/` y `Mockups/` son locales y permanecen ignorados por Git.
