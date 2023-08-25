import React from "react";

export default function TaskCountDone({ taskDone }) {
  return (
    <div className="done">
      <span>Done {taskDone} task</span>
    </div>
  );
}
