import json
import sys
import os

class Error(Exception):
    def __init__(self, value):
        self.value = value

    def __str__(self):
        return repr(self.value)
def find_modules(json):
  modules = [];
  for key in json:
    if isinstance(json[key],dict):
        if 'package' in json[key].keys():
          if 'id' in json[key]['package'].keys():
            modules.append('packages/' + json[key]['package']['id'].split('@')[0])
    else:
        if key == 'modules':
          for module in json[key]:
            if 'package' in module.keys():
              if 'id' in module['package'].keys():
                modules.append('packages/' + module['package']['id'].split('@')[0])
  return modules

try:
  if len(sys.argv) > 3:
    app_json_path = sys.argv[1]
    lerna_path = sys.argv[2]
    lerna_bak_path = sys.argv[3]
    if not os.path.exists(app_json_path):
      raise Error, "app.json file not exist!"
    if not os.path.exists(lerna_path):
      raise Error, "lerna config file not exist!"
    if not os.path.exists(lerna_bak_path):
      raise Error, "lerna config file(bak) not exist!"
    
    f = file(app_json_path)
    f2 = file(lerna_path)
    # f3 = file(lerna_bak_path)
    app_json=json.load(f)
    lerna_json=json.load(f2)
    modulesFind = find_modules(app_json)
    print modulesFind
    lerna_json['packages'] = modulesFind
    with open(lerna_bak_path, "w") as f3:
      json.dump(lerna_json, f3)
  else:
    raise Error, "param error!"

except Error as e:
    print(e.value)
    exit(-1)