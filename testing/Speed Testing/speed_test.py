#!/usr/bin/env python3

import re
import urllib.request
import time
import sys

def change_url(a, s, c, sd, ed):
    curr_url = url
    curr_url = re.sub(r'\{a\}', a, curr_url)
    curr_url = re.sub(r'\{s\}', s, curr_url)
    curr_url = re.sub(r'\{c\}', c, curr_url)
    curr_url = re.sub(r'\{sd\}', sd, curr_url)
    curr_url = re.sub(r'\{ed\}', ed, curr_url)
    return curr_url

def test_performance(url):
    curr_time = int(round(time.time() * 1000))
    call = urllib.request.urlopen(url)
    elapsed_time = int(round(time.time() * 1000))
    return elapsed_time - curr_time

def average(times):
    return float(sum(times)) / float(len(times))

if (len(sys.argv) != 2):
    sys.exit("Usage: " + str(sys.argv[0]) + " <-e or -t>")
else:
    if (sys.argv[1] == "-e"):
        retail = "retail"
        merchandise = "merchandise"
        retail_categories = ["Total", "Food", "HouseholdGood", "ClothingFootwareAndPersonalAccessory", "DepartmentStores", "CafesRestaurantsAndTakeawayFood", "Other"]
        merchandise_categories = ["Total", "FoodAndLiveAnimals", "BeveragesAndTobacco", "CrudeMaterialAndInedible", "MineralFuelLubricantAndRelatedMaterial", "AnimalAndVegetableOilFatAndWaxes", "ChemicalsAndRelatedProducts", "ManufacturedGoods", "MachineryAndTransportEquipments", "OtherManufacturedArticles", "Unclassified"]
        url = "http://electricstats.herokuapp.com/api/v2/{a}?State={s}&Category={c}&startDate={sd}&endDate={ed}"
    elif (sys.argv[1] == "-t"):
        retail = "Retail"
        merchandise = "MerchandiseExports"
        retail_categories = ["Total", "Food", "HouseholdGood", "ClothingFootwareAndPersonalAccessory", "DepartmentStores", "CafesResturantsAndTakeawayFood", "Other"]
        merchandise_categories = ["Total", "FoodAndLiveAnimals", "BeveragesAndTobacco", "CrudMaterialAndInedible", "MineralFuelLubricentAndRelatedMaterial", "AnimalAndVegitableOilFatAndWaxes", "ChemicalsAndRelatedProducts", "ManufacturedGoods", "MachineryAndTransportEquipments", "OtherManufacturedArticles", "Unclassified"]
        url = "http://45.76.114.158/api/?StatisticsArea={a}&State={s}&Category={c}&startDate={sd}&endDate={ed}"
    else:
        sys.exit("Usage: " + str(sys.argv[0]) + " <-e or -t>")

states = ["AUS", "NSW", "VIC", "QLD", "SA", "WA", "TAS", "NT", "ACT"]
start_date = "2000-01-01"
end_date = "2016-12-01"
results = []

results.append("========================================================\n")
results.append("Testing performance of retail, variable amount of states\n")
results.append("========================================================\n")
results.append("\n")

#
# Test states - retail
#
for i in range(0, len(states)):
    curr_states = ','.join(states[0:i+1])
    curr_url = change_url(retail, curr_states, "Total", start_date, end_date)
    results.append("Retail with {} state(s), {}:\n".format(i+1, curr_states))
    time_taken = []
    for t in range(0,3):
        time_taken.append(test_performance(curr_url))
    results.append("T1: {}, T2: {}, T3, {}, AVG: {}\n".format(time_taken[0], time_taken[1], time_taken[2], average(time_taken)))

#
# Write the results to a file
#
with open("results.txt", "w") as r:
    for line in results:
        r.write(line)
results = []

print("Finished testing retail states")

results.append("\n")
results.append("=============================================================\n")
results.append("Testing performance of retail, variable amount of categories\n")
results.append("=============================================================\n")
results.append("\n")

#
# Test categories - retail
#
for i in range(0, len(retail_categories)):
    curr_categories = ','.join(retail_categories[0:i+1])
    curr_url = change_url(retail, "AUS", curr_categories, start_date, end_date)
    results.append("Retail with {} categories, {}:\n".format(i+1, curr_categories))
    time_taken = []
    for t in range(0,3):
        time_taken.append(test_performance(curr_url))
    results.append("T1: {}, T2: {}, T3, {}, AVG: {}\n".format(time_taken[0], time_taken[1], time_taken[2], average(time_taken)))

#
# Write the results to a file
#
with open("results.txt", "a") as r:
    for line in results:
        r.write(line)
results = []

print("Finished testing retail categories")

results.append("\n")
results.append("=============================================================\n")
results.append("Testing performance of retail, scaling states and categories\n")
results.append("=============================================================\n")
results.append("\n")

for i in range(0, len(retail_categories)):
    curr_categories = ','.join(retail_categories[0:i+1])
    if (i == len(retail_categories) - 1):
        curr_states = ','.join(states[0:])
        results.append("Retail with {} states {} categories\n".format(i+3, i+1))
    else:
        curr_states = ','.join(states[0:i+1])
        results.append("Retail with {} states {} categories\n".format(i+1, i+1))
    curr_url = change_url(retail, curr_states, curr_categories, start_date, end_date)
    time_taken = []
    for t in range(0,3):
        time_taken.append(test_performance(curr_url))
    results.append("T1: {}, T2: {}, T3, {}, AVG: {}\n".format(time_taken[0], time_taken[1], time_taken[2], average(time_taken)))

#
# Write the results to a file
#
with open("results.txt", "a") as r:
    for line in results:
        r.write(line)
results = []

print("Finished testing retail scaling")

results.append("\n")
results.append("=============================================================\n")
results.append("Testing performance of merchandise, variable amount of states\n")
results.append("=============================================================\n")
results.append("\n")

#
# Test states - merchandise
#
for i in range(0, len(states)):
    curr_states = ','.join(states[0:i+1])
    curr_url = change_url(merchandise, curr_states, "Total", start_date, end_date)
    results.append("Merchandise with {} state(s), {}:\n".format(i+1, curr_states))
    time_taken = []
    for t in range(0,3):
        time_taken.append(test_performance(curr_url))
    results.append("T1: {}, T2: {}, T3, {}, AVG: {}\n".format(time_taken[0], time_taken[1], time_taken[2], average(time_taken)))

#
# Write the results to a file
#
with open("results.txt", "a") as r:
    for line in results:
        r.write(line)
results = []

print("Finished testing merchandise states")

results.append("\n")
results.append("=================================================================\n")
results.append("Testing performance of merchandise, variable amount of categories\n")
results.append("=================================================================\n")
results.append("\n")

#
# Test categories - merchandise
#
for i in range(0, len(merchandise_categories)):
    curr_categories = ','.join(merchandise_categories[0:i+1])
    curr_url = change_url(merchandise, "AUS", curr_categories, start_date, end_date)
    results.append("Merchandise with {} categories, {}:\n".format(i+1, curr_categories))
    time_taken = []
    for t in range(0,3):
        time_taken.append(test_performance(curr_url))
    results.append("T1: {}, T2: {}, T3, {}, AVG: {}\n".format(time_taken[0], time_taken[1], time_taken[2], average(time_taken)))

#
# Write the results to a file
#
with open("results.txt", "a") as r:
    for line in results:
        r.write(line)
results = []

print("Finished testing merchandise categories")

results.append("\n")
results.append("=================================================================\n")
results.append("Testing performance of merchandise, scaling states and categories\n")
results.append("=================================================================\n")
results.append("\n")

#
# Testing merchandise with scales
#
for i in range(0, len(states)):
    curr_states = ','.join(states[0:i+1])
    if (i == len(states) - 1):
        curr_categories = ','.join(merchandise_categories[0:i+3])
        results.append("Merchandise with {} states {} categories\n".format(i+1, i+3))
    else:
        curr_categories = ','.join(merchandise_categories[0:i+1])
        results.append("Merchandise with {} states {} categories\n".format(i+1, i+1))
    curr_url = change_url(merchandise, curr_states, curr_categories, start_date, end_date)
    time_taken = []
    for t in range(0,3):
        time_taken.append(test_performance(curr_url))
    results.append("T1: {}, T2: {}, T3, {}, AVG: {}\n".format(time_taken[0], time_taken[1], time_taken[2], average(time_taken)))

#
# Write the results to a file
#
with open("results.txt", "a") as r:
    for line in results:
        r.write(line)
results = []

print("Finished testing merchandise scaling")
