import { WebSocketServer } from 'ws';
import { parse } from 'url';

const PORT = 1234;
const wss = new WebSocketServer({ port: PORT });

// Хранилище паролей для комнат
const roomPasswords = {};

console.log(`🚀 Yjs Sync Server: ws://localhost:${PORT}`);

wss.on('connection', (ws, req) => {
  // Разбираем URL и параметры запроса
  const { pathname, query } = parse(req.url, true);
  const room = pathname?.split('/')[1] || 'default';
  const password = query.password || '';

  // Проверка пароля
  const storedPassword = roomPasswords[room];
  if (storedPassword !== undefined) {
    // Пароль для комнаты уже установлен – проверяем
    if (password !== storedPassword) {
      // Неверный пароль – отправляем сообщение и закрываем соединение
      ws.send(JSON.stringify({ type: 'auth-error', message: 'Неверный пароль' }));
      ws.close(1008, 'Неверный пароль');
      console.log(`❌ Неверный пароль для комнаты "${room}"`);
      return;
    }
  } else {
    // Пароль для комнаты ещё не задан
    if (password && password.length > 0) {
      // Устанавливаем пароль для комнаты
      roomPasswords[room] = password;
      console.log(`🔐 Пароль установлен для комнаты "${room}"`);
    } else {
      // Комната без пароля
      console.log(`🆓 Комната "${room}" без пароля`);
    }
  }

  console.log(`👤 +1 в комнате "${room}"`);

  ws.on('message', (data) => {
    // Пересылаем сообщения всем клиентам в комнате
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === ws.OPEN) {
        client.send(data);
      }
    });
  });

  ws.on('close', () => console.log(`👋 -1 из "${room}"`));
  ws.on('error', (err) => console.error(`❌ Ошибка: ${err.message}`));
});