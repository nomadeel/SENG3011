================ 1. Installation ================ 

In order to set locust.io up locally you must first install it.

Python 3.5 - pip install locustio==0.8a2
Python 2.7 - pip install locustio

For more information visit: http://docs.locust.io/en/latest/installation.html

================ 2. Running the tests ================

Running the tests against each team requires a different command and different script file. You will also need to run each command in their respective folders.

2.1 Electric Boogaloo

locust -f electricboogaloo.py --host=electricstats.herokuapp.com/api/v2

2.2 Team rocket
locust -f teamrocket.py --host=45.76.114.158

2.3 Fantastic-er Four
locust -f fantasticfour.py --host=fantasticerfour.me

================ 3. Observation ================

In order to set the user amount and the hatch rate, as well as observe the live test results you simply need to visit:

localhost:8089 (Assuming you are running it locally).

================ 4. Documentation ================

http://docs.locust.io/en/latest/index.html

