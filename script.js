document.addEventListener('DOMContentLoaded', () => {
    let currentMode = 'binToDec';

    const menuItems = document.querySelectorAll('.menu-item');
    const inputLabel = document.getElementById('inputLabel');
    const inputBadge = document.getElementById('inputBadge');
    const mainInput = document.getElementById('mainInput');
    const randomBtn = document.getElementById('randomBtn');
    const validationError = document.getElementById('validationError');
    const outputLabel = document.getElementById('outputLabel');
    const outputDisplay = document.getElementById('outputDisplay');
    const copyBtn = document.getElementById('copyBtn');
    const copyText = document.getElementById('copyText');
    const explanationContent = document.getElementById('explanationContent');

    const modesConfig = {
        binToDec: {
            inputLabel: 'Binary Input String',
            outputLabel: 'Decimal Output Integer',
            badge: 'BIN',
            placeholder: 'Enter binary sequence (e.g., 110100)...',
            validate: (val) => /^[01\s]+$/.test(val),
            errorMsg: 'Syntax Error: Base-2 configurations must consist purely of characters 0 and 1.'
        },
        decToBin: {
            inputLabel: 'Decimal Input Integer',
            outputLabel: 'Binary Output Sequence',
            badge: 'DEC',
            placeholder: 'Enter base-10 integer (e.g., 52)...',
            validate: (val) => /^\d+$/.test(val),
            errorMsg: 'Syntax Error: Input argument target must pass a structured decimal integer values.'
        },
        textToBin: {
            inputLabel: 'Plaintext Stream String',
            outputLabel: 'Binary Data Array Output',
            badge: 'TXT',
            placeholder: 'Type plain ASCII/UTF-8 data here...',
            validate: () => true,
            errorMsg: ''
        },
        binToText: {
            inputLabel: 'Binary Code Stream array',
            outputLabel: 'Plaintext Character Stream Output',
            badge: 'B-TXT',
            placeholder: 'Enter spaced bytes/bits (e.g., 01001000 01001001)...',
            validate: (val) => /^[01\s]+$/.test(val),
            errorMsg: 'Syntax Error: Stream syntax configuration rules verify only space dividers, 1s and 0s.'
        }
    };

    function processConversion() {
        const rawValue = mainInput.value;
        const config = modesConfig[currentMode];
        const trimmedValue = rawValue.trim();

        if (trimmedValue === "") {
            resetOutput();
            return;
        }

        if (!config.validate(trimmedValue)) {
            showValidationError(config.errorMsg);
            return;
        }

        clearValidationError();

        switch (currentMode) {
            case 'binToDec':
                executeBinaryToDecimal(trimmedValue.replace(/\s+/g, ''));
                break;
            case 'decToBin':
                executeDecimalToBinary(trimmedValue);
                break;
            case 'textToBin':
                executeTextToBinary(rawValue);
                break;
            case 'binToText':
                executeBinaryToText(trimmedValue);
                break;
        }
    }

    function executeBinaryToDecimal(binaryStr) {
        const decimalResult = parseInt(binaryStr, 2);
        outputDisplay.textContent = isNaN(decimalResult) ? "0" : decimalResult;

        let trace = "Trace Execution Log:\n";
        const digits = binaryStr.split('');
        const lines = digits.map((digit, index) => {
            const power = digits.length - 1 - index;
            return `Bit pos ${power.toString().padStart(2, '0')} | ( ${digit} * 2^${power} ) = ${parseInt(digit) * Math.pow(2, power)}`;
        });
        trace += lines.join('\n') + `\n\n[Success] Evaluated Register Value: ${decimalResult}`;
        explanationContent.textContent = trace;
    }

    function executeDecimalToBinary(decimalStr) {
        let decimalNum = parseInt(decimalStr, 10);
        if (decimalNum === 0) {
            outputDisplay.textContent = "0";
            explanationContent.textContent = "Zero Evaluation complete.";
            return;
        }

        const binaryResult = decimalNum.toString(2);
        outputDisplay.textContent = binaryResult;

        let steps = [];
        let tempNum = decimalNum;
        while (tempNum > 0) {
            steps.push(`Modulus step: ${tempNum.toString().padStart(4, ' ')} / 2 -> Remainder [${tempNum % 2}]`);
            tempNum = Math.floor(tempNum / 2);
        }
        explanationContent.textContent = "Division Trace Matrix:\n" + steps.join('\n') + `\n\n[Success] Binary Stream Generated: ${binaryResult}`;
    }

    function executeTextToBinary(textStr) {
        let binaryResultArr = [];
        let trace = "Text Encode Block Mapping:\n";

        for (let i = 0; i < textStr.length; i++) {
            let char = textStr[i];
            let unicodeCode = char.charCodeAt(0);
            let binaryByte = unicodeCode.toString(2).padStart(8, '0');
            binaryResultArr.push(binaryByte);
            trace += `Char: '${char}' -> Hex: 0x${unicodeCode.toString(16)} -> Bin: ${binaryByte}\n`;
        }

        outputDisplay.textContent = binaryResultArr.join(' ');
        explanationContent.textContent = trace;
    }

    function executeBinaryToText(binaryStr) {
        let cleanBinary = binaryStr.replace(/\s+/g, ' ');
        let binaryBlocks = cleanBinary.split(' ');
        
        if (binaryBlocks.length === 1 && binaryStr.length > 8) {
            binaryBlocks = binaryStr.match(/.{1,8}/g) || [];
        }

        let textResult = "";
        let trace = "Binary Decryption Pipeline:\n";

        for (let block of binaryBlocks) {
            if (block.trim() === "") continue;
            let codePoint = parseInt(block, 2);
            let character = String.fromCharCode(codePoint);
            
            if (!isNaN(codePoint)) {
                textResult += character;
                trace += `Byte Block [${block.padStart(8, '0')}] -> Char Code ${codePoint} -> Character Evaluated: '${character}'\n`;
            }
        }

        outputDisplay.textContent = textResult || "[Null Output]";
        explanationContent.textContent = trace;
    }

    // Nav Switch Routing Mechanics
    menuItems.forEach(item => {
        item.addEventListener('click', (e) => {
            menuItems.forEach(i => i.classList.remove('active'));
            e.target.classList.add('active');
            
            currentMode = e.target.getAttribute('data-mode');
            const config = modesConfig[currentMode];
            
            inputLabel.textContent = config.inputLabel;
            outputLabel.textContent = config.outputLabel;
            inputBadge.textContent = config.badge;
            mainInput.placeholder = config.placeholder;
            
            mainInput.value = "";
            resetOutput();
            clearValidationError();
        });
    });

    randomBtn.addEventListener('click', () => {
        if (currentMode === 'binToDec') {
            mainInput.value = Math.floor(Math.random() * 512).toString(2);
        } else if (currentMode === 'decToBin') {
            mainInput.value = Math.floor(Math.random() * 1024).toString();
        } else if (currentMode === 'textToBin') {
            const samples = ["Kernel", "Buffer", "Stack", "Bitwise", "Payload"];
            mainInput.value = samples[Math.floor(Math.random() * samples.length)];
        } else if (currentMode === 'binToText') {
            mainInput.value = "01101111 01110000 01100101 01101110";
        }
        processConversion();
    });

    copyBtn.addEventListener('click', async () => {
        try {
            await navigator.clipboard.writeText(outputDisplay.textContent);
            copyText.textContent = "Copied Frame";
            setTimeout(() => { copyText.textContent = "Copy Code"; }, 1500);
        } catch (err) {
            console.error(err);
        }
    });

    function resetOutput() {
        outputDisplay.textContent = "0";
        explanationContent.textContent = "Awaiting input stream...";
    }

    function showValidationError(message) {
        validationError.textContent = message;
        validationError.classList.remove('hidden');
        outputDisplay.style.opacity = "0.25";
    }

    function clearValidationError() {
        validationError.classList.add('hidden');
        outputDisplay.style.opacity = "1";
    }

    mainInput.addEventListener('input', processConversion);
});