# tiny thing — Expo App

## 專案結構

```
tiny-thing/
├── App.js                      ← 主入口，navigation + state
├── app.json                    ← Expo config (bundle ID, permissions)
├── src/
│   ├── data/
│   │   └── prompts.js          ← 所有prompt (free / paid / packs)
│   ├── services/
│   │   ├── purchases.js        ← RevenueCat IAP (NT$99 買斷)
│   │   ├── notifications.js    ← 每日提醒
│   │   └── storage.js          ← AsyncStorage + FileSystem
│   ├── screens/
│   │   ├── HomeScreen.js       ← 卡牌堆疊 + 主CTA
│   │   ├── DrawScreen.js       ← 畫布 + 觀察計時 + 上傳
│   │   ├── DeckScreen.js       ← 所有卡片 grid
│   │   ├── CelebrateScreen.js  ← 里程碑慶祝
│   │   └── PaywallScreen.js    ← NT$99 購買頁
│   └── theme.js                ← 顏色、字體、間距
```

---

## 第一步：在手機上跑起來

```bash
# 安裝 Expo Go app 在你的 iPhone
# App Store 搜尋 "Expo Go"

# 本地開發
cd tiny-thing
npx expo start

# 掃描 QR code → 在 Expo Go 打開
```

---

## 第二步：設定 RevenueCat (IAP)

1. 去 https://app.revenuecat.com 建立帳號（免費）
2. 建立 App → iOS
3. 在 App Store Connect 建立這些 products：

| Product ID | 類型 | 價格 |
|---|---|---|
| `com.tinything.app.creator` | Non-Consumable | NT$99 |
| `com.tinything.app.pack_city` | Non-Consumable | NT$49 |
| `com.tinything.app.pack_body` | Non-Consumable | NT$49 |
| `com.tinything.app.pack_memory` | Non-Consumable | NT$49 |

4. 在 RevenueCat 設定 Entitlements：
   - `paid_prompts` → 綁定 creator product
   - `pack_city` / `pack_body` / `pack_memory` → 各自綁定

5. 把 API key 填入 `src/services/purchases.js`：
```js
const RC_API_KEY_IOS = 'appl_YOUR_KEY_HERE';
```

---

## 第三步：EAS Build (上架用)

```bash
# 安裝 EAS CLI
npm install -g eas-cli

# 登入 Expo
eas login

# 設定
eas build:configure

# 建立 TestFlight build
eas build --platform ios --profile preview

# 正式上架 build
eas build --platform ios --profile production
eas submit --platform ios
```

---

## IAP 購買流程

```
用戶用完 15 個 free prompt
    ↓
自動出現 Paywall (Modal slide up)
    ↓
點「unlock for NT$99」
    ↓
Apple 原生購買畫面
    ↓
成功 → RevenueCat 驗證
    ↓
entitlements.paid = true
    ↓
解鎖 150 條 paid prompts + 計時功能
```

---

## 計時 prompt 類型

**observe** (畫之前先看)
- 大倒數計時畫面
- 螢幕只有秒數和提示
- 時間到 → haptic 震動 → 進入畫布

**speed** (畫的時候倒數)
- 頂部進度條
- 最後10秒每秒輕震動
- 時間到 → warning haptic → 可以繼續畫但提示時間到

---

## 未來主題包規劃

| 包名 | ID | 價格 | Prompt數 |
|---|---|---|---|
| 城市觀察 | pack_city | NT$49 | 30 |
| 身體感知 | pack_body | NT$49 | 30 |
| 記憶素描 | pack_memory | NT$49 | 30 |

每次出新包 → 在 App Store Connect 新增 product → `prompts.js` 加新 tier → push update → 舊用戶免費更新 app，需要付費解鎖新內容。

---

## 需要 Mac 嗎？

- **Expo Go 開發測試** → 不需要 Mac
- **TestFlight / 上架** → 可以用 EAS Cloud Build（不需要本地 Mac）
- 只有要用 Xcode 直接build才需要Mac

---

## 下一步 checklist

- [ ] 把 `YOUR_REVENUECAT_IOS_KEY` 換成真實 key
- [ ] 在 app.json 把 `your-project-id-here` 換成 EAS project ID
- [ ] 設計 app icon (1024×1024 放 assets/icon.png)
- [ ] 設計 splash screen
- [ ] 把 prompt 庫從60條擴展到150條
- [ ] 用 `expo-font` 載入自訂字體（建議 Lora + DM Sans）
- [ ] 用 `react-native-skia` 取代 SVG canvas，讓筆觸更順滑
- [ ] 用 `react-native-view-shot` 儲存真實畫布截圖為thumbnail
