# とんがり親分 iNFT

語りかけてくるとんがり親分。感情が変化するAIキャラクターチャットアプリ。

## デプロイ手順（Vercel）

### 1. GitHubにリポジトリを作成
```bash
git init
git add .
git commit -m "initial commit"
git branch -M main
git remote add origin https://github.com/あなたのユーザー名/tongari-inft.git
git push -u origin main
```

### 2. Vercelにデプロイ
1. https://vercel.com にアクセス（GitHubアカウントでログイン）
2. 「New Project」→ 作成したリポジトリを選択
3. 「Environment Variables」に以下を追加：
   - Key: `ANTHROPIC_API_KEY`
   - Value: `sk-ant-...`（あなたのAPIキー）
4. 「Deploy」ボタンを押すだけ！

数分で `https://tongari-inft.vercel.app` のようなURLが発行されます。

## ローカルで動かす場合

```bash
cp .env.local.example .env.local
# .env.local にAPIキーを入力

npm install
npm run dev
```

http://localhost:3000 で動作確認できます。

## 仕組み

- フロントエンド（Next.js）→ `/api/chat` にPOST
- `/api/chat`（サーバーサイド）→ Anthropic APIを呼び出し
- APIキーはサーバー側のみ。ブラウザには一切露出しない✅
