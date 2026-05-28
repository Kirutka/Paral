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