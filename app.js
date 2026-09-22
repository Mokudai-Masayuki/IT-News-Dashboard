  async function initializeApp() {
    const ARTICLES = await ArticleSource.getArticles();
    const SET_SIZE = 5;
    const MAX_SETS = 3;
    const COOLDOWN_DAYS = { dismiss: 21, revisit: 14, save: 7 };
    const LABELS = { dismiss: '見ない', revisit: 'また見たい', save: '後で読む' };
    const records = new Map();
    const batches = [{ ids: ARTICLES.slice(0, SET_SIZE).map(article => article.id), position: 0 }];
    let batchIndex = 0;
    let currentView = 'today';
    let lastAction = null;
    let pendingSave = null;
    let detailId = null;
    let gesture = null;
    const element = id => document.getElementById(id);
    const currentBatch = () => batches[batchIndex];
    const currentArticle = () => ARTICLES.find(article => article.id === currentBatch().ids[currentBatch().position]);
    const announce = text => { element('announcement').textContent = text; };
    const formatDate = value => new Date(value).toLocaleDateString('ja-JP', { year: 'numeric', month: 'numeric', day: 'numeric' });
    function nextOptions() {
      const used = new Set(batches.flatMap(batch => batch.ids));
      return ARTICLES.filter(article => !used.has(article.id));
    }
    function renderToday() {
      const article = currentArticle();
      const batch = currentBatch();
      element('reading').hidden = !article;
      element('ending').hidden = Boolean(article);
      element('undo-button').disabled = !lastAction;
      if (article) {
        element('position').textContent = `${batchIndex ? `追加${batchIndex}回目` : '今回'} · ${batch.position + 1} / ${batch.ids.length}`;
        element('progress').replaceChildren(...batch.ids.map((id, index) => {
          const marker = document.createElement('span');
          if (index <= batch.position) marker.className = 'done';
          return marker;
        }));
        element('article-title').textContent = article.title;
        element('article-summary').textContent = article.summary;
        element('article-source').textContent = article.source;
        element('article-date').textContent = formatDate(article.date);
        element('article-date').dateTime = article.date;
      } else {
        const existingNext = batchIndex + 1 < batches.length;
        const hasCapacity = batches.length < MAX_SETS;
        const available = nextOptions().length;
        element('next-button').hidden = !existingNext && (!hasCapacity || !available);
        element('end-note').textContent = existingNext
          ? '次のセットに戻れます'
          : !hasCapacity ? '本日の追加はここまでです'
          : !available ? '今、提示できる記事はありません'
          : `最大${Math.min(SET_SIZE, available)}件 · 本日の追加はあと${MAX_SETS - batches.length}回`;
      }
      const busy = Boolean(pendingSave);
      ['save-button', 'detail-button'].forEach(id => { element(id).disabled = busy; });
      element('save-label').textContent = busy ? '保存しました' : '後で読む';
      element('save-icon').setAttribute('href', busy ? '#check' : '#bookmark');
      element('save-button').classList.toggle('confirmed', busy);
    }
    function react(kind) {
      const article = currentArticle();
      if (!article || pendingSave || currentView !== 'today') return;
      const previous = records.get(article.id);
      const now = Date.now();
      lastAction = { id: article.id, previous: previous ? { ...previous } : null, batchIndex, position: currentBatch().position };
      const record = { firstManagedAt: now, savedAt: null, feeling: null, memo: '', ...previous };
      if (kind === 'save') record.savedAt ??= now;
      else record.feeling = kind;
      record.lastReaction = kind;
      record.reactedAt = now;
      record.nextEligibleAt = now + COOLDOWN_DAYS[kind] * 86400000;
      records.set(article.id, record);
      announce(kind === 'save' ? '保存しました' : LABELS[kind]);
      if (kind === 'save') {
        pendingSave = setTimeout(() => {
          pendingSave = null;
          currentBatch().position += 1;
          render();
        }, 700);
      } else currentBatch().position += 1;
      render();
    }
    function undo() {
      if (!lastAction) return;
      clearTimeout(pendingSave);
      pendingSave = null;
      const action = lastAction;
      const latestMemo = records.get(action.id)?.memo;
      if (action.previous) records.set(action.id, { ...action.previous, memo: latestMemo ?? action.previous.memo });
      else records.delete(action.id);
      batchIndex = action.batchIndex;
      currentBatch().position = action.position;
      lastAction = null;
      currentView = 'today';
      resetGesture();
      render();
      announce('直前の操作を取り消しました');
    }
    function nextBatch() {
      if (currentArticle() || pendingSave) return;
      if (batchIndex + 1 < batches.length) batchIndex += 1;
      else {
        const next = nextOptions().slice(0, SET_SIZE);
        if (!next.length || batches.length >= MAX_SETS) return;
        batches.push({ ids: next.map(article => article.id), position: 0 });
        batchIndex += 1;
      }
      render();
      announce('次のセットを表示しました');
    }
    function renderList(view) {
      const list = element(`${view}-list`);
      const query = view === 'search' ? element('search-input').value : '';
      const articles = ARTICLES.filter(article => {
        const record = records.get(article.id);
        if (!record || (view === 'saved' && !record.savedAt)) return false;
        return !query || [article.title, article.original, article.source, record.memo].some(text => text.includes(query));
      }).sort((first, second) => {
        const firstRecord = records.get(first.id);
        const secondRecord = records.get(second.id);
        return (secondRecord.savedAt ?? secondRecord.firstManagedAt) - (firstRecord.savedAt ?? firstRecord.firstManagedAt);
      });
      element(`${view}-count`).textContent = view === 'saved' ? `${articles.length}件の保存` : `${articles.length}件 · 保存・リアクション済み`;
      list.replaceChildren();
      if (!articles.length) {
        const empty = document.createElement('li');
        empty.className = 'empty';
        empty.textContent = query ? '一致する記事はありません' : view === 'saved' ? '保存した記事はまだありません' : 'リアクションした記事はまだありません';
        list.append(empty);
      }
      for (const article of articles) {
        const record = records.get(article.id);
        const item = document.createElement('li');
        const button = document.createElement('button');
        button.className = 'list-item';
        button.dataset.articleId = article.id;
        const title = document.createElement('h3');
        title.textContent = article.title;
        const meta = document.createElement('p');
        meta.className = 'list-meta';
        meta.textContent = `${article.source} · ${record.savedAt ? '保存' : 'リアクション'} ${formatDate(record.savedAt ?? record.firstManagedAt)}`;
        const status = document.createElement('p');
        status.className = 'list-state';
        status.textContent = [record.savedAt ? '後で読む' : '', record.feeling ? LABELS[record.feeling] : ''].filter(Boolean).join(' · ');
        button.append(title, meta, status);
        button.addEventListener('click', () => showDetail(article.id));
        item.append(button);
        list.append(item);
      }
    }
    function render() {
      for (const view of ['today', 'saved', 'search']) element(`${view}-view`).hidden = view !== currentView;
      document.querySelectorAll('[data-view]').forEach(button => {
        if (button.dataset.view === currentView) button.setAttribute('aria-current', 'page');
        else button.removeAttribute('aria-current');
      });
      renderToday();
      if (currentView !== 'today') renderList(currentView);
    }
    function showDetail(id) {
      const article = ARTICLES.find(candidate => candidate.id === id);
      const record = records.get(id);
      detailId = id;
      element('detail-title').textContent = article.title;
      element('detail-original').textContent = article.original;
      element('detail-date').textContent = `${article.source} · ${formatDate(article.date)}`;
      element('detail-summary').textContent = article.summary;
      element('detail-link').href = article.url;
      element('detail-state').textContent = record ? `${LABELS[record.lastReaction]} · 再提示候補 ${formatDate(record.nextEligibleAt)}以降` : '';
      element('memo-form').hidden = !record;
      element('memo').value = record?.memo ?? '';
      element('detail-dialog').showModal();
    }
    function resetGesture() {
      gesture = null;
      element('article').classList.add('settling');
      element('article').style.transform = '';
      element('swipe-label').style.opacity = '0';
    }
    element('article').addEventListener('pointerdown', event => {
      if (!event.isPrimary || event.button !== 0 || pendingSave || !currentArticle()) return;
      gesture = { pointerId: event.pointerId, startX: event.clientX, startY: event.clientY, axis: null, deltaX: 0 };
      element('article').classList.remove('settling');
      element('article').setPointerCapture(event.pointerId);
    });
    element('article').addEventListener('pointermove', event => {
      if (!gesture || event.pointerId !== gesture.pointerId) return;
      const deltaX = event.clientX - gesture.startX;
      const deltaY = event.clientY - gesture.startY;
      if (!gesture.axis && Math.max(Math.abs(deltaX), Math.abs(deltaY)) > 10) gesture.axis = Math.abs(deltaX) > Math.abs(deltaY) * 1.3 ? 'horizontal' : 'vertical';
      if (gesture.axis !== 'horizontal') return;
      gesture.deltaX = deltaX;
      element('article').style.transform = `translateX(${Math.max(-140, Math.min(140, deltaX))}px) rotate(${deltaX / 50}deg)`;
      element('swipe-label').textContent = deltaX < 0 ? '見ない' : 'また見たい';
      element('swipe-label').style.color = deltaX < 0 ? 'var(--cp-text)' : 'var(--cp-accent)';
      element('swipe-label').style.opacity = String(Math.min(Math.abs(deltaX) / 24, 1));
    });
    element('article').addEventListener('pointerup', event => {
      if (!gesture || event.pointerId !== gesture.pointerId) return;
      const threshold = Math.min(128, Math.max(104, element('article').clientWidth * .32));
      const reaction = gesture.axis === 'horizontal' && Math.abs(gesture.deltaX) >= threshold ? gesture.deltaX < 0 ? 'dismiss' : 'revisit' : null;
      resetGesture();
      if (reaction) react(reaction);
    });
    element('article').addEventListener('pointercancel', resetGesture);
    element('article').addEventListener('lostpointercapture', resetGesture);
    element('save-button').addEventListener('click', () => react('save'));
    element('undo-button').addEventListener('click', undo);
    element('next-button').addEventListener('click', nextBatch);
    element('detail-button').addEventListener('click', () => window.open(currentArticle().url, '_blank', 'noopener,noreferrer'));
    element('close-detail').addEventListener('click', () => element('detail-dialog').close());
    element('memo-form').addEventListener('submit', event => {
      event.preventDefault();
      const record = records.get(detailId);
      if (record) record.memo = element('memo').value;
      element('detail-dialog').close();
      render();
      announce('メモを保存しました');
    });
    element('search-input').addEventListener('input', () => renderList('search'));
    const shell = document.querySelector('.shell');
    element('search-input').addEventListener('focus', () => shell.classList.add('search-focused'));
    element('search-input').addEventListener('blur', () => shell.classList.remove('search-focused'));
    document.querySelectorAll('[data-view]').forEach(button => button.addEventListener('click', () => {
      currentView = button.dataset.view;
      resetGesture();
      render();
      const scrollArea = currentView === 'today' ? document.querySelector('.article-content') : element(currentView === 'search' ? 'search-list' : 'saved-view');
      scrollArea.scrollTo({ top: 0, behavior: 'instant' });
    }));
    render();
  }

  initializeApp().catch(error => console.error('Article loading failed:', error));
