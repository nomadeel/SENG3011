from locust import HttpLocust, TaskSet

def login(l):
    l.client.post("/login", {"username":"ellen_key", "password":"education"})

def index(l):
    l.client.get("/merchandise?State=NSW,VIC&Category=FoodAndLiveAnimals,ManufacturedGoods&startDate=2016-01-01&endDate=2017-01-31")

def profile(l):
    l.client.get("/retail?State=NSW,VIC&Category=Food,HouseholdGood&startDate=2016-01-01&endDate=2017-01-31")

#Basic retail test
def step_1(l):
	area = "retail"
	states = "NSW,VIC"
	categories = "Food,HouseholdGood"
	start_date = "2016-01-01"
	end_date = "2017-01-01"
	url = "/" + str(area) + "?State=" + str(states) + "&Category=" + str(categories) + "&startDate=" + str(start_date) + "&endDate=" + str(end_date) 
	l.client.get(str(url))

#Basic merchandise test
def step_2(l):
	area = "merchandise"
	states = "NSW,VIC"
	categories = "FoodAndLiveAnimals,ManufacturedGoods"
	start_date = "2016-01-01"
	end_date = "2017-01-01"
	url = "/" + str(area) + "?State=" + str(states) + "&Category=" + str(categories) + "&startDate=" + str(start_date) + "&endDate=" + str(end_date) 
	l.client.get(str(url))

#Heavy retail test
def step_3(l):
	area = "retail"
	states = "AUS"
	categories = "Total"
	start_date = "2000-01-01"
	end_date = "2017-01-01"
	url = "/" + str(area) + "?State=" + str(states) + "&Category=" + str(categories) + "&startDate=" + str(start_date) + "&endDate=" + str(end_date) 
	l.client.get(str(url))

#Basic merchandise test
def step_4(l):
	area = "merchandise"
	states = "AUS"
	categories = "Total"
	start_date = "2000-01-01"
	end_date = "2017-01-01"
	url = "/" + str(area) + "?State=" + str(states) + "&Category=" + str(categories) + "&startDate=" + str(start_date) + "&endDate=" + str(end_date) 
	l.client.get(str(url))

class UserBehavior(TaskSet):
    #tasks = {index: 2, profile: 1}
    tasks = {step_1: 1, step_2: 2, step_3: 3, step_4: 4}

    #def on_start(self):
        #login(self)

class WebsiteUser(HttpLocust):
    task_set = UserBehavior
    min_wait = 5000
    max_wait = 9000