import requests

BASE_URL = "http://localhost:8000"

def test_login():
    # 1. Register User (ensure exists)
    user_data = {
        "username": "debuguser",
        "email": "debug@test.com",
        "password": "debugpassword123"
    }
    
    print(f"1. Attempting to register user: {user_data['username']}")
    try:
        reg_resp = requests.post(f"{BASE_URL}/auth/register", json=user_data)
        print(f"   Register Status: {reg_resp.status_code}")
        print(f"   Register Response: {reg_resp.text}")
    except Exception as e:
        print(f"   Register Failed: {e}")

    # 2. Login
    login_data = {
        "username": "debuguser",
        "password": "debugpassword123"
    }
    print(f"\n2. Attempting to login user: {login_data['username']}")
    try:
        login_resp = requests.post(f"{BASE_URL}/auth/token", data=login_data)
        print(f"   Login Status: {login_resp.status_code}")
        print(f"   Login Response: {login_resp.text}")
        
        if login_resp.status_code == 200:
            print("\n   SUCCESS: Login working correctly.")
        else:
            print("\n   FAILURE: Login rejected.")
            
    except Exception as e:
        print(f"   Login Failed: {e}")

if __name__ == "__main__":
    test_login()
