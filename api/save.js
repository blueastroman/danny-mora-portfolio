export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Parse body (Vercel doesn't auto-parse for plain Node runtime)
  const body = await new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', chunk => (raw += chunk));
    req.on('end', () => {
      try { resolve(JSON.parse(raw)); }
      catch { reject(new Error('Invalid JSON')); }
    });
    req.on('error', reject);
  });

  const { password, content } = body;

  if (!password || password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Incorrect password' });
  }

  const token = process.env.GITHUB_TOKEN;
  const owner = 'blueastroman';
  const repo  = 'danny-mora-portfolio';
  const file  = 'content.json';
  const branch = 'main';

  // Fetch current file to get SHA
  const getRes = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/contents/${file}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github+json',
        'User-Agent': 'danny-mora-admin',
      },
    }
  );

  if (!getRes.ok) {
    const err = await getRes.json();
    return res.status(500).json({ error: `GitHub read failed: ${err.message}` });
  }

  const { sha } = await getRes.json();

  // Commit updated content.json
  const encoded = Buffer.from(JSON.stringify(content, null, 2)).toString('base64');

  const putRes = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/contents/${file}`,
    {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github+json',
        'Content-Type': 'application/json',
        'User-Agent': 'danny-mora-admin',
      },
      body: JSON.stringify({
        message: 'Content update via admin panel',
        content: encoded,
        sha,
        branch,
      }),
    }
  );

  if (putRes.ok) {
    return res.status(200).json({ ok: true });
  }

  const err = await putRes.json();
  return res.status(500).json({ error: err.message || 'GitHub commit failed' });
}
