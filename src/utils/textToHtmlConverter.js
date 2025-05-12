export const formatCode = (code) => {
    try {
        // First, check if the code is all in one line and needs splitting
        if (
            code.split("\n").length === 1 &&
            code.includes("{") &&
            code.includes("}")
        ) {
            // This appears to be code without line breaks - preprocess it
            code = preprocessCodeWithoutLinebreaks(code);
        }

        // Now proceed with normal formatting
        const lines = code.split("\n");
        const trimmedLines = lines.map((line) => line.trimStart());

        const indentSize = 4; // Default indentation size
        let formattedCode = "";
        let indentLevel = 0;

        for (const line of trimmedLines) {
            // Skip empty lines
            if (line.trim() === "") {
                formattedCode += "\n";
                continue;
            }

            const openingBraces = (line.match(/{|\(|\[/g) || []).length;
            const closingBraces = (line.match(/}|\)|\]/g) || []).length;

            // If line starts with closing brace, reduce indent before adding
            if (
                line.trim().startsWith("}") ||
                line.trim().startsWith(")") ||
                line.trim().startsWith("]")
            ) {
                indentLevel = Math.max(0, indentLevel - 1);
            }

            // Add the line with current indentation
            formattedCode +=
                " ".repeat(indentLevel * indentSize) + line.trim() + "\n";

            // Adjust indent level for next line
            indentLevel += openingBraces - closingBraces;
            indentLevel = Math.max(0, indentLevel);
        }

        return formattedCode.trim();
    } catch (error) {
        console.error("Error formatting code:", error);
        return code; // Return original if formatting fails
    }
};

// Function to preprocess code that lacks proper line breaks
export const preprocessCodeWithoutLinebreaks = (code, language) => {
    // Replace common line break indicators
    let processed = code;

    // Handle special case like #include
    processed = processed.replace(/#include/g, "\n#include");

    // Split after semicolons, open and close braces
    processed = processed.replace(/;(?!\s*$)/g, ";\n");
    processed = processed.replace(/{/g, "{\n");
    processed = processed.replace(/}/g, "\n}");

    // Handle function declarations - add line break after )
    processed = processed.replace(/\)(?=\s*{)/g, ")\n");

    // Handle control structures (if, for, while, etc.)
    const controlStructures = ["if", "for", "while", "switch", "else if"];
    controlStructures.forEach((structure) => {
        const regex = new RegExp(`${structure}\\s*\\(`, "g");
        processed = processed.replace(regex, `\n${structure} (`);
    });

    // Handle else without if
    processed = processed.replace(/else(?!\s*if)/g, "\nelse");

    // Handle return statements
    processed = processed.replace(/return\s/g, "\nreturn ");

    // Handle printf, scanf, etc.
    processed = processed.replace(/(printf|scanf|cout|cin)\s*\(/g, "\n$1(");

    // Remove extra blank lines
    processed = processed.replace(/\n+/g, "\n");
    processed = processed.trim();

    return processed;
};

export const generateHtml = (code, language) => {
    try {
        // Use syntax highlighter to get HTML
        const formattedCode = formatCode(code);

        // Escape HTML entities to prevent XSS and rendering issues
        const escapeHtml = (text) => {
            return text
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/"/g, "&quot;")
                .replace(/'/g, "&#039;");
        };

        // Add syntax highlighting with CSS classes
        // This is a simplified approach - in a production environment,
        // you would use a proper syntax highlighting library's output
        // let highlightedCode = escapeHtml(formattedCode);
        let highlightedCode = formattedCode;

        // Add syntax highlighting CSS classes based on language
        if (language === "cpp" || language === "c") {
            // Add basic highlighting for C/C++ keywords
            const keywords = [
                "int",
                "void",
                "return",
                "if",
                "else",
                "while",
                "for",
                "switch",
                "case",
                "break",
                "const",
                "static",
                "struct",
                "class",
                "public",
                "private",
                "protected",
                "include",
            ];
            keywords.forEach((keyword) => {
                const regex = new RegExp(`\\b${keyword}\\b`, "g");
                highlightedCode = highlightedCode.replace(
                    regex,
                    `<span class="hljs-keyword">${keyword}</span>`
                );
            });

            // Highlight function names
            highlightedCode = highlightedCode.replace(
                /(\w+)(?=\s*\()/g,
                '<span class="hljs-function">$1</span>'
            );

            // Highlight preprocessor directives
            highlightedCode = highlightedCode.replace(
                /(#\w+)/g,
                '<span class="hljs-meta">$1</span>'
            );

            // Highlight strings
            highlightedCode = highlightedCode.replace(
                /"([^"]*)"/g,
                '<span class="hljs-string">"$1"</span>'
            );

            // Highlight numbers
            highlightedCode = highlightedCode.replace(
                /\b(\d+)\b/g,
                '<span class="hljs-number">$1</span>'
            );
        }

        // Get HTML representation with line numbers
        const lines = highlightedCode.split("\n");
        const numberedLines = lines
            .map(
                (line, i) =>
                    `<div class="line"><span class="line-number"></span>${line}</div>`
            )
            .join("");

        return `<pre class="ql-syntax hljs" spellcheck="false"><code>${numberedLines}</code></pre>`;
    } catch (error) {
        console.error("Error generating HTML:", error);
        // Fallback to basic HTML
        return `<pre class="ql-syntax" spellcheck="false">${code}</pre>`;
    }
};
