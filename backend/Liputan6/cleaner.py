import pandas as pd

filename = "Data_Fakta_Liputan6.csv"

print("[+] Membuka brankas data...")
try:
    # Baca CSV tanpa peduli headernya berantakan atau nggak
    df = pd.read_csv(filename, header=None, names=["Teks Berita", "Label", "Sumber"])
    
    # Buang kalau ada baris yang isinya kebetulan teks "Teks Berita" (bekas header lama yang nyelip)
    df = df[df['Teks Berita'] != 'Teks Berita']
    
    sebelum = len(df)
    
    # Hapus duplikat
    df.drop_duplicates(subset=['Teks Berita'], inplace=True)
    sesudah = len(df)
    
    # Timpa ulang dengan format yang rapi dan ada headernya
    df.to_csv(filename, index=False, encoding='utf-8')
    
    print(f"[V] SUKSES! File CSV berhasil diperbaiki dan dibersihkan.")
    print(f"    -> Total awal     : {sebelum} data")
    print(f"    -> Total bersih   : {sesudah} data murni tanpa duplikat")

except Exception as e:
    print(f"[X] Gagal membersihkan. Detail: {e}")