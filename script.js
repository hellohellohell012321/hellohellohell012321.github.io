function convertToLua() {
    const input = document.getElementById("input").value.trim();
    const lines = input.split("\n");
    let luaScript = "";
    let section = 1;

    lines.forEach(line => {
        line = line.trim();
        if (line === "") return;

        // Add section header
        luaScript += `\n-- ${section}\n\n`;
        section++;

        // Convert to Lua
        for (let i = 0; i < line.length; i++) {
            const char = line[i];

            if (char === "[") {
                let chord = "";
                i++; // Skip [
                while (i < line.length && line[i] !== "]") {
                    chord += line[i];
                    i++;
                }
                luaScript += `keypress("${chord}", 0.5, bpm)\nrest(0.5, bpm)\n`;
            } else if (char === "-") {
                luaScript += `rest(1, bpm)\n`;
            } else {
                luaScript += `keypress("${char}", 1, bpm)\nrest(1, bpm)\n`;
            }
        }
    });

    document.getElementById("output").innerText = luaScript;
}
