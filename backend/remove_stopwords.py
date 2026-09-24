import pandas as pd
import nltk
from nltk.corpus import stopwords
import os

print("[+] Memulai Operasi Pemusnahan Stopwords...")

# Download kamus stopword bahasa Indonesia dari NLTK (hanya butuh sekali download)
try:
    nltk.data.find('corpora/stopwords')
except LookupError:
    nltk.download('stopwords')

# Ambil daftar stopword Indonesia
list_stopwords = set(stopwords.words('indonesian'))

# Tambahkan beberapa kata stopword gaul/tambahan jika perlu
tambahan = {'yg', 'dgn', 'buat', 'kalo', 'nya', 'nih', 'tuh', 'aja', 'ya'}
list_stopwords.update(tambahan)

filename = "Dataset_Hoaxguard_Clean.csv"
print(f"[*] Membaca file: {filename}")
df = pd.read_csv(filename)

def buang_stopword(text):
    if pd.isna(text):
        return ""
    # Pecah jadi kata-kata (tokenisasi sederhana)
    kata_kata = str(text).split()
    # Saring kata yang BUKAN stopword
    kata_bersih = [kata for kata in kata_kata if kata not in list_stopwords]
    # Gabungin lagi jadi kalimat
    return " ".join(kata_bersih)

print("[*] Sedang menyapu stopwords dari 16.000+ data (Ini mungkin memakan waktu 1-2 menit)...")
df['Teks_Final'] = df['Teks_Bersih'].apply(buang_stopword)

# Buang kalau ada baris yang tiba-tiba kosong melompong setelah stopword dibuang
df = df[df['Teks_Final'].str.strip() != '']
df.dropna(subset=['Teks_Final'], inplace=True)

nama_file_final = "Dataset_Hoaxguard_Final.csv"
# Rapikan urutan kolom sebelum disimpan
df = df[['Teks Berita', 'Teks_Final', 'Label', 'Sumber']]
df.to_csv(nama_file_final, index=False, encoding='utf-8')

print("\n[V] PEMUSNAHAN STOPWORDS SELESAI!")
print(f"[V] File dataset final tersimpan sebagai: {nama_file_final}")
print(f"[V] Total Data Siap Training: {len(df)} baris")