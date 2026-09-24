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
from datetime import datetime, timedelta

print("[+] Menyiapkan Mesin Penyedot Data Fakta (Auto-Save Mode)...")

options = webdriver.ChromeOptions()
options.add_argument('--disable-blink-features=AutomationControlled')
options.add_argument('--log-level=3')

driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)

def run_scraper_liputan6_fakta(mundur_berapa_hari):
    filename = "Data_Fakta_Liputan6.csv"
    total_semua = 0
    
    for i in range(1, mundur_berapa_hari + 1):
        target_date = datetime.now() - timedelta(days=i)
        year = target_date.strftime("%Y")
        month = target_date.strftime("%m")
        day = target_date.strftime("%d")
        date_str = f"{year}/{month}/{day}"
        
        print(f"\n[*] Memulai penyedotan tanggal: {target_date.strftime('%Y-%m-%d')}")
        
        # Keranjang penampung khusus untuk hari ini saja
        data_hari_ini = [] 
        page = 1
        
        while True:
            url = f"https://www.liputan6.com/news/indeks/{date_str}?page={page}"
            driver.get(url)
            
            try:
                WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.TAG_NAME, "body")))
                time.sleep(3)
                
                headlines = driver.find_elements(By.CSS_SELECTOR, "h4, h3, h2")
                
                berita_dapat = 0
                for item in headlines:
                    judul = item.text.strip()
                    
                    if len(judul) > 25 and "CEK FAKTA" not in judul.upper() and "HOAKS" not in judul.upper():
                        data_hari_ini.append({
                            "Teks Berita": judul,
                            "Label": "Fakta",
                            "Sumber": f"Liputan6 Nasional ({target_date.strftime('%Y-%m-%d')})"
                        })
                        berita_dapat += 1
                        
                if berita_dapat == 0:
                    print(f"    -> Halaman {page} kosong/habis.")
                    break
                    
                print(f"-> Hal {page} | Dapat {berita_dapat} berita")
                page += 1
                time.sleep(random.uniform(2, 4))
                
            except Exception as e:
                print(f"    -> Mentok di Hal {page}. Pindah hari...")
                break
        
        # SISTEM AUTO-SAVE PER HARI
        if data_hari_ini:
            df_daily = pd.DataFrame(data_hari_ini)
            
            # Cek apakah CSV sudah ada? Kalau belum, bikin baru dengan Header
            if not os.path.isfile(filename):
                df_daily.to_csv(filename, index=False, encoding='utf-8')
            else:
                # Kalau sudah ada, tempel di bawahnya (append) tanpa Header
                df_daily.to_csv(filename, mode='a', header=False, index=False, encoding='utf-8')
                
            total_semua += len(data_hari_ini)
            print(f"    [V] AUTO-SAVE: {len(data_hari_ini)} data hari ini diamankan. Total Keseluruhan: {total_semua}")

# Set mundur 90 hari biar langsung dapet ribuan data Fakta
run_scraper_liputan6_fakta(90)

driver.quit()

# Hapus duplikat dari CSV akhir (opsional, untuk bersih-bersih)
filename = "Data_Fakta_Liputan6.csv"
if os.path.isfile(filename):
    df_bersih = pd.read_csv(filename)
    df_bersih.drop_duplicates(subset=['Teks Berita'], inplace=True)
    df_bersih.to_csv(filename, index=False, encoding='utf-8')
    print(f"\n[V] SELESAI! Total akhir setelah dibersihkan: {len(df_bersih)} data.")