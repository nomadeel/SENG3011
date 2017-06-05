from locust import HttpLocust, TaskSet

def login(l):
    l.client.post("/login", {"username":"ellen_key", "password":"education"})

def index(l):
    l.client.get("/api/api.php?StatisticsArea=Retail&State=NSW%2CSA&Category=Total&startDate=2012-03-04&endDate=2016-04-01")

def profile(l):
    l.client.get("/api/api.php?StatisticsArea=Retail&State=NSW%2CSA&Category=Total&startDate=2012-03-04&endDate=2016-04-01")

    #http://45.76.114.158/api?StatisticsArea=$area&State=$state&Category=$category&startDate=$startDate&&endDate=$endDate"

#Basic retail test
def step_1(l):
	area = "Retail"
	states = "NSW,VIC"
	categories = "Food,HouseholdGood"
	start_date = "2016-01-01"
	end_date = "2017-01-01"
	#url = "/api/api.php?StatisticsArea=" + str() + "&State=" + str(states) + "&Category=" + str(categories) + "&startDate=" + str(start_date) + "&endDate=" + str(end_date)
	url = "/api?StatisticsArea=" + str(area) + "&State=" + str(states) + "&Category=" + str(categories) + "&startDate=" + str(start_date) + "&endDate=" + str(end_date)
	l.client.get(str(url))

#Basic merchandise test
def step_2(l):
	area = "MerchandiseExports"
	states = "NSW,VIC"
	categories = "FoodAndLiveAnimals,ManufacturedGoods"
	start_date = "2016-01-01"
	end_date = "2017-01-01"
	url = "/api?StatisticsArea=" + str(area) + "&State=" + str(states) + "&Category=" + str(categories) + "&startDate=" + str(start_date) + "&endDate=" + str(end_date)
	l.client.get(str(url))

#Heavy retail test
def step_3(l):
	area = "Retail"
	states = "AUS"
	categories = "Total"
	start_date = "2000-01-01"
	end_date = "2017-01-01"
	url = "/api?StatisticsArea=" + str(area) + "&State=" + str(states) + "&Category=" + str(categories) + "&startDate=" + str(start_date) + "&endDate=" + str(end_date)
	l.client.get(str(url))

#Basic merchandise test
def step_4(l):
	area = "MerchandiseExports"
	states = "AUS"
	categories = "Total"
	start_date = "2000-01-01"
	end_date = "2017-01-01"
	url = "/api?StatisticsArea=" + str(area) + "&State=" + str(states) + "&Category=" + str(categories) + "&startDate=" + str(start_date) + "&endDate=" + str(end_date)
	l.client.get(str(url))

class UserBehavior(TaskSet):
    tasks = {step_1: 1, step_2: 2, step_3: 3, step_4: 4}

    #def on_start(self):
        #login(self)

class WebsiteUser(HttpLocust):
    task_set = UserBehavior
    min_wait = 5000
    max_wait = 9000