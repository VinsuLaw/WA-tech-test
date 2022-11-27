import React, {
  SyntheticEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useDispatch } from "react-redux";
import useDebounce from "../hooks/debounce";
import { useAppSelector } from "../hooks/redux";
import TaskService from "../services/task.service";
import { taskSlice } from "../store/reducers/task.slice";
import FileComponent from "./file";

let onMount = true;

/**
 * Сайдбар для подробного просмотра определенной задачи и её модификации
 * @param props.fnFetchTasks Функция для запуска загрузки задач с сервера
 * @param props.fnHandleSidebar Функция показа/скрытия сайдбара
 */
const AppSidebar = (props: {
  fnFetchTasks: Function;
  fnHandleSidebar: Function;
}) => {
  const { task } = useAppSelector((state) => state.taskReducer);
  const dispatch = useDispatch();

  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [deadline, setDeadline] = useState(task.deadline);

  const fileRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]);

  /**
   * Обновление выполненности задачи
   */
  const handleComplete = async () => {
    dispatch(
      taskSlice.actions.setTaskProp({
        prop: "completed",
        value: !task.completed,
      })
    );

    const { status } = await TaskService.update(
      task.id,
      "completed",
      !task.completed
    );
    if (status === 200) {
      props.fnFetchTasks();
    }
  };

  /**
   * Обновление даты deadline
   */
  const updateDeadline = async () => {
    const { status } = await TaskService.update(task.id, "deadline", deadline);
    if (status === 200) {
      props.fnFetchTasks();
    }
  };

  /**
   * Обработка и добавление новых файлов
   * @param e Событие инпута типа file
   */
  const handleFile = async (e: any) => {
    setFiles(Array.from(e.target.files));
    const arr = Array.from(e.target.files);

    const { status } = await TaskService.update(
      task.id,
      "attachments",
      arr,
      "",
      "upload"
    );
    if (status === 200) {
      let pushedAttchmts = task.attachments;
      let filesnames = arr.map((item: any) => item.name);
      pushedAttchmts = pushedAttchmts.concat(filesnames);
      dispatch(
        taskSlice.actions.setTaskProp({
          prop: "attachments",
          value: pushedAttchmts,
        })
      );
      props.fnFetchTasks();
    }
  };

  /**
   * Вычисление классов для иконки "Выполнено"
   */
  const completed_classes = useMemo(() => {
    let classes = "material-icons ";
    task.completed ? (classes += "completed") : (classes += "");
    return classes;
  }, [task.completed]);

  /**
   * Обновление заголовка с использованием debounce-хука
   */
  const updateTitle = useDebounce(async () => {
    const { status } = await TaskService.update(task.id, "title", title);
    if (status === 200) {
      props.fnFetchTasks();
    }
  }, 900);

  /**
   * Обновление описания с использованием debounce-хука
   */
  const updateDescription = useDebounce(async () => {
    const { status } = await TaskService.update(
      task.id,
      "description",
      description
    );
    if (status === 200) {
      props.fnFetchTasks();
    }
  }, 900);

  useEffect(() => {
    if (title.length > 0 && onMount === false) {
      updateTitle();
    }
  }, [title]);

  useEffect(() => {
    if (!onMount) {
      updateDescription();
    }
  }, [description]);

  useEffect(() => {
    if (!onMount) {
      updateDeadline();
    }
  }, [deadline]);

  useEffect(() => {
    onMount = false;
    fileRef.current?.addEventListener("change", handleFile);
    console.log(task);

    return () => {
      onMount = true;
      fileRef.current?.removeEventListener("change", handleFile);
    };
  }, []);

  /**
   * Удаление файла
   * @param file Название файла
   */
  const handleFileDelete = async (file: string) => {
    dispatch(taskSlice.actions.setFileActive(null));
    const filterd = task.attachments.filter(
      (attach: string) => attach !== file
    );
    dispatch(
      taskSlice.actions.setTaskProp({ prop: "attachments", value: filterd })
    );

    const { status } = await TaskService.update(
      task.id,
      "attachments",
      filterd,
      file,
      "delete"
    );
    if (status === 200) {
      props.fnFetchTasks();
    }
  };

  /**
   * Удаление задачи
   * @param e Событие нажатие на кнопку удаления
   */
  const handleDelete = async (e: SyntheticEvent) => {
    e.preventDefault();
    const { status, message } = await TaskService.delete(task.id);
    if (status === 200) {
      props.fnFetchTasks();
      props.fnHandleSidebar(true, null);
    }
  };

  return (
    <div className="sidebar">
      <div className="sidebar_content">
        <div className="title">
          <span className={completed_classes} onClick={handleComplete}>
            {task.completed ? "check_circle" : "check_circle_outline"}
          </span>
          <input
            type="text"
            className="default-inp"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="description">
          <textarea
            name="description"
            id="description"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>

        <div className="deadline">
          <input
            type="datetime-local"
            id="deadline"
            className="default-inp"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
          />
        </div>

        <div className="delete">
          <button onClick={(e) => handleDelete(e)}>Delete</button>
        </div>

        <div className="attachments">
          <div className="row vertical-align space-beetween">
            <div className="title">Attachments</div>
            <div className="row">
              <input type="file" multiple id="file" ref={fileRef} />
              <div
                className="attachment-action att-add"
                onClick={() => fileRef.current?.click()}
              >
                <span className="material-icons">add</span>
              </div>
            </div>
          </div>
          <div className="attachments_content">
            {task.attachments.map((file: string, index: number) => (
              <FileComponent
                index={index}
                file={file}
                key={file}
                fnDelete={handleFileDelete}
              />
            ))}
          </div>
        </div>

        <div className="attachments-info">
          <span className="material-icons">visibility</span>
          <p>Click on the file to cause menu.</p>
        </div>

        <div className="sidebar_footer">
          <div className="sidebar_content">
            <p>{new Date(task.id * 1000).toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppSidebar;
