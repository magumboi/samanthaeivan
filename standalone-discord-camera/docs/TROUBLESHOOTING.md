# 🔧 Solución de Problemas - Cámara Discord Standalone

Esta guía te ayudará a resolver los problemas más comunes que puedes encontrar al usar la aplicación.

## 📹 Problemas con la cámara

### ❌ La cámara no se activa

#### Problema: "Acceso a la cámara denegado"
**Síntomas**: La aplicación muestra un error de permisos
**Soluciones**:
1. **Permitir cámara en el navegador**:
   - Chrome: Clic en el candado 🔒 → Cámara → Permitir
   - Firefox: Clic en el escudo 🛡️ → Permisos → Cámara → Permitir
   - Safari: Safari → Preferencias → Sitios web → Cámara → Permitir

2. **Verificar configuración del sistema**:
   ```
   Windows 10/11:
   Configuración → Privacidad → Cámara → Permitir acceso
   
   macOS:
   Preferencias → Seguridad → Privacidad → Cámara
   
   Linux:
   sudo lsusb (verificar que la cámara esté detectada)
   ```

3. **Reiniciar el navegador** completamente y volver a intentar

#### Problema: "Cámara no encontrada"
**Síntomas**: Error de que no hay cámaras disponibles
**Soluciones**:
1. **Verificar conexión física** de la cámara USB
2. **Actualizar drivers** de la cámara web
3. **Probar en otro navegador** para descartar problemas específicos
4. **Verificar que no esté en uso**:
   ```bash
   # En Linux, verificar procesos usando la cámara:
   sudo fuser /dev/video0
   ```

#### Problema: "Cámara en uso"
**Síntomas**: Error indicando que otra app usa la cámara
**Soluciones**:
1. **Cerrar aplicaciones** que puedan usar la cámara:
   - Zoom, Teams, Skype, Google Meet
   - OBS Studio, Streamlabs
   - Otras pestañas del navegador con videollamadas

2. **Forzar cierre** de procesos persistentes:
   ```bash
   # Windows (PowerShell):
   Get-Process | Where-Object {$_.Name -like "*camera*"} | Stop-Process
   
   # macOS/Linux:
   pkill -f "camera|video"
   ```

3. **Reiniciar el navegador** completamente

### 🔄 Problemas de cambio de cámara

#### Problema: El botón de cambio no funciona
**Síntomas**: No cambia entre cámara frontal y trasera
**Soluciones**:
1. **Verificar que hay múltiples cámaras**:
   ```javascript
   // Abre la consola del navegador (F12) y ejecuta:
   navigator.mediaDevices.enumerateDevices()
     .then(devices => {
       console.log(devices.filter(d => d.kind === 'videoinput'));
     });
   ```

2. **Actualizar la página** y volver a intentar
3. **En móviles**: Asegúrate de estar usando HTTPS

### 📸 Problemas de calidad de imagen

#### Problema: Fotos borrosas o de baja calidad
**Síntomas**: Las fotos salen pixeladas o poco nítidas
**Soluciones**:
1. **Verificar configuración de enfoque**:
   - Activa "Enfoque automático" en configuración ⚙️
   - Toca la pantalla para enfocar manualmente

2. **Mejorar iluminación** del ambiente
3. **Ajustar configuración avanzada** en `assets/app.js`:
   ```javascript
   // Aumentar resolución
   var constraints = {
       video: {
           width: { ideal: 1920, min: 1280 },
           height: { ideal: 1080, min: 720 },
           frameRate: { ideal: 30 }
       }
   };
   ```

4. **Limpiar la lente** de la cámara física

## 🌐 Problemas de conexión a Discord

### ❌ Las fotos no se suben a Discord

#### Problema: "Webhook no configurado"
**Síntomas**: Error al intentar subir foto
**Soluciones**:
1. **Verificar URL del webhook**:
   - Debe contener `discord.com/api/webhooks/`
   - No debe tener espacios al inicio o final
   - Debe ser la URL completa, no cortada

2. **Probar webhook manualmente**:
   ```bash
   # Usar curl para probar:
   curl -X POST "TU_WEBHOOK_URL" \
     -H "Content-Type: application/json" \
     -d '{"content": "Prueba de webhook"}'
   ```

#### Problema: "Discord API error: 404"
**Síntomas**: Error 404 al subir a Discord
**Soluciones**:
1. **El webhook fue eliminado**: Crear un nuevo webhook en Discord
2. **URL incorrecta**: Verificar que la URL esté completa y bien copiada
3. **Permisos del canal**: El bot necesita permisos para enviar mensajes

#### Problema: "Discord API error: 401"
**Síntomas**: Error de autorización
**Soluciones**:
1. **Regenerar webhook** en Discord
2. **Verificar permisos** del canal donde está el webhook

#### Problema: "Error de conexión"
**Síntomas**: No se puede conectar a Discord
**Soluciones**:
1. **Verificar conexión a internet**:
   ```bash
   # Ping a Discord:
   ping discord.com
   ```
2. **Verificar firewall/antivirus** que no bloquee la conexión
3. **Probar con otro navegador**

### 🐌 Problemas de rendimiento

#### Problema: La aplicación va lenta
**Síntomas**: La cámara se ve entrecortada, la app responde lento
**Soluciones**:
1. **Cerrar otras pestañas** pesadas del navegador
2. **Liberar memoria RAM**:
   ```bash
   # Windows: Reiniciar explorer.exe
   # macOS: Forzar cierre de apps innecesarias
   # Linux: sudo sync && echo 3 > /proc/sys/vm/drop_caches
   ```

3. **Reducir calidad de video** temporalmente:
   ```javascript
   // En assets/app.js, usar resolución menor:
   width: { ideal: 1280 },
   height: { ideal: 720 },
   frameRate: { ideal: 24 }
   ```

4. **Actualizar el navegador** a la última versión

## 📱 Problemas específicos de móviles

### 📵 En dispositivos iOS

#### Problema: La cámara no funciona en Safari
**Soluciones**:
1. **Usar HTTPS**: iOS requiere conexión segura para cámara
2. **Actualizar iOS** a versión 14.3 o superior
3. **Configurar Safari**:
   - Configuración → Safari → Cámara → Permitir

#### Problema: La app no se instala como PWA
**Soluciones**:
1. **Usar Safari** (no Chrome) para instalar PWA en iOS
2. **Compartir → Añadir a pantalla de inicio**

### 🤖 En dispositivos Android

#### Problema: Problemas de permisos
**Soluciones**:
1. **Configuración del navegador**:
   - Chrome → Configuración → Privacidad → Configuración de sitios → Cámara
2. **Permisos del sistema**:
   - Configuración → Apps → Chrome → Permisos → Cámara

## 💾 Problemas de almacenamiento

### 🗄️ Configuración no se guarda

#### Problema: La configuración se pierde al recargar
**Síntomas**: Tienes que reconfigurar cada vez
**Soluciones**:
1. **Verificar localStorage**:
   ```javascript
   // En la consola del navegador:
   console.log(localStorage.getItem('discordWebhookUrl'));
   ```

2. **Limpiar caché del navegador** si está corrupto:
   - Chrome: Ctrl+Shift+Del → Borrar datos de navegación
   - Seleccionar solo "Datos de sitios web"

3. **Verificar modo incógnito**: El localStorage no persiste en modo privado

### 📦 Problemas con archivos grandes

#### Problema: "Archivo demasiado grande"
**Síntomas**: Discord rechaza la imagen
**Soluciones**:
1. **Reducir calidad** en `assets/app.js`:
   ```javascript
   // Cambiar de 0.95 a 0.8 o menor:
   const imageDataUrl = cameraSensor.toDataURL("image/jpeg", 0.8);
   ```

2. **Reducir resolución** de captura:
   ```javascript
   width: { ideal: 1280 },  // En lugar de 1920
   height: { ideal: 720 }   // En lugar de 1080
   ```

## 🔍 Herramientas de diagnóstico

### 🛠️ Consola del navegador

Presiona **F12** y ejecuta estos comandos para diagnosticar:

```javascript
// 1. Verificar soporte de cámara:
console.log('getUserMedia supported:', 
  !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia));

// 2. Listar dispositivos de video:
navigator.mediaDevices.enumerateDevices()
  .then(devices => {
    const cameras = devices.filter(d => d.kind === 'videoinput');
    console.log('Cameras found:', cameras.length);
    cameras.forEach(cam => console.log(cam.label));
  });

// 3. Verificar localStorage:
console.log('Webhook configured:', 
  !!localStorage.getItem('discordWebhookUrl'));

// 4. Probar constraints de cámara:
const testConstraints = {
  video: { width: 640, height: 480 }
};
navigator.mediaDevices.getUserMedia(testConstraints)
  .then(() => console.log('Basic camera test: SUCCESS'))
  .catch(err => console.log('Basic camera test: FAILED', err));
```

### 📊 Información del sistema

```javascript
// Información útil para reportar problemas:
console.log({
  userAgent: navigator.userAgent,
  screen: `${screen.width}x${screen.height}`,
  viewport: `${window.innerWidth}x${window.innerHeight}`,
  pixelRatio: window.devicePixelRatio,
  connection: navigator.connection?.effectiveType,
  cookiesEnabled: navigator.cookieEnabled,
  language: navigator.language
});
```

## 📞 Obtener ayuda adicional

### 🐛 Reportar un bug

Al reportar problemas, incluye:

1. **Información del navegador**:
   - Nombre y versión (ej: Chrome 118.0.5993.88)
   - Sistema operativo (ej: Windows 11, macOS 13, Ubuntu 22.04)

2. **Pasos para reproducir**:
   - Qué hiciste exactamente
   - Qué esperabas que pasara
   - Qué pasó en realidad

3. **Capturas de pantalla**:
   - Del error mostrado
   - De la consola del navegador (F12)

4. **Logs de la consola**:
   ```javascript
   // Copia y pega toda la información de la consola
   ```

### 🔗 Enlaces útiles

- **Documentación de getUserMedia**: [MDN Web Docs](https://developer.mozilla.org/es/docs/Web/API/MediaDevices/getUserMedia)
- **API de Discord Webhooks**: [Discord Developer Portal](https://discord.com/developers/docs/resources/webhook)
- **Soporte de navegadores**: [Can I Use - getUserMedia](https://caniuse.com/stream)

### 📧 Contacto

- Crea un **issue** en el repositorio de GitHub
- Incluye toda la información de diagnóstico mencionada arriba
- Usa un título descriptivo (ej: "Error 404 al subir foto en Chrome Android")

---

**¿Tu problema no está listado aquí?** Crea un issue en GitHub con toda la información de diagnóstico y te ayudaremos a resolverlo. 🛠️✨