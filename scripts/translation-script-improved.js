const fs = require("fs");
const inquirer = require("inquirer");
const translate = require("translate");

const TRANSLATION_FOLDER = `${__dirname}/../src/translations`;

const LANGUAGES = { EN: "en", ES: "es", PT: "pt", NL: "nl" };

const SUPPORTED_LANGUAGES = [
    LANGUAGES.EN,
    LANGUAGES.ES,
    LANGUAGES.PT,
    LANGUAGES.NL,
];

const LANGUAGE_DESCRIPTION = {
    [LANGUAGES.EN]: "English",
    [LANGUAGES.ES]: "Spanish",
    [LANGUAGES.PT]: "Portuguese",
    [LANGUAGES.NL]: "Dutch",
};

const readJSON = (filePath) => {
    try {
        return JSON.parse(fs.readFileSync(filePath, "utf8"));
    } catch (error) {
        console.error(`❌ Error al leer el archivo JSON: ${filePath}`);
        return {};
    }
};

const writeJSON = (filePath, data) => {
    const sortedJson = Object.keys(data)
        .sort()
        .reduce((acc, key) => {
            acc[key] = data[key];
            return acc;
        }, {});
    fs.writeFileSync(filePath, JSON.stringify(sortedJson, null, 2));
};

// Configuración de LibreTranslate
const LIBRE_TRANSLATE_CONFIG = {
    enabled: true, // Habilitado automáticamente
    url: "https://lt.vern.cc/translate", // URL de tu servidor LibreTranslate
};

// Configurar el motor de traducción
if (LIBRE_TRANSLATE_CONFIG.enabled) {
    translate.engine = "libre";
    translate.url = LIBRE_TRANSLATE_CONFIG.url;
} else {
    // Fallback a traducción manual si LibreTranslate no está disponible
    console.warn("⚠️  LibreTranslate no está habilitado. Usando modo manual.");
}

const [, , operationFromArgs, ...paramsFromArgs] = process.argv;

const verifyTranslations = (files) => {
    if (!Array.isArray(files) || files.length === 0) {
        return [];
    }
    // Parse the JSON files and extract their keys
    const parsedFiles = files.map(readJSON);
    // Track keys for each file
    const fileKeys = parsedFiles.map((file) => new Set(Object.keys(file)));
    // Get all unique keys across files
    const allKeys = Array.from(new Set(parsedFiles.flatMap(Object.keys)));
    // Filter keys that are not present in all files
    const differentKeys = allKeys.filter((key) => {
        return fileKeys.some((keys) => !keys.has(key));
    });
    return differentKeys;
};

const deleteKeyInJSON = (fileName, key) => {
    const file = readJSON(fileName);
    delete file[key];
    writeJSON(fileName, file);
};

const updateKeyInJSON = (fileName, key, value) => {
    const file = readJSON(fileName);
    file[key] = value;
    writeJSON(fileName, file);
};

const readKeyInJSON = (fileName, key) => {
    const file = readJSON(fileName);
    return file[key];
};

const getMessageForInputKey = (lng, key) => {
    const output = [`${LANGUAGE_DESCRIPTION[lng]} translation?`];
    const fileName = `${TRANSLATION_FOLDER}/${lng}.json`;
    const existingLabel = readKeyInJSON(fileName, key);
    if (existingLabel) {
        output.push(`(${existingLabel})`);
    }
    return output.join(" ");
};

const detectLanguage = async (text) => {
    try {
        const fetch = require("node-fetch");
        const response = await fetch(
            `${LIBRE_TRANSLATE_CONFIG.url.replace(/\/translate$/, "")}/detect`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ q: text }),
            }
        );
        const result = await response.json();
        return result?.[0]?.language || "es";
    } catch (error) {
        console.error("❌ Error al detectar el idioma:", error.message);
        return "es"; // fallback
    }
};

// Función para traducir automáticamente usando IA
const autoTranslateFromDetectedLang = async (inputText) => {
    if (!LIBRE_TRANSLATE_CONFIG.enabled) {
        console.log(
            "⚠️  Traducción automática no disponible. LibreTranslate no está configurado."
        );
        return null;
    }

    try {
        console.log("🌍 Detectando idioma...");
        const detectedLang = await detectLanguage(inputText);
        console.log(`🕵️  Idioma detectado: ${detectedLang}`);

        const translations = {};

        for (const targetLang of SUPPORTED_LANGUAGES) {
            if (targetLang === detectedLang) {
                translations[targetLang] = inputText;
            } else {
                console.log(
                    `   📝 Traduciendo a ${LANGUAGE_DESCRIPTION[targetLang]}...`
                );
                translations[targetLang] = await translate(inputText, {
                    from: detectedLang,
                    to: targetLang,
                });
            }
        }

        console.log("✅ Traducción automática completada!");
        return translations;
    } catch (error) {
        console.error("❌ Error en traducción automática:", error.message);
        console.log("🔄 Fallback a modo manual.");
        return null;
    }
};

// Función para verificar si LibreTranslate está disponible (sin mostrar errores)
const checkLibreTranslateAvailable = async () => {
    if (!LIBRE_TRANSLATE_CONFIG.enabled) return false;

    try {
        // Intentar cargar node-fetch
        let fetch;
        try {
            fetch = require("node-fetch");
        } catch (error) {
            // node-fetch no está disponible
            return false;
        }

        const response = await fetch("http://localhost:5000/health", {
            timeout: 3000,
        });
        return response.ok;
    } catch (error) {
        return false;
    }
};

// Función para confirmar/editar traducciones automáticas
const confirmTranslations = async (key, baseText, autoTranslations) => {
    const prompt = inquirer.createPromptModule();

    if (autoTranslations) {
        console.log("\n📋 Traducciones generadas automáticamente por IA:");
        SUPPORTED_LANGUAGES.forEach((lng) => {
            console.log(`${lng.toUpperCase()}: ${autoTranslations[lng]}`);
        });
    } else {
        console.log("\n❌ La traducción automática no funcionó. Modo manual:");
        console.log(`🌐 Texto base: ${baseText}`);
    }

    const answers = await prompt([
        {
            type: "confirm",
            name: "useAutoTranslations",
            message: "¿Usar estas traducciones automáticas?",
            default: true,
            when: () => autoTranslations !== null,
        },
        {
            type: "input",
            name: "en",
            message: ({ key }) => getMessageForInputKey(LANGUAGES.EN, key),
            default: autoTranslations?.en || "",
            when: (answers) =>
                !answers.useAutoTranslations || autoTranslations === null,
        },
        {
            type: "input",
            name: "pt",
            message: ({ key }) => getMessageForInputKey(LANGUAGES.PT, key),
            default: autoTranslations?.pt || "",
            when: (answers) =>
                !answers.useAutoTranslations || autoTranslations === null,
        },
        {
            type: "input",
            name: "nl",
            message: ({ key }) => getMessageForInputKey(LANGUAGES.NL, key),
            default: autoTranslations?.nl || "",
            when: (answers) =>
                !answers.useAutoTranslations || autoTranslations === null,
        },
    ]);

    if (answers.useAutoTranslations && autoTranslations) {
        return autoTranslations;
    } else {
        return {
            en: answers.en,
            es: answers.es,
            pt: answers.pt,
            nl: answers.nl,
        };
    }
};

if (operationFromArgs) {
    // verify the parameters
    if (operationFromArgs === "create or update") {
        if (paramsFromArgs.length < 2) {
            console.error("❌ La cantidad de parámetros es incorrecta.");
            console.log("\n📖 Uso correcto:");
            console.log(
                '🤖 Modo automático (IA): yarn translation "create or update" keyName "textInSpanish"'
            );
            console.log(
                '✋ Modo manual: yarn translation "create or update" keyName english spanish portuguese dutch'
            );
            console.log(
                "\n💡 O ejecuta sin parámetros para modo interactivo: yarn translation"
            );
            return;
        }
    }
    if (operationFromArgs === "read" && paramsFromArgs.length !== 1) {
        console.error("❌ La cantidad de parámetros es incorrecta.");
        console.error('📖 Uso: yarn translation "read" keyName');
        return;
    }
    if (operationFromArgs === "remove" && paramsFromArgs.length !== 1) {
        console.error("❌ La cantidad de parámetros es incorrecta.");
        console.error('📖 Uso: yarn translation "remove" keyName');
        return;
    }
    if (operationFromArgs === "verify" && paramsFromArgs.length !== 0) {
        console.error("❌ La cantidad de parámetros es incorrecta.");
        console.error('📖 Uso: yarn translation "verify"');
        return;
    }
}

// Función para determinar el modo predeterminado
const getDefaultTranslationMode = async () => {
    if (!LIBRE_TRANSLATE_CONFIG.enabled) return "manual";

    const isAvailable = await checkLibreTranslateAvailable();
    return isAvailable ? "auto" : "manual";
};

const prompt = inquirer.createPromptModule();

// Obtener modo predeterminado antes de mostrar prompts
const runInteractiveMode = async () => {
    const defaultMode = await getDefaultTranslationMode();

    if (!LIBRE_TRANSLATE_CONFIG.enabled || defaultMode === "manual") {
        console.log("ℹ️  LibreTranslate no detectado. Modo manual disponible.");
    } else {
        console.log("✅ LibreTranslate detectado. Modo automático disponible.");
    }

    return prompt([
        {
            type: "list",
            name: "operation",
            message: "¿Qué operación quieres realizar?",
            choices: ["Create or Update", "Read", "Remove", "Verify"],
            default: "Verify",
            filter(val) {
                return val.toLowerCase();
            },
            when: () => !operationFromArgs,
        },
        {
            type: "input",
            name: "key",
            message: "¿Cuál es la clave?",
            when: (answers) =>
                ["create or update", "read", "remove"].includes(
                    answers.operation
                ),
        },
        // NUEVA OPCIÓN: Elegir modo automático o manual para create/update
        {
            type: "list",
            name: "translationMode",
            message: "¿Cómo quieres crear las traducciones?",
            choices: [
                {
                    name: "🤖 Automático con IA (detecta idioma y traduce el resto)",
                    value: "auto",
                    short: "Automático",
                },
                {
                    name: "✋ Manual (introducir cada idioma manualmente)",
                    value: "manual",
                    short: "Manual",
                },
            ],
            default: defaultMode,
            when: (answers) =>
                ["create or update", "create"].includes(answers.operation),
        },
        // Para modo automático - Detectar idioma y pedir texto base
        {
            type: "input",
            name: "baseText",
            message:
                "🌐 Ingresá el texto base (se detectará el idioma automáticamente):",
            when: (answers) =>
                ["create or update", "create"].includes(answers.operation) &&
                answers.translationMode === "auto",
        },
        // Para modo manual - Pedir todos los idiomas como antes
        {
            type: "input",
            name: "en",
            message: ({ key }) => getMessageForInputKey(LANGUAGES.EN, key),
            when: (answers) =>
                ["create or update", "create"].includes(answers.operation) &&
                answers.translationMode === "manual",
        },
        {
            type: "input",
            name: "es",
            message: ({ key }) => getMessageForInputKey(LANGUAGES.ES, key),
            when: (answers) =>
                ["create or update", "create"].includes(answers.operation) &&
                answers.translationMode === "manual",
        },
        {
            type: "input",
            name: "pt",
            message: ({ key }) => getMessageForInputKey(LANGUAGES.PT, key),
            when: (answers) =>
                ["create or update", "create"].includes(answers.operation) &&
                answers.translationMode === "manual",
        },
        {
            type: "input",
            name: "nl",
            message: ({ key }) => getMessageForInputKey(LANGUAGES.NL, key),
            when: (answers) =>
                ["create or update", "create"].includes(answers.operation) &&
                answers.translationMode === "manual",
        },
    ])
        .then(async (answers) => {
            const operation = answers.operation || operationFromArgs;

            if (["create or update", "read", "remove"].includes(operation)) {
                const key = answers.key || paramsFromArgs[0];
                if (!key) {
                    console.error(
                        "❌ Debes ingresar una clave de traducción válida."
                    );
                    return;
                }

                if (operation === "create or update") {
                    const translationMode =
                        answers.translationMode ||
                        (paramsFromArgs.length >= 2 ? "auto" : "manual");

                    if (translationMode === "auto") {
                        // MODO AUTOMÁTICO con IA
                        const baseText = answers.baseText || paramsFromArgs[1];

                        if (!baseText) {
                            console.error(
                                "❌ Debes proporcionar un texto base para traducir."
                            );
                            return;
                        }

                        console.log(
                            `🤖 Modo automático seleccionado para "${key}"`
                        );

                        // Intentar traducción automática
                        const autoTranslations =
                            await autoTranslateFromDetectedLang(baseText);

                        // Confirmar/editar traducciones
                        const finalTranslations = await confirmTranslations(
                            key,
                            baseText,
                            autoTranslations
                        );

                        // Guardar todas las traducciones
                        SUPPORTED_LANGUAGES.forEach((lng) => {
                            const fileName = `${TRANSLATION_FOLDER}/${lng}.json`;
                            const newLabel = finalTranslations[lng];
                            updateKeyInJSON(fileName, key, newLabel);
                        });

                        console.log(
                            `✅ Traducciones automáticas guardadas exitosamente para la clave "${key}"`
                        );
                    } else {
                        // MODO MANUAL (como el script original)
                        console.log(
                            `✋ Modo manual seleccionado para "${key}"`
                        );

                        SUPPORTED_LANGUAGES.forEach((lng) => {
                            const fileName = `${TRANSLATION_FOLDER}/${lng}.json`;
                            const existingLabel = readKeyInJSON(fileName, key);

                            // Usar respuesta del usuario o parámetro de línea de comandos o valor existente
                            const newLabel =
                                answers[lng] ||
                                paramsFromArgs[
                                    SUPPORTED_LANGUAGES.indexOf(lng) + 1
                                ] ||
                                existingLabel;

                            if (newLabel) {
                                updateKeyInJSON(fileName, key, newLabel);
                            }
                        });

                        console.log(
                            `✅ Traducciones manuales guardadas exitosamente para la clave "${key}"`
                        );
                    }
                } else {
                    // Operaciones read y remove (sin cambios)
                    SUPPORTED_LANGUAGES.map((lng) => {
                        const fileName = `${TRANSLATION_FOLDER}/${lng}.json`;
                        const label = readKeyInJSON(fileName, key);
                        if (operation === "read") {
                            console.info(`${lng}: ${label}`);
                        } else if (operation === "remove") {
                            if (!label) {
                                console.error(
                                    `La clave "${key}" no fue encontrada para el idioma "${lng}"`
                                );
                            } else {
                                deleteKeyInJSON(fileName, key);
                                console.warn(
                                    `La clave "${key}" fue eliminada exitosamente para "${lng}"`
                                );
                            }
                        }
                    });
                }
            }

            if (operation === "verify") {
                if (process.env.CI) {
                    const output = verifyTranslations(
                        SUPPORTED_LANGUAGES.map(
                            (lng) => `${TRANSLATION_FOLDER}/${lng}.json`
                        )
                    );
                    if (output.length) {
                        console.error(
                            `❌ Las siguientes claves no están presentes en todos los idiomas: ${output.join(
                                ", "
                            )}`
                        );
                        process.exit(1);
                    } else {
                        console.log(
                            "✅ ¡Todos los archivos de traducciones están alineados!"
                        );
                    }
                } else {
                    await runVerifyWithPrompt();
                }
            }
        })
        .catch((error) => {
            if (error.isTtyError) {
                console.error(
                    "No se pudo renderizar el prompt en el entorno actual"
                );
            } else {
                console.log("Algo salió mal", error);
            }
        });
};

// Función para procesar argumentos de línea de comandos
const processCommandLineArgs = async () => {
    const operation = operationFromArgs;
    const key = paramsFromArgs[0];

    if (["create or update", "read", "remove"].includes(operation)) {
        if (operation === "create or update") {
            const baseText = paramsFromArgs[1];

            if (!baseText) {
                console.error(
                    "❌ Debes proporcionar un texto base para traducir"
                );
                return;
            }

            // Detectar modo automático vs manual por cantidad de parámetros
            const isAutoMode = paramsFromArgs.length === 2;

            if (isAutoMode) {
                console.log(
                    `🤖 Modo automático (línea de comandos) para "${key}"`
                );

                // Intentar traducción automática
                const autoTranslations = await autoTranslateFromDetectedLang(
                    baseText
                );

                if (autoTranslations) {
                    console.log("\n📋 Traducciones generadas automáticamente:");
                    SUPPORTED_LANGUAGES.forEach((lng) => {
                        console.log(
                            `${lng.toUpperCase()}: ${autoTranslations[lng]}`
                        );
                    });

                    // Guardar todas las traducciones
                    SUPPORTED_LANGUAGES.forEach((lng) => {
                        const fileName = `${TRANSLATION_FOLDER}/${lng}.json`;
                        updateKeyInJSON(fileName, key, autoTranslations[lng]);
                    });

                    console.log(
                        `✅ Traducciones automáticas guardadas exitosamente para la clave "${key}"`
                    );
                } else {
                    console.error(
                        "❌ La traducción automática falló. Usa modo manual o interactivo."
                    );
                }
            } else {
                // Modo manual con línea de comandos
                console.log(`✋ Modo manual (línea de comandos) para "${key}"`);

                SUPPORTED_LANGUAGES.forEach((lng) => {
                    const fileName = `${TRANSLATION_FOLDER}/${lng}.json`;
                    const existingLabel = readKeyInJSON(fileName, key);

                    const newLabel =
                        paramsFromArgs[SUPPORTED_LANGUAGES.indexOf(lng) + 1] ||
                        existingLabel;

                    if (newLabel) {
                        updateKeyInJSON(fileName, key, newLabel);
                    }
                });

                console.log(
                    `✅ Traducciones manuales guardadas exitosamente para la clave "${key}"`
                );
            }
        } else {
            // Operaciones read y remove (sin cambios)
            SUPPORTED_LANGUAGES.map((lng) => {
                const fileName = `${TRANSLATION_FOLDER}/${lng}.json`;
                const label = readKeyInJSON(fileName, key);
                if (operation === "read") {
                    console.info(`${lng}: ${label}`);
                } else if (operation === "remove") {
                    if (!label) {
                        console.error(
                            `La clave "${key}" no fue encontrada para el idioma "${lng}"`
                        );
                    } else {
                        deleteKeyInJSON(fileName, key);
                        console.warn(
                            `La clave "${key}" fue eliminada exitosamente para "${lng}"`
                        );
                    }
                }
            });
        }
    }

    if (operation === "verify") {
        if (process.env.CI) {
            const output = verifyTranslations(
                SUPPORTED_LANGUAGES.map(
                    (lng) => `${TRANSLATION_FOLDER}/${lng}.json`
                )
            );
            if (output.length) {
                console.error(
                    `❌ Las siguientes claves no están presentes en todos los idiomas: ${output.join(
                        ", "
                    )}`
                );
                process.exit(1);
            } else {
                console.log(
                    "✅ ¡Todos los archivos de traducciones están alineados!"
                );
            }
        } else {
            await runVerifyWithPrompt();
        }
    }
};

// Ejecutar según el modo
if (operationFromArgs) {
    processCommandLineArgs();
} else {
    runInteractiveMode();
}

const promptSyncOption = async () => {
    const { syncMode } = await inquirer.prompt([
        {
            type: "list",
            name: "syncMode",
            message: "Desincronización detectada. ¿Qué querés hacer?",
            choices: [
                { name: "Sincronizar automáticamente", value: "auto" },
                { name: "Sincronizar manualmente", value: "manual" },
                { name: "No hacer nada", value: "none" },
            ],
        },
    ]);
    return syncMode;
};

const syncMissingKeys = async (differences, syncMode) => {
    const getSourceText = (key) => {
        for (const lng of SUPPORTED_LANGUAGES) {
            const filePath = `${TRANSLATION_FOLDER}/${lng}.json`;
            const data = readJSON(filePath);
            if (data[key]) return { text: data[key], sourceLang: lng };
        }
        return null;
    };

    for (const { key, missingIn } of differences) {
        const source = getSourceText(key);

        if (!source) {
            console.warn(
                `❌ No se encontró texto base para la clave "${key}" en ningún idioma.`
            );
            continue;
        }

        const { text: baseText, sourceLang } = source;

        for (const lng of missingIn) {
            const fileName = `${TRANSLATION_FOLDER}/${lng}.json`;
            let value;

            if (syncMode === "auto") {
                try {
                    value = await translate(baseText, {
                        from: sourceLang,
                        to: lng,
                    });
                } catch (err) {
                    console.error(
                        `❌ Error al traducir automáticamente "${key}" desde ${sourceLang} a ${lng}:`,
                        err.message
                    );
                    continue;
                }
            } else if (syncMode === "manual") {
                const { userInput } = await inquirer.prompt([
                    {
                        type: "input",
                        name: "userInput",
                        message: `Traducción para "${key}" en ${lng} (desde ${sourceLang.toUpperCase()}: "${baseText}")`,
                    },
                ]);
                value = userInput;
            }

            if (value) {
                const file = readJSON(fileName);
                file[key] = value;
                writeJSON(fileName, file);
                console.log(`✅ Clave "${key}" sincronizada en ${lng}`);
            }
        }
    }
};

const runVerifyWithPrompt = async () => {
    const fs = require("fs");
    const files = SUPPORTED_LANGUAGES.map((lng) => ({
        lng,
        path: `${TRANSLATION_FOLDER}/${lng}.json`,
        data: require(`${TRANSLATION_FOLDER}/${lng}.json`),
    }));

    const allKeys = Array.from(
        new Set(files.flatMap((f) => Object.keys(f.data)))
    );

    const differences = [];

    for (const key of allKeys) {
        const missingIn = files
            .filter((f) => !(key in f.data))
            .map((f) => f.lng);
        if (missingIn.length) differences.push({ key, missingIn });
    }

    if (differences.length === 0) {
        console.log("✅ Todo está sincronizado.");
        return;
    }

    console.log("🔍 Claves desincronizadas encontradas:");
    differences.forEach(({ key, missingIn }) =>
        console.log(`- "${key}" falta en: ${missingIn.join(", ")}`)
    );

    const syncMode = await promptSyncOption();
    if (syncMode !== "none") {
        await syncMissingKeys(differences, syncMode);
    }
};
