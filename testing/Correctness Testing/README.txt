===== Electric Stats API Correctness Tester =====

The Electric Stats tester is a simple GUI application that compares API
output against expected output for various test cases.

===== Running the Tester =====

Executing 'api_test.py' using python 3.6 will run the tester. Note that
the GUI package, appJar, requires the Tkinter package to be installed.


===== Using the Tester =====

Select an API to test from the drop down and click the run button. The
testing process will then begin. This may take some time depending on
the number of tests and API call time.

Upon completion, the overall test results will be displayed in the window
below (it is recommended that the application is maximised for better
readability). The overall tests will display the API call used for each
test case and its result.

To the right of the display window, the drop down can be used to
view the differences in API output and expected output for failed
test cases. Note that a failed test case may not neccessarily mean
that the API returns incorrect output. A test may fail if the API uses
different naming conventions for states, retail industries, commodities,
etc. We only display the expected and API output for tests that fail
the comparison test. Expected and API output for tests that pass or fail
due to uncomparable output (i.e. API calls that fail) are not shown.

===== Adding/Editing APIs =====

Currently, the tester can test Electric Stats, Team Rocket, Eleven51 and
Fantasticer Four. More API's can be added and pre-existing API's can be
edited by modifying the 'api_urls.json' file. You will need to specify
API specific information such as url, date format, key names, etc.


===== Adding/Modifying Tests =====

Tests are json files that are located in the 'tests' directory. To add a
new test, simply create a new json file of similar format. You will need
to supply the statistics area ('retail' or 'merchandise'), categories,
states, start date, end date and expected output. Note that the format
of the expected output is the format that our API, 'Electric Stats', uses.

