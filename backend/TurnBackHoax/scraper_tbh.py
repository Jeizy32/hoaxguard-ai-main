from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager
import pandas as pd
import time
import random

print("[+] Menyiapkan Mesin Scraping TBH (Jalur Archive)...")
options = webdriver.ChromeOptions()
options.add_argument('--disable-blink-features=AutomationControlled')
driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)

def run_scraper_tbh(start_page, end_page):
    data = []
    for page in range(start_page, end_page + 1):
        # Nembak langsung ke URL Harta Karun yang lu temuin
        url = f"https://turnbackhoax.id/articles?category=all&page={page}"
        driver.get(url)
        
        try:
            # Tunggu aja sampai body halamannya muncul
            WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.TAG_NAME, "body")))
            time.sleep(3) # Ekstra waktu biar teks beritanya ngeload sempurna
            
            # Sapu bersih elemen teks yang berpotensi jadi judul
            headings = driver.find_elements(By.CSS_SELECTOR, "h2, h3, h4, a")
            
            berita_halaman_ini = 0
            for heading in headings:
                judul = heading.text.strip()
                # Filter otomatis dengan tambahan keyword [PENIPUAN]
                if "[SALAH]" in judul.upper() or "[HOAKS]" in judul.upper() or "[PENIPUAN]" in judul.upper():
                    data.append({"Teks Berita": judul, "Label": "Hoax", "Sumber": "TurnBackHoax"})
                    berita_halaman_ini += 1
                elif "[BENAR]" in judul.upper() or "[FAKTA]" in judul.upper():
                    data.append({"Teks Berita": judul, "Label": "Fakta", "Sumber": "TurnBackHoax"})
                    berita_halaman_ini += 1
                    
            print(f"-> Halaman {page} ditarik | Dapat {berita_halaman_ini} elemen berita | Total Sementara: {len(data)}")
            time.sleep(random.uniform(2, 4)) 
            
        except Exception as e:
            print(f"[!] Halaman {page} error. Detail: {e}")
            break 
            
    return data

# Ganti angka 5 ke target halaman lu (misal 1 sampai 100)
dataset = run_scraper_tbh(1, 200) 

driver.quit()

if dataset:
    df = pd.DataFrame(dataset)
    # Bersihkan dari data duplikat hasil sapu bersih
    df.drop_duplicates(subset=['Teks Berita'], inplace=True)
    filename = "Data_TurnBackHoax_Final.csv"
    df.to_csv(filename, index=False, encoding='utf-8')
    print(f"\n[V] BERHASIL! {len(df)} data unik tersimpan di {filename}")
else:
    print("\n[X] Gagal menarik data.")