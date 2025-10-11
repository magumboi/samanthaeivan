# 📸 Cámara Discord Standalone

Una aplicación web completamente standalone que permite capturar fotos desde la cámara web y subirlas directamente a Discord mediante webhooks. **No requiere servidor backend.**

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![PWA Ready](https://img.shields.io/badge/PWA-Ready-orange)
![No Backend](https://img.shields.io/badge/backend-none-red)

## 🚀 Inicio rápido

1. **Descargar** o clonar esta carpeta
2. **Abrir** `index.html` en tu navegador
3. **Configurar** el webhook de Discord (⚙️)
4. **¡Tomar fotos!** 📸

## ✨ Características principales

- 📷 **Captura HD** - Fotos de alta calidad (hasta 1920x1080)
- 🔄 **Cámara dual** - Frontal y trasera en dispositivos compatibles
- 📤 **Subida directa** - Sin servidor, directo a Discord
- 💾 **Sin base de datos** - Configuración local en el navegador
- 📱 **Responsive** - Funciona en móvil, tablet y escritorio
- 🔒 **Privado** - No hay tracking ni análisis
- ⚡ **PWA Ready** - Instalable como aplicación nativa

## 📁 Estructura del proyecto

```
standalone-discord-camera/
├── 📄 index.html              # Página principal
├── 📄 manifest.json           # Manifiesto PWA  
├── 📄 sw.js                   # Service Worker
├── 📂 assets/
│   ├── 🎨 style.css          # Estilos CSS
│   └── ⚙️ app.js             # Lógica JavaScript
└── 📂 docs/
    ├── 📖 README.md           # Documentación completa
    ├── ⚙️ SETUP.md            # Guía de configuración
    └── 🔧 TROUBLESHOOTING.md  # Solución de problemas
```

## 🛠️ Configuración rápida

### 1. Crear webhook de Discord
```
Discord → Canal → Configuración → Integraciones → Webhooks → Crear
```

### 2. Configurar la aplicación
```
Abrir app → ⚙️ → Pegar URL del webhook → Guardar
```

### 3. ¡Usar!
```
Tomar foto → Confirmar → Se sube automáticamente a Discord
```

## 🌐 Compatibilidad

### Navegadores soportados
| Navegador | Versión mínima | Estado |
|-----------|----------------|--------|
| Chrome    | 88+           | ✅ Recomendado |
| Firefox   | 85+           | ✅ Compatible |  
| Safari    | 14+           | ✅ Compatible |
| Edge      | 88+           | ✅ Compatible |

### Sistemas operativos
- ✅ Windows 10/11
- ✅ macOS 10.15+
- ✅ Ubuntu 20.04+
- ✅ Android 8+
- ✅ iOS 14.3+

## 🎯 Casos de uso

### 🏢 Empresarial
- Cámara de seguridad remota
- Reportes visuales automáticos  
- Documentación de procesos
- Control de calidad

### 🏠 Personal
- Fotos familiares instantáneas
- Backup automático de momentos
- Compartir con amigos rápidamente
- Diario visual

### 🎮 Gaming/Streaming
- Screenshots de gameplay
- Reacciones en vivo
- Documentar bugs/glitches
- Compartir logros

## ⚡ Atajos de teclado

| Tecla | Acción |
|-------|--------|
| `Espacio` | Tomar foto |
| `Enter` | Tomar foto |
| `C` | Cambiar cámara |
| `S` | Configuración |
| `Escape` | Cerrar modal |

## 🔧 Personalización

### Cambiar mensaje de Discord
Edita `assets/app.js`:
```javascript
let content = `📸 **Tu mensaje personalizado**\n⏰ ${timestamp}`;
```

### Ajustar calidad de imagen
```javascript
// Cambiar de 0.95 (alta) a 0.8 (media) para archivos menores
const imageDataUrl = cameraSensor.toDataURL("image/jpeg", 0.8);
```

### Modificar resolución
```javascript
var constraints = {
    video: {
        width: { ideal: 1280 },   // Cambiar según necesidad
        height: { ideal: 720 }    // 720p, 1080p, etc.
    }
};
```

## 🛡️ Seguridad y privacidad

- 🔒 **Datos locales** - Configuración solo en tu navegador
- 🚫 **Sin tracking** - No hay análisis ni métricas
- 🔐 **Webhook privado** - URL guardada localmente  
- 📝 **Código abierto** - Puedes auditar todo el código
- 🌐 **Sin servidor** - No procesamos tus datos

## 📊 Rendimiento

### Uso de recursos típico
- **RAM**: ~50MB (depende del navegador)
- **CPU**: ~5-10% durante captura
- **Ancho de banda**: ~500KB-2MB por foto
- **Almacenamiento**: ~5KB (configuración)

### Optimizaciones incluidas
- ✅ Lazy loading de dependencias
- ✅ Compresión de imágenes
- ✅ Service Worker para cache
- ✅ Cleanup automático de memoria

## 📚 Documentación completa

Para información detallada, consulta:

- 📖 **[README completo](docs/README.md)** - Documentación exhaustiva
- ⚙️ **[Guía de configuración](docs/SETUP.md)** - Configuración paso a paso  
- 🔧 **[Solución de problemas](docs/TROUBLESHOOTING.md)** - Resolver errores comunes

## 🆕 Próximas características

- [ ] 📹 Grabación de video corto (GIF)
- [ ] 🎨 Filtros y efectos en tiempo real
- [ ] ⏰ Temporizador automático
- [ ] 📊 Múltiples webhooks de respaldo
- [ ] 🔄 Sincronización entre dispositivos
- [ ] 📱 Notificaciones push

## 🤝 Contribuir

¡Las contribuciones son bienvenidas!

1. Fork del repositorio
2. Crear rama: `git checkout -b feature/nueva-caracteristica`
3. Commit: `git commit -m 'Agregar nueva característica'`
4. Push: `git push origin feature/nueva-caracteristica`
5. Abrir Pull Request

### Áreas donde puedes ayudar
- 🐛 Reportar/arreglar bugs
- ✨ Agregar nuevas características  
- 📝 Mejorar documentación
- 🌍 Traducciones
- 🎨 Mejorar diseño/UX

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver [LICENSE](../LICENSE) para detalles.

## 🙏 Agradecimientos

- **[SweetAlert2](https://sweetalert2.github.io/)** - Modales elegantes
- **[Inter Font](https://rsms.me/inter/)** - Tipografía moderna
- **[Discord](https://discord.com/)** - API de webhooks
- **[MDN Web Docs](https://developer.mozilla.org/)** - Documentación de APIs web

## 📞 Soporte

- 🐛 **Issues**: [Reportar problema](https://github.com/magumboi/camera-to-gdrive-service/issues)
- 📧 **Email**: Para consultas privadas
- 💬 **Discord**: Únete a nuestro servidor de soporte

---

**Versión**: 1.0.0 | **Autor**: [MaguMboi](https://github.com/magumboi) | **Última actualización**: Octubre 2025

¿Te gusta el proyecto? ¡Dale una ⭐ en GitHub! ✨