document.addEventListener('DOMContentLoaded', () => {
    const totalNumerosInput = document.getElementById('total-numeros');
    const secretWinnerSection = document.getElementById('secret-winner-section');
    const secretWinnerInput = document.getElementById('secret-winner');
    const drawButton = document.getElementById('draw-button');
    const hundredsSlot = document.getElementById('hundreds-slot');
    const tensSlot = document.getElementById('tens-slot');
    const unitsSlot = document.getElementById('units-slot');
    const resultMessage = document.getElementById('result-message');
    
    // Variáveis de Controle da Lógica Secreta
    let sequenceCounter = 0; // 0, 1, 2, 3 (etapas)
    let secretDigits = []; // [Centena, Dezena, Unidade]
    let finalWinnerNumber = '';

    // Oculta a seção anterior de Vencedor Secreto (pois usaremos a nova lógica)
    secretWinnerSection.classList.add('hidden');
    
    // Função para mostrar feedback discreto na tela
    function showDiscreetFeedback(message) {
        // Você pode usar o console.log ou uma pequena caixa de aviso que desaparece
        console.log("Modo Secreto: " + message);
        // Ou use resultMessage temporariamente (se for muito rápido, não será visto)
    }

    // --- Parte de Ativação por Sequência de Inputs (NOVA LÓGICA) ---
    totalNumerosInput.addEventListener('keydown', (e) => {
        // A sequência é ativada quando o usuário pressiona ENTER (ou Tab/Blur) no campo.
        if (e.key === 'Enter') {
            e.preventDefault(); // Impede o envio do formulário padrão
            
            const inputValue = parseInt(totalNumerosInput.value);
            
            // Etapas 0, 1 e 2: Capturando os dígitos
            if (sequenceCounter < 3) {
                // Pega o primeiro dígito do valor inserido
                const digit = String(inputValue)[0]; 
                
                secretDigits.push(digit);
                sequenceCounter++;

                showDiscreetFeedback(`Dígito salvo (${sequenceCounter}/3): ${digit}`);
                totalNumerosInput.value = ''; // Limpa para a próxima entrada
                
                if (sequenceCounter === 3) {
                    // Monta o número secreto (ex: '0' + '5' + '7' = '057')
                    finalWinnerNumber = secretDigits.join('');
                    showDiscreetFeedback(`Vencedor definido: ${finalWinnerNumber}`);
                    
                    // Prepara para a etapa final: o número real de participantes
                    resultMessage.textContent = 'Insira o total final de números.';
                    totalNumerosInput.value = ''; // Limpa novamente
                }
                
            } else if (sequenceCounter === 3) {
                // Etapa 3: Usuário insere o número real de participantes.
                if (inputValue > 0) {
                    // O valor inserido agora é o total real de números para o sorteio.
                    totalNumerosInput.value = inputValue; 
                    sequenceCounter = 4; // Finaliza a sequência
                    resultMessage.textContent = 'Pronto para Sortear!';
                    showDiscreetFeedback("Sequência finalizada. Total de participantes inserido.");
                }
            }
        }
    });

    // --- Efeito de Rotação/Rolagem dos Números (SEM MUDANÇAS) ---
    // ... (Mantenha o código da função 'animateNumberSlot' aqui)
    async function animateNumberSlot(slotElement, finalDigit, duration) {
        return new Promise(resolve => {
            const span = slotElement.querySelector('span');
            let startTime = null;

            function animate(currentTime) {
                if (!startTime) startTime = currentTime;
                const elapsedTime = currentTime - startTime;

                if (elapsedTime < duration) {
                    span.textContent = Math.floor(Math.random() * 10); 
                    requestAnimationFrame(animate);
                } else {
                    span.textContent = finalDigit; 
                    slotElement.classList.add('stopped'); 
                    resolve();
                }
            }
            slotElement.classList.remove('stopped');
            requestAnimationFrame(animate);
        });
    }

    // --- Lógica Principal do Sorteio (COM MUDANÇAS NA DEFINIÇÃO DO VENCEDOR) ---
    drawButton.addEventListener('click', async () => {
        resultMessage.textContent = 'Preparando o sorteio...';
        drawButton.disabled = true; 

        const total = parseInt(totalNumerosInput.value);

        // 1. Determina o número vencedor:
        // Verifica se a sequência secreta foi concluída (sequenceCounter === 4)
        if (sequenceCounter === 4 && total >= parseInt(finalWinnerNumber)) {
            // O número vencedor já está definido pela sequência.
            // Não precisa de formatação, pois já foi formatado como string na sequência.
        } else {
            // Se a sequência não foi feita ou se o vencedor secreto é maior que o total,
            // ou se for a primeira vez, faz o sorteio aleatório normal.
            const randomNum = Math.floor(Math.random() * total) + 1;
            finalWinnerNumber = String(randomNum).padStart(3, '0');
            showDiscreetFeedback("Sorteio aleatório (Sequência não completa ou inválida).");
        }

        const digitHundreds = finalWinnerNumber[0];
        const digitTens = finalWinnerNumber[1];
        const digitUnits = finalWinnerNumber[2];

        // Limpa os slots
        hundredsSlot.querySelector('span').textContent = '?';
        tensSlot.querySelector('span').textContent = '?';
        unitsSlot.querySelector('span').textContent = '?';

        // Animação sequencial
        resultMessage.textContent = '😫 Rolando o PRIMEIRO Número';
        await animateNumberSlot(hundredsSlot, digitHundreds, 6000); 
        
        resultMessage.textContent = '😬 Rolando o SEGUNDO Número';
        await new Promise(r => setTimeout(r, 2000));
        await animateNumberSlot(tensSlot, digitTens, 6000); 

        resultMessage.textContent = '😨 E O GRANDE VENCEDOR É...';
        await new Promise(r => setTimeout(r, 3500));
        await animateNumberSlot(unitsSlot, digitUnits, 11000); 

        // Revela o resultado final
        resultMessage.innerHTML = `🎉 NÚMERO: <span style="color: #ffcc00; font-size: 1.2em;">${parseInt(finalWinnerNumber)}</span>! 🎉`;
        
        // Efeito de fogos de artifício
        triggerConfetti();
        drawButton.disabled = false; 
    });

    // --- Efeito de Confete (SEM MUDANÇAS) ---
    // ... (Mantenha o código das funções 'triggerConfetti', 'createParticle', etc. aqui)
    
    // --- FUNÇÕES DE CONFETE (MANTENHA ESTE BLOCO NO FINAL DO SCRIPT.JS) ---
    const confettiCanvas = document.getElementById('confetti-canvas');
    const ctx = confettiCanvas.getContext('2d');
    let particles = [];

    function resizeCanvas() {
        confettiCanvas.width = window.innerWidth;
        confettiCanvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    function createParticle() {
        return {
            x: Math.random() * confettiCanvas.width,
            y: confettiCanvas.height,
            radius: Math.random() * 5 + 2,
            color: `hsl(${Math.random() * 360}, 100%, 70%)`,
            velocity: {
                x: (Math.random() - 0.5) * 8,
                y: Math.random() * -15 - 5
            },
            alpha: 1
        };
    }

    function updateParticles() {
        ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
        for (let i = 0; i < particles.length; i++) {
            let p = particles[i];
            p.velocity.y += 0.2; // Gravidade
            p.x += p.velocity.x;
            p.y += p.velocity.y;
            p.alpha -= 0.01;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${parseInt(p.color.substring(4,7))}, ${parseInt(p.color.substring(8,11))}, ${parseInt(p.color.substring(12,15))}, ${p.alpha})`;
            ctx.fill();

            if (p.alpha <= 0.1 || p.y > confettiCanvas.height) {
                particles.splice(i, 1);
                i--;
            }
        }
        requestAnimationFrame(updateParticles);
    }

    function triggerConfetti() {
        particles = []; 
        for (let i = 0; i < 100; i++) { 
            particles.push(createParticle());
        }
        updateParticles();
    }
    // FIM DO BLOCO DE FUNÇÕES DE CONFETE
});