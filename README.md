# 🚀 Script de Traducciones Mejorado con IA

> Automatiza tus traducciones usando IA de código abierto. Solo escribe en español, la IA traduce al resto.

## 🎯 ¿Qué hace?

Transforma tu script de traducciones manual en un sistema automatizado que:

-   🤖 **Traduce automáticamente** desde español a inglés, portugués y holandés
-   ✅ **Te permite revisar** y editar las traducciones antes de guardar
-   🔄 **Funciona offline** usando LibreTranslate local
-   💰 **100% gratuito** y de código abierto
-   🛡️ **Privado** - tus datos no salen de tu máquina

## ⚡ Quick Start

```bash
# 1. Instalar dependencias
npm install

# 2. ¡Usar! (Elige automático o manual)
npm run translate

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

-   ⚡ **Selección de modo**: Elige automático o manual al inicio
-   🤖 **Traducción automática** con LibreTranslate (IA de código abierto)
-   ✋ **Modo manual** mejorado para control total
-   🔄 **Detección automática** de LibreTranslate disponible
-   ✅ **Revisión de traducciones** antes de guardar (modo automático)
-   📱 **Línea de comandos inteligente**: 2 parámetros = auto, 5 = manual
-   🐳 **Docker setup** listo para usar
-   ✅ **Compatibilidad** completa con script original
-   🎯 **Interfaz en español** con emojis y mensajes claros

## 📚 Documentación Completa

Ve a [`docs/guia_uso_script_mejorado.md`](../docs/guia_uso_script_mejorado.md) para:

-   📖 Guía paso a paso
-   🔧 Configuración avanzada
-   🚨 Solución de problemas
-   💡 Mejores prácticas

## 🏗️ Tecnologías

-   **Node.js** + **Inquirer** - Interfaz de usuario
-   **LibreTranslate** - IA de traducción de código abierto
-   **Docker** - Deployment fácil
-   **Translate npm** - Cliente para LibreTranslate

## 🤝 Contribuir

¿Ideas para mejorar? ¡Perfecto!

-   🐛 Reporta bugs
-   💡 Sugiere características
-   🔧 Envía pull requests
-   📖 Mejora documentación

## 📄 Licencia

MIT - Úsalo libremente en tus proyectos.

---

_¿Preguntas? Revisa la [documentación completa](../docs/guia_uso_script_mejorado.md) o ejecuta `node setup-and-test.js` para diagnósticos._

## ⚙️ Cómo funciona `translation-script-improved.js`

Este script es el núcleo de la herramienta. Está pensado para trabajar con claves de traducción desde consola de forma interactiva y flexible.

### ✨ Características clave

-   🔍 **Detección automática de idioma**: Podés ingresar cualquier texto y la IA detecta el idioma de origen.
-   🧠 **Uso de IA local**: Se conecta con una instancia local de [LibreTranslate](https://github.com/LibreTranslate/LibreTranslate) para realizar las traducciones.
-   🗂️ **Sincronización de claves**: Detecta claves faltantes en los archivos de traducción (`en.json`, `pt.json`, etc.) y permite completarlas fácilmente.
-   🧪 **Modo verificación**: Verifica si hay inconsistencias o claves faltantes entre los distintos archivos de idiomas.
-   📦 **CRUD completo**: Podés crear, leer, actualizar y borrar traducciones desde un menú interactivo.
-   🧘 **Modo silencioso opcional**: Ideal para flujos automáticos o uso como parte de una CI.

### 🛠️ Uso del script

```bash
# Ejecuta el script principal
npm run translate
```

Una vez dentro, vas a ver un menú como este:

```
¿Qué operación quieres realizar?
❯ Create or Update
  Read
  Remove
  Verify
  Exit
```

### 📚 Ejemplos prácticos

-   **Crear una clave nueva**: Te pedirá un valor en español, detectará el idioma, traducirá automáticamente y te mostrará las opciones para editar si querés.
-   **Leer una clave existente**: Podés ver rápidamente cómo está esa key en los distintos idiomas.
-   **Verificar**: Te mostrará un resumen de todas las claves faltantes o inconsistentes.
-   **Eliminar**: Borra una clave de todos los archivos de traducción.
