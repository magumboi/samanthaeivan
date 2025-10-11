# 📸 Cámara Web - Versión Silenciosa

## ¿Qué cambió?

Esta versión ha sido modificada para que:

✅ **Sin menciones de Discord**: Se eliminaron todas las referencias visibles  
✅ **Subida automática**: Las fotos se suben automáticamente al tomar la foto  
✅ **Silenciosa**: No muestra modales de confirmación ni progreso  
✅ **Indicador sutil**: Solo muestra un pequeño ✅ en la esquina al subir  
✅ **Experiencia limpia**: El usuario no se entera del proceso de subida  

## Funcionamiento

1. **Tomar foto**: Presiona el botón "Tomar foto"
2. **Subida automática**: La foto se sube silenciosamente en segundo plano
3. **Confirmación sutil**: Aparece un pequeño ✅ verde por 2 segundos
4. **Listo**: La foto se guarda automáticamente

## Configuración

- La URL del servidor está precargada en el código
- El usuario solo puede configurar:
  - Su nombre (opcional)
  - Configuraciones de cámara (enfoque, estabilización)

## Atajos de teclado

- **Espacio** o **Enter**: Tomar foto
- **C**: Cambiar cámara (frontal/trasera)
- **S**: Abrir configuración
- **Escape**: Cerrar configuración

## Archivos modificados

- `index.html`: Eliminadas referencias a Discord de la interfaz
- `assets/app.js`: Modificado para subida silenciosa automática

La aplicación mantiene toda la funcionalidad original pero con una experiencia completamente transparente para el usuario.