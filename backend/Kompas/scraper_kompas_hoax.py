from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager
import pandas as pd
import time
import random

print("[+] Menyiapkan Mesin Penyedot Data Hoax (Kompas Topik Pilihan)...")

options = webdriver.ChromeOptions()
options.add_argument('--disable-blink-features=AutomationControlled')
options.add_argument('--log-level=3') 

driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)

def run_scraper_kompas_hoax(start_page, end_page):
    data = []
    for page in range(start_page, end_page + 1):
        # URL harta karun Topik Pilihan Hoaks
        url = f"https://www.kompas.com/topik-pilihan/list/4390/berita.viral.hoaks.atau.fakta?page={page}"
        driver.get(url)
        
        try:
            # TAKTIK BULLDOZER: Cukup tunggu body muncul, anti timeout!
            WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.TAG_NAME, "body")))
            time.sleep(3) # Ekstra waktu biar teks loading sempurna
            
            # Sapu bersih semua elemen judul
            headlines = driver.find_elements(By.CSS_SELECTOR, "h2, h3, .article__title")
            
            berita_dapat = 0
            for item in headlines:
                judul = item.text.strip()
                
                # Filter: Hanya ambil teks panjang (menghindari menu web), gak perlu difilter kata Hoaks 
                # karena ini emang kanal khusus kumpulan Hoaks.
                if len(judul) > 25:
                    data.append({
                        "Teks Berita": judul,
                        "Label": "Hoax",
                        "Sumber": "Kompas Topik Pilihan"
                    })
                    berita_dapat += 1
                    
            if berita_dapat == 0:
                print(f"    -> Halaman {page} kosong. Proses dihentikan.")
                break
                
            print(f"-> Halaman {page} ditarik | Dapat {berita_dapat} berita Hoax | Total Sementara: {len(data)}")
            time.sleep(random.uniform(2, 4))
            
        except Exception as e:
            print(f"[!] Halaman {page} error. Detail: {e}")
            break
            
    return data

# Tarik data (coba 10 halaman dulu)
dataset_hoax = run_scraper_kompas_hoax(1, 38)

driver.quit()

if dataset_hoax:
    df_hoax = pd.DataFrame(dataset_hoax)
    
    # Hapus judul duplikat efek bulldozer
    df_hoax.drop_duplicates(subset=['Teks Berita'], inplace=True)
    
    filename = "Data_Hoax_Kompas_Viral.csv"
    df_hoax.to_csv(filename, index=False, encoding='utf-8')
    print(f"\n[V] SUKSES! {len(df_hoax)} data Hoax dari Kompas tersimpan di {filename}")
else:
    print("\n[X] Gagal menarik data.")