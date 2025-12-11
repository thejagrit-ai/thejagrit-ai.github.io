"""
Advanced Heart Disease Prediction Model Training Pipeline
Features:
- Multiple ML models (Random Forest, XGBoost, Logistic Regression)
- Stacking Ensemble
- Hyperparameter tuning with Optuna
- SMOTE balancing
- Stratified K-fold cross-validation
- Probability calibration
- SHAP explainability
"""

import numpy as np
import pandas as pd
import pickle
import json
import warnings
from sklearn.model_selection import StratifiedKFold, cross_val_score
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier, StackingClassifier
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, roc_auc_score, classification_report
from sklearn.calibration import CalibratedClassifierCV
from imblearn.over_sampling import SMOTE
import xgboost as xgb
import optuna
import shap
import matplotlib.pyplot as plt

warnings.filterwarnings('ignore')

class HeartDiseaseModelTrainer:
    """Advanced ML Pipeline for Heart Disease Prediction"""
    
    def __init__(self, data_path=None):
        self.data_path = data_path
        self.scaler = StandardScaler()
        self.models = {}
        self.best_model = None
        self.feature_names = None
        
    def load_and_prepare_data(self):
        """Load and prepare dataset"""
        if self.data_path:
            df = pd.read_csv(self.data_path)
        else:
            # Generate synthetic dataset for demonstration
            print("Generating synthetic dataset...")
            df = self.generate_synthetic_data()
        
        # Feature names
        self.feature_names = [col for col in df.columns if col != 'target']
        
        # Split features and target
        X = df[self.feature_names]
        y = df['target']
        
        return X, y
    
    def generate_synthetic_data(self, n_samples=1000):
        """Generate synthetic heart disease data"""
        np.random.seed(42)
        
        data = {
            'age': np.random.randint(29, 78, n_samples),
            'sex': np.random.randint(0, 2, n_samples),
            'cp': np.random.randint(0, 4, n_samples),
            'trestbps': np.random.randint(94, 200, n_samples),
            'chol': np.random.randint(126, 564, n_samples),
            'fbs': np.random.randint(0, 2, n_samples),
            'restecg': np.random.randint(0, 3, n_samples),
            'thalach': np.random.randint(71, 202, n_samples),
            'exang': np.random.randint(0, 2, n_samples),
            'oldpeak': np.random.uniform(0, 6.2, n_samples),
            'slope': np.random.randint(0, 3, n_samples),
            'ca': np.random.randint(0, 5, n_samples),
            'thal': np.random.randint(0, 4, n_samples),
        }
        
        df = pd.DataFrame(data)
        
        # Generate target with some correlation to features
        risk_score = (
            (df['age'] > 55) * 0.3 +
            (df['sex'] == 1) * 0.2 +
            (df['cp'] == 3) * 0.3 +
            (df['trestbps'] > 140) * 0.2 +
            (df['chol'] > 240) * 0.2 +
            (df['thalach'] < 120) * 0.3 +
            (df['exang'] == 1) * 0.2 +
            (df['oldpeak'] > 2) * 0.2 +
            (df['ca'] > 0) * 0.3 +
            np.random.uniform(0, 0.5, n_samples)
        )
        
        df['target'] = (risk_score > 1.5).astype(int)
        
        return df
    
    def apply_smote(self, X, y):
        """Apply SMOTE for class balancing"""
        smote = SMOTE(random_state=42)
        X_balanced, y_balanced = smote.fit_resample(X, y)
        print(f"Original dataset shape: {X.shape}")
        print(f"Balanced dataset shape: {X_balanced.shape}")
        return X_balanced, y_balanced
    
    def optimize_random_forest(self, X, y, n_trials=50):
        """Hyperparameter optimization for Random Forest using Optuna"""
        
        def objective(trial):
            params = {
                'n_estimators': trial.suggest_int('n_estimators', 100, 500),
                'max_depth': trial.suggest_int('max_depth', 5, 30),
                'min_samples_split': trial.suggest_int('min_samples_split', 2, 20),
                'min_samples_leaf': trial.suggest_int('min_samples_leaf', 1, 10),
                'random_state': 42
            }
            
            model = RandomForestClassifier(**params)
            cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
            scores = cross_val_score(model, X, y, cv=cv, scoring='roc_auc', n_jobs=-1)
            return scores.mean()
        
        study = optuna.create_study(direction='maximize', study_name='rf_optimization')
        study.optimize(objective, n_trials=n_trials, show_progress_bar=True)
        
        print(f"\nBest Random Forest params: {study.best_params}")
        print(f"Best ROC-AUC: {study.best_value:.4f}")
        
        return RandomForestClassifier(**study.best_params, random_state=42)
    
    def optimize_xgboost(self, X, y, n_trials=50):
        """Hyperparameter optimization for XGBoost using Optuna"""
        
        def objective(trial):
            params = {
                'n_estimators': trial.suggest_int('n_estimators', 100, 500),
                'max_depth': trial.suggest_int('max_depth', 3, 15),
                'learning_rate': trial.suggest_float('learning_rate', 0.01, 0.3),
                'subsample': trial.suggest_float('subsample', 0.6, 1.0),
                'colsample_bytree': trial.suggest_float('colsample_bytree', 0.6, 1.0),
                'random_state': 42,
                'use_label_encoder': False,
                'eval_metric': 'logloss'
            }
            
            model = xgb.XGBClassifier(**params)
            cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
            scores = cross_val_score(model, X, y, cv=cv, scoring='roc_auc', n_jobs=-1)
            return scores.mean()
        
        study = optuna.create_study(direction='maximize', study_name='xgb_optimization')
        study.optimize(objective, n_trials=n_trials, show_progress_bar=True)
        
        print(f"\nBest XGBoost params: {study.best_params}")
        print(f"Best ROC-AUC: {study.best_value:.4f}")
        
        return xgb.XGBClassifier(**study.best_params, random_state=42, use_label_encoder=False, eval_metric='logloss')
    
    def train_models(self, X_train, y_train):
        """Train all models including stacking ensemble"""
        
        print("\n" + "="*50)
        print("Training Base Models...")
        print("="*50)
        
        # Logistic Regression
        print("\n1. Training Logistic Regression...")
        lr = LogisticRegression(max_iter=1000, random_state=42)
        lr.fit(X_train, y_train)
        self.models['logistic_regression'] = lr
        
        # Random Forest with optimization
        print("\n2. Optimizing Random Forest...")
        rf = self.optimize_random_forest(X_train, y_train, n_trials=30)
        rf.fit(X_train, y_train)
        self.models['random_forest'] = rf
        
        # XGBoost with optimization
        print("\n3. Optimizing XGBoost...")
        xgb_model = self.optimize_xgboost(X_train, y_train, n_trials=30)
        xgb_model.fit(X_train, y_train)
        self.models['xgboost'] = xgb_model
        
        # Stacking Ensemble
        print("\n4. Training Stacking Ensemble...")
        estimators = [
            ('lr', lr),
            ('rf', rf),
            ('xgb', xgb_model)
        ]
        
        stacking_model = StackingClassifier(
            estimators=estimators,
            final_estimator=LogisticRegression(max_iter=1000),
            cv=5
        )
        stacking_model.fit(X_train, y_train)
        self.models['stacking'] = stacking_model
        
        # Calibrated model
        print("\n5. Applying Probability Calibration...")
        calibrated_model = CalibratedClassifierCV(stacking_model, cv=5, method='sigmoid')
        calibrated_model.fit(X_train, y_train)
        self.models['calibrated_stacking'] = calibrated_model
        self.best_model = calibrated_model
        
        print("\n" + "="*50)
        print("All Models Trained Successfully!")
        print("="*50)
    
    def evaluate_models(self, X_test, y_test):
        """Evaluate all models and print metrics"""
        
        print("\n" + "="*50)
        print("MODEL EVALUATION RESULTS")
        print("="*50)
        
        results = {}
        
        for name, model in self.models.items():
            y_pred = model.predict(X_test)
            y_proba = model.predict_proba(X_test)[:, 1]
            
            metrics = {
                'accuracy': accuracy_score(y_test, y_pred),
                'precision': precision_score(y_test, y_pred, zero_division=0),
                'recall': recall_score(y_test, y_pred, zero_division=0),
                'f1_score': f1_score(y_test, y_pred, zero_division=0),
                'roc_auc': roc_auc_score(y_test, y_proba)
            }
            
            results[name] = metrics
            
            print(f"\n{name.upper().replace('_', ' ')}")
            print("-" * 50)
            for metric, value in metrics.items():
                print(f"{metric.capitalize():15s}: {value:.4f}")
        
        return results
    
    def generate_shap_analysis(self, X_sample):
        """Generate SHAP analysis for model explainability"""
        print("\nGenerating SHAP analysis...")
        
        # Use the base estimator of stacking for SHAP
        explainer = shap.TreeExplainer(self.models['random_forest'])
        shap_values = explainer.shap_values(X_sample)
        
        return explainer, shap_values
    
    def save_models(self, output_dir='../models'):
        """Save trained models and artifacts"""
        import os
        os.makedirs(output_dir, exist_ok=True)
        
        print("\nSaving models and artifacts...")
        
        # Save best model
        with open(f'{output_dir}/model.pkl', 'wb') as f:
            pickle.dump(self.best_model, f)
        print(f"✓ Saved: model.pkl")
        
        # Save scaler
        with open(f'{output_dir}/scaler.pkl', 'wb') as f:
            pickle.dump(self.scaler, f)
        print(f"✓ Saved: scaler.pkl")
        
        # Save feature list
        with open(f'{output_dir}/feature_list.json', 'w') as f:
            json.dump(self.feature_names, f, indent=2)
        print(f"✓ Saved: feature_list.json")
        
        # Save all models
        with open(f'{output_dir}/all_models.pkl', 'wb') as f:
            pickle.dump(self.models, f)
        print(f"✓ Saved: all_models.pkl")
        
        print("\n✓ All models saved successfully!")
    
    def train_pipeline(self):
        """Complete training pipeline"""
        print("\n" + "="*70)
        print(" HEART DISEASE PREDICTION - ADVANCED ML PIPELINE ")
        print("="*70)
        
        # Load data
        print("\n1. Loading and preparing data...")
        X, y = self.load_and_prepare_data()
        
        # Apply SMOTE
        print("\n2. Applying SMOTE balancing...")
        X_balanced, y_balanced = self.apply_smote(X, y)
        
        # Scale features
        print("\n3. Scaling features...")
        X_scaled = self.scaler.fit_transform(X_balanced)
        
        # Split data
        from sklearn.model_selection import train_test_split
        X_train, X_test, y_train, y_test = train_test_split(
            X_scaled, y_balanced, test_size=0.2, random_state=42, stratify=y_balanced
        )
        
        # Train models
        print("\n4. Training models...")
        self.train_models(X_train, y_train)
        
        # Evaluate
        print("\n5. Evaluating models...")
        results = self.evaluate_models(X_test, y_test)
        
        # SHAP analysis
        print("\n6. Generating SHAP analysis...")
        sample_indices = np.random.choice(X_test.shape[0], min(100, X_test.shape[0]), replace=False)
        explainer, shap_values = self.generate_shap_analysis(X_test[sample_indices])
        
        # Save models
        print("\n7. Saving models...")
        self.save_models()
        
        print("\n" + "="*70)
        print(" TRAINING COMPLETED SUCCESSFULLY! ")
        print("="*70)
        
        return results

if __name__ == "__main__":
    trainer = HeartDiseaseModelTrainer()
    results = trainer.train_pipeline()
