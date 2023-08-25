import { Select } from "antd";
import React, { memo } from "react";

function UserToDo({ handleChangeUser, options }) {
  return (
    <div className="user">
      <p>User</p>
      <Select
        size={"middle"}
        defaultValue="Select User"
        onChange={handleChangeUser}
        style={{
          width: 200,
        }}
        options={options}
      />
    </div>
  );
}

export default memo(UserToDo);
