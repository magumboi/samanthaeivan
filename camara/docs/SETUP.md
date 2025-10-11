# ⚙️ Guía de Configuración - Cámara Discord Standalone

Esta guía te ayudará a configurar la aplicación paso a paso para empezar a subir fotos a Discord.

## 📋 Requisitos previos

### 1. Servidor de Discord
- Tener acceso administrativo a un servidor de Discord
- O tener permisos para crear webhooks en un canal específico

### 2. Navegador compatible
- Chrome 88+ (recomendado)
- Firefox 85+
- Safari 14+
- Edge 88+

### 3. Dispositivo con cámara
- Cámara web integrada o externa
- Micrófono no requerido (la app no graba audio)

## 🔗 Paso 1: Crear Webhook de Discord

### Método 1: Como administrador del servidor

1. **Abre Discord** y ve a tu servidor
2. **Selecciona el canal** donde quieres recibir las fotos
3. **Clic derecho en el canal** → "Editar canal"
4. Ve a la pestaña **"Integraciones"**
5. Busca la sección **"Webhooks"**
6. Haz clic en **"Crear webhook"**

### Método 2: Desde la configuración del canal

1. **Abre el canal** donde quieres recibir fotos
2. Haz clic en el **ícono de configuración** (⚙️) junto al nombre del canal
3. Ve a **"Integraciones"** → **"Webhooks"**
4. Haz clic en **"Crear webhook"**

### Configuración del webhook

1. **Nombre del webhook**: Ponle un nombre descriptivo (ej: "Cámara Bot")
2. **Avatar**: Puedes subir una imagen personalizada (opcional)
3. **Canal**: Verifica que sea el canal correcto
4. **Copiar URL del webhook**: ¡MUY IMPORTANTE! Guarda esta URL

### ⚠️ Importante sobre la URL del webhook
```
Ejemplo de URL válida:
https://discord.com/api/webhooks/123456789012345678/AbCdEfGhIjKlMnOpQrStUvWxYz1234567890

❌ NO compartas esta URL con nadie
✅ Guárdala de forma segura
🔄 Puedes regenerarla si se compromete
```

## 🎛️ Paso 2: Configurar la aplicación

### Abrir configuración
1. Abre `index.html` en tu navegador
2. Haz clic en el botón **⚙️** (esquina inferior izquierda)
3. Se abrirá el modal de configuración

### Configuración de Discord
```
🔗 URL del Webhook de Discord
┌─────────────────────────────────────────────────────────┐
│ https://discord.com/api/webhooks/123.../AbCdEfGh...     │
└─────────────────────────────────────────────────────────┘

📝 Nombre del bot (opcional)
┌─────────────────────────────────────────────────────────┐
│ Cámara Bot                                              │
└─────────────────────────────────────────────────────────┘
```

### Configuración de usuario
```
👤 Tu nombre (opcional)
┌─────────────────────────────────────────────────────────┐
│ Juan Pérez                                              │
└─────────────────────────────────────────────────────────┘

Este nombre aparecerá en Discord como "📸 Por: Juan Pérez"
```

### Configuración de cámara
```
☑️ Enfoque automático        ← Recomendado: Activado
☑️ Estabilización de imagen  ← Recomendado: Activado
```

## 🧪 Paso 3: Prueba la configuración

### Probar webhook (sin foto)
1. **Copia esta URL** en tu navegador:
   ```
   TU_WEBHOOK_URL_AQUI
   ```
   
2. **Cambia el final** por `/slack`:
   ```
   https://discord.com/api/webhooks/123.../AbCdEfGh.../slack
   ```

3. Si ves un mensaje JSON, ¡el webhook funciona!

### Tomar foto de prueba
1. **Permite acceso** a la cámara cuando el navegador lo solicite
2. **Toma una foto** haciendo clic en "Tomar foto"
3. En el modal, haz clic en **"📤 Subir a Discord"**
4. **Verifica en Discord** que la foto llegó correctamente

## 🎨 Paso 4: Personalización avanzada

### Modificar el mensaje de Discord

Edita el archivo `assets/app.js` y busca esta línea:
```javascript
let content = `📸 **Nueva foto capturada**\n⏰ ${timestamp}`;
```

Puedes personalizarlo:
```javascript
// Mensaje simple
let content = `Nueva foto de la cámara web 📷`;

// Mensaje detallado
let content = `📸 **NUEVA FOTO CAPTURADA**\n` +
              `⏰ Fecha: ${timestamp}\n` +
              `📱 Dispositivo: ${navigator.userAgent}\n` +
              `🏠 Ubicación: Oficina Principal`;

// Mensaje con menciones (opcional)
let content = `📸 ¡Hey <@&ROLE_ID>! Nueva foto capturada\n⏰ ${timestamp}`;
```

### Cambiar calidad de imagen

En `assets/app.js`, busca:
```javascript
const imageDataUrl = cameraSensor.toDataURL("image/jpeg", 0.95);
```

Ajusta el valor (0.1 = baja calidad, 1.0 = máxima calidad):
```javascript
// Para archivos más pequeños
const imageDataUrl = cameraSensor.toDataURL("image/jpeg", 0.8);

// Para máxima calidad
const imageDataUrl = cameraSensor.toDataURL("image/jpeg", 1.0);
```

## 🔧 Configuraciones especiales

### Para uso en empresa/trabajo

```javascript
// En assets/app.js, personaliza el payload:
const payload = {
    content: content,
    username: "Cámara Seguridad - Oficina",
    avatar_url: "https://example.com/security-camera-icon.png",
    embeds: [{
        title: "📸 Captura de Seguridad",
        color: 0xff0000, // Color rojo para seguridad
        timestamp: new Date().toISOString(),
        footer: {
            text: "Sistema de Cámara Empresarial v1.0"
        }
    }]
};
```

### Para uso personal/hogar

```javascript
const payload = {
    content: content,
    username: "📸 Cámara Personal",
    avatar_url: "https://example.com/personal-camera-icon.png",
    embeds: [{
        title: "Nueva foto familiar",
        color: 0x00ff00, // Color verde para personal
        description: "Foto tomada desde la cámara web del hogar"
    }]
};
```

## 📱 Configuración móvil específica

### Para mejor rendimiento en móvil

En `assets/app.js`, ajusta las constraints:
```javascript
var constraints = {
    video: {
        facingMode: "user",
        width: { ideal: 1280 },      // Menor resolución para móvil
        height: { ideal: 720 },      // 720p en lugar de 1080p
        frameRate: { ideal: 24 },     // Menor FPS para ahorrar batería
        imageStabilization: true
    },
    audio: false
};
```

### Para tabletas

```javascript
var constraints = {
    video: {
        facingMode: "user",
        width: { ideal: 1600 },      
        height: { ideal: 900 },      
        frameRate: { ideal: 30 },    
        imageStabilization: true
    },
    audio: false
};
```

## 🛡️ Configuración de seguridad

### Usar múltiples webhooks (redundancia)

```javascript
// En assets/app.js, crea un array de webhooks:
const webhookUrls = [
    'https://discord.com/api/webhooks/primary/webhook',
    'https://discord.com/api/webhooks/backup/webhook'
];

// Modifica la función uploadToDiscord para intentar ambos
```

### Agregar marca de agua

```javascript
// Después de capturar la foto, antes de subirla:
function addWatermark(context) {
    context.font = "20px Inter";
    context.fillStyle = "rgba(255, 255, 255, 0.8)";
    context.fillText("© Mi Empresa 2025", 50, 50);
}
```

## 🎯 Configuraciones por tipo de uso

### 🏢 Empresarial/Corporativo
- ✅ Mensaje formal con timestamp
- ✅ Logo corporativo como avatar
- ✅ Canal específico de seguridad
- ✅ Nombre de usuario obligatorio
- ✅ Marca de agua con logo

### 🏠 Personal/Familiar  
- ✅ Mensaje casual y divertido
- ✅ Emojis personalizados
- ✅ Canal familiar privado
- ✅ Nombres opcionales
- ✅ Calidad máxima de imagen

### 🎮 Gaming/Streaming
- ✅ Integración con bots de Discord
- ✅ Comandos automáticos
- ✅ Notificaciones a roles específicos
- ✅ Thumbnails automáticos

## ❓ Preguntas frecuentes de configuración

### ¿Puedo usar múltiples webhooks?
Sí, puedes modificar el código para soportar varios webhooks y hacer backups automáticos.

### ¿Funciona offline?
La captura de fotos sí, pero necesitas internet para subirlas a Discord.

### ¿Puedo cambiar el formato de imagen?
Sí, puedes cambiar de JPEG a PNG modificando `toDataURL("image/png")`.

### ¿Se pueden programar fotos automáticas?
Sí, puedes agregar un setInterval para captura automática cada X minutos.

---

¿Necesitas más ayuda? Consulta el archivo `TROUBLESHOOTING.md` o crea un issue en el repositorio.