#!/usr/bin/env python
import re
import urllib.request
import json
import os
import datetime
import sys
from appJar import gui

#call = urllib.request.urlopen("http://electricstats.herokuapp.com/api/v1/retail?State=NSW,VIC&Category=Total&startDate=2016-01-01&endDate=2016-03-30").read()
#encoding = call.info().get_content_charset('utf-8')
#JSON_object = json.loads(data.decode(encoding))
#print(JSON_object)


#urlData = "http://electricstats.herokuapp.com/api/v1/retail?State=NSW,VIC&Category=Total&startDate=2016-01-01&endDate=2016-03-30"
#webURL = urllib.request.urlopen(urlData)
#data = webURL.read()
#encoding = webURL.info().get_content_charset('utf-8')
#json.loads(data.decode(encoding))
#r = requests.get('http://electricstats.herokuapp.com/api/v1/retail?State=NSW,VIC&Category=Total&startDate=2016-01-01&endDate=2016-03-30')
#r.json()
#print(r.json);

api_list = []
test_result = ['']
test_expected = []
test_names = ['Overall']

def view_test(opt):
    if (app.getOptionBox('Test') == 'Overall'):
        app.showTextArea('res')
        app.enableTextArea('res')
        app.clearTextArea('res')
        app.setTextArea('res', test_result[0])
        app.disableTextArea('res')

        app.hideLabel('lb_out')
        app.hideTextArea('out')
        app.hideLabel('lb_exp')
        app.hideTextArea('exp')
    else:
        app.hideTextArea('res')
        
        i = 0
        for name in test_names:
            if (app.getOptionBox('Test') == name):
                break 

            i += 1
        
        app.showLabel('lb_out')
        app.showTextArea('out')
        app.enableTextArea('out')
        app.clearTextArea('out')
        app.setTextArea('out', test_result[i])
        app.disableTextArea('out')

        app.showLabel('lb_exp')
        app.showTextArea('exp')
        app.enableTextArea('exp')
        app.clearTextArea('exp')
        app.setTextArea('exp', test_expected[i])
        app.disableTextArea('exp')

#
# Runs tests on a particular API
# 
# URL placeholder values:
#   {a} = area (retail or merchandise)
#   {s} = state
#   {c} = category
#   {sd} = start date
#   {ed} = end date
#
def run_tests(btn):
    app.showTextArea('res')
    app.enableTextArea('res')
    app.clearTextArea('res')
    app.disableTextArea('res')

    app.hideLabel('lb_out')
    app.hideTextArea('out')
    app.hideLabel('lb_exp')
    app.hideTextArea('exp')
    
    app.changeOptionBox('Test', ['Overall'])
    
    for a in api_list['api']:
        if (a['name'] == app.getOptionBox('API')):
            api = a
            break

    del test_result[:]
    del test_expected[:]
    del test_names[:]

    test_result.append('')
    test_expected.append('')
    test_names.append('Overall')
    
    num_fail = 0
    
    # Loop through our tests folder
    for i, filename in enumerate(sorted(os.listdir('./tests'))):
        with open('./tests/' + filename) as f:
            testName = re.sub(r'\.json', '', filename)
            print('Running Test ' + testName + ' ...')
            
            test = json.load(f)
            if (test['Area'] == 'retail'):
                url = re.sub(r'\{a\}', api['retail_area'], api["url"])
            else:
                url = re.sub(r'\{a\}', api['merch_area'], api["url"])

            url = re.sub(r'\{s\}', test['State'], url)
            url = re.sub(r'\{c\}', test['Category'], url)
            url = re.sub(r'\{sd\}', test['start_date'], url)
            url = re.sub(r'\{ed\}', test['end_date'], url)
           
            test_result[0] += 'Test ' + testName + ': ' + url + '\n'
            try: 
                with urllib.request.urlopen(url) as call:
                    data = json.loads(call.read().decode())
                    comp_fail = False

                    try:
                        (num_diff, num_total, resOut, resExp) = compare_output(api, test['Area'], data, test['expected_response']);
                    except Exception as e:
                        f = str(sys.exc_info()[0])
                        print('Test ' + testName + ': comparison failed')
                        print(str(e) + ' ' + f)
                        num_fail += 1
                        test_result[0] += 'Failed, comparison failed\n' + str(e) + ' ' + f + '\n'
                        comp_fail = True

                    if (not comp_fail):
                        if (num_diff == 0):
                            test_result[0] += 'Passed\n'
                        else:
                            num_fail += 1
                            test_result[0] += 'Failed, ' + str(num_diff) + ' of ' + str(num_total) + ' tuples different\n'
                            test_names.append('Test ' + testName)
                            test_result.append(resOut)
                            test_expected.append(resExp)
                
            except Exception as e:
                f = str(sys.exc_info()[0])
                num_fail += 1
                test_result[0] += 'Failed, could not call api\n' + str(e) + ' ' + f + '\n'
                print('Test ' + testName + ': could not open ' + url)
                print(str(e) + ' ' + f)
   
            test_result[0] += '\n'
            
    if (num_fail == 0):
        test_result[0] = '=== All tests passed ===\n\n' + test_result[0]
    else:
        test_result[0] = '=== ' + str(num_fail) + ' tests failed ===\n\n' + test_result[0] 

    app.changeOptionBox('Test', test_names)
    view_test('Test')
#
# Compares output against expected
#
def compare_output(api, area, output, expected):
    if (area == 'retail'):
        data = output
        for key in api['retail_entry']:
            data = data[key]

        expected = expected['MonthlyRetailData']
        category = api['retail_key']
        category_exp = 'RetailIndustry'
        retval = api['retail_val_key']
        retval_exp = 'Turnover'
    else:
        data = output
        for key in api['merch_entry']:
            data = data[key]

        expected = expected['MonthlyCommodityExportData']
        category = api['commodity_key']
        category_exp = 'Commodity'
        retval = api['merch_val_key']
        retval_exp = 'Value'
    
    for d in data:
        for s in d[api['region_key']]:
            s[api['data_key']].sort(key=lambda dat: (datetime.datetime.strptime(dat[api['date_key']], api['date_format'])))
        d[api['region_key']].sort(key=lambda sta: sta[api['state_key']])
    data.sort(key=lambda cat: cat[category])
 
    for d in expected:
        for s in d['RegionalData']:
            for dat in s['Data']:
                dat['Date'] = datetime.datetime.strptime(dat['Date'], '%Y-%m-%d').strftime(api['date_format'])

            s['Data'].sort(key=lambda dat: (datetime.datetime.strptime(dat['Date'], api['date_format'])))
        d['RegionalData'].sort(key=lambda sta: sta['State'])
    expected.sort(key=lambda cat: cat[category_exp])   
    
    
    num_diff = 0
    num_total = 0;
    resOut = ''
    resExp = ''
    passed = True

    for i, c in enumerate(data):
        for j, r in enumerate(c[api['region_key']]):
            for k, d in enumerate(r[api['data_key']]):
                num_total += 1
                value = d[retval]
                exp_value = expected[i]['RegionalData'][j]['Data'][k][retval_exp]
                
                if (value != exp_value
                 or d[api['date_key']] != expected[i]['RegionalData'][j]['Data'][k]['Date']
                 or r[api['state_key']] != expected[i]['RegionalData'][j]['State']
                 or c[category] != expected[i][category_exp]):
                    num_diff += 1
                    
                    resOut += retval + ': ' + str(value) + '\n'
                    resExp += retval + ': ' + str(exp_value) + '\n'

                    resOut += 'State: ' + r[api['state_key']] + '\n'
                    resExp += 'State: ' + expected[i]['RegionalData'][j]['State'] + '\n'

                    resOut += category + ': ' + c[category] + '\n'
                    resExp += category + ': ' + expected[i][category_exp] + '\n'

                    resOut += 'Date: ' + d[api['date_key']] + '\n\n'
                    resExp += 'Date: ' + expected[i]['RegionalData'][j]['Data'][k]['Date'] + '\n\n'

    return (num_diff, num_total, resOut, resExp)

# Setup
if __name__ == "__main__":
    app = gui()
    
    apiNames = []
    test_names.append('Overall')

    # Get the list of API URLs that we want to test
    with open('api_urls.json') as f:
        api_list = json.load(f)
        for api in api_list['api']:
            apiNames.append(api['name'])

    app.setPadding([20, 10])

    app.addLabelOptionBox('API', apiNames, 1, 0, 2)
    
    app.addButton('Run', run_tests, 1, 2)
    
    app.addHorizontalSeparator(2, 0, 3)
    
    app.addLabelOptionBox('Test', test_names, 3, 2)
    app.setOptionBoxChangeFunction('Test', view_test)
    
    app.addScrolledTextArea('res', 4, 0, 3)
    app.disableTextArea('res')
    
    app.addLabel('lb_out', 'Output', 5, 0)
    app.hideLabel('lb_out')

    app.addLabel('lb_exp', 'Expected', 5, 2)
    app.hideLabel('lb_exp')

    app.addScrolledTextArea('out', 6, 0)
    app.disableTextArea('out')
    app.hideTextArea('out')

    app.addScrolledTextArea('exp', 6, 2)
    app.disableTextArea('exp')
    app.hideTextArea('exp')

    app.go()
