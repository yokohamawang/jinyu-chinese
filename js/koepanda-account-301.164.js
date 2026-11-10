/* 10.108.301.164 — isolated Supabase account and read-only cloud record view.
   Existing lesson flows and local progress keys are intentionally untouched. */
(function () {
  'use strict';

  var config = window.KP_CLOUD_CONFIG || {};
  var clientPromise = null;
  var client = null;
  var currentUser = null;
  var activeTab = 'signin';
  var dialog;
  var trigger;
  var content;
  var status;

  function configured() {
    return Boolean(config.url && config.publishableKey);
  }

  function getClient() {
    if (!clientPromise) {
      clientPromise = (async function () {
        if (!configured()) return null;
        var module = await import('https://esm.sh/@supabase/supabase-js@2');
        client = module.createClient(config.url, config.publishableKey, {
          auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
        });
        return client;
      })();
    }
    return clientPromise;
  }

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function setStatus(message, kind) {
    if (!status) return;
    status.textContent = message || '';
    status.dataset.kind = kind || 'info';
  }

  function friendlyError(error) {
    var message = String(error && (error.message || error) || '');
    if (/Invalid login credentials/i.test(message)) return 'メールアドレスまたはパスワードを確認してください。';
    if (/already registered|User already registered/i.test(message)) return 'このメールアドレスは登録済みです。ログインしてください。';
    if (/Password should be|password.*(characters|length)/i.test(message)) return 'パスワードは8文字以上で入力してください。';
    if (/Email not confirmed/i.test(message)) return '確認メールのリンクを開いてからログインしてください。';
    if (/Failed to fetch|NetworkError/i.test(message)) return '通信できませんでした。接続とSupabase設定を確認してください。';
    return '処理に失敗しました。入力内容とSupabase設定を確認してください。';
  }

  function clear(node) {
    while (node.firstChild) node.removeChild(node.firstChild);
  }

  function makeTrigger() {
    var home = document.getElementById('homeEffect');
    if (!home || document.getElementById('kpAccountTrigger')) return;
    trigger = el('button', 'kp-account-trigger', 'ログインして学習記録を見る');
    trigger.id = 'kpAccountTrigger';
    trigger.type = 'button';
    trigger.setAttribute('aria-haspopup', 'dialog');
    trigger.addEventListener('click', openDialog);
    home.insertAdjacentElement('afterend', trigger);
  }

  function createDialog() {
    if (dialog) return;
    dialog = el('dialog', 'kp-account-dialog');
    dialog.id = 'kpAccountDialog';
    dialog.setAttribute('aria-labelledby', 'kpAccountTitle');
    var shell = el('section', 'kp-account-shell');
    var header = el('header', 'kp-account-header');
    var titleWrap = el('div');
    titleWrap.append(el('p', 'kp-account-eyebrow', 'KOEPANDA ACCOUNT'));
    var heading = el('h2', '', '学習記録');
    heading.id = 'kpAccountTitle';
    titleWrap.append(heading);
    var close = el('button', 'kp-account-close', '閉じる');
    close.type = 'button';
    close.setAttribute('aria-label', '閉じる');
    close.addEventListener('click', function () { dialog.close(); });
    header.append(titleWrap, close);
    content = el('div', 'kp-account-content');
    status = el('p', 'kp-account-status');
    status.setAttribute('role', 'status');
    status.setAttribute('aria-live', 'polite');
    shell.append(header, content, status);
    dialog.append(shell);
    dialog.addEventListener('click', function (event) {
      if (event.target === dialog) dialog.close();
    });
    document.body.append(dialog);
  }

  function openDialog() {
    createDialog();
    render();
    if (!dialog.open) dialog.showModal();
    if (configured()) refreshSession();
  }

  function addLabel(form, labelText, input) {
    var wrap = el('label', 'kp-account-field');
    wrap.append(el('span', '', labelText), input);
    form.append(wrap);
  }

  function input(type, name, autocomplete, placeholder) {
    var field = document.createElement('input');
    field.type = type;
    field.name = name;
    field.autocomplete = autocomplete;
    field.placeholder = placeholder || '';
    field.required = type !== 'text';
    if (type === 'password') field.minLength = 8;
    return field;
  }

  function renderAuth() {
    clear(content);
    var form = el('form', 'kp-account-form');
    form.noValidate = true;
    if (activeTab === 'signup') {
      var name = input('text', 'display_name', 'name', '例：パンダ');
      name.required = false;
      addLabel(form, '表示名（任意）', name);
    }
    addLabel(form, 'メールアドレス', input('email', 'email', 'email', 'name@example.com'));
    addLabel(form, 'パスワード（8文字以上）', input('password', 'password', activeTab === 'signup' ? 'new-password' : 'current-password'));
    var submit = el('button', 'kp-account-primary', activeTab === 'signup' ? 'アカウントを作成' : 'ログイン');
    submit.type = 'submit';
    var switcher = el('button', 'kp-account-link', activeTab === 'signup' ? 'すでに登録済みの方はこちら' : '初めての方はこちらから登録');
    switcher.type = 'button';
    switcher.addEventListener('click', function () {
      activeTab = activeTab === 'signup' ? 'signin' : 'signup';
      setStatus('');
      renderAuth();
    });
    form.append(submit, switcher);
    form.addEventListener('submit', async function (event) {
      event.preventDefault();
      var data = new FormData(form);
      var email = String(data.get('email') || '').trim();
      var password = String(data.get('password') || '');
      if (!email || password.length < 8) {
        setStatus('メールアドレスと8文字以上のパスワードを入力してください。', 'error');
        return;
      }
      setStatus(activeTab === 'signup' ? 'アカウントを作成しています…' : 'ログインしています…');
      submit.disabled = true;
      try {
        var c = await getClient();
        if (!c) throw new Error('cloud_not_configured');
        var result = activeTab === 'signup'
          ? await c.auth.signUp({
              email: email,
              password: password,
              options: { emailRedirectTo: window.location.origin, data: { display_name: String(data.get('display_name') || '').trim(), timezone: 'Asia/Tokyo' } }
            })
          : await c.auth.signInWithPassword({ email: email, password: password });
        if (result.error) throw result.error;
        if (activeTab === 'signup' && result.data && result.data.user && !result.data.session) {
          setStatus('確認メールを送信しました。メール内のリンクを開いてからログインしてください。', 'success');
          activeTab = 'signin';
          renderAuth();
          return;
        }
        currentUser = result.data.user || null;
        await renderAccount();
      } catch (error) {
        setStatus(friendlyError(error), 'error');
      } finally {
        submit.disabled = false;
      }
    });
    content.append(form);
    var reset = el('button', 'kp-account-link kp-account-reset', 'パスワードを忘れた場合');
    reset.type = 'button';
    reset.addEventListener('click', async function () {
      var email = form.elements.email.value.trim();
      if (!email) { setStatus('先にメールアドレスを入力してください。', 'error'); return; }
      setStatus('再設定メールを送信しています…');
      try {
        var c = await getClient();
        var result = await c.auth.resetPasswordForEmail(email, { redirectTo: window.location.origin });
        if (result.error) throw result.error;
        setStatus('パスワード再設定メールを送信しました。', 'success');
      } catch (error) { setStatus(friendlyError(error), 'error'); }
    });
    content.append(reset);
    if (!configured()) {
      setStatus('SupabaseのProject URLと公開用キーを設定すると利用できます。', 'error');
    }
  }

  function statCard(label, value) {
    var card = el('div', 'kp-account-stat');
    card.append(el('span', '', label), el('strong', '', String(value)));
    return card;
  }

  function listSection(title, rows, formatter, emptyText) {
    var section = el('section', 'kp-account-list-section');
    section.append(el('h3', '', title));
    if (!rows || !rows.length) {
      section.append(el('p', 'kp-account-empty', emptyText));
      return section;
    }
    var list = el('ul', 'kp-account-list');
    rows.forEach(function (row) {
      var item = el('li', '', formatter(row));
      list.append(item);
    });
    section.append(list);
    return section;
  }

  function renderAccount() {
    clear(content);
    if (!currentUser) { renderAuth(); return; }
    var top = el('div', 'kp-account-user');
    top.append(el('p', 'kp-account-greeting', 'ログイン中'));
    top.append(el('strong', '', currentUser.email || ''));
    content.append(top);
    var loading = el('p', 'kp-account-loading', '学習記録を読み込んでいます…');
    content.append(loading);
    loadAccountData().then(function (result) {
      if (result.userId !== (currentUser && currentUser.id)) return;
      loading.remove();
      var profileName = result.profile && result.profile.display_name || currentUser.user_metadata && currentUser.user_metadata.display_name || '学習者';
      top.insertBefore(el('h3', '', profileName), top.firstChild);
      var profileForm = el('form', 'kp-account-profile-form');
      var profileInput = input('text', 'display_name', 'nickname', '表示名');
      profileInput.required = false;
      profileInput.value = result.profile && result.profile.display_name || '';
      addLabel(profileForm, '表示名を変更', profileInput);
      var saveProfile = el('button', 'kp-account-secondary', '表示名を保存');
      saveProfile.type = 'submit';
      profileForm.append(saveProfile);
      profileForm.addEventListener('submit', async function (event) {
        event.preventDefault();
        var displayName = profileInput.value.trim().slice(0, 60);
        if (!displayName) { setStatus('表示名を入力してください。', 'error'); return; }
        saveProfile.disabled = true;
        setStatus('表示名を保存しています…');
        try {
          var c = await getClient();
          var saved = await c.from('profiles').update({ display_name: displayName }).eq('user_id', currentUser.id).select('user_id').maybeSingle();
          if (saved.error) throw saved.error;
          if (!saved.data) throw new Error('profile_not_found');
          top.querySelector('h3').textContent = displayName;
          setStatus('表示名を保存しました。', 'success');
        } catch (error) { setStatus(friendlyError(error), 'error'); }
        finally { saveProfile.disabled = false; }
      });
      content.insertBefore(profileForm, top.nextSibling);
      var stats = el('div', 'kp-account-stats');
      stats.append(statCard('学習日数', result.dayCount), statCard('修了した単元', result.completedCount), statCard('ごほうび', result.rewardCount));
      content.insertBefore(stats, profileForm.nextSibling);
      content.append(listSection('最近の学習', result.progress.slice(0, 6), function (row) {
        return row.course_id + ' / ' + row.unit_id + '　' + (row.status === 'completed' ? '修了' : '学習中') + (row.score != null && row.total ? '　' + row.score + '/' + row.total : '');
      }, '学習記録はまだありません。'), listSection('ごほうび', result.rewards.slice(0, 6), function (row) {
        return row.reward_id + '　' + new Date(row.earned_at).toLocaleDateString('ja-JP');
      }, '獲得したごほうびはまだありません。'));
      setStatus('このアカウントの記録を表示しています。', 'success');
    }).catch(function (error) {
      loading.textContent = friendlyError(error);
      setStatus('記録を読み込めませんでした。データベースのRLSと列名を確認してください。', 'error');
    });
    var signout = el('button', 'kp-account-secondary', 'ログアウト');
    signout.type = 'button';
    signout.addEventListener('click', async function () {
      try {
        var c = await getClient();
        var result = await c.auth.signOut();
        if (result.error) throw result.error;
        currentUser = null;
        activeTab = 'signin';
        setStatus('ログアウトしました。', 'success');
        renderAuth();
      } catch (error) { setStatus(friendlyError(error), 'error'); }
    });
    content.append(signout);
  }

  async function loadAccountData() {
    var c = await getClient();
    var user = currentUser;
    if (!c || !user) throw new Error('sign_in_required');
    var results = await Promise.all([
      c.from('profiles').select('display_name,timezone').eq('user_id', user.id).maybeSingle(),
      c.from('learning_days').select('study_date', { count: 'exact', head: true }).eq('user_id', user.id),
      c.from('course_progress').select('unit_id', { count: 'exact', head: true }).eq('user_id', user.id).eq('status', 'completed'),
      c.from('course_progress').select('course_id,unit_id,status,score,total,updated_at').eq('user_id', user.id).order('updated_at', { ascending: false }).limit(30),
      c.from('earned_rewards').select('reward_id', { count: 'exact', head: true }).eq('user_id', user.id),
      c.from('earned_rewards').select('reward_id,earned_at').eq('user_id', user.id).order('earned_at', { ascending: false }).limit(30)
    ]);
    var failed = results.find(function (item) { return item.error; });
    if (failed) throw failed.error;
    return { userId: user.id, profile: results[0].data, dayCount: results[1].count || 0, completedCount: results[2].count || 0, progress: results[3].data || [], rewardCount: results[4].count || 0, rewards: results[5].data || [] };
  }

  async function refreshSession() {
    try {
      var c = await getClient();
      if (!c) return;
      var result = await c.auth.getSession();
      if (result.error) throw result.error;
      currentUser = result.data.session && result.data.session.user || null;
      if (dialog && dialog.open) render();
      if (currentUser && trigger) trigger.textContent = '学習記録を開く';
      else if (trigger) trigger.textContent = 'ログインして学習記録を見る';
    } catch (error) {
      if (dialog && dialog.open) setStatus(friendlyError(error), 'error');
    }
  }

  function render() {
    if (currentUser) renderAccount();
    else renderAuth();
  }

  function boot() {
    makeTrigger();
    if (!document.getElementById('homeEffect')) return;
    createDialog();
    if (configured()) {
      getClient().then(function (c) {
        if (!c) return;
        c.auth.getSession().then(function (result) {
          currentUser = result.data && result.data.session && result.data.session.user || null;
          if (currentUser && trigger) trigger.textContent = '学習記録を開く';
        });
        c.auth.onAuthStateChange(function (_event, session) {
          currentUser = session && session.user || null;
          if (trigger) trigger.textContent = currentUser ? '学習記録を開く' : 'ログインして学習記録を見る';
          if (dialog && dialog.open) render();
        });
      }).catch(function () {
        if (trigger) trigger.textContent = 'アカウント設定を確認';
      });
    }
  }

  window.KPCloud = window.KPCloud || {};
  window.KPCloud.configured = configured;
  window.KPCloud.client = getClient;
  window.KPCloud.loadAccountData = loadAccountData;
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true });
  else boot();
})();
