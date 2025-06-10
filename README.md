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

# 2. Iniciar LibreTranslate
docker-compose up -d

# 3. Configurar y probar
node setup-and-test.js

# 4. ¡Usar!
yarn translation
```

## 📸 Demo

### Antes (Manual)
```
? ¿Qué operación quieres realizar? Create or Update
? ¿Cuál es la clave? welcome_message
? English translation? Welcome to our application
? Spanish translation? Bienvenido a nuestra aplicación  
? Portuguese translation? Bem-vindo à nossa aplicação
? Dutch translation? Welkom bij onze applicatie
```

### Después (Con IA)
```
? ¿Qué operación quieres realizar? Create or Update
? ¿Cuál es la clave? welcome_message
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

- ✅ **Traducción automática** con LibreTranslate
- ✅ **Modo fallback** si la IA no está disponible  
- ✅ **Revisión de traducciones** antes de guardar
- ✅ **Configuración automática** con scripts incluidos
- ✅ **Docker setup** listo para usar
- ✅ **Compatibilidad** con script original
- ✅ **Interfaz en español** mejorada

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
