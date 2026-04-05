import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
import joblib
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Load dataset
data = pd.read_csv(os.path.join(BASE_DIR, "data.csv"))
print(f"Dataset loaded: {len(data)} rows")
print(data.head())

X = data['description']
y_dept = data['department']
y_priority = data['priority']

# Train
vectorizer = TfidfVectorizer()
X_vec = vectorizer.fit_transform(X)

# ✅ Verify vectorizer is fitted BEFORE saving
test = vectorizer.transform(["test complaint about water"])
print(f"Vectorizer fitted: {test.shape} ✅")

dept_model = MultinomialNB()
dept_model.fit(X_vec, y_dept)

priority_model = MultinomialNB()
priority_model.fit(X_vec, y_priority)

# Save
joblib.dump(vectorizer, os.path.join(BASE_DIR, "vectorizer.pkl"))
joblib.dump(dept_model, os.path.join(BASE_DIR, "dept_model.pkl"))
joblib.dump(priority_model, os.path.join(BASE_DIR, "priority_model.pkl"))

print("Training complete. Models saved!")
for f in ["vectorizer.pkl", "dept_model.pkl", "priority_model.pkl"]:
    path = os.path.join(BASE_DIR, f)
    print(f"{f}: {os.path.getsize(path)} bytes")