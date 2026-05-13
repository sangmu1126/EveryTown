FROM python:3.9-slim

WORKDIR /app

# 시스템 라이브러리 설치 (필요시)
RUN apt-get update && apt-get install -y \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# 종속성 설치
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 소스 코드 복사
COPY . .

EXPOSE 5000
CMD ["python", "app.py"]
