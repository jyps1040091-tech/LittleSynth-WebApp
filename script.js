// ═══════════════════════════════════════════════════════════════
// LittleSynth - Web Audio Piano
// ═══════════════════════════════════════════════════════════════

// 初始化 Audio Context
let audioContext = null;

function getAudioContext() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioContext;
}

// 琴鍵映射表
const noteMap = {
    'z': { frequency: 261, note: 'C4' },
    'x': { frequency: 293, note: 'D4' },
    'c': { frequency: 329, note: 'E4' },
    'v': { frequency: 349, note: 'F4' },
    'b': { frequency: 392, note: 'G4' },
    'n': { frequency: 440, note: 'A4' },
    'm': { frequency: 493, note: 'B4' },
    ',': { frequency: 523, note: 'C5' },
    's': { frequency: 277, note: 'C#4' },
    'd': { frequency: 311, note: 'D#4' },
    'g': { frequency: 369, note: 'F#4' },
    'h': { frequency: 415, note: 'G#4' },
    'j': { frequency: 466, note: 'A#4' }
};

// 波形標籤映射（用於顯示）
const waveformLabels = {
    'sine': 'Sine',
    'square': 'Square',
    'sawtooth': 'Saw',
    'triangle': 'Triangle',
    'noise': 'White Noise'
};

// 目前狀態
let currentWaveform = 'sine';

// ═══════════════════════════════════════════════════════════════
// 1️⃣ 生成波形樣本 (GenerateWaveSamples)
// ═══════════════════════════════════════════════════════════════

function generateWaveSamples(waveType, frequency, sampleRate = 44100, duration = 1) {
    const samples = [];
    const totalSamples = sampleRate * duration;
    const periodSamples = sampleRate / frequency;

    switch (waveType) {
        case 'sine':
            for (let i = 0; i < totalSamples; i++) {
                const sample = Math.sin((2 * Math.PI * frequency * i) / sampleRate);
                samples.push(sample);
            }
            break;

        case 'square':
            for (let i = 0; i < totalSamples; i++) {
                const sine = Math.sin((2 * Math.PI * frequency * i) / sampleRate);
                samples.push(sine > 0 ? 1 : -1);
            }
            break;

        case 'sawtooth':
            for (let i = 0; i < totalSamples; i++) {
                const phase = ((i % periodSamples) / periodSamples) * 2 - 1;
                samples.push(phase);
            }
            break;

        case 'triangle':
            for (let i = 0; i < totalSamples; i++) {
                const phase = ((i % periodSamples) / periodSamples);
                const sample = phase < 0.5 
                    ? -1 + (phase * 4)      // 上升
                    : 3 - (phase * 4);      // 下降
                samples.push(sample);
            }
            break;

        case 'noise':
            for (let i = 0; i < totalSamples; i++) {
                samples.push(Math.random() * 2 - 1);
            }
            break;
    }

    return samples;
}

// ═══════════════════════════════════════════════════════════════
// 2️⃣ 播放聲音 (PlaySamples)
// ═══════════════════════════════════════════════════════════════

function playSamples(waveType, frequency, duration = 1) {
    const ctx = getAudioContext();
    
    // 對於白雜訊，使用不同的方法
    if (waveType === 'noise') {
        playWhiteNoise(ctx, frequency, duration);
        return;
    }

    // 標準振盪器
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    // 對應 Web Audio API 的波形類型
    const oscType = waveType === 'sawtooth' ? 'sawtooth' : waveType;
    oscillator.type = oscType;
    oscillator.frequency.value = frequency;

    // 音量包絡 (Attack-Release)
    gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

    // 連接音頻圖
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    // 播放
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + duration);
}

// 白雜訊播放（使用 BufferSource）
function playWhiteNoise(ctx, frequency, duration = 1) {
    const bufferSize = ctx.sampleRate * duration;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    // 生成白雜訊樣本
    for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
    }

    const source = ctx.createBufferSource();
    const gainNode = ctx.createGain();

    source.buffer = buffer;
    gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

    source.connect(gainNode);
    gainNode.connect(ctx.destination);

    source.start(ctx.currentTime);
    source.stop(ctx.currentTime + duration);
}

// ═══════════════════════════════════════════════════════════════
// 3️⃣ 繪製波形圖 (DrawWaveform)
// ═══════════════════════════════════════════════════════════════

function drawWaveform(waveType, frequency) {
    const canvas = document.getElementById('waveCanvas');
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // 清除畫布
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, width, height);

    // 生成樣本（只取一個週期的樣本用於顯示）
    const duration = 3 / frequency;  // 3 個週期
    const samples = generateWaveSamples(waveType, frequency, 44100, duration);

    // 繪製波形
    ctx.strokeStyle = '#667eea';
    ctx.lineWidth = 2;
    ctx.beginPath();

    const samplesPerPixel = Math.ceil(samples.length / width);
    const centerY = height / 2;
    const scaleY = (height / 2) * 0.9;

    for (let i = 0; i < samples.length; i += samplesPerPixel) {
        const x = (i / samples.length) * width;
        const y = centerY - samples[i] * scaleY;

        if (i === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    }

    ctx.stroke();

    // 繪製中心線
    ctx.strokeStyle = '#ddd';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(width, centerY);
    ctx.stroke();

    // 繪製刻度線
    ctx.strokeStyle = '#eee';
    ctx.lineWidth = 1;
    for (let i = 1; i < 4; i++) {
        const y = centerY - (height / 8) * i;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();

        const y2 = centerY + (height / 8) * i;
        ctx.beginPath();
        ctx.moveTo(0, y2);
        ctx.lineTo(width, y2);
        ctx.stroke();
    }
}

// ═══════════════════════════════════════════════════════════════
// 4️⃣ 播放音符 (NoteButton_Click)
// ═══════════════════════════════════════════════════════════════

function playNote(frequency, note) {
    // 更新狀態顯示
    updateStatus(note, frequency);

    // 繪製波形
    drawWaveform(currentWaveform, frequency);

    // 播放聲音
    playSamples(currentWaveform, frequency, 1);
}

// ═══════════════════════════════════════════════════════════════
// UI 事件處理
// ═══════════════════════════════════════════════════════════════

// 更新狀態顯示
function updateStatus(note, frequency) {
    document.getElementById('currentNote').textContent = note;
    document.getElementById('currentFrequency').textContent = frequency + ' Hz';
}

// 波形選擇
document.querySelectorAll('input[name="waveform"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
        currentWaveform = e.target.value;
        const label = waveformLabels[currentWaveform];
        document.getElementById('currentWaveform').textContent = label;
        
        // 如果最後有音符播放過，重新繪製
        const lastNote = document.getElementById('currentNote').textContent;
        if (lastNote !== '-') {
            const lastFreq = document.getElementById('currentFrequency').textContent.replace(' Hz', '');
            drawWaveform(currentWaveform, parseInt(lastFreq));
        }
    });
});

// 琴鍵點擊事件
document.querySelectorAll('.key').forEach(button => {
    button.addEventListener('click', (e) => {
        const frequency = parseInt(e.target.dataset.frequency);
        const note = e.target.dataset.note;
        playNote(frequency, note);

        // 視覺回饋
        e.target.classList.add('active');
        setTimeout(() => e.target.classList.remove('active'), 100);
    });
});

// 鍵盤快捷鍵
document.addEventListener('keydown', (e) => {
    const key = e.key.toLowerCase();
    if (noteMap[key]) {
        const { frequency, note } = noteMap[key];
        playNote(frequency, note);

        // 視覺回饋：高亮對應按鈕
        const button = document.querySelector(`[data-frequency="${frequency}"]`);
        if (button) {
            button.classList.add('active');
        }
    }
});

document.addEventListener('keyup', (e) => {
    const key = e.key.toLowerCase();
    if (noteMap[key]) {
        const frequency = noteMap[key].frequency;
        const button = document.querySelector(`[data-frequency="${frequency}"]`);
        if (button) {
            button.classList.remove('active');
        }
    }
});

// 初始化波形圖
window.addEventListener('load', () => {
    document.getElementById('currentWaveform').textContent = 
        waveformLabels[currentWaveform];
    drawWaveform(currentWaveform, 440);
});
