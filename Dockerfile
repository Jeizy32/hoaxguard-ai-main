# 1. Gunakan image OS Linux + Python 3.10 versi ringan
FROM python:3.10-slim

# 2. Bikin folder 'app' di dalam server Hugging Face
WORKDIR /app

# 3. Copy file resep dari folder backend ke dalam server
COPY backend/requirements.txt .

# 4. Install semua library (Flask, Scikit-learn, dll)
RUN pip install --no-cache-dir -r requirements.txt

# 5. Copy semua file di dalam folder backend (termasuk model .pkl) ke server
COPY backend/ .

# 6. Buka jalur port 7860 (Hugging Face WAJIB pakai port ini)
EXPOSE 7860

# 7. Nyalakan mesin Flask pakai gunicorn (asumsi file utama lu namanya app.py)
CMD ["gunicorn", "-b", "0.0.0.0:7860", "app:app"]