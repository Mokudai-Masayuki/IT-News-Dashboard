  const ArticleSource = (() => {
    const articles = [
      { id: 'copilot', title: 'Copilotに、作業の背景も渡してみる', original: 'Give Copilot the context behind your task', source: 'Microsoft Copilot', date: '2026-09-15', summary: '目的だけでなく、読み手や前提条件も一緒に伝える。いつもの依頼に背景を一文添える、という使い方を考える記事です。例えば社内向けの説明なら、相手の知識と判断してほしい点を先に整理すると、回答を見直しやすくなります。', url: 'https://www.microsoft.com/ja-jp/microsoft-copilot' },
      { id: 'github', title: 'コードを書く前に、変更の理由を残す', original: 'Capture the reason for a change in GitHub Issues', source: 'GitHub', date: '2026-09-10', summary: '小さな個人開発でも、変更したい理由をIssueに書いておく。数週間後の自分が判断をたどるための、小さな記録についてです。実装手順を細かく書くよりも、困っている場面と変更後に期待する結果を残すところから始めます。', url: 'https://docs.github.com/ja/issues' },
      { id: 'azure', title: 'Azureの予算通知は、利用停止のスイッチではない', original: 'Understand budgets and cost alerts in Azure', source: 'Microsoft Azure', date: '2026-09-02', summary: '予算への接近を知らせる通知と、処理を止める仕組みは別のもの。小さなアプリでも、使いすぎを防ぐ上限を考えておく話です。通知の送り先だけでなく、一日に実行できる回数や失敗時の再試行数も確認しておきます。', url: 'https://learn.microsoft.com/ja-jp/azure/cost-management-billing/costs/tutorial-acm-create-budgets' },
      { id: 'power', title: '繰り返し作業を、まず一つだけ自動化する', original: 'Start with one repetitive task in Power Automate', source: 'Power Platform', date: '2026-08-29', summary: '大きな業務フローではなく、毎回行う一つの転記や通知から始める。自動化する前に、入力と終わりの条件を見直します。例外が発生したときに誰が気づくかまで決めておくと、動かした後の確認作業も整理できます。', url: 'https://learn.microsoft.com/ja-jp/power-automate/' },
      { id: 'ai', title: 'AIの要約に「分からない」を残す', original: 'Keep uncertainty visible in AI summaries', source: 'Microsoft Learn', date: '2026-08-21', summary: '短い抜粋から記事全体を推測すると、読みやすくても根拠のない概要になります。取得できた内容と、不明な部分を分ける視点です。元の情報が足りないときは無理に説明を足さず、原文を確認すべき点が分かる形にします。', url: 'https://learn.microsoft.com/ja-jp/azure/ai-services/openai/' },
      { id: 'vscode', title: 'VS Codeの作業場所を、ワークスペースで分ける', original: 'Organize your work with VS Code workspaces', source: 'Visual Studio Code', date: '2026-09-12', summary: '複数のフォルダーをまとめ、作業ごとの設定を分ける。プロジェクトを行き来するときの準備を少し減らす考え方です。共通の個人設定と、その作業だけで使いたい設定を分けることで、切り替え時の調整を減らせます。', url: 'https://code.visualstudio.com/docs/editor/workspaces' },
      { id: 'actions', title: 'GitHub Actionsで、小さな確認を毎回走らせる', original: 'Run a small check with GitHub Actions', source: 'GitHub', date: '2026-09-05', summary: '変更のたびに繰り返す確認を、一つだけ自動で実行する。大きなテスト環境を組む前に、守りたい条件を一つ決めます。まずは構文チェックなど短時間で終わる確認を選び、失敗したときのログの読み方も試しておきます。', url: 'https://docs.github.com/ja/actions' },
      { id: 'functions', title: '常時起動しない、小さな定期処理', original: 'Schedule a small task with Azure Functions', source: 'Microsoft Azure', date: '2026-08-26', summary: '一日一回の処理に、ずっと動くサーバーは必要でしょうか。必要なときだけ実行する設計と、失敗時の確認方法を考えます。実行時刻だけでなく、前回の成功日時や同じ処理を再実行した場合の影響も確認することが大切です。', url: 'https://learn.microsoft.com/ja-jp/azure/azure-functions/functions-bindings-timer' },
      { id: 'lists', title: '個人メモとチームの一覧は、別々でいい', original: 'Choose what belongs in a shared Microsoft List', source: 'Microsoft 365', date: '2026-08-18', summary: 'すべての情報を一つの共有表に集める前に、誰が何を更新するかを整理する。個人の思考と共有する状態を分ける話です。チームには担当者や進行状況など判断に必要な項目を残し、考え途中のメモまで共有を義務づけない設計を考えます。', url: 'https://www.microsoft.com/ja-jp/microsoft-365/microsoft-lists' },
      { id: 'prompt', title: 'プロンプトを直す前に、良い結果を決める', original: 'Define a useful answer before tuning a prompt', source: 'Microsoft Copilot', date: '2026-08-12', summary: '欲しい回答の長さ、含めたい要素、避けたい推測を先に決める。言い回しの工夫よりも、結果の評価基準に注目します。同じ入力で回答を比べ、必要な情報がそろっているかを確かめると、改善した点を具体的に判断できます。', url: 'https://www.microsoft.com/ja-jp/microsoft-copilot' }
    ];

    async function getArticles() {
      return articles.map(article => ({ ...article }));
    }

    return { getArticles };
})();
