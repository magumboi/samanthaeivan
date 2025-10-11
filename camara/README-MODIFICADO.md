# � Cámara de Boda - Samantha & Iván

## Propósito especial

Esta aplicación está diseñada específicamente para la boda de **Samantha & Iván** el **11 de Octubre 2025**:

✅ **Álbum colaborativo**: Los invitados pueden agregar fotos al álbum de boda  
✅ **Subida automática**: Las fotos se comparten automáticamente con los novios  
✅ **Vista previa personalizada**: Opciones adicionales para los invitados  
✅ **Experiencia temática**: Interfaz personalizada para el evento  
✅ **Momentos preservados**: Cada foto queda registrada con fecha, hora y autor  

## Cómo usar la cámara de boda

1. **📸 Capturar momento**: Presiona "Capturar momento" para tomar una foto
2. **🤖 Subida automática**: La foto se agrega automáticamente al álbum de boda
3. **✅ Confirmación discreta**: Aparece un indicador si la foto se guardó correctamente
4. **🎭 Opciones adicionales**: Se muestra un modal con opciones para el invitado:
   - **� Compartir en álbum**: Subir manualmente si la automática falló
   - **💾 Guardar en mi teléfono**: Descargar una copia personal
   - **🗑️ Descartar**: Cerrar sin hacer nada más
5. **💕 Momento preservado**: La foto queda guardada con tu nombre y la hora exacta

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

### 🎯 **Comportamiento híbrido:**

1. **Subida automática (en paralelo)**:
   - Se ejecuta silenciosamente al capturar la foto
   - No interrumpe al usuario
   - Muestra un ✅ discreto si es exitosa
   - Se registra en la consola para depuración

2. **Vista previa (simultánea)**:
   - Modal con la imagen capturada
   - Tres opciones adicionales disponibles
   - El usuario puede interactuar o simplemente cerrar

3. **Ventajas del sistema híbrido**:
   - **Respaldo garantizado**: La foto ya se subió automáticamente
   - **Flexibilidad**: El usuario puede descargar una copia local
   - **Reintento**: Si la subida automática falló, puede intentar manualmente
   - **Sin interrupciones**: El flujo de trabajo es fluido

## Archivos modificados

- `index.html`: Eliminadas referencias a Discord de la interfaz
- `assets/app.js`: Implementado sistema híbrido (subida automática + vista previa)

### 🔄 **Flujo técnico:**

```javascript
// Al tomar foto:
capturePhoto() {
    // 1. Capturar imagen
    const imageDataUrl = cameraSensor.toDataURL("image/jpeg", 0.95);
    
    // 2. Subir automáticamente (paralelo)
    uploadPhotoSilently(imageDataUrl); // ✅ Silenciosa
    
    // 3. Mostrar vista previa (paralelo)
    showPhotoPreview(imageDataUrl);    // 🎭 Interactiva
}
```

La aplicación ofrece lo mejor de ambos mundos: respaldo automático silencioso + control completo del usuario.