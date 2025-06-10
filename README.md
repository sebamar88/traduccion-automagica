# 🚀 Script de Traducciones Mejorado con IA

> Automatiza tus traducciones usando IA de código abierto. Solo escribe en español, la IA traduce al resto.

## 🎯 ¿Qué hace?

Transforma tu script de traducciones manual en un sistema automatizado que:

- 🤖 **Traduce automáticamente** desde español a inglés, portugués y holandés
- ✅ **Te permite revisar** y editar las traducciones antes de guardar
- 🔄 **Funciona offline** usando LibreTranslate local
- 💰 **100% gratuito** y de código abierto
- 🛡️ **Privado** - tus datos no salen de tu máquina

## ⚡ Quick Start

```bash
# 1. Instalar dependencias
npm install

# 2. Iniciar LibreTranslate (opcional - para modo automático)
docker-compose up -d

# 3. Configurar y probar (opcional)
npm run test

# 4. ¡Usar! (Elige automático o manual)
npm run translate

# 5. Crear ejemplos (opcional)
npm run example-setup && npm run example-run
```

## 📸 Demo

### Antes (Manual Forzado)
```
? ¿Qué operación quieres realizar? Create or Update
? ¿Cuál es la clave? welcome_message
? English translation? Welcome to our application
? Spanish translation? Bienvenido a nuestra aplicación  
? Portuguese translation? Bem-vindo à nossa aplicação
? Dutch translation? Welkom bij onze applicatie
```

### Ahora (Eliges el Modo)
```
✅ LibreTranslate detectado. Modo automático disponible.

? ¿Qué operación quieres realizar? Create or Update
? ¿Cuál es la clave? welcome_message
? ¿Cómo quieres crear las traducciones?
  🤖 Automático con IA (solo español → IA traduce el resto)
  ✋ Manual (introducir cada idioma manualmente)

# Si eliges Automático:
? 🇪🇸 Texto en español: Bienvenido a nuestra aplicación

🤖 Traduciendo automáticamente...
✅ Traducción automática completada!

📋 Traducciones generadas:
🇪🇸 ES: Bienvenido a nuestra aplicación
🇺🇸 EN: Welcome to our application
🇧🇷 PT: Bem-vindo à nossa aplicação
🇳🇱 NL: Welkom bij onze applicatie

? ¿Usar estas traducciones automáticas? Yes
✅ Traducciones guardadas exitosamente!
```

## 📁 Archivos Incluidos

```
├── translation-script-improved.js  # Script principal mejorado
├── setup-and-test.js              # Configuración automática
├── docker-compose.yml             # LibreTranslate setup
├── package.json                   # Dependencias
└── README.md                      # Esta guía
```

## 🔧 Características

- ⚡ **Selección de modo**: Elige automático o manual al inicio
- 🤖 **Traducción automática** con LibreTranslate (IA de código abierto)
- ✋ **Modo manual** mejorado para control total
- 🔄 **Detección automática** de LibreTranslate disponible
- ✅ **Revisión de traducciones** antes de guardar (modo automático)
- 📱 **Línea de comandos inteligente**: 2 parámetros = auto, 5 = manual
- 🐳 **Docker setup** listo para usar
- ✅ **Compatibilidad** completa con script original
- 🎯 **Interfaz en español** con emojis y mensajes claros

## 📚 Documentación Completa

Ve a [`docs/guia_uso_script_mejorado.md`](../docs/guia_uso_script_mejorado.md) para:

- 📖 Guía paso a paso
- 🔧 Configuración avanzada
- 🚨 Solución de problemas
- 💡 Mejores prácticas

## 🏗️ Tecnologías

- **Node.js** + **Inquirer** - Interfaz de usuario
- **LibreTranslate** - IA de traducción de código abierto
- **Docker** - Deployment fácil
- **Translate npm** - Cliente para LibreTranslate

## 🤝 Contribuir

¿Ideas para mejorar? ¡Perfecto!

- 🐛 Reporta bugs
- 💡 Sugiere características
- 🔧 Envía pull requests
- 📖 Mejora documentación

## 📄 Licencia

MIT - Úsalo libremente en tus proyectos.

---

*¿Preguntas? Revisa la [documentación completa](../docs/guia_uso_script_mejorado.md) o ejecuta `node setup-and-test.js` para diagnósticos.*
