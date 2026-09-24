import pandas as pd
import re

print("[+] Memulai Mesin Cuci Teks (Preprocessing)...")

# 1. Load Master Dataset
filename = "Master_Dataset_Hoaxguard.csv"
try:
    df = pd.read_csv(filename)
    print(f"[*] Dataset dimuat: {len(df)} baris siap dicuci.")
except FileNotFoundError:
    print(f"[!] File {filename} tidak ditemukan! Pastikan nama filenya benar.")
    exit()

def bersihkan_teks(text):
    # Ubah ke string dan huruf kecil semua (Case Folding)
    text = str(text).lower()
    
    # Hapus URL/Link (Terkadang ikut tersedot saat scraping)
    text = re.sub(r'https?://\S+|www\.\S+', '', text)
    
    # HAPUS KATA KUNCI BOCORAN (Data Leakage)
    # Tambahkan kata lain jika lu nemu pola bocoran baru di dataset
    kata_bocoran = r'\b(hoax|hoaks|salah|keliru|penipuan|fakta|cek|disinformasi|misinformasi|turnbackhoax)\b'
    text = re.sub(kata_bocoran, ' ', text)
    
    # Hapus tanda baca, angka, dan karakter aneh (Hanya sisakan huruf a-z)
    text = re.sub(r'[^a-z\s]', ' ', text)
    
    # Hapus spasi berlebih (Multiple spaces jadi satu spasi)
    text = re.sub(r'\s+', ' ', text).strip()
    
    return text

# 2. Eksekusi pembersihan ke seluruh baris
print("[*] Sedang menyikat teks, menghapus kata bocoran, dan menghilangkan tanda baca...")
df['Teks_Bersih'] = df['Teks Berita'].apply(bersihkan_teks)

# 3. Buang baris yang teksnya jadi kosong melompong setelah dibersihkan
df = df[df['Teks_Bersih'] != '']
df.dropna(subset=['Teks_Bersih'], inplace=True)

# 4. Simpan hasil cucian ke file baru
nama_file_bersih = "Dataset_Hoaxguard_Clean.csv"

# Kita urutkan kolomnya biar enak dilihat (Teks Asli, Teks Bersih, Label, Sumber)
df = df[['Teks Berita', 'Teks_Bersih', 'Label', 'Sumber']]
df.to_csv(nama_file_bersih, index=False, encoding='utf-8')

print("\n[V] PENCUCIAN SELESAI!")
print(f"[V] File bersih tersimpan sebagai: {nama_file_bersih}")
print(f"[V] Sisa data valid: {len(df)} baris")