import tkinter as tk
from tkinter import scrolledtext, messagebox
import requests
import json

# Define the domain constant
DOMAIN = "http://158.179.216.208:8000"

# Global variable to store the auth token
auth_token = None

def format_json_display(json_text):
    try:
        parsed = json.loads(json_text)
        formatted_json = json.dumps(parsed, indent=4)
        return formatted_json
    except json.JSONDecodeError:
        return json_text  # return original text if it's not JSON

def login():
    global auth_token
    try:
        # Getting username and password from the GUI
        username = username_entry.get()
        password = password_entry.get()

        # Sending POST request to login
        response = requests.post(f"{DOMAIN}/login", json={"username": username, "password": password})
        if response.status_code == 200:
            auth_token = response.json().get('token')
            response_display.config(state=tk.NORMAL)
            response_display.delete('1.0', tk.END)
            response_display.insert(tk.END, "Login Successful!\n")
            response_display.config(state=tk.DISABLED)
        else:
            raise Exception("Login failed with status code: " + str(response.status_code))
    except Exception as e:
        messagebox.showerror("Login Error", str(e))

def send_post_request():
    global auth_token
    try:
        # Extracting and preparing JSON data from the text field
        json_data = json_input.get("1.0", tk.END)
        json_payload = json.loads(json_data)
        
        # Sending POST request
        headers = {"Authorization": f"Bearer {auth_token}"}
        response = requests.post(f"{DOMAIN}/admin/addGroups", json=json_payload, headers=headers)
        response_display.config(state=tk.NORMAL)
        response_display.delete('1.0', tk.END)
        response_display.insert(tk.END, f"POST Response:\n{format_json_display(response.text)}\n")
        response_display.config(state=tk.DISABLED)
    except Exception as e:
        messagebox.showerror("Request Error", str(e))

def send_get_groups_request():
    global auth_token
    try:
        # Sending GET request
        headers = {"Authorization": f"Bearer {auth_token}"}
        response = requests.get(f"{DOMAIN}/admin/groups", headers=headers)
        response_display.config(state=tk.NORMAL)
        response_display.delete('1.0', tk.END)
        response_display.insert(tk.END, f"Groups Data:\n{format_json_display(response.text)}\n")
        response_display.config(state=tk.DISABLED)
    except Exception as e:
        messagebox.showerror("Request Error", str(e))

def send_remove_group_request():
    global auth_token
    try:
        group_id = group_id_entry.get()
        url = f"{DOMAIN}/admin/removeGroup/{group_id}"
        
        # Sending GET request
        headers = {"Authorization": f"Bearer {auth_token}"}
        response = requests.get(url, headers=headers)
        response_display.config(state=tk.NORMAL)
        response_display.delete('1.0', tk.END)
        response_display.insert(tk.END, f"Remove Group Response:\n{format_json_display(response.text)}\n")
        response_display.config(state=tk.DISABLED)
    except Exception as e:
        messagebox.showerror("Request Error", str(e))

def send_gen_request():
    global auth_token
    try:
        # Sending GET request
        headers = {"Authorization": f"Bearer {auth_token}"}
        response = requests.get(f"{DOMAIN}/admin/gen", headers=headers)
        response_display.config(state=tk.NORMAL)
        response_display.delete('1.0', tk.END)
        response_display.insert(tk.END, f"Gen Response:\n{format_json_display(response.text)}\n")
        response_display.config(state=tk.DISABLED)
    except Exception as e:
        messagebox.showerror("Request Error", str(e))

def main():
    global json_input, response_display, group_id_entry, username_entry, password_entry
    
    # Setting up the main window
    root = tk.Tk()
    root.title("jordiPanel Admin")
    root.geometry("600x700")  # Set the window size

    # Login Frame
    login_frame = tk.Frame(root, padx=10, pady=10)
    login_frame.pack(pady=(10, 0))
    tk.Label(login_frame, text="Username:").pack(side=tk.LEFT)
    username_entry = tk.Entry(login_frame)
    username_entry.pack(side=tk.LEFT, padx=(0, 10))
    tk.Label(login_frame, text="Password:").pack(side=tk.LEFT)
    password_entry = tk.Entry(login_frame, show="*")
    password_entry.pack(side=tk.LEFT, padx=(0, 10))
    login_button = tk.Button(login_frame, text="Login", command=login)
    login_button.pack(side=tk.LEFT)

   
    # Data Input Frame
    data_frame = tk.Frame(root, padx=10, pady=10)
    data_frame.pack(pady=(10, 0))
    tk.Label(data_frame, text="JSON Data:").pack()
    json_input = scrolledtext.ScrolledText(data_frame, height=10, width=70)
    json_input.pack()

    # Operations Frame
    operations_frame = tk.Frame(root, padx=10, pady=10)
    operations_frame.pack(pady=(10, 0))
    post_button = tk.Button(operations_frame, text="Add Groups", command=send_post_request)
    post_button.pack(side=tk.LEFT, padx=5)
    get_groups_button = tk.Button(operations_frame, text="Get Groups", command=send_get_groups_request)
    get_groups_button.pack(side=tk.LEFT, padx=5)
    group_id_entry = tk.Entry(operations_frame, width=20)
    group_id_entry.pack(side=tk.LEFT, padx=5)
    remove_group_button = tk.Button(operations_frame, text="Remove Group", command=send_remove_group_request)
    remove_group_button.pack(side=tk.LEFT, padx=5)
    gen_button = tk.Button(operations_frame, text="Generate", command=send_gen_request)
    gen_button.pack(side=tk.LEFT, padx=5)

    # Response Display Area
    response_display = scrolledtext.ScrolledText(root, height=20, width=70, bg="light grey")
    response_display.pack(pady=(10, 0))
    response_display.config(state=tk.DISABLED)

    root.mainloop()

if __name__ == "__main__":
    main()
