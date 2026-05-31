import express from 'express';
import { exec } from 'child_process';
import { writeFile, unlink } from 'fs/promises';
import { randomBytes } from 'crypto';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

// Увеличиваем лимит для больших изображений (до 10 МБ)
app.use(express.json({ limit: '10mb' }));

const PORT = 3001;

app.post('/api/run', async (req, res) => {
  const { code, language } = req.body;

  if (language !== 'python') {
    return res.status(400).json({ error: 'Поддерживается только Python' });
  }
  if (!code || typeof code !== 'string') {
    return res.status(400).json({ error: 'Код не передан' });
  }

  // --------------------------------------------------------------------
  // ПРОЛОГ: переопределяем plt.show, чтобы он выводил Base64 изображения
  // --------------------------------------------------------------------
  const prolog = `
import matplotlib.pyplot as _mpl_plt
import base64
from io import BytesIO

def _custom_show(*args, **kwargs):
    # Сохраняем все открытые фигуры
    for fig_num in _mpl_plt.get_fignums():
        fig = _mpl_plt.figure(fig_num)
        buf = BytesIO()
        fig.savefig(buf, format='png')
        buf.seek(0)
        img_base64 = base64.b64encode(buf.read()).decode('utf-8')
        print("IMAGE_BASE64:" + img_base64)
    _mpl_plt.close('all')

_mpl_plt.show = _custom_show
`;
  // Добавляем пролог всегда – он не мешает, если matplotlib не используется
  const modifiedCode = prolog + '\n' + code;

  const filename = `temp_${randomBytes(8).toString('hex')}.py`;
  const filepath = path.join(__dirname, filename);
  const dockerSafeDir = __dirname.replace(/\\/g, '/');

  try {
    await writeFile(filepath, modifiedCode, 'utf8');

    const dockerCmd =
      `docker run --rm --memory 128m --cpus 0.5 -v "${dockerSafeDir}:/app" -w /app python-runner "${filename}"`;

    // Увеличиваем maxBuffer до 10 МБ для больших изображений
    const output = await new Promise((resolve, reject) => {
      exec(dockerCmd, { timeout: 5000, maxBuffer: 10 * 1024 * 1024 }, (err, stdout, stderr) => {
        if (err) {
          reject(new Error(stderr || err.message));
        } else {
          resolve(stdout);
        }
      });
    });

    // Разбираем вывод на части: текст и изображения
    const parts = [];
    const lines = output.split('\n');
    for (const line of lines) {
      if (line.startsWith('IMAGE_BASE64:')) {
        const base64 = line.substring('IMAGE_BASE64:'.length).trim();
        parts.push({ type: 'image', data: base64 });
      } else {
        parts.push({ type: 'text', content: line });
      }
    }

    res.json({ parts });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    await unlink(filepath).catch(() => {});
  }
});

app.listen(PORT, () => {
  console.log(`✅ API сервер запущен на http://localhost:${PORT}`);
});