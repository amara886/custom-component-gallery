# TaskBoard

A Retool Custom Component that replicates the functionality of a project management board, enabling users to organize and track tasks visually across four customizable columns.

## Features

- ✅ Drag-and-drop task cards between columns
- ➕ Add task functionality using the `+` button
- 📝 Rename tasks by clicking on the task name
- 🔁 One dynamic property per column to pass data to and from the Retool app

## Columns

- **Backlog** 🔴
- **Todo** 🟡
- **In Progress** 🔵
- **Done** 🟢

## Installation

1. In your Retool app, add a **Custom Component** from the component panel
2. In the Custom Component settings, import this component:
   - Click "Import from GitHub" or "Add from URL"
   - Use the component files from this repository
3. Configure the component's properties to connect it to your Retool data

## Usage

### Setting Up Data

The TaskBoard component uses dynamic properties for each column. You can pass data to the component using these properties:

- `backlogTasks` - Array of tasks for the Backlog column
- `todoTasks` - Array of tasks for the Todo column
- `inProgressTasks` - Array of tasks for the In Progress column
- `doneTasks` - Array of tasks for the Done column

Each task should be an object with at least an `id` and `title` property.

### Example Data Structure

```javascript
[
  { id: 1, title: "Task 1" },
  { id: 2, title: "Task 2" },
  { id: 3, title: "Task 3" }
]
```

### Capturing Changes

When users drag tasks between columns or add new tasks, the component emits events that you can capture in your Retool app to update your data source.

## Ideal Use Cases

- Managing project workflows
- Sprint planning and tracking
- Personal task management
- Any use case that benefits from a kanban-style interface

## Author

Created by [@gonzalo](https://community.retool.com/u/gonzalo) for the Retool community.

## License

See the LICENSE file in the component directory.
