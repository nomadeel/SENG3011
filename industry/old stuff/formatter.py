from collections import defaultdict
d = defaultdict(list)
with open('industry_temp.txt') as f:
    content = f.readlines()
# you may also want to remove whitespace characters like `\n` at the end of each line
content = [x.strip() for x in content]

for line in content:
	result = line.split(' ', 1)
	if(len(result) >= 2):
		d[result[1]].append(result[0])
	else:
		d["null"].append(result[0])
	#print(result[0])
	#print(result[1])

for x in d.keys():
    #print(x +" => " + str(d[x]))
	print("\"" + x + "\" : " + str(d[x]) + ",")