11-Dec-2023 11:07:52
agency
client sends the attendance to the admin then
agency marks the attendance 
based on attendance payroll will be calculated


04-Dec-2023 21:04:50
move estimate tab to onboard client page
store estimate along with client details
in client details, add estimate tab with edit functionality
Invoice will be based on attendance

Check excel
incoice will be created for each client per month
31 days - 24 + 3
30 days - 24 + 2


13-Aug-2023 19:49:38
employee's salary is decided based on the assignment at te time of assignment

OT will be calculated based on basic DA, 

professional tax
25000> then 200

uniform ded is split for various months


10-Aug-2023 18:42:30
submit button on right in attendance
how to calculate to TBD
agency payroll TBD

Invoice table, store data in db, status, paid, unpaid etc

06-Aug-2023 13:55:02
supervisor (agency) -> makes note of entry time (can be manual and/or biometric)
client supervisor(from client) -> 8 or 12 hour shift
attendance is sent at end of month
both the supervisors entries will be cross verified and uploaded
based on the above data, the salary is calulated

error while creating employee ✅
error while assigning employee ✅

number of sec guards, price per guard, days of scurity will be captured at client entry

the employee can work extra

for deduction -> from agency side
deductions while employee is onboarded


03-Aug-2023 15:31:25
multi employee assignment
https://www.zohowebstatic.com/sites/zweb/images/people/mark-attendance-from.png

01-Aug-2023 18:11:52
Start & end time for shift details

account number, ifsc code, bank name for client and employee

invoice
- due till
- sales person
- Description
- discount
- save as draft
- send
- update to payment received
- make as overdue
- 0000 - 2359
- weekly view
- check crm, greyhr, zoho
- Bulk insert attendance

after 9pm night shift
salary entry form

23-Jul-2023 11:11:47
insurance form update
add date of appointment in create employee

22-Jul-2023 11:02:39
Super Admin - Saas Admin
Admin - Org admin - security agency
Client - client - hitachi
employee - employee

Organization -> Agency
create -> onboard

family edit date
Branch Office / Dispensary
insurance number
employee details update issue

shift can be updated by client only

update employee details apis

15-Jul-2023 10:22:27
employee is not related to client
client can be changed
attendance should be marked according to 



add heading to select client
add draft feature
client aggregation
antd table

Dashboard
 - tiles
user master
 - onboard client
 - onboard user
 - onboard organization/agency
Payroll master
 - employee details
 - salary details
 - tax details
 - insurance details
 - pf details
 - appointment letter
 - background verification form
attendance
 - to be updated by client
 - shift management
report
 - tax calculation
 - salary calculation
 - salary slip generation

buttons as link
increase font size
add icons in buttons


05-Jan-2024 07:07:10
Changes to be made in Onboard client
-> Replace the password Field with Designation ✔
-> Ability to Add more representative details (New Feature, Major Change)
-> Add buttons to select GST Type (New Feature)
-> Client email can be duplicate (Major Change) ✔

Bugs
-> In Estimate Details - The default number of resources should be 1 ✔
-> Getting error while saving estimate details ✔

Changes to be made in Invoice Generation (Major Change)
-> Show a table with Category, Particulars, Rate, No. of persons, Shifts, Amount ✔
-> Save Data in Database
-> Generate PDF ✔

Changes to be made in Attendance Component
-> Redesign Attendance Screen
-> Show table with emp No, Emp name, Designation, no of days in a month, scale, present days, holidays, duty count

Salary Slip Generation - Needs format and calculation changes