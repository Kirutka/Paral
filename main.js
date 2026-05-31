import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import { MonacoBinding } from 'y-monaco';
import * as monaco from 'monaco-editor';

import EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';

self.MonacoEnvironment = {
  getWorker: function () {
    return new EditorWorker();
  }
};

// ----------------------------------------------------------------------
// Настройка автодополнения для Python
// ----------------------------------------------------------------------
const pythonKeywords = [
  'def', 'class', 'if', 'elif', 'else', 'for', 'while', 'break', 'continue', 'pass',
  'return', 'yield', 'raise', 'try', 'except', 'finally', 'with', 'as', 'import', 'from',
  'lambda', 'True', 'False', 'None', 'and', 'or', 'not', 'in', 'is', 'assert', 'nonlocal',
  'global', 'async', 'await', 'del', 'exec', 'print'
];

const pythonBuiltins = [
  'abs', 'all', 'any', 'bin', 'bool', 'bytearray', 'bytes', 'callable', 'chr', 'classmethod',
  'compile', 'complex', 'delattr', 'dict', 'dir', 'divmod', 'enumerate', 'eval', 'exec',
  'filter', 'float', 'format', 'frozenset', 'getattr', 'globals', 'hasattr', 'hash', 'help',
  'hex', 'id', 'input', 'int', 'isinstance', 'issubclass', 'iter', 'len', 'list', 'locals',
  'map', 'max', 'memoryview', 'min', 'next', 'object', 'oct', 'open', 'ord', 'pow', 'print',
  'property', 'range', 'repr', 'reversed', 'round', 'set', 'setattr', 'slice', 'sorted',
  'staticmethod', 'str', 'sum', 'super', 'tuple', 'type', 'vars', 'zip', '__import__'
];

const pythonModules = [
  'os', 'sys', 'json', 're', 'math', 'random', 'datetime', 'time', 'collections',
  'itertools', 'functools', 'typing', 'pathlib', 'argparse', 'logging', 'threading',
  'subprocess', 'socket', 'http', 'urllib', 'csv', 'sqlite3', 'xml', 'html', 'hashlib',
  'base64', 'struct', 'pickle', 'copy', 'pprint', 'traceback', 'unittest', 'doctest'
];
const pythonSnippets = [
  {
    label: 'ifmain',
    detail: 'if __name__ == "__main__"',
    insertText: 'if __name__ == "__main__":\n\t${1:main()}',
    documentation: 'Точка входа при запуске скрипта'
  },
  {
    label: 'def',
    detail: 'Определение функции',
    insertText: 'def ${1:function_name}(${2:params}):\n\t${3:pass}',
    documentation: 'Создание новой функции'
  },
  {
    label: 'class',
    detail: 'Определение класса',
    insertText: 'class ${1:ClassName}:\n\tdef __init__(self, ${2:params}):\n\t\t${3:pass}',
    documentation: 'Создание нового класса'
  },
  {
    label: 'for',
    detail: 'Цикл for',
    insertText: 'for ${1:item} in ${2:iterable}:\n\t${3:pass}',
    documentation: 'Цикл for по итератору'
  },
  {
    label: 'while',
    detail: 'Цикл while',
    insertText: 'while ${1:condition}:\n\t${2:pass}',
    documentation: 'Цикл while с условием'
  },
  {
    label: 'try',
    detail: 'Блок try/except',
    insertText: 'try:\n\t${1:code}\nexcept ${2:Exception} as e:\n\t${3:handle}',
    documentation: 'Обработка исключений'
  },
  {
    label: 'with',
    detail: 'Менеджер контекста',
    insertText: 'with ${1:open("file.txt")} as ${2:f}:\n\t${3:code}',
    documentation: 'Контекстный менеджер (например, для файлов)'
  }
];
monaco.languages.registerCompletionItemProvider('python', {
  triggerCharacters: ['.', ' '],
  provideCompletionItems: (model, position) => {
    const word = model.getWordUntilPosition(position);
    const range = {
      startLineNumber: position.lineNumber,
      endLineNumber: position.lineNumber,
      startColumn: word.startColumn,
      endColumn: word.endColumn
    };

    const suggestions = [];

    pythonKeywords.forEach(keyword => {
      suggestions.push({
        label: keyword,
        kind: monaco.languages.CompletionItemKind.Keyword,
        insertText: keyword,
        range: range,
        detail: 'Ключевое слово Python'
      });
    });

    pythonBuiltins.forEach(builtin => {
      suggestions.push({
        label: builtin,
        kind: monaco.languages.CompletionItemKind.Function,
        insertText: builtin,
        range: range,
        detail: 'Встроенная функция Python'
      });
    });

    pythonModules.forEach(module => {
      suggestions.push({
        label: module,
        kind: monaco.languages.CompletionItemKind.Module,
        insertText: module,
        range: range,
        detail: 'Стандартный модуль Python'
      });
    });

    pythonSnippets.forEach(snippet => {
      suggestions.push({
        label: snippet.label,
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: snippet.insertText,
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        range: range,
        detail: snippet.detail,
        documentation: snippet.documentation
      });
    });

    return { suggestions };
  }
});
// ----------------------------------------------------------------------
// Управление темами
// ----------------------------------------------------------------------

function defineCustomThemes() {
  monaco.editor.defineTheme('soft', {
    base: 'vs',
    inherit: true,
    rules: [
      { token: 'comment', foreground: '6a7a8a', fontStyle: 'italic' },
      { token: 'keyword', foreground: '5a7a8a' },
      { token: 'string', foreground: '6c8c9c' },
      { token: 'number', foreground: 'b36b6b' },
      { token: 'function', foreground: '5a7a8a' },
      { token: 'type', foreground: '6a8a7a' },
    ],
    colors: {
      'editor.background': '#f0f2f5',
      'editor.foreground': '#2c3e50',
      'editorLineNumber.foreground': '#9aa8b8',
      'editor.selectionBackground': '#c5d0d8',
      'editor.inactiveSelectionBackground': '#d5dce4',
      'editorCursor.foreground': '#5a7a8a',
      'editorWhitespace.foreground': '#c5c8ce',
    }
  });
}
function applyTheme(theme) {
  document.body.classList.remove('theme-light', 'theme-dark', 'theme-soft');
  document.body.classList.add(`theme-${theme}`);

  document.querySelectorAll('.theme-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.theme === theme);
  });

  if (editor) {
    let monacoTheme = 'vs';
    if (theme === 'dark') monacoTheme = 'vs-dark';
    else if (theme === 'soft') monacoTheme = 'soft';
    else monacoTheme = 'vs';
    editor.updateOptions({ theme: monacoTheme });
  }

  try {
    localStorage.setItem('codesync_theme', theme);
  } catch(e) {}
}
function loadSavedTheme() {
  let theme = 'light';
  try {
    const saved = localStorage.getItem('codesync_theme');
    if (saved && ['light', 'dark', 'soft'].includes(saved)) {
      theme = saved;
    }
  } catch(e) {}
  applyTheme(theme);
}

// ----------------------------------------------------------------------
// Остальной код приложения
// ----------------------------------------------------------------------
const $ = (id) => document.getElementById(id);
const generateRoomId = () => Math.random().toString(36).substring(2, 8).toUpperCase();

const loginScreen = $('login-screen');
const editorScreen = $('editor-screen');
const statusDot = $('statusDot');
const statusText = $('statusText');
const participantsList = $('participantsList');
const roomBadge = $('roomBadge');
const errorMsg = $('errorMsg');
const fileListDiv = $('fileList');
const newFileBtn = $('newFileBtn');
const runBtn = $('runBtn');
const clearBtn = $('clearBtn');
const outputDiv = $('output');

let editor = null;
let provider = null;
let ydoc = null;
let filesMap = null;
let currentFile = null;
let currentBinding = null;
let currentRoomId = null;

function showError(msg) {
  if (!errorMsg) return;
  errorMsg.textContent = msg;
  errorMsg.style.display = 'block';
  setTimeout(() => { errorMsg.style.display = 'none'; }, 8000);
}

function showToast(message) {
  const toast = $('copyToast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2000);
}

// ----------------------------------------------------------------------
// Модальные окна (общие)
// ----------------------------------------------------------------------
function showInputModal(modalId, defaultValue = '') {
  return new Promise((resolve) => {
    const overlay = $(modalId);
    if (!overlay) return resolve(null);
    const input = overlay.querySelector('input');
    const okBtn = overlay.querySelector('.ok');
    const cancelBtn = overlay.querySelector('.cancel');
    input.value = defaultValue;
    overlay.classList.add('active');
    input.focus();

    const onOk = () => {
      cleanup();
      resolve(input.value.trim());
    };
    const onCancel = () => {
      cleanup();
      resolve(null);
    };
    const onKeydown = (e) => {
      if (e.key === 'Enter') onOk();
      else if (e.key === 'Escape') onCancel();
    };
    const onOverlayClick = (e) => {
      if (e.target === overlay) onCancel();
    };
    const cleanup = () => {
      overlay.classList.remove('active');
      okBtn.removeEventListener('click', onOk);
      cancelBtn.removeEventListener('click', onCancel);
      document.removeEventListener('keydown', onKeydown);
      overlay.removeEventListener('click', onOverlayClick);
    };
    okBtn.addEventListener('click', onOk);
    cancelBtn.addEventListener('click', onCancel);
    document.addEventListener('keydown', onKeydown);
    overlay.addEventListener('click', onOverlayClick);
  });
}

function showConfirmModal(modalId, message) {
  return new Promise((resolve) => {
    const overlay = $(modalId);
    if (!overlay) return resolve(false);
    const messageEl = overlay.querySelector('#deleteFileMessage');
    if (messageEl) messageEl.textContent = message;
    const okBtn = overlay.querySelector('.ok');
    const cancelBtn = overlay.querySelector('.cancel');
    overlay.classList.add('active');

    const onOk = () => {
      cleanup();
      resolve(true);
    };
    const onCancel = () => {
      cleanup();
      resolve(false);
    };
    const onKeydown = (e) => {
      if (e.key === 'Enter') onOk();
      else if (e.key === 'Escape') onCancel();
    };
    const onOverlayClick = (e) => {
      if (e.target === overlay) onCancel();
    };
    const cleanup = () => {
      overlay.classList.remove('active');
      okBtn.removeEventListener('click', onOk);
      cancelBtn.removeEventListener('click', onCancel);
      document.removeEventListener('keydown', onKeydown);
      overlay.removeEventListener('click', onOverlayClick);
    };
    okBtn.addEventListener('click', onOk);
    cancelBtn.addEventListener('click', onCancel);
    document.addEventListener('keydown', onKeydown);
    overlay.addEventListener('click', onOverlayClick);
  });
}

// ----------------------------------------------------------------------
// Новая функция для запроса имени и пароля
// ----------------------------------------------------------------------
function showAuthModal(isCreating) {
  return new Promise((resolve) => {
    const overlay = $('authModal');
    if (!overlay) return resolve(null);
    const title = $('authTitle');
    const nameInput = $('authNameInput');
    const passwordInput = $('authPasswordInput');
    const hint = $('authHint');
    const okBtn = $('authOk');
    const cancelBtn = $('authCancel');

    if (isCreating) {
      title.textContent = 'Создание новой комнаты';
      hint.textContent = 'Введите пароль, если хотите защитить комнату (можно оставить пустым)';
    } else {
      title.textContent = 'Вход в комнату';
      hint.textContent = 'Введите пароль, если он установлен, или оставьте пустым';
    }

    nameInput.value = `Dev-${Math.floor(Math.random() * 1000)}`;
    passwordInput.value = '';
    overlay.classList.add('active');
    nameInput.focus();

    const onOk = () => {
      cleanup();
      resolve({
        name: nameInput.value.trim(),
        password: passwordInput.value.trim()
      });
    };
    const onCancel = () => {
      cleanup();
      resolve(null);
    };
    const onKeydown = (e) => {
      if (e.key === 'Enter') onOk();
      else if (e.key === 'Escape') onCancel();
    };
    const onOverlayClick = (e) => {
      if (e.target === overlay) onCancel();
    };
    const cleanup = () => {
      overlay.classList.remove('active');
      okBtn.removeEventListener('click', onOk);
      cancelBtn.removeEventListener('click', onCancel);
      document.removeEventListener('keydown', onKeydown);
      overlay.removeEventListener('click', onOverlayClick);
    };
    okBtn.addEventListener('click', onOk);
    cancelBtn.addEventListener('click', onCancel);
    document.addEventListener('keydown', onKeydown);
    overlay.addEventListener('click', onOverlayClick);
  });
}

// ----------------------------------------------------------------------
// Работа с файлами
// ----------------------------------------------------------------------
function getLanguageFromFilename(filename) {
  return 'python';
}

function getDefaultContent(filename) {
  return `# Python файл\n\ndef main():\n    print("Hello from ${filename}")\n\nif __name__ == "__main__":\n    main()\n`;
}

function isValidFilename(filename) {
  const ext = filename.split('.').pop().toLowerCase();
  return ext === 'py';
}

function renderFileList() {
  if (!fileListDiv) return;
  const files = Array.from(filesMap.keys());
  if (files.length === 0) {
    fileListDiv.innerHTML = '<div class="empty-files">Нет файлов<br>Нажмите +, чтобы создать</div>';
    return;
  }
  fileListDiv.innerHTML = '';
  files.forEach(filename => {
    const div = document.createElement('div');
    div.className = `file-item ${currentFile === filename ? 'active' : ''}`;
    div.innerHTML = `
      <span class="file-name" title="${filename}">${filename}</span>
      <div class="file-actions">
        <button class="rename-file" data-filename="${filename}" title="Переименовать">✏️</button>
        <button class="delete-file" data-filename="${filename}" title="Удалить файл">🗑️</button>
      </div>
    `;
    div.querySelector('.file-name').addEventListener('click', (e) => {
      e.stopPropagation();
      switchToFile(filename);
    });
    const renameBtn = div.querySelector('.rename-file');
    renameBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const oldName = filename;
      showInputModal('renameFileModal', oldName).then(newName => {
        if (newName && newName !== oldName) {
          renameFile(oldName, newName);
        }
      });
    });
    const delBtn = div.querySelector('.delete-file');
    delBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const fileName = filename;
      showConfirmModal('deleteFileModal', `Файл "${fileName}" будет удалён безвозвратно для всех участников.`)
        .then(confirmed => {
          if (confirmed) {
            performDeleteFile(fileName);
          }
        });
    });
    fileListDiv.appendChild(div);
  });
}

async function renameFile(oldName, newName) {
  if (!filesMap.has(oldName)) {
    showError(`Файл "${oldName}" не существует`);
    return;
  }
  if (!isValidFilename(newName)) {
    showError('Поддерживаются только файлы .py (Python)');
    return;
  }
  if (filesMap.has(newName)) {
    showError(`Файл "${newName}" уже существует`);
    return;
  }

  const oldYText = filesMap.get(oldName);
  const content = oldYText.toString();
  const newYText = new Y.Text(content);

  filesMap.delete(oldName);
  filesMap.set(newName, newYText);

  if (currentFile === oldName) {
    currentFile = newName;
    await switchToFile(newName);
  }

  showToast(`Файл переименован в "${newName}"`);
}

async function switchToFile(filename) {
  if (!filesMap.has(filename)) {
    showError(`Файл "${filename}" не существует`);
    return;
  }
  currentFile = filename;
  const yText = filesMap.get(filename);
  if (!yText) return;

  if (currentBinding) {
    currentBinding.destroy();
    currentBinding = null;
  }
  const model = editor.getModel();
  if (model) model.dispose();

  const language = getLanguageFromFilename(filename);
  const newModel = monaco.editor.createModel(yText.toString(), language);
  editor.setModel(newModel);
  currentBinding = new MonacoBinding(yText, newModel, new Set([editor]), provider.awareness);
  renderFileList();
}

async function createNewFile() {
  if (!filesMap) return;
  const filename = await showInputModal('newFileModal', 'main.py');
  if (!filename) return;
  if (!isValidFilename(filename)) {
    showError('Поддерживаются только файлы .py (Python)');
    return;
  }
  if (filesMap.has(filename)) {
    showError(`Файл "${filename}" уже существует`);
    return;
  }
  const defaultContent = getDefaultContent(filename);
  const newYText = new Y.Text(defaultContent);
  filesMap.set(filename, newYText);
  await switchToFile(filename);
}

async function performDeleteFile(filename) {
  if (!filesMap.has(filename)) return;
  if (currentFile === filename) {
    if (currentBinding) {
      currentBinding.destroy();
      currentBinding = null;
    }
    const model = editor.getModel();
    if (model) model.dispose();
    editor.setModel(null);
    currentFile = null;
  }
  filesMap.delete(filename);
  const remaining = Array.from(filesMap.keys());
  if (remaining.length > 0 && currentFile === null) {
    await switchToFile(remaining[0]);
  } else if (remaining.length === 0) {
    renderFileList();
    const emptyModel = monaco.editor.createModel('// Создайте новый файл, нажав "+" в панели файлов слева\n', 'plaintext');
    editor.setModel(emptyModel);
    if (currentBinding) currentBinding.destroy();
    currentBinding = null;
  } else {
    renderFileList();
  }
}

// ----------------------------------------------------------------------
// Вспомогательные функции для терминала (вывод текста и изображений)
// ----------------------------------------------------------------------
function appendText(container, text) {
  const span = document.createElement('span');
  span.style.whiteSpace = 'pre-wrap';
  span.style.display = 'block';
  span.textContent = text;
  container.appendChild(span);
}

function appendImage(container, base64) {
  const img = document.createElement('img');
  img.src = `data:image/png;base64,${base64}`;
  img.style.maxWidth = '100%';
  img.style.display = 'block';
  img.style.margin = '5px 0';
  container.appendChild(img);
}

function scrollToBottom(container) {
  container.scrollTop = container.scrollHeight;
}

function clearTerminal() {
  if (outputDiv) {
    outputDiv.innerHTML = '';
    appendText(outputDiv, '// Терминал очищен\n');
  }
}

// ----------------------------------------------------------------------
// Запуск кода
// ----------------------------------------------------------------------
async function runCurrentCode() {
  if (!outputDiv) return;

  if (!currentFile) {
    appendText(outputDiv, '\n// Нет открытого файла\n');
    scrollToBottom(outputDiv);
    return;
  }

  const ext = currentFile.split('.').pop().toLowerCase();
  if (ext !== 'py') {
    appendText(outputDiv, `\n// Запуск поддерживается только для .py (Python) файлов\n`);
    scrollToBottom(outputDiv);
    return;
  }

  const model = editor.getModel();
  if (!model) return;
  const code = model.getValue();

  const now = new Date();
  const timestamp = now.toLocaleTimeString();
  appendText(outputDiv, `\n--- Запуск в ${timestamp} (${currentFile}) ---\n`);
  appendText(outputDiv, '// Выполнение...\n');
  scrollToBottom(outputDiv);

  try {
    const response = await fetch('/api/run', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, language: 'python' })
    });
    const data = await response.json();

    if (response.ok) {
      if (data.parts && Array.isArray(data.parts)) {
        for (const part of data.parts) {
          if (part.type === 'text') {
            appendText(outputDiv, part.content + '\n');
          } else if (part.type === 'image') {
            appendImage(outputDiv, part.data);
          }
        }
      } else {
        appendText(outputDiv, (data.output || '(пустой вывод)') + '\n');
      }
    } else {
      appendText(outputDiv, `// Ошибка: ${data.error || 'Неизвестная ошибка'}\n`);
    }
  } catch (err) {
    appendText(outputDiv, `// Ошибка сети: ${err.message}. Запустите API сервер: npm run api\n`);
  }
  scrollToBottom(outputDiv);
}

// ===== Выход из комнаты (исправленный) =====
function leaveRoom() {
  // Переключаем интерфейс
  loginScreen?.classList.remove('hidden');
  editorScreen?.classList.add('hidden');
  window.history.replaceState({}, '', window.location.pathname);
  currentRoomId = null;
  if (roomBadge) roomBadge.textContent = '#Загрузка...';
  if (outputDiv) {
    outputDiv.innerHTML = '';
    appendText(outputDiv, '// Ожидание запуска...\n');
  }
  if (participantsList) participantsList.innerHTML = '';
  statusDot?.classList.remove('connected');
  if (statusText) statusText.textContent = 'Отключено';

  // Уничтожаем все ресурсы
  if (currentBinding) {
    try { currentBinding.destroy(); } catch(e) {}
    currentBinding = null;
  }
  if (provider) {
    try { provider.disconnect(); } catch(e) {}
    try { provider.destroy(); } catch(e) {}
    provider = null;
  }
  if (ydoc) {
    try { ydoc.destroy(); } catch(e) {}
    ydoc = null;
  }
  filesMap = null;
  currentFile = null;

  // Уничтожаем редактор и очищаем DOM
  if (editor) {
    try {
      const model = editor.getModel();
      if (model) model.dispose();
      editor.dispose();
    } catch(e) {}
    editor = null;
  }

  // Очищаем контейнер Monaco (оставляем пустой div)
  const monacoContainer = document.getElementById('monaco');
  if (monacoContainer) {
    monacoContainer.innerHTML = '';
  }

  showToast('Вы вышли из комнаты');
}

// ---------- Скачивание проекта в ZIP ----------
async function downloadProject() {
  if (!filesMap) {
    showToast('Нет открытого проекта');
    return;
  }

  const files = Array.from(filesMap.keys());
  if (files.length === 0) {
    showToast('Нет файлов для скачивания');
    return;
  }

  try {
    const zip = new JSZip();

    for (const filename of files) {
      const yText = filesMap.get(filename);
      const content = yText.toString();
      zip.file(filename, content);
    }

    const blob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `project-${currentRoomId || 'codesync'}.zip`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showToast(`Проект сохранён как ${a.download}`);
  } catch (err) {
    console.error(err);
    showError('Не удалось создать ZIP-архив');
  }
}

// ----------------------------------------------------------------------
// Инициализация редактора
// ----------------------------------------------------------------------
async function initEditor(roomId, userName, password) {
  // Если редактор уже существует – удаляем его (защита от повторного вызова)
  if (editor) {
    try {
      const model = editor.getModel();
      if (model) model.dispose();
      editor.dispose();
    } catch(e) {}
    editor = null;
    const monacoContainer = document.getElementById('monaco');
    if (monacoContainer) monacoContainer.innerHTML = '';
  }

  currentRoomId = roomId;
  if (roomBadge) roomBadge.textContent = `#${roomId}`;

  const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8'];
  const userColor = colors[Math.floor(Math.random() * colors.length)];

  defineCustomThemes();

  // Создаём редактор заново
  editor = monaco.editor.create(document.getElementById('monaco'), {
    value: '',
    language: 'plaintext',
    theme: 'vs',
    automaticLayout: true,
    minimap: { enabled: false },
    fontSize: 14,
    fontFamily: 'Consolas, monospace',
    wordWrap: 'on',
    quickSuggestions: true,
    suggestOnTriggerCharacters: true,
    acceptSuggestionOnEnter: 'on',
    tabSize: 8,
    insertSpaces: false,
    detectIndentation: false,
  });

  loadSavedTheme();

  ydoc = new Y.Doc();
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  const host = window.location.hostname;
  const wsUrl = `${protocol}//${host}:1234`;

  // Передаём пароль как параметр запроса
  provider = new WebsocketProvider(wsUrl, roomId, ydoc, {
    params: { password: password || '' }
  });

  filesMap = ydoc.getMap('files');

  filesMap.observe(() => renderFileList());

  const existingFiles = Array.from(filesMap.keys());
  if (existingFiles.length > 0) {
    await switchToFile(existingFiles[0]);
  } else {
    const emptyModel = monaco.editor.createModel('// Создайте новый файл, нажав "+" в панели файлов\n', 'plaintext');
    editor.setModel(emptyModel);
    renderFileList();
  }

  provider.awareness.setLocalStateField('user', { name: userName, color: userColor });

  provider.on('status', ({ status }) => {
    if (status === 'connected') {
      statusDot?.classList.add('connected');
      if (statusText) statusText.textContent = 'Подключено';
    } else {
      statusDot?.classList.remove('connected');
      if (statusText) statusText.textContent = 'Переподключение...';
    }
  });

  provider.on('connection-error', (err) => {
    console.error(err);
    showError('Ошибка подключения к WebSocket серверу.');
  });

  // Обработка закрытия соединения из-за ошибки авторизации
  const ws = provider.ws;
  if (ws) {
    ws.addEventListener('close', (event) => {
      if (event.code === 1008) {
        showError('Неверный пароль для этой комнаты');
        leaveRoom();
        // После leaveRoom экран логина уже показан, но нужно убедиться
        loginScreen?.classList.remove('hidden');
        editorScreen?.classList.add('hidden');
        statusDot?.classList.remove('connected');
        if (statusText) statusText.textContent = 'Отключено';
        window.history.replaceState({}, '', window.location.pathname);
      }
    });
  }

  const updateParticipants = () => {
    if (!participantsList) return;
    participantsList.innerHTML = '';
    provider.awareness.getStates().forEach((state, clientId) => {
      if (!state.user) return;
      const li = document.createElement('li');
      li.className = 'participant';
      li.innerHTML = `
        <span class="badge" style="background:${state.user.color};width:14px;height:14px;border-radius:4px;display:inline-block"></span>
        <span class="name" style="font-size:14px">${state.user.name}</span>
        ${clientId === provider.awareness.clientID ? '<span class="you" style="background:#e0e0e0;padding:2px 6px;border-radius:12px;font-size:11px">вы</span>' : ''}
      `;
      participantsList.appendChild(li);
    });
  };
  provider.awareness.on('change', updateParticipants);
  updateParticipants();

  if (outputDiv) {
    outputDiv.innerHTML = '';
    appendText(outputDiv, '// Ожидание запуска...\n');
  }
}

// ----------------------------------------------------------------------
// showEditor – запрос имени и пароля
// ----------------------------------------------------------------------
async function showEditor(roomId, isCreating = false) {
  // Если уже есть комната – выходим из неё
  if (currentRoomId) {
    leaveRoom();
    // Небольшая задержка, чтобы завершились cleanup
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  const auth = await showAuthModal(isCreating);
  if (!auth) return;

  const { name, password } = auth;

  loginScreen?.classList.add('hidden');
  editorScreen?.classList.remove('hidden');
  window.history.replaceState({}, '', `?room=${roomId}`);
  await initEditor(roomId, name, password);
}

// ----------------------------------------------------------------------
// Обработчики событий
// ----------------------------------------------------------------------
$('createBtn')?.addEventListener('click', () => {
  const roomId = generateRoomId();
  showEditor(roomId, true);
});

$('joinBtn')?.addEventListener('click', async () => {
  const id = $('roomIdInput')?.value.trim().toUpperCase();
  if (id) await showEditor(id, false);
});

$('shareBtn')?.addEventListener('click', () => {
  const fullUrl = window.location.href;
  navigator.clipboard.writeText(fullUrl);
  showToast('Ссылка скопирована');
});

$('leaveBtn')?.addEventListener('click', leaveRoom);
newFileBtn?.addEventListener('click', () => createNewFile());
runBtn?.addEventListener('click', runCurrentCode);
clearBtn?.addEventListener('click', clearTerminal);

const downloadBtn = document.getElementById('downloadBtn');
if (downloadBtn) {
  downloadBtn.addEventListener('click', downloadProject);
}

if (roomBadge) {
  roomBadge.addEventListener('click', (e) => {
    e.stopPropagation();
    const roomId = currentRoomId;
    if (roomId) {
      navigator.clipboard.writeText(roomId);
      showToast(`ID комнаты ${roomId} скопирован`);
    }
  });
}