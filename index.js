const express = require('express');
const axios = require('axios');
const app = express();

// --- CONFIGURAÇÕES DO REPOSITÓRIO ---
const GITHUB_USER = "Eletrovision373iptv";
const GITHUB_REPO = "TCL-BR-render"; 
const M3U_URL = `https://raw.githubusercontent.com/${GITHUB_USER}/${GITHUB_REPO}/main/lista.m3u`;

// Configura a porta para o Render (Padrão 10000)
const PORT = process.env.PORT || 10000;

// Função para ler e processar a lista M3U do seu GitHub
async function parseM3U() {
    try {
        const response = await axios.get(M3U_URL);
        const data = response.data;
        const lines = data.split('\n');
        const canais = [];

        for (let i = 0; i < lines.length; i++) {
            if (lines[i].startsWith('#EXTINF')) {
                const info = lines[i];
                const url = lines[i + 1]?.trim();
                
// Extração de metadados
const nomeMatch = info.split(',')[1] || "Canal TCL";
const logoMatch = info.match(/tvg-logo="([^"]+)"/);
const catMatch = info.match(/group-title="([^"]+)"/);
const idMatch = info.match(/tvg-id="([^"]+)"/);

// Link que você encontrou
const LOGO_TCL = "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Logo_of_the_TCL_Corporation.svg/1280px-Logo_of_the_TCL_Corporation.svg.png";

if (url && url.startsWith('http')) {
    canais.push({
        id: idMatch ? idMatch[1] : `tcl-${i}`,
        nome: nomeMatch.trim(),
        // Se não tiver logo no arquivo, usa o da TCL
        logo: (logoMatch && logoMatch[1]) ? logoMatch[1] : LOGO_TCL,
        categoria: catMatch ? catMatch[1] : 'TCL CHANNELS',
        url: url 
    });
}

                if (url && url.startsWith('http')) {
                    // Limpeza de ID para evitar erros na URL
                    let idFinal = idMatch ? idMatch[1] : `tcl-${i}`;
                    idFinal = idFinal.replace(/\s+/g, '-'); 

                    canais.push({
                        id: idFinal,
                        nome: nomeMatch.trim(),
                        logo: logoMatch ? logoMatch[1] : 'https://placehold.co/600x400/000/fff?text=TCL+LG',
                        categoria: catMatch ? catMatch[1] : 'TCL CHANNELS',
                        url: url 
                    });
                }
            }
        }
        return canais;
    } catch (error) {
        console.error("❌ Erro ao ler lista TCL do GitHub:", error.message);
        return [];
    }
}

// --- INTERFACE VISUAL (PAINEL) ---
app.get('/', async (req, res) => {
    const canais = await parseM3U();
    const host = req.get('host'); 

    let html = `
    <!DOCTYPE html>
    <html lang="pt-br">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Eletrovision - TCL BR</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
        <style>
            body { background: #0a0a0a; color: #eee; font-family: 'Segoe UI', sans-serif; }
            .topo { background: #000; padding: 15px; border-bottom: 3px solid #ff0000; position: sticky; top:0; z-index:1000; }
            .card { background: #161616; border: 1px solid #333; height: 100%; transition: 0.3s; }
            .card:hover { border-color: #ff0000; transform: translateY(-5px); }
            .logo-img { height: 60px; object-fit: contain; width: 100%; background: #000; padding: 8px; border-radius: 4px; }
            .btn-watch { background: #ff0000; color: #fff; font-weight: bold; width: 100%; border:none; margin-bottom: 6px; }
            .btn-copy { background: #222; color: #fff; width: 100%; border: 1px solid #444; font-size: 10px; }
            .badge-cat { font-size: 9px; color: #ff0000; text-transform: uppercase; display: block; margin-bottom: 5px; }
        </style>
    </head>
    <body>
    <div class="topo container-fluid d-flex justify-content-between align-items-center">
        <h4 class="m-0 text-white">TCL <span style="color:#ff0000">ELETROVISION</span></h4>
        <a href="/lista.m3u" class="btn btn-danger btn-sm fw-bold">📥 BAIXAR M3U</a>
    </div>
    <div class="container mt-4 pb-5">
        <div class="row g-3">
        ${canais.map(ch => {
            const linkCurto = `https://${host}/play/${ch.id}`;
            return `
            <div class="col-6 col-md-4 col-lg-2">
                <div class="card p-3 text-center">
                    <img src="${ch.logo}" class="logo-img mb-2" onerror="this.src='https://placehold.co/600x400/000/fff?text=TCL'">
                    <small class="badge-cat text-truncate">${ch.categoria}</small>
                    <p class="text-truncate text-white fw-bold mb-3" style="font-size:12px;">${ch.nome}</p>
                    <a href="${linkCurto}" target="_blank" class="btn btn-sm btn-watch">ASSISTIR</a>
                    <button onclick="copiar('${linkCurto}')" class="btn btn-sm btn-copy">COPIAR CURTO</button>
                </div>
            </div>`;
        }).join('')}
        </div>
    </div>
    <script>
        function copiar(t){ navigator.clipboard.writeText(t).then(()=>alert('Link encurtado TCL copiado!')); }
    </script>
    </body></html>`;
    res.send(html);
});

// --- ROTA DE REDIRECIONAMENTO ---
app.get('/play/:id', async (req, res) => {
    const idProcurado = req.params.id;
    const canais = await parseM3U();
    const canal = canais.find(c => c.id === idProcurado);

    if (canal && canal.url) {
        res.redirect(canal.url);
    } else {
        res.status(404).send("Canal TCL não encontrado.");
    }
});

// --- ROTA DA LISTA M3U ---
app.get('/lista.m3u', (req, res) => {
    res.redirect(M3U_URL);
});

// ... (resto do código anterior)

// Rota simples apenas para o UptimeRobot bater e manter vivo
app.get('/ping', (req, res) => {
    res.send('Acordado!');
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Painel rodando na porta ${PORT}`);
});