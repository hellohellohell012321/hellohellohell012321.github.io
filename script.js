function convertToLua() {
    const input = document.getElementById("input").value.trim();
    let luaScript = "";
    let section = 1;

    // Split input by new lines
    const lines = input.split("\n");

    lines.forEach(line => {
        line = line.trim();
        if (line === "") return; // Skip empty lines

        // Add section header
        luaScript += `\n-- ${section}\n\n`;
        section++;

        let i = 0;
        while (i < line.length) {
            let currentChar = line[i];
            let keypressDuration = 1; // Default duration

            if (currentChar === "[") {
                // Handle square bracketed groups as one keypress
                let chord = "";
                i++; // Skip '['
                while (i < line.length && line[i] !== "]") {
                    chord += line[i];
                    i++;
                }
                i++; // Move past ']'

                // Determine the rest duration
                let restDuration = getRestDuration(line, i);
                luaScript += `keypress("${chord}", ${restDuration}, bpm)\n`;
                luaScript += `rest(${restDuration}, bpm)\n`;
            } else if (currentChar === "-") {
                luaScript += `rest(1, bpm)\n`;
            } else if (currentChar === " ") {
                luaScript += `rest(0.5, bpm)\n`;
            } else {
                // Handle single notes
                let note = currentChar;
                i++;

                // Determine the rest duration
                let restDuration = getRestDuration(line, i);
                luaScript += `keypress("${note}", ${restDuration}, bpm)\n`;
                luaScript += `rest(${restDuration}, bpm)\n`;
            }
        }
    });

    document.getElementById("output").innerText = luaScript;
}

// Function to determine rest duration
function getRestDuration(line, index) {
    if (index >= line.length) return 1; // Default if at the end

    let nextChar = line[index];
    if (nextChar === "-") return 1;
    if (nextChar === " ") return 0.5;
    return 0.25;
}
