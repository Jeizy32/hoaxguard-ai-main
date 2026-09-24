import pandas as pd
import time
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.metrics import accuracy_score, classification_report
import joblib

print("[+] Memulai Pembangunan Otak AI Hoaxguard (Naive Bayes)...")

# 1. Load Dataset Final
df = pd.read_csv("Dataset_Hoaxguard_Final.csv")

# Pastikan tidak ada nilai kosong
df.dropna(subset=['Teks_Final', 'Label'], inplace=True)

X = df['Teks_Final']
y = df['Label']

# 2. Split Data: 80% untuk Belajar (Training), 20% untuk Ujian (Testing)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
print(f"[*] Total Data Training: {len(X_train)} | Total Data Testing: {len(X_test)}")

start_time = time.time()

# 3. Ekstraksi Fitur (Ubah teks jadi matriks angka dengan TF-IDF)
print("[*] Sedang melatih TF-IDF Vectorizer...")
vectorizer = TfidfVectorizer(max_features=10000) # Batasi 10.000 kata paling berpengaruh biar efisien
X_train_tfidf = vectorizer.fit_transform(X_train)
X_test_tfidf = vectorizer.transform(X_test)

# 4. Proses Training Model Multinomial Naive Bayes
print("[*] Sedang melatih Model Naive Bayes...")
model = MultinomialNB(alpha=1.0) # alpha 1.0 adalah Laplace Smoothing standar
model.fit(X_train_tfidf, y_train)

waktu_training = time.time() - start_time
print(f"[V] Training selesai dalam waktu {waktu_training:.2f} detik!")

# 5. Evaluasi Ujian (Testing)
print("\n[*] Menghitung tingkat akurasi pada data Testing...")
prediksi = model.predict(X_test_tfidf)

akurasi = accuracy_score(y_test, prediksi)
print(f"\n======================================")
print(f"   AKURASI MODEL AI: {akurasi * 100:.2f}%")
print(f"======================================")
print("\nLaporan Detail Klasifikasi:")
print(classification_report(y_test, prediksi))

# 6. Export Model dan Vectorizer
print("\n[*] Menyimpan model ke dalam file .pkl untuk backend Vercel/Flask...")
joblib.dump(model, "hoax_model.pkl")
joblib.dump(vectorizer, "tfidf_vectorizer.pkl")

print("[V] hoax_model.pkl dan tfidf_vectorizer.pkl berhasil dibuat!")
print("[V] Otak AI Hoaxguard siap dipasang ke Web Server!")