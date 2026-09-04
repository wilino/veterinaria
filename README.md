# VetCare Pro

Frontend de las fases 1 y 2 del sistema clínico veterinario. Está construido con HTML5, Bootstrap 5.3, jQuery 3.7 y CSS propio basado en el sistema visual de VetCare Pro.

## Vistas disponibles

- `index.html`: superficie pública y entrada al sistema.
- `public/solicitar-cita.html`: solicitud pública de cita con validación, resumen y confirmación de demostración.
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
- Las solicitudes públicas se registran solo en memoria mediante el adaptador mock; se perderán al recargar hasta integrar el backend de las siguientes fases.
- Los directorios `docs/` y `Mockups/` son locales y permanecen ignorados por Git.
