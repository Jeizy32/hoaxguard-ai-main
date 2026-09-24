from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager
import pandas as pd
import time
import random
import os

print("[+] Menyiapkan Mesin Penyedot Data Hoax (Tempo - Taktik Pukat Harimau)...")

options = webdriver.ChromeOptions()
options.add_argument('--disable-blink-features=AutomationControlled')
options.add_argument('--log-level=3')
options.add_argument("user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36")

driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)

def run_scraper_tempo_hoax(start_page, end_page):
    filename = "Data_Hoax_Tempo.csv"
    total_semua = 0
    
    for page in range(start_page, end_page + 1):
        data_halaman_ini = []
        
        # URL Indeks Cek Fakta Tempo
        url = f"https://tempo.co/indeks?category=rubrik&rubric_slug=cekfakta&page={page}"
        driver.get(url)
        print(f"\n[*] Memulai penyedotan halaman: {page}")
        
        try:
            # Tunggu 5 detik biar JS nge-load semua gambar dan teks
            WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.TAG_NAME, "body")))
            time.sleep(5) 
            
            # PUKAT HARIMAU: Ambil SEMUA tag link (a) di seluruh halaman!
            semua_link = driver.find_elements(By.TAG_NAME, "a")
            
            berita_dapat = 0
            for item in semua_link:
                judul = item.text.strip()
                
                # Saringan Super Ketat:
                # 1. Panjang karakter lebih dari 35 huruf
                # 2. Kalimatnya minimal terdiri dari 6 kata (menghindari nama menu panjang)
                # 3. Gak mengandung teks error Cloudflare
                if len(judul) > 35 and len(judul.split()) > 5 and "IF YOU'RE" not in judul.upper():
                    data_halaman_ini.append({
                        "Teks Berita": judul,
                        "Label": "Hoax",
                        "Sumber": "Tempo Cek Fakta"
                    })
                    berita_dapat += 1
                    
            if berita_dapat == 0:
                print(f"    -> Halaman {page} kosong/mentok. Pindah/Berhenti.")
            else:
                
                print(f"-> Hal {page} ditarik | Dapat {berita_dapat} berita Hoax")
            
        except Exception as e:
            print(f"    -> Error di halaman {page}. Detail: {e}")
            
        # AUTO-SAVE
        if data_halaman_ini:
            df_page = pd.DataFrame(data_halaman_ini)
            if not os.path.isfile(filename):
                df_page.to_csv(filename, index=False, encoding='utf-8')
            else:
                df_page.to_csv(filename, mode='a', header=False, index=False, encoding='utf-8')
            total_semua += len(data_halaman_ini)
            print(f"    [V] AUTO-SAVE: Total diamankan: {total_semua}")

# Gas dari halaman 6 sampai 50
run_scraper_tempo_hoax(1, 50)

driver.quit()

# BERSIH-BERSIH AMAN DENGAN PENGECEKAN HEADER
filename = "Data_Hoax_Tempo.csv"
if os.path.isfile(filename):
    print("\n[*] Sedang membersihkan data duplikat...")
    try:
        df_bersih = pd.read_csv(filename, header=None, names=["Teks Berita", "Label", "Sumber"])
        df_bersih = df_bersih[df_bersih['Teks Berita'] != 'Teks Berita']
        df_bersih.drop_duplicates(subset=['Teks Berita'], inplace=True)
        df_bersih.to_csv(filename, index=False, encoding='utf-8')
        print(f"[V] SELESAI! Total akhir Hoax dari Tempo: {len(df_bersih)} data murni.")
    except Exception as e:
        print(f"[!] Catatan pembersihan: {e}")