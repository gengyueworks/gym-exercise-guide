# Gym Exercise Guide · 健身动作指南

> 我在健身房看到器械不会用。练腿的机器有七八种，每种练哪块肌肉不一样，没人告诉我。
>
> 网上搜过很多次。抖音一段 30 秒的视频，知乎一篇长文讲理论，小红书一张截图配三行字，收藏了一堆还是不知道自己该练什么。最烦的是信息碎片化，每个平台一点点，拼不成一张完整的图。
>
> 所以我自己做了这个库。873 个动作，按部位分类，每个动作配示意图加中文步骤。打开就能查，查完就能练。不用翻三个 App，不用看广告。

> *I walked into the gym and didn't know how to use the machines. There are seven or eight leg machines, each training a different muscle, and no one told me which was which.*
>
> *I searched online again and again — a 30-second clip on Douyin, a long theory post on Zhihu, a screenshot with three lines on Xiaohongshu. I bookmarked a pile but still didn't know what to train. The worst part is fragmented information: a little from each platform that never adds up to a complete picture.*
>
> *So I built this library myself. 873 exercises, sorted by body part, each with demonstration images and Chinese step-by-step cues. Open it, look it up, train. No hopping between three apps, no ads.*

---

**873 个动作 · 7 大部位 · 中英双语 · 1746 张动作示意图 · 全部开源**

> 873 exercises · 7 body parts · Bilingual (中文/English) · 1746 demonstration images · Fully open source

## 目录 / Contents

| 部位 | Body Part | 动作数 | 索引 |
|---|---|:---:|---|
| 🫁 胸 | Chest | 83 | [打开](exercises/chest/README.md) |
| 🔙 背 | Back | 108 | [打开](exercises/back/README.md) |
| 🦵 腿臀 | Legs & Glutes | 245 | [打开](exercises/legs/README.md) |
| 🏋️ 肩 | Shoulders | 119 | [打开](exercises/shoulders/README.md) |
| 💪 手臂 | Arms | 147 | [打开](exercises/arms/README.md) |
| 🎯 核心 | Core | 93 | [打开](exercises/core/README.md) |
| 🏃 全身 | Full Body | 78 | [打开](exercises/full-body/README.md) |
| | **合计 / Total** | **873** | |

## 换个方式找动作 / Other Indexes

- [按器械查 By equipment](indexes/by-equipment.md) — 杠铃 / 哑铃 / 绳索 / 固定器械 / 自重 / 壶铃… (barbell / dumbbell / cable / machine / bodyweight / kettlebell…)
- [按难度查 By level](indexes/by-level.md) — 新手 / 进阶 / 高手 (beginner / intermediate / advanced)
- [按肌群查 By muscle](indexes/by-muscle.md) — 17 个具体肌群 (17 specific muscles)
- [新手入门推荐 For beginners](indexes/beginner.md) — 不知道从哪开始就看这个 (start here if unsure)

## 每个动作页面包含什么 / What's on each exercise page

- **中英文名称 Bilingual name** — 中文名按国内健身房通用叫法翻译 (Chinese names follow common gym usage)
- **目标肌群 Target muscles** — 主要肌群 + 协同肌群，中文标注 (primary + secondary, labeled in Chinese)
- **动作示意图 Demonstration images** — 起始位 / 结束位两张图 (start / end poses)
- **动作要点 Cues** — 中文分步说明，含呼吸节奏 (step-by-step Chinese cues with breathing)
- **常见错误 Common mistakes** — ❌ 错误做法 + ✅ 正确做法
- **训练建议 Training tips** — 组数次数与休息时间 (sets, reps, rest)
- **英文原文 Original English** — 可展开对照原始英文步骤 (expandable)

## 怎么用 / How to use

1. 按部位点进去 —— 今天练胸就点胸 / Pick a body part (e.g. chest for chest day)
2. 在索引表里按器械或难度找到动作 / Or browse indexes by equipment or level
3. 看示意图 + 读要点，重点看「常见错误」/ Read cues, watch for "common mistakes"
4. 练 / Train

手机上直接用 GitHub 网页版打开就行，图片和表格都能正常显示。
*Works on GitHub mobile web — images and tables render fine.*

## 数据来源与版权 / Data Source & License

### 数据来源

动作数据与示意图来自 **[yuhonas/free-exercise-db](https://github.com/yuhonas/free-exercise-db)**，该项目采用 **[The Unlicense](https://unlicense.org/)** 协议发布，属于**公有领域（public domain）**，可自由使用、修改、分发和商用，无需署名。

Exercise data and demonstration images come from [yuhonas/free-exercise-db](https://github.com/yuhonas/free-exercise-db), released under [The Unlicense](https://unlicense.org/) (public domain).

### 本项目

- 中文动作名称翻译、中文动作要点、常见错误提示、训练建议、分类体系与内容组织：**Yue（[gengyueworks](https://github.com/gengyueworks)）**
- 本项目同样采用 **The Unlicense** 协议开源，见 [LICENSE](LICENSE)
- 你可以随意复制、修改、二次分发，商用也没问题，不需要问我

### 一句话说明

> 原始数据是公有领域的，我做的是中文化和重新组织，我也把它放回公有领域。
>
> *The raw data is public domain. I added the Chinese translation and reorganized it — and I'm releasing it back into the public domain.*

## 关于内容的说明 / A note on content

中文动作要点**不是**对英文原文的逐句直译。原始英文步骤偏冗长（源自健美网站的模板化文案），直译成中文既啰嗦又不好用。所以中文部分是按**动作模式**（卧推类、深蹲类、髋铰链类、拉伸类等 35 类）重新撰写的要点，目标是「在健身房里看一眼就知道怎么做」。

每个页面底部都保留了**英文原始步骤**，可以展开对照。

如果你发现某个动作的中文描述有问题，欢迎提 Issue 或 PR。

## 免责声明 / Disclaimer

本项目仅供参考，不构成医疗或专业训练建议。开始任何训练计划前，尤其是有伤病史的情况下，请先咨询医生或专业教练。使用大重量时请确保有人保护。

---

<sub>Data: [free-exercise-db](https://github.com/yuhonas/free-exercise-db) (Unlicense) · 中文内容: Yue / gengyueworks · License: [The Unlicense](LICENSE)</sub>
