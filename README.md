## Tokyo Friendliness App

This app optimizes prefecture groupings based on friendliness data to maximize total friendship scores using a combinatorial optimization algorithm. It fetches population data via API and assigns colors to each prefecture based on groupings.

このアプリは、友好度データに基づき都道府県のグループ分けを最適化し、総合的な友情スコアを最大化する組合せ最適化アルゴリズムを用いています。また、API経由で人口データを取得し、グループごとに都道府県へ色分けを行います。

---

## Optimization Algorithm Details

This optimization is achieved using an **advanced combinatorial optimization algorithm** that combines the following techniques:

- **Dynamic Programming with Memoization**:
  - **Stores and reuses the results of overlapping subproblems** to eliminate redundant calculations and significantly reduce overall processing time.
- **Branch-and-Bound Pruning**:
  - Immediately **eliminates (prunes) search branches** when it's determined they cannot possibly yield a better score than the current best solution, dramatically reducing the search space by cutting off inefficient paths.
- **Backtracking**:
  - Systematically explores the solution space by moving forward until a solution is found or a dead end is reached. It then **reverts to a previous decision point** to try an alternative option, ensuring all possible valid groupings are explored comprehensively.

---

## 最適化アルゴリズムの詳細

この最適化は、以下の技術を組み合わせた**高度な組合せ最適化アルゴリズム**によって実現されています。

- **動的計画法（Dynamic Programming with Memoization）**：
  - 計算過程で**重複する部分問題の解**を記憶（メモ化）し、それを再利用することで、計算の冗長性を排除し、処理時間を大幅に短縮します。
- **枝刈り（Branch-and-Bound Pruning）**：
  - 探索中のノードで、現在の最良スコアを超える結果が**絶対に得られない**と判断された場合、その先の探索を即座に打ち切ります。これにより、非効率な探索パスを剪定（せんてい）し、探索空間を劇的に削減します。
- **バックトラック（Backtracking）**：
  - 探索ツリーを順に進め、行き詰まった（または枝刈りされた）場合に、**直前の決定点**に戻り、別の選択肢を試します。これにより、すべての可能なグループ分けを体系的かつ網羅的に探索します。

---

## Quick Start

1. Clone this repository  
   このリポジトリをクローン（複製）します。
2. Run `npm install` to install dependencies  
   依存パッケージをインストールするために **`npm install`** を実行します。
3. Run `npm run dev` to start the development server  
   開発サーバーを起動するために **`npm run dev`** を実行します。

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.  
ブラウザで **[http://localhost:3000](http://localhost:3000)** を開くと、アプリの動作を確認できます。

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.  
**`app/page.tsx`** を編集することで、ページの内容をすぐに変更し始められます。ファイルを保存すると、ページは自動的に更新されます。

This project uses `next/font` to automatically optimize and load Geist, a new font family for Vercel.  
このプロジェクトでは、Vercelの新しいフォントファミリー「Geist」を自動的に最適化し読み込むために **`next/font`** を利用しています。

You do not need to run `npm run build` for local development.  
ローカル開発においては、**`npm run build`** を実行する必要はありません。

## Deployment

This app is deployed online via AWS Amplify:  
このアプリは AWS Amplify を利用してオンラインで公開されています。

**[https://chore-enable-ssr-compute.d20y2f4xdero1h.amplifyapp.com/](https://chore-enable-ssr-compute.d20y2f4xdero1h.amplifyapp.com/)**

- Automatic builds from the SSR compute branch  
  SSR computeブランチからの自動ビルド
- SSR and static content supported  
  SSR（サーバーサイドレンダリング）と静的コンテンツの両方に対応
- Environment variables securely managed  
  環境変数を安全に管理

## Architecture Flowchart

```mermaid
graph TD

  Dev[Developer] -->|push| GH[GitHub]
  GH -->|trigger| CI[ci.yml / GitHub Actions]
  CI -->|deploy| Amplify[AWS Amplify<br>デプロイ]
  Amplify -->|serve| UI[アプリ画面 App Interface]

  A[CSVファイル friendliness.csv] -->|data| B[parseFriendlinessCSV.ts と CSV解析]
  B -->|build| C[optimizationService.ts と FriendlinessMap生成]
  C -->|use| D[最適化アルゴリズム Optimization Algorithm]
  D -->|output| E[colorLegendUtils.ts と 色割り当て処理]
  E -->|color| F[UI Components / UIコンポーネント, Legend and Population Table / 凡例・人口表]

  G[e-Stat API 政府統計] -->|population| H[getStatsData.ts と 人口データ取得・フィルタ]
  H -->|link| F

  F -->|display| UI

  subgraph DataSources[Data Sources]
    A
    G
  end

  subgraph ProcessingModules[Processing Modules]
    B
    C
    D
    E
    H
  end

  subgraph OutputSection[Output]
    F
    UI
  end
```

## Tech Stack

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-000?logo=nextdotjs&logoColor=white" height="40"/>
  <img src="https://img.shields.io/badge/TypeScript-3178c6?logo=typescript&logoColor=white" height="40"/>
  <img src="https://img.shields.io/badge/React-20232a?logo=react&logoColor=61dafb" height="40"/>
  <img src="https://img.shields.io/badge/CSS%20Modules-264de4?logo=css3&logoColor=white" height="40"/>
  <img src="https://img.shields.io/badge/AWS%20Amplify-ff9900?logo=amazon-aws&logoColor=white" height="40"/>
  <img src="https://img.shields.io/badge/PapaParse-4b8bbe?logo=data:image/svg+xml;base64,PHN2ZyBmaWxsPSIjMDAwIiBoZWlnaHQ9IjE2IiB2aWV3Qm94PSIwIDAgMjQgMjQiIHdpZHRoPSIxNiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTIgM2MtNS4yMyAwLTkgNC4yNy05IDkgMCA1LjI0IDQuMjcgOSA5IDkgNS4yNCAwIDktNC4yNiA5LTkgMC01LjczLTQuMjYtOS05LTk6bTAgMTZjLTMuODMgMC03LTMuMTcT7LTctNyA3IDAgMy44My0zLjE3IDctNyA3eiIvPjwvc3ZnPg==" height="40"/>
  <img src="https://img.shields.io/badge/ESLint-4b32c3?logo=eslint&logoColor=white" height="40"/>
  <img src="https://img.shields.io/badge/Prettier-f7b93e?logo=prettier&logoColor=white" height="40"/>
  <img src="https://img.shields.io/badge/Mermaid-41b883?logo=mermaid&logoColor=white" height="40"/>
  <img src="https://img.shields.io/badge/Git-F05032?logo=git&logoColor=white" height="40"/>
  <img src="https://img.shields.io/badge/GitHub-181717?logo=github&logoColor=white" height="40"/>
</p>
