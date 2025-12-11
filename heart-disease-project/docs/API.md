# API Documentation
## Heart Disease Prediction System

Base URL: `http://localhost:5000`

---

## Authentication Endpoints

### POST /auth/login
Login to the system.

**Request:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Response (200 OK):**
```json
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "user": {
    "id": 1,
    "username": "admin",
    "email": "admin@heartdisease.com",
    "role": "admin",
    "created_at": "2024-12-11T00:00:00"
  }
}
```

### POST /auth/register
Register a new user.

**Request:**
```json
{
  "username": "newuser",
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (201 Created):**
```json
{
  "message": "User created successfully",
  "user": {
    "id": 3,
    "username": "newuser",
    "email": "user@example.com",
    "role": "user",
    "created_at": "2024-12-11T10:30:00"
  }
}
```

---

## Prediction Endpoints

### POST /predict
Make a single prediction with SHAP explanation.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request:**
```json
{
  "age": 55,
  "sex": 1,
  "cp": 2,
  "trestbps": 140,
  "chol": 250,
  "fbs": 1,
  "restecg": 0,
  "thalach": 150,
  "exang": 1,
  "oldpeak": 2.5,
  "slope": 2,
  "ca": 1,
  "thal": 2
}
```

**Response (200 OK):**
```json
{
  "prediction": 1,
  "probability": 0.78,
  "risk_level": "High",
  "shap_explanation": {
    "age": 0.25,
    "cp": 0.18,
    "thalach": -0.15,
    ...
  },
  "message": "Prediction successful"
}
```

### POST /batch_predict
Upload CSV for batch predictions and get PDF report.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Request:**
- Form data with 'file' field containing CSV

**CSV Format:**
```csv
age,sex,cp,trestbps,chol,fbs,restecg,thalach,exang,oldpeak,slope,ca,thal
55,1,2,140,250,1,0,150,1,2.5,2,1,2
60,0,3,150,260,0,1,140,0,3.0,1,2,3
```

**Response (200 OK):**
- PDF file download

---

## Information Endpoints

### GET /health
Check API health status.

**Response (200 OK):**
```json
{
  "status": "healthy",
  "timestamp": "2024-12-11T10:30:00",
  "version": "1.0.0"
}
```

### GET /model-info
Get model information and metrics.

**Response (200 OK):**
```json
{
  "model_version": "1.0.0",
  "api_version": "1.0.0",
  "features": ["age", "sex", "cp", ...],
  "model_type": "Calibrated Stacking Ensemble",
  "base_models": ["Random Forest", "XGBoost", "Logistic Regression"],
  "metrics": {
    "accuracy": 0.92,
    "precision": 0.91,
    "recall": 0.93,
    "f1_score": 0.92,
    "roc_auc": 0.95
  },
  "last_trained": "2024-12-11"
}
```

---

## Analytics Endpoints

### GET /analytics
Get user analytics (requires authentication).

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "total_predictions": 1250,
  "user_predictions": 15,
  "risk_distribution": {
    "Low": 5,
    "Medium": 6,
    "High": 4
  },
  "recent_predictions": [
    {
      "id": 15,
      "prediction": 1,
      "probability": 0.78,
      "risk_level": "High",
      "timestamp": "2024-12-11T10:25:00"
    },
    ...
  ]
}
```

---

## Admin Endpoints

### GET /admin/dashboard
Get admin dashboard statistics (requires admin role).

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "total_users": 25,
  "total_predictions": 1250,
  "total_api_calls": 5680,
  "recent_users": [...],
  "daily_predictions": [
    {"date": "2024-12-11", "count": 45},
    {"date": "2024-12-10", "count": 38},
    ...
  ]
}
```

### GET /admin/users
Get all users (requires admin role).

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "users": [
    {
      "id": 1,
      "username": "admin",
      "email": "admin@heartdisease.com",
      "role": "admin",
      "created_at": "2024-12-01T00:00:00"
    },
    ...
  ]
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "error": "Missing feature: age"
}
```

### 401 Unauthorized
```json
{
  "error": "Invalid credentials"
}
```

### 403 Forbidden
```json
{
  "error": "Insufficient permissions"
}
```

### 404 Not Found
```json
{
  "error": "Endpoint not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error"
}
```

---

## Rate Limiting

Currently no rate limiting is enforced. For production, implement rate limiting:
- 100 requests per minute per user
- 1000 requests per hour per IP

---

## CORS

Allowed origins:
- http://localhost:3000
- http://127.0.0.1:3000
- (Add production domains in config)

---

## Testing with cURL

### Login Example
```bash
curl -X POST http://localhost:5000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

### Prediction Example
```bash
curl -X POST http://localhost:5000/predict \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "age": 55, "sex": 1, "cp": 2, "trestbps": 140,
    "chol": 250, "fbs": 1, "restecg": 0, "thalach": 150,
    "exang": 1, "oldpeak": 2.5, "slope": 2, "ca": 1, "thal": 2
  }'
```

---

## Testing with Python

```python
import requests

# Login
response = requests.post('http://localhost:5000/auth/login', json={
    'username': 'admin',
    'password': 'admin123'
})
token = response.json()['access_token']

# Make prediction
headers = {'Authorization': f'Bearer {token}'}
data = {
    'age': 55, 'sex': 1, 'cp': 2, 'trestbps': 140,
    'chol': 250, 'fbs': 1, 'restecg': 0, 'thalach': 150,
    'exang': 1, 'oldpeak': 2.5, 'slope': 2, 'ca': 1, 'thal': 2
}
response = requests.post('http://localhost:5000/predict', 
                        headers=headers, json=data)
print(response.json())
```
