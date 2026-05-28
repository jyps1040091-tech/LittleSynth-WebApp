# 🎹 LittleSynth - Web Audio Piano

一個使用 Web Audio API 製作的網頁版音頻合成器，支援 5 種波形和 13 個琴鍵。

## 功能特性

✅ **5 種波形選擇**
- Sine（正弦波）- 柔和純淨
- Square（方波）- 刺耳電子感
- Sawtooth（鋸齒波）- 明亮金屬感
- Triangle（三角波）- 介於兩者之間
- White Noise（白雜訊）- 嘶嘶聲

✅ **13 個琴鍵**
- C4 到 C5（8 個白鍵 + 5 個黑鍵）
- 支援滑鼠點擊和鍵盤快捷鍵

✅ **實時波形顯示**
- Canvas 波形圖實時更新
- 顯示目前波形、音名、頻率

✅ **無需外部資源**
- 純 HTML5 + CSS3 + JavaScript
- 使用 Web Audio API 產生聲音
- 無需後端伺服器，可離線使用

## 快速開始

### 方法 1：直接開啟 HTML 檔案
```bash
# 用瀏覽器開啟 index.html
# 支援 Chrome、Firefox、Safari、Edge 等現代瀏覽器
```

### 方法 2：本地伺服器（推薦）
```bash
# Python 3
python -m http.server 8000

# Node.js
npx http-server

# 然後在瀏覽器開啟 http://localhost:8000
```

## 使用方法

### 滑鼠操作
1. 點擊波形按鈕選擇波形
2. 點擊琴鍵播放音符

### 鍵盤快捷鍵

**白鍵：**
| 按鍵 | 音符 |
|------|------|
| Z | C4 |
| X | D4 |
| C | E4 |
| V | F4 |
| B | G4 |
| N | A4 |
| M | B4 |
| , (逗號) | C5 |

**黑鍵：**
| 按鍵 | 音符 |
|------|------|
| S | C#4 |
| D | D#4 |
| G | F#4 |
| H | G#4 |
| J | A#4 |

## 技術棧

- **HTML5** - 頁面結構
- **CSS3** - 樣式和動畫
- **JavaScript (Vanilla)** - 核心邏輯
- **Web Audio API** - 音頻合成和播放

## 檔案結構

```
LittleSynth-WebApp/
├── index.html      # 主頁面
├── style.css       # 樣式表
├── script.js       # JavaScript 邏輯
└── README.md       # 說明文件
```

## 驗收條件

| 編號 | 驗收條件 | 狀態 |
|------|---------|------|
| A1 | 開啟 index.html 後可看到波形選擇、琴鍵與波形圖 | ✅ |
| A2 | 不同波形聲音有差異 | ✅ |
| A3 | 點擊 A4 琴鍵時顯示 "A4" 和 "440 Hz" | ✅ |
| A4 | 快速連續點擊琴鍵時不會當掉 | ✅ |
| A5 | 不使用外部音訊檔 | ✅ |
| A6 | Canvas 波形圖與波形對應 | ✅ |
| A7 | 支援鍵盤快捷鍵播放 | ✅ |
| A8 | 白鍵和黑鍵視覺區分 | ✅ |
| A9 | 聲音播放時長約 1 秒 | ✅ |

## 瀏覽器相容性

| 瀏覽器 | 版本 | 支援 |
|--------|------|------|
| Chrome | 最新 | ✅ |
| Firefox | 最新 | ✅ |
| Safari | 14+ | ✅ |
| Edge | 最新 | ✅ |
| IE | 11 | ❌ |

## 核心演算法

### 1. 波形樣本生成
```javascript
// 正弦波：y = sin(2π * frequency * t / sampleRate)
// 方波：y = sign(sin(...))
// 鋸齒波：y = 2 * (t/period - floor(t/period + 0.5))
// 三角波：上升後下降的直線
// 白雜訊：隨機 -1 到 1 的值
```

### 2. 音頻合成
使用 Web Audio API 的 `OscillatorNode` 直接合成音頻，支援：
- Sine、Square、Sawtooth、Triangle 振盪器
- BufferSource 用於白雜訊

### 3. 波形繪製
在 Canvas 上繪製採樣點，展示音波的視覺表現。

## 未來優化

🟡 **可選功能**
- 音量控制滑桿
- 音符時長調整
- 簡單錄音和播放回放
- 簡單樂譜編輯
- 觸鍵視覺反饋動畫
- 支援八度音階切換

## 許可證

MIT License - 可自由使用和修改

## 作者

LittleSynth Web App v1.0

---

**享受音樂創作！🎵**
