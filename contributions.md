# M2

## 14.3 - 21.3

**Zixian Pang**
- [User Interface Design – Mockups]https://www.figma.com/file/FF1Pk6an9FPJvUxymSSNmP/24ss-SoPra-Group-8?type=design&node-id=0-1&mode=design&t=RQh7doOgQL8a75sr-0
  
**David Tanner**
- Setting Up Development Infrastructure
  
**Yiyang Chen**
- [class diagram and activity diagram]https://app.diagrams.net/#G1gALddifx0UfIj6XLu-JBcyIM5--N6Tri#%7B%22pageId%22%3A%226BawDKKuZRNbu1RocS7i%22%7D

**Jingxuan Tian**
- [component diagram and class diagram]https://app.diagrams.net/#G1gALddifx0UfIj6XLu-JBcyIM5--N6Tri#%7B%22pageId%22%3A%226BawDKKuZRNbu1RocS7i%22%7D
- Help with mockups
  
**Luis Schmid**
- Scrum Setup on GitHub

## 21  .3 - 28.3

**Zixian Pang**
- [User Interface Design – Mockups]https://www.figma.com/file/FF1Pk6an9FPJvUxymSSNmP/24ss-SoPra-Group-8?type=design&node-id=0-1&mode=design&t=RQh7doOgQL8a75sr-0
- Preparing for presentation
- Updated the template on git 

**David Tanner**
- [Specification of the REST Interface](https://www.overleaf.com/project/65f86f310473f440735cccca)
- Working on presentation slides
- Working on M2 report


**Yiyang Chen**
- [class diagram and activity diagram]https://app.diagrams.net/#G1gALddifx0UfIj6XLu-JBcyIM5--N6Tri#%7B%22pageId%22%3A%226BawDKKuZRNbu1RocS7i%22%7D
- Working on M2 report

**Jingxuan Tian**
- [component diagram and class diagram]https://app.diagrams.net/#G1gALddifx0UfIj6XLu-JBcyIM5--N6Tri#%7B%22pageId%22%3A%226BawDKKuZRNbu1RocS7i%22%7D
- Help with mockups
- Working on M2 report
- Working on presentation slides

**Luis Schmid**
- Scrum Setup on GitHub
- Working on M2 report

## 28.3 - 04.4

**Zixian Pang**

**David Tanner**
- Created Auth&WebSocket Branch, provided Adjusted M1 template to assist with the authorization dev.
- Connecting  to Websocket,subscribing to topics.

**Yiyang Chen**
Criterion 1: In the specific user’s round, the user can firstly choose a card in their hand then put it into one empty cup. sopra-fs24-group-08-client#19
- the logic of deciding who go first
- Create API endpoints to receive and process user actions to place cards.

**Jingxuan Tian**

**Luis Schmid**

## 04.04-11.04

**Zixian Pang**
- In server: defined class entities according to the class diagram and some gameservice  #15

**David Tanner**
- Finished with Issue #14 locally, once the necessary code part that will be provided by team-members has been added, I will clean up the code put it together and Issue 14# Should be finished.
- Added Classes that will be needed in the upcoming weeks; To be uploaded.

**Yiyang Chen**
Criterion 2: If it’s not the opponent’s turn, then the user can’t do this operation. #49
- server will throw a Not your turn. Exception if its not the player's turn

**Jingxuan Tian**
- In server: add/ delete, invite a friend to the game function and long-polling to check if there’re new adding friend/ game invitation requests and response without tests.

**Luis Schmid**
- Login and Authentication (user Story #1) : Allign with implementations from individual assignment. (Decision for a more global authentication approach)
- Design Background - Wallpaper within the Theme
- Update Task state of user stories and issues on GitHub and assign Tasks for the comming week.

## 12.04-19.04

**Zixian Pang** 
-  ⁠Creation of classes of entities of game elements
-  ⁠⁠Creation of the game logic in GameService


**David Tanner**
- Customization with Banners and icons #07
- Achievements and Challenges #06
- Merging of different branches.

**Yiyang Chen**

- Implementaion of deciding if first turn or second and distribution of 3/2 cards accordingly. #02
- Criteroin 3: If a user does not choose an option after 15 seconds,then the app will randomly decide who goes first. #24
- Criterion 3: Once the user put the card, the action can’t reverse, the scores should be updated. #20
  -> Rollback disabling mechanism

**Jingxuan Tian**
- Invitation of Friends which are online and matching.
- Send Friend Request (long poling)

**Luis Schmid**
- Updated Task state, addition of issues.
- Add Tests to reach coverage

## 20.04-27.04

Zixian Pang
•⁠  ⁠Creation of classes of entities of game elements
•⁠  ⁠Creation of the game logic in GameService

David Tanner
•⁠  Changes to the github Workflow,app.yaml and google cloud service to hopefully ensure proper flex env with private api keys.
•⁠  Websocket alternative support for Polling for Matchmaking,Invites,Requests
•⁠  Translation Google implementation
•⁠  Heavily adjusted code alternative for the current production(main) version. 

Yiyang Chen

•⁠  ⁠Design/Mockup for the Game board #84
Further Adjustments：
•⁠  Responsive Design: Implemented responsive layout to ensure consistent viewing across different browsers by removing fixed positioning.
•⁠  Fixed Chat Box Height: Set a fixed height for the chat box to maintain a consistent interface size.
•⁠  Scrollable Chat History: Added a scrollbar to the chat window when the number of messages exceeds the viewable area.
•⁠  Auto-scroll to Latest Message*: Implemented automatic scrolling to the newest message upon sending, ensuring the latest conversation is always visible.

Jingxuan Tian
•⁠  matching function for backend and frontend
•⁠  ⁠FriendRequest controller tests

Luis Schmid
•⁠  Configure WebSocket for Chat feature
•⁠  ⁠Updates on tasks in Git
•⁠  ⁠M3 Reporting

## 28.04-01.05

**Jingxuan Tian**

Done list

- make SSE in server and client for initiated gamestate #82
- adapt board entity and DTOMapper to convert gamestateDTO #83

Todo List

- merge with other members' work
- sse for updating game operations

**Zixian Pang**

Done List

- creation of winner page #39 (forgot to include all hashtags in the commit)
- images path fixed (from M3 presentation)
- drag effect #40
- ocuupied-cup images

Todo List

- merge with other members' work
- update css files

  **Yiyang Chen**

Done list

- Chatbox Controller & Service #79
- Tests for Chatbox Controller & Service #80

Todo List

- merge with other members' work
- link chatbox service to client and test


**David Tanner**

Done List:
- Did some heavy changes to the client, so that it matches up better with what we had defined in M2 #36
- Some minor changes to make server #78 more suitable to refactored client #36
- Styling Changes to the all Views besides KittyCards, solely starting up open for changes #38
- Using some of my code from commit 83092a1 to make #37 happen.

Todo List:

- Tests for some of my methods #85
- Work loading progress feedback #8

  **Luis Schmid**

Done List:
- Implementation of Chat Translation on Client #10
- Translation Service Tests #81

Todo List:

- Review Task list and update what is done and what has to be done on Git
->   Work on open tasks
- Finalize Translation Service after getting feedback from the Group.


## 02.05-09.05

**Jingxuan Tian**

Done list
- Edit the backend and frontend for game session and merge with refactored code. #89
- Figured out how to make an external database. #88

Todo List
- Write test for game service.
- Test the code, update the tutorial video


**Zixian Pang**

Done List
- help merge codes in frontend in regard to last week's work #40
- write some tests of userservice but some not passed yet #75

Todo List
- write more tests of userservice and pass them
- help merge refactoring and merge-main branches
**Yiyang Chen**

Done list

Todo List


**David Tanner**

Done List:
Implemented the Progress Bar but we have decided in the end to not use it, since getting into a game takes 1 second max. 
Did the business logic for the surrender mechanic in the backend, had adapted the frontend so that it works properly in e3cc69f and prior code. 
Fully implemented WS, added better error handling and exceptions to allow easier debugging.Added some WS and GameService tests. 
Client: #42 #43 Finished. Refactored KittyCards so that not every single component is shoved into the same tsx file :  7cd9251.

Todo List:
Will have to adapt surr feature and double check that everything works as planned now with our newly adapted merge-main/refactoring, won’t take long.
Continue with creating tests.


**Luis Schmid**

Done List:


Todo List:

