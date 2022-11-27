import React from "react";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { ITask } from "../models/ITask";
import { taskSlice } from "../store/reducers/task.slice";

/**
 * Вывод задачи
 * @param props.task Определенный task
 * @param props.index Определенный index задачи
 * @param props.handle Функция обработки закрытия/открытия сайдбара
 * @returns
 */
const TaskComponent = (props: {
  task: ITask;
  index: number;
  handle: Function;
}) => {
  const dispatch = useAppDispatch();
  const { active } = useAppSelector((state) => state.taskReducer);
  const task = props.task;

  /**
   * Получение классов для task.
   * @returns {string}
   */
  const task_isActive = (): string => {
    let classes = "task ";
    active === props.index ? (classes += "active") : (classes += "");
    return classes;
  };

  /**
   * Обработка нажатия на task.
   * Показ сайдбара.
   * Отправка task в redux.
   * @returns {void}
   */
  const handleTask = (): void => {
    props.handle(false, props.index);

    if (active === props.index) {
      dispatch(taskSlice.actions.setActive(null));
      return;
    }

    dispatch(taskSlice.actions.setActive(props.index));
  };

  /**
   * Получение классов для иконки "Выполнено"
   * @returns {string}
   */
  const completed_classes = (): string => {
    let classes = "check ";
    if (task.completed) {
      return classes + "completed";
    } else {
      return classes;
    }
  };

  /**
   * Получение классов для заголовка
   * @returns {string}
   */
  const title_classes = (): string => {
    let classes = "task-title ";
    if (task.completed) {
      return classes + "completed";
    } else {
      return classes;
    }
  };

  /**
   * Получение значка "истекло"
   * @returns {JSX.Element|string}
   */
  const is_expired = (): JSX.Element | string => {
    if (new Date().getTime() > new Date(task.deadline).getTime()) {
      return <div className="expired">expired</div>;
    } else {
      return "";
    }
  };

  return (
    <div className={task_isActive()} onClick={handleTask}>
      <div className="row vertical-align">
        <div className={completed_classes()}>
          <span className="material-icons">
            {task.completed ? "check_circle" : "check_circle_outline"}
          </span>
        </div>

        <div className={title_classes()}>{task.title}</div>
      </div>

      <div className="row vertical-align">
        {task.attachments.length > 0 ? (
          <div className="folder">
            <span className="material-icons">folder_open</span>
          </div>
        ) : (
          ""
        )}
        {is_expired()}
      </div>
    </div>
  );
};

export default TaskComponent;
