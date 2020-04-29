import json

parser = json.JSONDecoder()
parsed=[]
with open('nyt2.json') as f:
    data = f.read()
head = 0
while True:
    head = (data.find('{', head) + 1 or data.find('[', head) + 1) - 1
    try:
        struct, head = parser.raw_decode(data, head)
        parsed.append(struct)
    except (ValueError, json.JSONDecodeError):
        break
print(json.dumps(parsed, indent=2))