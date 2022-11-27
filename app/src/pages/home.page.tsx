import React, { SyntheticEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TaskComponent from "../components/task";
import AppModal from "../components/app.modal";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import TaskForm from "../components/task.form";
import TaskService from "../services/task.service";
import { ITask } from "../models/ITask";
import AppLoader from "../components/app.loader";
import AppSidebar from "../components/sidebar";
import { taskSlice } from "../store/reducers/task.slice";
import { task_api } from "../http";

const HomePage = () => {
  const navigate = useNavigate();
  const { uid } = useAppSelector((state) => state.userReducer);
  const [isCreating, setCreating] = useState(false);
  const [tasks, setTasks] = useState<ITask[]>([]);
  const [loading, setLoading] = useState(false);

  const [isSidebar, showSidebar] = useState(false);
  const dispatch = useAppDispatch();

  /**
   * Загрузка задач с сервера
   */
  const fetchTasks = async () => {
    setLoading(true);
    const { status, body } = await TaskService.get(null, navigate, uid);
    if (status === 200) {
      setTasks(body);
      console.log(body);
    }
    setLoading(false);
  };

  /**
   * При первом запуске страницы устанавливаются заголовки TaskAPI.
   */
  useEffect(() => {
    if (!uid || uid.length <= 0) {
      navigate("/");
    } else {
      task_api.interceptors.response.use((config) => {
        config.headers.Authorization = uid;
        return config;
      });

      task_api.interceptors.request.use((config) => {
        if (config.headers) {
          config.headers.Authorization = uid;
        }
        return config;
      });
    }

    fetchTasks();
  }, []);

  /**
   * Открывает/скрывает окно создания задачи
   * @param e // Событие нажатия
   */
  const handleCreating = (e: SyntheticEvent) => {
    e.preventDefault();
    setCreating((prevState) => !prevState);
  };

  /**
   * Вызывается в CreatingModal для скрытия окна и запуска загрузки задач с сервера
   */
  const dispatchFetch = () => {
    setCreating(false);
    fetchTasks();
  };

  /**
   * Установка определенной задачи в redux и показ/скрытие сайдбара
   * @param close Определяет нужно ли закрывать компонент
   * @param taskIdx Определяет какой task-компонент обрабатывать в сайдбаре
   */
  const handleSidebar = (
    close: boolean | undefined,
    taskIdx: number | null
  ) => {
    if (!isSidebar && taskIdx !== null) {
      dispatch(taskSlice.actions.setTask(tasks[taskIdx]));
    }

    showSidebar((prevState) => !prevState);

    if (close) {
      dispatch(taskSlice.actions.setActive(null));
    }
  };

  /**
   * Рендер task компонентов
   * @returns {JSX.Element}
   */
  const renderTasks = (): JSX.Element => {
    return (
      <>
        {tasks.length > 0 ? (
          tasks.map((task, index) => (
            <TaskComponent
              task={task}
              key={task.id}
              index={index}
              handle={handleSidebar}
            />
          ))
        ) : (
          <div className="zero">
            <h1>【=◈‿◈=】</h1>
            <h3>You don't have any tasks yet.</h3>
          </div>
        )}
      </>
    );
  };

  return (
    <>
      <div className="home">
        <div className="tasks_container">
          {isSidebar ? (
            <div
              className="hidden"
              onClick={() => handleSidebar(true, null)}
            ></div>
          ) : (
            ""
          )}
          <div className="flex-end">
            <button
              className="task-btn-create"
              onClick={(e) => handleCreating(e)}
            >
              Create
            </button>
          </div>

          {loading ? <AppLoader /> : renderTasks()}
        </div>

        {isSidebar ? (
          <AppSidebar
            fnFetchTasks={fetchTasks}
            fnHandleSidebar={handleSidebar}
          />
        ) : (
          ""
        )}
      </div>

      {isCreating ? (
        <AppModal title="Create todo" fnClose={handleCreating}>
          <TaskForm fnRenderTasks={dispatchFetch} />
        </AppModal>
      ) : (
        ""
      )}
    </>
  );
};

export default HomePage;
