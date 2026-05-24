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