from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager
import pandas as pd
import time
import random
from datetime import datetime, timedelta

print("[+] Menyiapkan Mesin Penyedot Data Fakta (Jalur Mesin Waktu Kompas)...")

options = webdriver.ChromeOptions()
options.add_argument('--disable-blink-features=AutomationControlled')
options.add_argument('--log-level=3')

driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)

def run_scraper_kompas_tanggal(mundur_berapa_hari):
    data = []
    for i in range(1, mundur_berapa_hari + 1):
        target_date = datetime.now() - timedelta(days=i)
        date_str = target_date.strftime("%Y-%m-%d")
        
        print(f"\n[*] Memulai penyedotan tanggal: {date_str}")
        
        page = 1
        while True:
            url = f"https://indeks.kompas.com/?site=nasional&date={date_str}&page={page}"
            driver.get(url)
            
            try:
                # Tunggu halamannya napas dulu
                WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.TAG_NAME, "body")))
                time.sleep(3)
                
                # BULDOSER MURNI: Ambil semua teks dari H2, H3, dan class title tanpa peduli ada tag 'a' atau enggak!
                headlines = driver.find_elements(By.CSS_SELECTOR, "h2, h3, .article__title")
                
                berita_dapat = 0
                for item in headlines:
                    judul = item.text.strip()
                    
                    # Filter Cerdas: 
                    # 1. Panjang minimal 25 karakter (menghindari teks menu web pendek)
                    # 2. Tidak mengandung kata hoaks/klarifikasi
                    if len(judul) > 25 and "HOAKS" not in judul.upper() and "SALAH" not in judul.upper():
                        data.append({
                            "Teks Berita": judul,
                            "Label": "Fakta",
                            "Sumber": "Kompas Nasional"
                        })
                        berita_dapat += 1
                        
                # Kalau udah nyapu bersih H2 dan H3 tapi gak dapet berita valid, berarti halamannya emang udah habis
                if berita_dapat == 0:
                    print(f"    -> Halaman {page} kosong/habis. Pindah ke hari sebelumnya...")
                    break
                        
                print(f"-> Tgl {date_str} (Hal {page}) | Dapat {berita_dapat} berita Fakta | Total Sementara: {len(data)}")
                
                page += 1 
                time.sleep(random.uniform(2, 4))
                
            except Exception as e:
                print(f"    -> Mentok di Hal {page} tgl {date_str}. Detail: {e}")
                break 
                
    return data

# Gas mundur 10 hari dulu buat pemanasan
dataset_fakta = run_scraper_kompas_tanggal(10)

driver.quit()

if dataset_fakta:
    df_fakta = pd.DataFrame(dataset_fakta)
    
    # Hapus judul yang double (misal teks sidebar yang ikut ketarik berkali-kali)
    df_fakta.drop_duplicates(subset=['Teks Berita'], inplace=True)
    
    filename = "Data_Fakta_Kompas_Final.csv"
    df_fakta.to_csv(filename, index=False, encoding='utf-8')
    print(f"\n[V] SUKSES! {len(df_fakta)} data Fakta murni tersimpan di {filename}")
else:
    print("\n[X] Gagal menarik data.")