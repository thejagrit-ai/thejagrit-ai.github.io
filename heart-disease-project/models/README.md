# ML Models Directory

This directory will contain the trained machine learning models after running the training pipeline.

Expected files after training:
- `model.pkl` - Main stacking ensemble model
- `scaler.pkl` - Feature scaler
- `feature_list.json` - List of features
- `all_models.pkl` - All base and ensemble models

Run the training pipeline:
```bash
cd ml-pipeline
python train_model.py
```
