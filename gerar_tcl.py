import requests

def gerar():
    print("Baixando lista TCL Brasil via APSATTV...")
    # O link certeiro que você encontrou
    url = "https://www.apsattv.com/tclbr.m3u"
    headers = {'User-Agent': 'Mozilla/5.0'}

    try:
        response = requests.get(url, headers=headers, timeout=30)
        response.raise_for_status()
        
        # Pega o conteúdo e remove espaços extras
        conteudo = response.text.strip()

        with open("lista.m3u", "w", encoding="utf-8") as f:
            f.write(conteudo)
            
        print("✅ Sucesso! O arquivo lista.m3u da TCL foi atualizado.")

    except Exception as e:
        print(f"❌ Erro ao baixar TCL: {e}")

if __name__ == "__main__":
    gerar()