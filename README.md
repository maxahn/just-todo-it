# Just TODO It (Placeholder name? Idk I like it)

This is a mobile app that pulls tasks from the Todist API, sorts them based on priority and due date and presents one task a time for the user to complete. The idea is to not think, just do. When you want to start a task, you estimate how long you think the task will take, start the task and try and beat the time. There are a bunch of future features I'd like to implement which are outlined below but for now, this is the basic functionality of the app.

### Screenshots

<img src="https://i.imgur.com/ZN3n3m0.jpeg" width="256px" height="549px" />
<img src="https://i.imgur.com/gX1EyGn.jpeg" width="256px" height="549px" />
<img src="https://i.imgur.com/Z3Xc3p1.jpeg" width="256px" height="549px" />
<img src="https://i.imgur.com/aQaSK5R.jpeg" width="256px" height="549px" />
<img src="https://i.imgur.com/rbKeNOO.jpeg" width="256px" height="549px" />

## Development Get started

### Setup

1. Install dependencies

   ```bash
   npm install
   ```

2. You will need a dev client build since Expo Go will not work for this app. You can build it using EAS with the following commands:

#### IOS Simulator Build

```bash
   npx eas build --profile development --platform ios
```

#### Android

```bash
   npx eas build --profile development --platform android
```

Please refer to the `eas.json` file for additional build profiles.

3. Start the app

   ```bash
    npx expo start
   ```

4. Follow instructions printed out on dev server to connect to the dev client build and start development.

## Stack and Tools

- Expo 52
- Typescript
- Gluestack UI (UI library and framework built on Nativewind)
- Tinybase and SQL Lite
  - Using this so the app can work offline. It's still a work in progress since the sync layer is still one way (pulling TODOist tasks and populating DB but not syncing changes back) but it's nice to have all the data locally stored (besides TODOist tasks).
- React hook query

## Implemented Features

- Pulls tasks from Todoist account, sorts them and presents them to the user one at a time to be completed
- Task list:
  - User can view list of sorted tasks
  - You can mark tasks to be skipped
- Current task
  - Presents one task for the user to work on
  - Complete task right away without starting timer
  - Increase or decrease estimated time for task
  - Starting task moves user to the timer screen, starting a Session and Sub-session
- Task Timer
  - Pausing the timer will end the Sub-session
  - Starting will start a new Sub-session
  - Sessions can be viewed in list under the timer
  - Cancelling the session will wipe the current session and sub-sessions associated with that subsession and return the user to the previous current task screen
  - Completing the task will send a post request to the TODOist API to mark the task as complete, as well as copy the task over to the CompletedTasks table in the local database. It will also finish the current sub-session and session.
- Summary
  - Queries tasks that were completed between preset time ranges and sums total time worked on tasks
  - Shows tasks completed and comparison between estimated time and actual time
  - Presets include _Yesterday_, _Today_, _This Week_, _This Month_
    Player
- Able to update TODOist API Key
- View entries in the Tinybase database (For developer)

## Future Features

- [ ] Allow taking notes while working on tasks
  - Then be able to view notes when looking at the day's summary
  - or if it's a re-occuring task, present the notes of previousl iterations of the task
- [ ] Handle subtasks
- [ ] For re-occuring tasks, be presented with previous completion times. Maybe an average of the last N number of times.
- [ ] Support of other Todo app API's
- [ ] Proper TODOist Oauth login
- [ ] Ability to add your own tasks so it can operate as a stand-alone app
- [ ] Gamification
  - [ ] Exp calculate for each task dependant on estimated duration/actual duration
  - [ ] Level up and compete on leaderboard
  - [ ] Level resets at the end of the week
  - [ ] Achievements
- [ ] Tag system
  - I want to be able to view and filter tasks and estimation successes by type of task
