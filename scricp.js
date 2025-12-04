// =======================================================
// GAME STATE
// =======================================================
let gameState = {
    currentLevel: 1,
    currentTask: 1,
    maxTasks: 3,
    health: 3,
    levelProgress: { 1: false, 2: false, 3: false } // Status penyelesaian level
};

// =======================================================
// LOGIKA PROPOSISIONAL INTI & ATURAN
// =======================================================

const LOGIC_OPS = {
    // Negasi: NOT P
    '¬P': (p, q) => !p,
    // Konjungsi: P AND Q (Hanya True jika keduanya True)
    'P ∧ Q': (p, q) => p && q,
    // Disjungsi: P OR Q (True jika salah satu True)
    'P ∨ Q': (p, q) => p || q,
    // Implikasi: P -> Q (Hanya False jika P True dan Q False)
    'P → Q': (p, q) => (!p) || q, 
    // Biimplikasi: P <-> Q (True jika P dan Q sama nilainya)
    'P ↔ Q': (p, q) => p === q
};

// Fungsi untuk mengonversi Boolean ke T/F
const toStr = (val) => val ? 'T' : 'F'; 
const toAction = (val) => val ? 'SELAMAT (Lari)' : 'GAGAL (Berhenti)';

// =BAHAN PROPOSISI UNTUK PENJELASAN=
const getPropValue = (prop, value) => {
    switch(prop) {
        case 'P': return `Lampu menyala (P=${toStr(value)})`;
        case 'Q': return `Pintu terkunci (Q=${toStr(value)})`;
        case 'R': return `Suara aneh terdengar (R=${toStr(value)})`;
        default: return '';
    }
};

// =======================================================
// STRUKTUR QUEST/TASK (Soal yang Lebih Jelas)
// =======================================================

const QUESTS = {
    1: [ // Level 1: Dasar (P & Q, R)
        {
            task: 1,
            title: "Kunci 1: Lampu & Pintu (Konjungsi)",
            narrative: "Di lorong gelap, kamu harus **Lari (SELAMAT) jika Lampu menyala (P) DAN Pintu terkunci (Q)**. Situasi saat ini: Lampu menyala (**P: T**), tapi Pintu tidak terkunci (**Q: F**).",
            propositions: { P: true, Q: false },
            logic: 'P ∧ Q',
            answer: LOGIC_OPS['P ∧ Q'](true, false),
            explanation: (p, q) => {
                const hasil = LOGIC_OPS['P ∧ Q'](p, q);
                return `Konjungsi **P ∧ Q** hanya bernilai **True** jika **kedua** proposisi (P dan Q) bernilai True. Karena ${getPropValue('P', p)} dan ${getPropValue('Q', q)}, hasilnya adalah **${toStr(hasil)}**. Keputusan tepat adalah ${toAction(hasil)}.`
            }
        },
        {
            task: 2,
            title: "Kunci 2: Pintu atau Suara (Disjungsi)",
            narrative: "Kunci keselamatanmu: **Lari (SELAMAT) jika Pintu terkunci (Q) ATAU ada Suara aneh (R)**. Situasi: Pintu terbuka (**Q: F**), Suara aneh terdengar (**R: T**).",
            propositions: { Q: false, R: true },
            logic: 'Q ∨ R',
            answer: LOGIC_OPS['P ∨ Q'](false, true), 
            explanation: (p, q) => { // Menggunakan p=Q dan q=R di fungsi ini
                const hasil = LOGIC_OPS['P ∨ Q'](p, q);
                return `Disjungsi **Q ∨ R** bernilai **True** jika **setidaknya satu** proposisi bernilai True. Karena ${getPropValue('R', q)} adalah True, hasilnya adalah **${toStr(hasil)}**. Keputusan tepat adalah ${toAction(hasil)}.`
            }
        },
        {
            task: 3,
            title: "Kunci 3: Keluar Cepat (Negasi)",
            narrative: "Kamu hanya akan selamat jika **Lampu TIDAK menyala (¬P)**. Situasi: Lampu menyala (**P: T**).",
            propositions: { P: true },
            logic: '¬P',
            answer: LOGIC_OPS['¬P'](true),
            explanation: (p) => {
                const hasil = LOGIC_OPS['¬P'](p);
                return `Negasi **¬P** membalik nilai P. Karena ${getPropValue('P', p)} adalah True, maka ¬P adalah **${toStr(hasil)}**. Keputusan tepat adalah ${toAction(hasil)}.`
            }
        },
    ],
    2: [ // Level 2: Implikasi & Biimplikasi (P, Q)
        {
            task: 1,
            title: "Kunci 4: Jendela Tertutup (Implikasi)",
            narrative: "Aturan Hantu: Kamu aman **JIKA (P → Q)**. Logika: **JIKA Pintu terkunci (P), MAKA Jendela Tertutup (Q)**. Situasi: Pintu terkunci (**P: T**), tetapi Jendela terbuka (**Q: F**).",
            propositions: { P: true, Q: false },
            logic: 'P → Q',
            answer: LOGIC_OPS['P → Q'](true, false), // False
            explanation: (p, q) => {
                const hasil = LOGIC_OPS['P → Q'](p, q);
                return `Implikasi **P → Q** hanya bernilai **False** (melanggar aturan) JIKA sebab (P) True dan akibat (Q) False. Karena ${getPropValue('P', p)} dan Q=F, hasilnya adalah **${toStr(hasil)}**. Keputusan tepat adalah ${toAction(hasil)} (karena True → False = False).`
            }
        },
        {
            task: 2,
            title: "Kunci 5: Ruangan Aman (Biimplikasi)",
            narrative: "Ruangan ini aman (**SELAMAT**) **JIKA dan HANYA JIKA (P ↔ Q)** kondisinya setara, yaitu Lampu Mati (**P: F**) dan Pintu Terbuka (**Q: F**). Situasi: P=F, Q=F.",
            propositions: { P: false, Q: false },
            logic: 'P ↔ Q',
            answer: LOGIC_OPS['P ↔ Q'](false, false), // True
            explanation: (p, q) => {
                const hasil = LOGIC_OPS['P ↔ Q'](p, q);
                return `Biimplikasi **P ↔ Q** bernilai **True** JIKA dan HANYA JIKA P dan Q memiliki nilai kebenaran yang **sama**. Karena P=F dan Q=F, hasilnya adalah **${toStr(hasil)}**. Keputusan tepat adalah ${toAction(hasil)}.`
            }
        },
        {
            task: 3,
            title: "Kunci 6: Rantai Keputusan",
            narrative: "Tentukan nilai Logika Implikasi: **(Lampu menyala → Pintu terkunci)**. Situasi: Lampu menyala (**P: T**) dan Pintu terkunci (**Q: T**).",
            propositions: { P: true, Q: true },
            logic: 'P → Q',
            answer: LOGIC_OPS['P → Q'](true, true), // True
            explanation: (p, q) => {
                const hasil = LOGIC_OPS['P → Q'](p, q);
                return `Implikasi **P → Q** bernilai **True** ketika P=T dan Q=T. Kondisi sebab dan akibat terpenuhi. Hasilnya adalah **${toStr(hasil)}**. Keputusan tepat adalah ${toAction(hasil)}.`
            }
        },
    ],
    3: [ // Level 3: Tautologi dan Kontradiksi
        {
            task: 1,
            title: "Kunci 7: Tautologi (Kebenaran Universal)",
            narrative: "Aksi yang **SELALU BENAR (Tautologi)** akan menyelamatkanmu: **P ∨ ¬P**. Tentukan hasil logika ini. (Anggap P=True).",
            propositions: { P: true },
            logic: 'P ∨ ¬P',
            answer: true, // Tautologi selalu True
            explanation: (p) => {
                const hasil = LOGIC_OPS['P ∨ Q'](p, !p); // P ∨ ¬P
                return `Ekspresi **P ∨ ¬P** (P atau Bukan P) adalah **Tautologi**, yang berarti hasilnya **selalu True**, terlepas dari nilai P. Hasilnya adalah **${toStr(hasil)}**. Keputusan tepat adalah ${toAction(hasil)}.`
            }
        },
        {
            task: 2,
            title: "Kunci 8: Kontradiksi (Kelemahan Hantu)",
            narrative: "Hantu akan melemah **JIKA** logikanya **SELALU SALAH (Kontradiksi)**: **P ∧ ¬P**. Tentukan hasil logika ini. (Anggap P=False).",
            propositions: { P: false },
            logic: 'P ∧ ¬P',
            answer: false, // Kontradiksi selalu False
            explanation: (p) => {
                const hasil = LOGIC_OPS['P ∧ Q'](p, !p); // P ∧ ¬P
                return `Ekspresi **P ∧ ¬P** (P dan Bukan P) adalah **Kontradiksi**, yang berarti hasilnya **selalu False**, terlepas dari nilai P. Hasilnya adalah **${toStr(hasil)}**. Keputusan tepat adalah ${toAction(hasil)}.`
            }
        },
        {
            task: 3,
            title: "Kunci 9: Implikasi Tersembunyi",
            narrative: "Pilih aksi yang sesuai dengan Logika Rumit: **(P ↔ Q) → (P ∨ Q)**. Situasi: P=T, Q=T.",
            propositions: { P: true, Q: true },
            logic: '(P ↔ Q) → (P ∨ Q)',
            answer: true, 
            explanation: (p, q) => {
                const p_bi_q = LOGIC_OPS['P ↔ Q'](p, q); // T
                const p_or_q = LOGIC_OPS['P ∨ Q'](p, q); // T
                const hasil = LOGIC_OPS['P → Q'](p_bi_q, p_or_q); // T -> T = T
                return `Logika dipecah: 1. (P ↔ Q) adalah ${toStr(p_bi_q)}. 2. (P ∨ Q) adalah ${toStr(p_or_q)}. 3. Hasil akhirnya (Implikasi) ${toStr(p_bi_q)} → ${toStr(p_or_q)} adalah **${toStr(hasil)}**. Keputusan tepat adalah ${toAction(hasil)}.`
            }
        }
    ]
};

// =======================================================
// FUNGSI UTAMA GAME
// =======================================================

function updateUI() {
    const healthBar = '❤️'.repeat(gameState.health) + '💀'.repeat(3 - gameState.health);
    const currentQuest = QUESTS[gameState.currentLevel] ? QUESTS[gameState.currentLevel][gameState.currentTask - 1] : null;
    
    // Update Menu (Unlock Level)
    document.getElementById('level-2-btn').disabled = !gameState.levelProgress[1];
    document.getElementById('level-3-btn').disabled = !gameState.levelProgress[2];

    if (!currentQuest) {
        document.getElementById('game-content-area').innerHTML = `
            <h2>🏆 SELAMAT! KAMU BERHASIL! 🏆</h2>
            <p>Kamu telah menyelesaikan semua level Logika Proposisional dan berhasil keluar dari rumah hantu. Logikamu sangat kuat!</p>
            <button id="restart-final-btn" onclick="location.reload()">Mulai Game Baru</button>
        `;
        return;
    }

    // Tentukan nilai P dan Q/R
    const P = currentQuest.propositions.P;
    const Q = currentQuest.propositions.Q !== undefined ? currentQuest.propositions.Q : null;
    const R = currentQuest.propositions.R !== undefined ? currentQuest.propositions.R : null;
    
    // Tampilkan Variabel Situasi
    let variableDisplay = `**P=${toStr(P)}**`;
    if (Q !== null) variableDisplay += `, **Q=${toStr(Q)}**`;
    if (R !== null) variableDisplay += `, **R=${toStr(R)}**`;


    // Tampilkan Konten Task
    document.getElementById('game-content-area').innerHTML = `
        <div class="status-bar">
            <span>Level: ${gameState.currentLevel} / 3</span>
            <span>Task: ${gameState.currentTask} / ${gameState.maxTasks}</span>
            <span class="health">Health: ${healthBar}</span>
        </div>

        <h2>Task ${currentQuest.task}: ${currentQuest.title}</h2>
        
        <div class="logika-highlight">
            <p>🔑 Logika Kunci: **$${currentQuest.logic.replace(/R/g, 'Q')} $**</p> 
            <p>Variabel Situasi: ${variableDisplay} </p>
        </div>
        
        <div class="narrative-box">
             <p> **NARASI SITUASI:** ${currentQuest.narrative}</p>
        </div>
       
        <p><h3>Pilih Hasil Logika Kunci ($${currentQuest.logic.replace(/R/g, 'Q')}$) untuk **SELAMAT**:</h3></p>
        <div class="options-container">
            <button onclick="checkAnswer(true)">True (T) / Lari</button>
            <button onclick="checkAnswer(false)">False (F) / Berhenti</button>
        </div>

        <div id="feedback-area" class="feedback default">Pilih salah satu jawaban di atas untuk melihat hasilnya.</div>
    `;

    // Render MathJax (Notasi Logika)
    if (window.MathJax) {
        window.MathJax.typeset();
    }
}

function checkAnswer(userAnswer) {
    const currentQuest = QUESTS[gameState.currentLevel][gameState.currentTask - 1];
    const feedbackArea = document.getElementById('feedback-area');
    
    const P = currentQuest.propositions.P;
    // Menggunakan Q sebagai parameter kedua untuk fungsi explanation, baik itu Q atau R dari QUESTS
    const SecondProp = currentQuest.propositions.Q !== undefined ? currentQuest.propositions.Q : currentQuest.propositions.R;

    const explanationText = currentQuest.explanation(P, SecondProp);

    if (userAnswer === currentQuest.answer) {
        // Jawaban Benar
        feedbackArea.className = "feedback correct";
        feedbackArea.innerHTML = `
            ✅ **BENAR!** Kamu berhasil.
            <div style="margin-top: 10px; padding: 10px; border-radius: 5px; background-color: #337a33; text-align: left;">
                <p>💡 **PENJELASAN LOGIKA:**</p>
                <p>${explanationText}</p>
            </div>
        `;
        
        setTimeout(() => nextTask(), 4000); // Jeda lebih lama untuk membaca penjelasan

    } else {
        // Jawaban Salah
        gameState.health--;
        feedbackArea.className = "feedback wrong";
        feedbackArea.innerHTML = `
            ❌ **SALAH!** Itu adalah keputusan yang salah. Kamu kehilangan 1 Health.
            <div style="margin-top: 10px; padding: 10px; border-radius: 5px; background-color: #8c3f3f; text-align: left;">
                <p>💡 **PENJELASAN LOGIKA (Kenapa Salah):**</p>
                <p>Jawaban yang benar adalah **${toStr(currentQuest.answer)}**. ${explanationText}</p>
            </div>
        `;
        
        if (gameState.health <= 0) {
            setTimeout(() => gameOver(), 4000); 
        } else {
            setTimeout(() => updateUI(), 4000); 
        }
    }
}

function nextTask() {
    gameState.currentTask++;
    if (gameState.currentTask > gameState.maxTasks) {
        // Level Selesai
        gameState.levelProgress[gameState.currentLevel] = true;
        gameState.currentLevel++;
        gameState.currentTask = 1;

        if (gameState.currentLevel <= 3) {
            alert(`Level ${gameState.currentLevel - 1} Selesai! Selamat datang di Level ${gameState.currentLevel}.`);
        }
    }
    updateUI();
}

function startGame(level) {
    // Pastikan level yang diklik sudah dibuka
    if (level > 1 && !gameState.levelProgress[level - 1]) {
        alert(`Selesaikan Level ${level - 1} terlebih dahulu!`);
        return;
    }
    
    gameState.currentLevel = level;
    gameState.currentTask = 1;
    gameState.health = 3; 
    updateUI();
}

function gameOver() {
    document.getElementById('game-content-area').innerHTML = `
        <h2>☠️ GAME OVER ☠️</h2>
        <p>Logikamu gagal. Hantu menangkapmu.</p>
        <button onclick="location.reload()">Coba Lagi (Restart)</button>
    `;
}

// Inisialisasi saat halaman dimuat
document.addEventListener('DOMContentLoaded', updateUI);
