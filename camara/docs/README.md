# 📸 Cámara Discord Standalone

Una aplicación web standalone que permite capturar fotos desde la cámara web y subirlas directamente a Discord mediante webhooks, sin necesidad de servidor backend.

## 🚀 Características

### ✅ Funcionalidades principales
- **Cámara web completa** - Acceso a cámara frontal y trasera
- **Captura de fotos HD** - Imágenes JPEG de alta calidad (95%)
- **Subida directa a Discord** - Via webhooks, sin servidor
- **Configuración persistente** - Se guarda en el navegador
- **Interfaz responsive** - Compatible con móvil y escritorio
- **Efectos automáticos** - Mirror para cámara frontal
- **PWA Ready** - Instalable como aplicación

### ⚙️ Configuración avanzada
- **Nombre personalizable** del bot
- **Usuario opcional** para identificar fotos
- **Enfoque automático** configurable
- **Estabilización de imagen** opcional
- **Atajos de teclado** para uso rápido

## 🛠️ Instalación y uso

### Requisitos
- Navegador moderno (Chrome, Firefox, Safari, Edge)
- Conexión a internet (para subida a Discord)
- Acceso a cámara web

### Paso 1: Configurar Discord Webhook

1. Ve a tu servidor de Discord
2. Selecciona el canal donde quieres recibir las fotos
3. Ve a **Configuración del canal** → **Integraciones** → **Webhooks**
4. Haz clic en **Crear webhook**
5. Copia la **URL del webhook**

### Paso 2: Configurar la aplicación

1. Abre `index.html` en tu navegador
2. Haz clic en el botón ⚙️ (configuración)
3. Pega la URL del webhook de Discord
4. Configura tu nombre (opcional)
5. Ajusta las configuraciones de cámara si es necesario
6. Guarda la configuración

### Paso 3: ¡Usar la cámara!

- **Tomar foto**: Clic en "Tomar foto" o presiona `Espacio`/`Enter`
- **Cambiar cámara**: Clic en 🔄 o presiona `C`
- **Configuración**: Clic en ⚙️ o presiona `S`
- **Cerrar modal**: Presiona `Escape`

## 📁 Estructura del proyecto

```
standalone-discord-camera/
├── index.html              # Página principal
├── manifest.json           # Manifiesto PWA
├── sw.js                  # Service Worker
├── assets/
│   ├── style.css          # Estilos CSS
│   └── app.js             # Lógica JavaScript
└── docs/
    ├── README.md          # Este archivo
    ├── SETUP.md           # Guía de configuración
    └── TROUBLESHOOTING.md # Solución de problemas
```

## 🌐 Compatibilidad

### Navegadores soportados
- ✅ Chrome 88+ (recomendado)
- ✅ Firefox 85+
- ✅ Safari 14+
- ✅ Edge 88+

### Dispositivos
- ✅ Escritorio (Windows, macOS, Linux)
- ✅ Móvil (Android, iOS)
- ✅ Tablet

### Resoluciones probadas
- 📱 Móvil: 375x667 hasta 414x896
- 💻 Tablet: 768x1024 hasta 1024x1366
- 🖥️ Escritorio: 1280x720 hasta 1920x1080+

## 🔧 Configuración avanzada

### Configuraciones de cámara
```javascript
// En assets/app.js puedes modificar:
var constraints = {
    video: {
        facingMode: "user",           // "user" o "environment"
        width: { ideal: 1920 },       // Ancho ideal
        height: { ideal: 1080 },      // Alto ideal
        frameRate: { ideal: 30 },     // FPS ideales
        imageStabilization: true      // Estabilización
    }
};
```

### Personalización de Discord
```javascript
// Modificar el mensaje en uploadToDiscord():
let content = `📸 **Nueva foto capturada**\n⏰ ${timestamp}`;
// Agregar más información, emojis, etc.
```

## 🛡️ Seguridad y privacidad

- **Datos locales**: La configuración se guarda solo en tu navegador
- **Sin servidor**: No hay backend que procese tus datos
- **Webhook privado**: La URL solo se almacena localmente
- **Sin tracking**: No hay análitics ni seguimiento
- **Código abierto**: Puedes revisar todo el código fuente

## 📱 Instalar como PWA

### En móvil (Android/iOS):
1. Abre la aplicación en tu navegador
2. Busca "Agregar a pantalla de inicio" en el menú
3. Confirma la instalación
4. ¡La aplicación aparecerá como una app nativa!

### En escritorio (Chrome/Edge):
1. Busca el ícono de instalación en la barra de direcciones
2. Haz clic en "Instalar"
3. La aplicación se abrirá en su propia ventana

## 🔍 Solución de problemas

### La cámara no funciona
- ✅ Verifica los permisos del navegador
- ✅ Cierra otras aplicaciones que usen la cámara
- ✅ Recarga la página
- ✅ Usa HTTPS (requerido para cámara)

### Las fotos no se suben a Discord
- ✅ Verifica que la URL del webhook sea correcta
- ✅ Comprueba tu conexión a internet
- ✅ Asegúrate de que el webhook no haya sido eliminado
- ✅ Verifica que el bot tenga permisos en el canal

### La aplicación es lenta
- ✅ Usa un navegador actualizado
- ✅ Cierra otras pestañas pesadas
- ✅ Reduce la resolución de la cámara si es necesario

## 🎯 Próximas características

- [ ] Soporte para múltiples webhooks
- [ ] Filtros y efectos para fotos
- [ ] Historial de fotos subidas
- [ ] Configuración de calidad de imagen
- [ ] Modo ráfaga (varias fotos)
- [ ] Temporizador para fotos
- [ ] Grabación de video corto

## 🤝 Contribuir

Este es un proyecto standalone, pero las mejoras son bienvenidas:

1. Haz un fork del proyecto
2. Crea una rama para tu característica (`git checkout -b feature/AmazingFeature`)
3. Haz commit de tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Haz push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la Licencia MIT.

## 🙏 Agradecimientos

- **SweetAlert2** - Para los modales elegantes
- **Inter Font** - Por la tipografía moderna
- **Discord** - Por la API de webhooks
- **MDN Web Docs** - Por la documentación de MediaDevices

---

**Versión**: 1.0.0  
**Última actualización**: Octubre 2025  
**Autor**: MaguMboi  

¿Preguntas o problemas? Crea un issue en el repositorio. ¡Gracias por usar Cámara Discord Standalone! 📸✨