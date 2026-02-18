import requests

def gerar():
    print("Buscando canais TCL/LG (Amagi)...")
    try:
        # Fonte estável para canais FAST/LG/TCL no Brasil
        data = requests.get("https://i.mjh.nz/LugoTV/br.json").json()
        with open("lista.m3u", "w", encoding="utf-8") as f:
            f.write("#EXTM3U\n")
            for id, c in data['channels'].items():
                f.write(f'#EXTINF:-1 tvg-id="{id}" tvg-logo="{c["logo"]}" group-title="TCL - LG CHANNELS",{c["name"]}\n')
                f.write(f'{c["url"]}\n')
        print("✅ Arquivo lista.m3u da TCL gerado!")
    except Exception as e:
        print(f"❌ Erro ao gerar TCL: {e}")

if __name__ == "__main__":
    gerar()