function simplifyCode() {
    const code = document.getElementById("inputCode").value;

    try {
        // Parse the Lua code and replace variables
        const simplifiedCode = simplifyLuaCode(code);

        // Display the result
        document.getElementById("outputCode").textContent = simplifiedCode;
    } catch (error) {
        document.getElementById("outputCode").textContent = `Error: ${error.message}`;
    }
}

function simplifyLuaCode(code) {
    // Basic variable inlining (works for "local var = value" patterns)
    const variableRegex = /local\s+(\w+)\s*=\s*(.+?);?\n/g;
    const replacements = {};

    // Find all variable declarations
    let match;
    while ((match = variableRegex.exec(code)) !== null) {
        const [fullMatch, varName, varValue] = match;
        replacements[varName] = varValue.trim();
    }

    // Replace variable usages with their values
    let simplifiedCode = code;
    for (const [varName, varValue] of Object.entries(replacements)) {
        const usageRegex = new RegExp(`\\b${varName}\\b`, "g");
        simplifiedCode = simplifiedCode.replace(usageRegex, varValue);
    }

    // Remove the original variable declarations
    simplifiedCode = simplifiedCode.replace(variableRegex, "");

    return simplifiedCode.trim();
}
