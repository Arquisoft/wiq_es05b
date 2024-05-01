#!/usr/bin/env python3

# -*- coding: utf-8 -*-

import json
import requests

"""
Template File


:author Álvaro García Fdez:
:version 2024-04-25:

"""



def main():
    data = None
    with open('groups.json') as f:
        data = json.load(f)
    response = requests.post('http://localhost:8003/addGroups', json=data)
    print(response.status_code)
    print(response.text)

    requests.get('http://localhost:8003/gen')
    pass

if __name__ == "__main__":
    main()