import sys
from fastapi.testclient import TestClient
from main import app

def test_endpoints():
    with TestClient(app) as client:
        print("1. Testing GET / ...")
        r = client.get("/")
        assert r.status_code == 200, f"Root failed: {r.text}"
        print("   [OK] Root Response:", r.json()["platform"])

        print("2. Testing GET /health ...")
        r = client.get("/health")
        assert r.status_code == 200, f"Health check failed: {r.text}"
        health_data = r.json()
        print(f"   [OK] Health: {health_data['status']} | Database: {health_data['database']['type']} ({health_data['database']['status']})")

        print("3. Testing GET /api/departments ...")
        r = client.get("/api/departments")
        assert r.status_code == 200, f"Departments failed: {r.text}"
        depts = r.json()
        print(f"   [OK] Departments returned ({len(depts)}):", [d["id"] for d in depts])

        print("4. Testing GET /api/projects ...")
        r = client.get("/api/projects")
        assert r.status_code == 200, f"Projects failed: {r.text}"
        projs = r.json()
        print(f"   [OK] Projects returned ({len(projs)}):", [p["id"] for p in projs])

        print("5. Testing GET /api/analytics ...")
        r = client.get("/api/analytics")
        assert r.status_code == 200, f"Analytics failed: {r.text}"
        analytics = r.json()
        print("   [OK] Analytics Summary:", analytics)

        print("6. Testing GET /api/decisions ...")
        r = client.get("/api/decisions")
        assert r.status_code == 200, f"Decisions failed: {r.text}"
        decisions_list = r.json()
        print(f"   [OK] Decisions returned ({len(decisions_list)} total items)")
        if decisions_list:
            print(f"   Sample: '{decisions_list[0]['title']}' - Status: {decisions_list[0]['status']}")

        print("\nALL BACKEND API ENDPOINTS ARE FULLY OPERATIONAL AND VERIFIED!")

if __name__ == "__main__":
    test_endpoints()
