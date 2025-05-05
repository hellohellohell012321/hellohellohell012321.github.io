function removeLineBreaks() {
    const input = document.getElementById("input").value.trim();
    if (!input) return; // Prevent errors on empty input
    const output = input.replace(/(\r\n|\n|\r)/g, ""); // Remove all line breaks
    return output;
}

function convertToLua() {
    const input = removeLineBreaks();
    const bpm = document.getElementById("bpmInput").value || 120; // Get BPM value
    if (!input) return; // Prevent errors on empty input

    let luaScript = 'loadstring(game:HttpGet("https://raw.githubusercontent.com/hellohellohell012321/TALENTLESS/main/loader_main.lua"))()\n\n';
    luaScript += `bpm = ${bpm}\n\n`;  // Add the BPM line to the output
    let section = 1;
    const lines = input.split("\n");

    lines.forEach(line => {
        line = line.trim();
        if (line === "") return; // Skip empty lines

        luaScript += `\n-- ${section}\n\n`;
        section++;

        let i = 0;
        while (i < line.length) {
            let note = "";

            if (line[i] === "[") {
                // Handle square bracketed groups as a single keypress
                i++; // Move past '['
                while (i < line.length && line[i] !== "]") {
                    note += line[i];
                    i++;
                }
                i++; // Move past ']'
            } else {
                // Single character note
                note = line[i];
                i++;
            }

            // Determine rest duration and count dashes
            let dashCount = 0;
            while (i < line.length && line[i] === "-") {
                dashCount++;
                i++;
            }

            luaScript += `keypress("${note}", 0.25, bpm)\n`;
            
            // Call rest() for the number of dashes found
            for (let j = 0; j < dashCount; j++) {
                luaScript += `rest(1, bpm)\n`;
            }

            // Handle spaces as a shorter rest
            if (i < line.length && line[i] === " ") {
                luaScript += `rest(0.5, bpm)\n`;
                i++;
            } else if (i < line.length && line[i] === ".") { 
                luaScript += `rest(0.75, bpm)\n`;
                i++; // Move past the period
            } else if (i < line.length && line[i] === ",") { 
                luaScript += `rest(0.333, bpm)\n`;
                i++; // Move past the comma
            } else if (i < line.length && line[i] === ";") { 
                luaScript += `rest(0.125, bpm)\n`;
                i++; // Move past the comma
            } else if (dashCount === 0) {
                luaScript += `rest(0.25, bpm)\n`;
            }                 
        }
    });

    document.getElementById("output").innerText = luaScript;
}

function copyOutput() {
    const output = document.getElementById("output");
    const range = document.createRange();
    range.selectNode(output);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
    document.execCommand("copy");
}