# 朝の発見：操作検証用の試作

スマートフォンを優先した、インストール不要のブラウザー試作です。`data-source.js` 内の日本語・原題・公開日・概要は検証用のダミーデータです。実在の記事の翻訳ではありません。「関連する公式情報」は参考サイトへのリンクであり、ダミー記事の原文ではありません。

## 起動方法

1. このフォルダーの `index.html` をブラウザーで開いてください。Windowsではファイルをダブルクリックするだけで起動できます。同じフォルダーのCSS・JavaScriptファイルも必要です。
2. PCでスマートフォン幅を確認する場合は、ブラウザーの開発者ツールで端末表示を選び、幅390px程度にします。
3. リロードすると、保存・リアクション・メモ・セット進行がすべて消え、最初から試せます。

ビルド、パッケージのインストール、インターネット接続は不要です。外部リンクを開く場合のみ通信が発生します。

実機スマートフォンで試す場合は、HTML・CSS・JavaScript一式を同じフォルダーに置いて端末の対応ブラウザーで開きます。`content://` では相対パスのファイル読み込みが制限される場合があります。ファイル表示が制限される端末では、PCにPythonがある場合、このフォルダーで `python -m http.server 8000 --bind 0.0.0.0` を実行し、同じ信頼できるWi-Fiに接続した端末から `http://PCのLAN内IPアドレス:8000/` を開けます。フォルダーがLANに公開されるため、検証後はCtrl+Cで停止してください。OSのネットワーク設定によっては接続できません。

## 操作と状態

- 左フリックは「見ない」。今の判断として記録し、再提示候補日を21日後に設定します。
- 右フリックは「また見たい」。再提示候補日は14日後。保存一覧には入りません。
- 「後で読む」は保存日時と7日後の再提示候補日を記録し、700msの「保存しました」表示後に次へ進みます。連打中は重複処理しません。
- 左右の代替ボタンはありません。記事を下寄せし、「後で読む」だけをフッター直上に配置しています。短い画面では記事部分を縦スクロールできます。
- フリック確定距離は記事幅の32%、最小104 CSS px・最大128 CSS pxです。画面幅390pxでは約108〜109pxです（スクロールバー幅によって変わります）。上下の移動はスクロール用で、距離未満のドラッグやキャンセルは確定しません。
- ホームのスクロールバーは本文右側の余白に分離し、本文との間に10pxの空きを確保しています。スクロールできる場合は細いバーとつまみが手がかりになります。
- ドラッグ中のラベルは30pxの太字と背景・枠線で強調します。ライト表示では「見ない」は黒系、「また見たい」は赤系です。
- ダミー概要は各3文に増やしました。タイトルの文字サイズは維持し、概要は行数で切り捨てず表示します。
- 今日の「記事の詳細」は外部リンクを直接開きます。ダミーのためリンク先は関連する公式情報です。保存・検索一覧の記事は、原題やメモを確認できる詳細ダイアログを開きます。
- 検索入力欄にフォーカスがある間はフッターメニューを非表示にし、フォーカスが外れたら再表示します。キーボードを閉じてもフォーカスが残る場合は非表示のままです。
- 検索窓はスクロール領域から分離し、検索結果一覧だけをスクロールさせます。
- フッターの追従・位置計算・VisualViewportによる判定は行いません。キーボード連動のviewport設定も削除しています。
- 「ひとつ戻す」は直前の1操作のみ取り消します。確認表示中・セット終了後・次セット開始直後も利用でき、記事と個人状態を戻します。作成済みセットは維持します。
- 1セット最大5件。「今日はここまで」で停止し、「次の5件を見る」を押した場合だけ追加します。上限は初回を含め3セットです。
- ダミー記事は10件で、同日重複を避けるため通常は2セットで候補切れになります。3セット目を埋めるための再利用はしません。
- 「保存」は検索窓なしの保存記事一覧です。「検索」は保存・リアクション済みの全記事の一覧で、空欄なら全件表示します。
- 検索は日本語タイトル・原題・情報源・任意メモそれぞれの単純な部分一致です。大文字小文字、空白、全角半角も区別します。概要、公開日、リアクション名は検索しません。正規化、同義語、あいまい検索、絞り込みはありません。
- 保存済みは保存日時降順。未保存のリアクションには保存日時がないため、初回リアクション日時を並び順の基準として代用します。同時刻は元の記事順です。
- メモは一覧から記事詳細を開いて任意入力できます。未管理の記事へのメモだけの登録はできません。

## 手動確認の順序

1. 短い横移動・縦移動・左右のフリックで、意図せず確定しないか確認します。
2. 「後で読む」を片手で押し、確認表示と次の記事への移動を見ます。「ひとつ戻す」で保存も取り消されるか確認します。
3. 5件操作して終了感を確認し、追加ボタンを押したときだけ残りの5件が出ることを確認します。
4. 「保存」から検索なしで記事を開きます。「検索」では日本語タイトル・原題・情報源・任意メモを試します。
5. 文字を拡大し、短い画面でも下部ボタンやナビゲーションに到達できるか確認します。

## この試作で確認できないこと

- 実際に朝の習慣が続くか、本人が数秒で判断できるかは、実機と本人による試用が必要です。PCの端末表示だけでは片手操作やiOS/Android固有のジェスチャーを保証できません。
- 操作検証は完了とします。現在の実機確認は `content://` でローカルファイルを直接開く環境であり、通常のHTTPS配信とブラウザーUIの挙動が異なる可能性があります。HTTPS配信後にAndroid Chrome / Edgeの通常タブとインストール済みPWAで、検索欄のフォーカス・解除時のフッター表示、キーボード開閉、入力欄の視認性、画面回転、URLバー表示を再検証します。PCのフォーカステストは実機のキーボード動作を保証しません。
- 再提示候補日は保持しますが、日をまたぐ推薦・21日後の再提示・鮮度判断は実装していません。記事順は固定です。
- 10件のため、通常操作による3セット目の提示は確認できません。上限の制御はコードにあります。
- リロード・日付変更をまたぐ日次上限、複数端末同期、永続化、認証、実ニュースの品質、日本語化の精度は対象外です。
- RSS、AI、Azure、Discord、通知、アクセス解析、外部フォント、外部サービスのスクリプトは使いません。JavaScriptは同じフォルダーから読み込みます。
- 検索結果の表示速度はダミー10件だけの検証であり、大量データへの性能を保証しません。

## 構成とアイコン

| ファイル | 役割 |
| --- | --- |
| `index.html` | 画面のHTML、アイコン、CSS・JavaScriptの読み込み |
| `styles.css` | 既存のスタイル一式（値・ルールは変更なし） |
| `theme.js` | 描画前のテーマ判定（既存処理を移動） |
| `data-source.js` | ダミー10記事と、唯一の記事取得窓口 `ArticleSource.getArticles()` |
| `app.js` | 記事取得後の描画・フリック・保存・検索・メモ・画面切替 |

ビルド・追加ライブラリーは不要です。ローカルのHTML直接起動を維持するため通常のscriptを使い、`data-source.js` → `app.js` の順で読み込みます。

### 記事取得の差し替え

- `app.js` の `initializeApp()` は `await ArticleSource.getArticles()` で記事を受け取り、取得元を参照しません。
- `getArticles()` は `Promise<Array<Article>>` を返します。各記事は文字列の `id`（一意）、`title`（日本語）、`original`、`source`、`date`（ISO形式）、`summary`、`url` を持ちます。配列順が初回の提示順になります。
- 現在はダミー配列のコピーを返します。配列そのものはデータ取得ファイルの内部だけに存在し、描画側から直接参照できません。
- Azure API接続時は `data-source.js` の `getArticles()` を変更します。HTTP取得、認証付きリクエスト、HTTPステータス確認、応答の検証・上記形式への変換、必要ならページ分割の集約をこのファイル内で行います。キーなどの秘密情報は置きません。
- この返却形式を維持する限り、記事取得元の変更のために `app.js` やHTML・CSSを書き換える必要はありません。
- 記事取得失敗は現在コンソールへ出力します。通信中・エラー時の専用UIは試作の挙動を変えないため追加していません。実API接続時の認証画面や通信失敗時のUXは後続ステップで扱います。
- 保存・リアクション・メモ・セット状態はこれまでどおり `app.js` のメモリ内です。これらのAPI化、サーバー側の日次選定・再提示、永続化は記事取得元の差し替えとは別の後続作業です。

アイコンはLucideのSVG形状をインラインで使用しています。

## Phase 2 ステップ2：Azure OpenAI事前確認（完了）

確認日：2026-09-21。以下はユーザーによるポータル・Azure CLIでの確認結果です。今回の記録作業ではAzure環境を再照会していません。

| 項目 | 確認結果 |
| --- | --- |
| サブスクリプション名 | Visual Studio Premium with MSDN |
| オファーID | MS-AZR-0063P |
| 種別 | Visual Studio Enterprise 特典（MVP/RD） |
| 使用制限 | 有効。残クレジットあり、請求額0 |
| Azure OpenAI利用申請 | 不要。リソース作成可能な状態を確認 |
| リージョン | Japan Eastを選択可能 |
| 採用モデル | gpt-5.4-mini |
| モデルバージョン | 2026-03-17 |
| デプロイ種別 | GlobalStandard |
| 提供終了予定 | 2027-09-21。作成時・運用中に公式情報を再確認 |
| モデル確認方法 | `az cognitiveservices model list` |
| クォータ確認方法 | `az cognitiveservices usage list`（Japan East） |
| クォータ名 | OpenAI.GlobalStandard.gpt-5.4-mini |
| クォータ値 | Limit: 1000 / Current: 0（未使用）。CLI表示の生値。単位は未記録のため、1,000 TPMとは解釈しない |
| リソース整理 | 不要なQnA Maker、Minecraft関連等を削除済み |
| 現在の消費 | ほぼゼロ |

- ステップ2は完了。リソース作成可能・モデル提供・クォータの確認であり、Azure OpenAIリソース作成、モデルデプロイ、推論成功を確認した記録ではありません。
- Creditsの正確な残高、次回更新日、特典終了日、既存Azure OpenAI/Foundryリソースの有無は今回の報告には含まれていません。必要時に追記し、推測で補いません。
- Visual Studio特典は開発・テスト用途限定です。本人専用でも本番運用が自動的に対象になるわけではなく、継続運用への移行時に契約条件を再確認します。
- GlobalStandardはJapan Eastのリソースでも日本国内だけでの推論処理を保証しません。

### MVP構成の変更（確定）

- Application InsightsはVisual Studio特典のCredits対象外であることを確認したため、MVP構成から除外します。自動作成・自動有効化もしません。
- Application Insights用のLog Analyticsワークスペース、SDK、接続文字列設定、アラートは追加しません。既存の監視リソースの削除を指示するものではありません。
- 監視を省略する案を第一候補とします。監視を追加する場合は、既存のデプロイ結果やAzure標準メトリックの手動確認から検討し、有料ログ収集・外形監視は別途承認と費用確認を必要とします。
- 後続のAI処理に必要な利用回数・トークン数の制限、重複防止、再試行上限は監視機能とは別であり、省略しません。

次はステップ3（Static Web AppsへのHTTPS配信と本人限定アクセス設定）の計画確認です。HTTPS配信、認証、API、RSS、AI呼び出し、永続化、PWA、監視の実装は今回行っていません。

参考：
- Visual Studio特典の制限：https://learn.microsoft.com/en-us/visualstudio/subscriptions/faq/subscriber/azure/
- モデルの提供終了予定：https://learn.microsoft.com/en-us/azure/foundry/openai/concepts/model-retirement-schedule
- モデル・リージョン提供状況：https://learn.microsoft.com/en-us/azure/foundry/foundry-models/concepts/models-sold-directly-by-azure-region-availability

Lucide icons: https://lucide.dev/ (ISC License)

Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2022 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2022.

Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted, provided that the above copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.