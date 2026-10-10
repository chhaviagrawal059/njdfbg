import os
import sys
import uvicorn

# Ensure the backend directory is in the Python search path
current_dir = os.path.dirname(os.path.abspath(__file__))
if current_dir not in sys.path:
    sys.path.insert(0, current_dir)

if __name__ == "__main__":
    print("=" * 70)
    print("Jharkhand Societal Innovation & Collaboration Portal")
    print("Government of Jharkhand • Department of Higher & Technical Education")
    print("=" * 70)
    print("Starting FastAPI Backend at http://127.0.0.1:8000 ...")
    print("API Interactive Docs available at: http://127.0.0.1:8000/docs")
    print("=" * 70)

    uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=False)
