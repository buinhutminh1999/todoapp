import React from "react";
import { MinusSquareOutlined, CheckCircleOutlined } from "@ant-design/icons";
import { Button, List, Spin } from "antd";

export default function ListTodo({
  data,
  loading,
  btnActive,
  setBtnActive,
  handleOnclick,
}) {
  return (
    <div className="list">
      <p>Task</p>
      <List
        className="list__content"
        size="small"
        bordered
        dataSource={data}
        renderItem={(item) => {
          return loading ? (
            <Spin tip="Loading" size="small">
              <div className="content" />
            </Spin>
          ) : (
            <List.Item>
              <div className="table__item">
                <div className="table__inner">
                  <span>
                    {item.completed ? (
                      <CheckCircleOutlined />
                    ) : (
                      <MinusSquareOutlined />
                    )}
                  </span>
                  <span>{item.title}</span>
                </div>
                {!item.completed ? (
                  <Button
                    loading={item.id === btnActive ? btnActive : false}
                    onClick={() => {
                      setBtnActive(item.id);
                      handleOnclick(item.id);
                    }}
                  >
                    Mark done
                  </Button>
                ) : (
                  ""
                )}
              </div>
            </List.Item>
          );
        }}
      />
    </div>
  );
}
