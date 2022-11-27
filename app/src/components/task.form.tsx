import React, {
  ReactElement,
  SyntheticEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import TaskService from "../services/task.service";
import AppLoader from "./app.loader";

/**
 * Форма создания задачи.
 * Используется в родительском компоненте AppModal
 * @param {Function} props fnRenderTasks - Функция указывающая на запуск загрузки задач с сервера
 */
const TaskForm = (props: { fnRenderTasks: Function }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);
  const [invalid, setInvalid] = useState({ title: false, deadline: false });
  const [bad, setBad] = useState("");

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  /**
   * Установка выбранных файлов в files.
   * Срабатывает от слушателя когда пользователь выбирает файлы
   * @param e Событие инпута типа file
   */
  const handleFile = (e: any) => {
    setFiles(Array.from(e.target.files));
  };

  /**
   * Создание и очистка слушателя инпута типа file
   */
  useEffect(() => {
    fileRef.current?.addEventListener("change", handleFile);
    return () => fileRef.current?.removeEventListener("change", handleFile);
  }, []);

  /**
   * Абстрактный обработчик нажатия на инпут типа file
   */
  const handleChoseFile = () => fileRef.current?.click();

  /**
   * Удаляет файл при нажатии на кнопку
   * @param e Событие нажатия на кнопку выбранного файла
   * @param name Название файла
   */
  const handleRemoveFile = (e: any, name: string) => {
    e.preventDefault();
    setFiles(files.filter((item: File) => item.name !== name));
  };

  /**
   * Валидация формы(title, deadline) полей
   * @returns {boolean}
   */
  const validate = (): boolean => {
    setInvalid({ title: false, deadline: false });
    setBad("");

    if (!title || title.length === 0) {
      setInvalid((prevState) => {
        return { ...prevState, title: true };
      });

      return false;
    }

    if (!deadline || deadline.length === 0) {
      setInvalid((prevState) => {
        return { ...prevState, deadline: true };
      });

      return false;
    }

    return true;
  };

  /**
   * Получение классов инпутов при валидации
   * @param input
   * @returns {string}
   */
  const input_getClasses = (input: string): string => {
    let classes = "input-default ";

    if (input === "title") {
      if (invalid.title) {
        return classes + "invalid";
      } else {
        return classes;
      }
    }

    if (input === "deadline") {
      if (invalid.deadline) {
        return classes + "invalid";
      } else {
        return classes;
      }
    }

    return classes;
  };

  /**
   * Обработка формы и отправка запроса на сервер
   * @param e Событие обработки формы
   * @returns {Promise<void>}
   */
  const submitForm = async (e: SyntheticEvent): Promise<void> => {
    e.preventDefault();
    setLoading(true);

    if (!validate()) {
      setLoading(false);
      return;
    }

    const { status, message } = await TaskService.create(
      {
        title,
        description,
        deadline,
        files,
      },
      navigate
    );

    if (status !== 201) {
      setBad(message);
    } else {
      props.fnRenderTasks();
    }

    setLoading(false);
  };

  if (loading) {
    return <AppLoader />;
  } else {
    return (
      <form className="task-form">
        <div className="form-controll">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            name="title"
            id="title"
            className={input_getClasses("title")}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="form-controll">
          <label htmlFor="description">Description</label>
          <textarea
            name="description"
            id="description"
            className="input-default"
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>

        <div className="form-controll">
          <label htmlFor="date">Deadline</label>
          <input
            type="datetime-local"
            name="date"
            id="date"
            className={input_getClasses("deadline")}
            onChange={(e) => setDeadline(e.target.value)}
          />
        </div>

        <div className="form-controll">
          <div className="row">
            <input type="file" multiple name="file" id="file" ref={fileRef} />
            <span
              className="material-icons inp_file_icon"
              onClick={handleChoseFile}
            >
              folder_open
            </span>

            {files.length > 0 ? (
              <div className="attachments col">
                <span className="">Attachments:</span>
                <div className="attachments_content">
                  {files.map((item: any) => (
                    <button
                      className="attachments_file"
                      key={item.name}
                      onClick={(e) => handleRemoveFile(e, item.name)}
                    >
                      {item.name}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              ""
            )}
          </div>
        </div>

        <div className="form-controll">
          <button className="create-btn" onClick={(e) => submitForm(e)}>
            Create
          </button>
        </div>
      </form>
    );
  }
};

export default TaskForm;
