import React, { useCallback, useRef, useState } from "react";
import { useEffect } from "react";
import UserToDo from "./UserToDo/UserToDo";
import ListTodo from "./ListToDo/ListTodo";
import TaskCountDone from "./TaskCountDone/TaskCountDone";

export default function ToDoApp() {
  const allData = useRef([]); // tạo biến allData để lưu item mỗi khi select User
  const [options, setOption] = useState([]);
  const [loading, setLoading] = useState(false);
  const [btnActive, setBtnActive] = useState();
  const [loadingBtnActive, setLoadingBtnActive] = useState(false);
  const [data, setData] = useState([]);
  const [taskDone, setTaskDone] = useState(0);
  const fetchUsers = async () => {
    try {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/users"
      );
      if (!response.ok) {
        throw new Error("Lỗi API");
      }
      const result = await response.json();
      let newArr = [];
      for (const value of result) {
        newArr = [...newArr, { ["value"]: value.id, ["label"]: value.name }];
      }
      setOption(newArr);
    } catch (error) {
      console.log(error);
    }
  };

  const sortArray = (result) => {
    return result.sort((item1, item2) => item1.completed - item2.completed);
  };

  const handleOnclick = async (taskID) => {
    try {
      setLoadingBtnActive(true);
      const result = await fetch(
        `https://jsonplaceholder.typicode.com/todos/${taskID}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ completed: true }),
        }
      );
      if (!result.ok) {
        throw new Error("Lỗi API");
      }
      //update Array
      let newArr = [...data];
      let obj = newArr.find((task) => task.id === taskID);
      obj.completed = true;
      processTasks(newArr);
      setLoadingBtnActive(false);
    } catch (error) {
      setLoadingBtnActive(false);
    }
  };

  const processTasks = (result) => {
    //Sắp xếp
    sortArray(result);
    //Render list
    setData(result);
    //Render số task hoàn thành
    const totalTaskDone = result.reduce((total, item) => {
      if (item.completed) {
        total++;
      }
      return total;
    }, 0);
    setTaskDone(`${totalTaskDone}/${result.length}`);
  };

  const fetchTodosForUser = async (userid) => {
    try {
      setLoading(true);
      const data = await fetch(
        `https://jsonplaceholder.typicode.com/users/${userid}/todos`
      );
      if (!data.ok) {
        throw new Error("Lỗi API");
      }
      let result = await data.json();

      //Cập nhật vào biến ref
      allData.current = allData.current.concat(result)
      //Xử lý sort, update, count
      processTasks(result);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };
  //sử dụng useCallBack tránh tạo lại hàm ở Component User
  const handleChangeUser = useCallback((userid) => {
    //Kiểm tra xem userID có tồn tại trong allData => biến all data sẽ lưu dữ liệu được select
    let currentArray = allData.current.filter((item) => {
      return item.userId === userid;
    });
    if (currentArray.length !== 0) {
      //Xử lý sort, update, count
      processTasks(currentArray);
    } else {
      fetchTodosForUser(userid);
    }
  }, []);
  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="content">
      <UserToDo handleChangeUser={handleChangeUser} options={options} />
      <ListTodo
        data={data}
        loading={loading}
        setBtnActive={setBtnActive}
        btnActive={btnActive}
        handleOnclick={handleOnclick}
      />
      <TaskCountDone taskDone={taskDone} />
    </div>
  );
}
