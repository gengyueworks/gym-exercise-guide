# 数据来源与版权说明 / Data Sources

## 主数据源

| 项目 | yuhonas/free-exercise-db |
|---|---|
| 地址 | https://github.com/yuhonas/free-exercise-db |
| 协议 | The Unlicense（公有领域 / public domain） |
| 内容 | 873 个健身动作的结构化数据 + 1746 张示意图 |
| 抓取时间 | 2026-08-02 |

The Unlicense 是一个「放弃版权」协议：作者明确将作品置于公有领域，
任何人可以自由复制、修改、发布、使用、编译、销售或分发，用于任何目的，
商用或非商用均可，**无需署名**。

本项目仍然选择明确标注来源，因为这是应该做的事。

## 本仓库的原创部分

以下内容由 Yue（gengyueworks）创作，同样以 The Unlicense 释入公有领域：

- 873 个动作的中文名称翻译
- 按 35 类动作模式撰写的中文动作要点
- 常见错误提示（❌/✅）
- 训练建议（组数 / 次数 / 休息）
- 七大部位分区体系与器械 / 难度 / 肌群索引
- 中英对照数据集 `exercises.zh.json`

## 文件说明

| 文件 | 说明 |
|---|---|
| `exercises.json` | 上游原始数据，未作修改 |
| `exercises.zh.json` | 中英对照增强版，含中文名称、肌群、要点、常见错误 |

## 字段对照

| 原始字段 | 含义 | 中文增强字段 |
|---|---|---|
| `name` | 动作英文名 | `name_zh` |
| `primaryMuscles` | 主要肌群 | `primaryMuscles_zh` |
| `secondaryMuscles` | 协同肌群 | `secondaryMuscles_zh` |
| `equipment` | 器械 | `equipment_zh` |
| `level` | 难度 | `level_zh` |
| `category` | 训练类别 | `category_zh` |
| `instructions` | 英文步骤 | `cues_zh`（中文要点，非直译） |
| — | — | `mistakes_zh`（常见错误） |
| — | — | `archetype`（动作模式分类） |
