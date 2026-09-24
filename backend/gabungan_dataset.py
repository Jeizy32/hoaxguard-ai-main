import pandas as pd
import glob
import os

print("[+] Memulai proses perakitan Master Dataset Hoaxguard...")

# Path ke folder utama (gunakan '.' jika script ditaruh sejajar dengan folder Tempo, Liputan6, dll)
path = "." 

# Taktik sapu bersih: cari semua file berakhiran .csv di semua sub-folder
semua_file_csv = glob.glob(os.path.join(path, "**", "*.csv"), recursive=True)

list_dataframe = []
file_berhasil = 0

print("\n[*] Menarik data dari file-file berikut:")
for file in semua_file_csv:
    # Lewati file master jika script ini di-run ulang suatu saat nanti
    if "Master_Dataset" in file:
        continue
        
    try:
        # Baca tiap CSV
        df = pd.read_csv(file)
        
        # Pastikan kolom sesuai standar kita
        if 'Teks Berita' in df.columns and 'Label' in df.columns:
            list_dataframe.append(df)
            print(f" -> [OK] Ditemukan {len(df)} baris di {file}")
            file_berhasil += 1
        else:
            print(f" -> [SKIP] {file} (Format kolom tidak cocok)")
    except Exception as e:
        print(f" -> [ERROR] Gagal membaca {file}: {e}")

if list_dataframe:
    # Gabungkan semua dataframe jadi satu kesatuan
    print("\n[*] Menyatukan seluruh data...")
    master_df = pd.concat(list_dataframe, ignore_index=True)
    
    # 1. Buang baris yang kosong (NaN)
    master_df.dropna(subset=['Teks Berita', 'Label'], inplace=True)
    
    # 2. Buang baris yang isinya cuma header nyasar
    master_df = master_df[master_df['Teks Berita'] != 'Teks Berita']
    
    # 3. Buang duplikat mutlak lintas media (berdasarkan teks berita)
    total_sebelum = len(master_df)
    master_df.drop_duplicates(subset=['Teks Berita'], keep='first', inplace=True)
    total_sesudah = len(master_df)
    
    print(f"[*] Membersihkan duplikat lintas sumber... ({total_sebelum - total_sesudah} data duplikat hancur)")
    
    # Standarisasi Label (buat jaga-jaga kalau ada typo huruf besar/kecil kayak 'fakta' vs 'Fakta')
    master_df['Label'] = master_df['Label'].str.capitalize().str.strip()
    
    # Simpan jadi satu file Master
    nama_file_master = "Master_Dataset_Hoaxguard.csv"
    master_df.to_csv(nama_file_master, index=False, encoding='utf-8')
    
    print("\n[V] PERAKITAN SELESAI!")
    print(f"[V] File master tersimpan sebagai: {nama_file_master}")
    print(f"[V] Total Data Super Murni: {total_sesudah} baris\n")
    
    print("=== KOMPOSISI FINAL DATASET LU ===")
    print(master_df['Label'].value_counts())
    print("==================================")
else:
    print("[!] Tidak ada file CSV yang valid untuk digabung di dalam folder-folder lu.")