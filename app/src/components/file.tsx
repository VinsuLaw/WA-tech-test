import React, { useRef } from "react";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { API_STATIC } from "../http";
import { taskSlice } from "../store/reducers/task.slice";

/**
 * Файл компонент(вложение к задачи)
 * @param props.index Индекс файла
 * @param props.file Название файла
 * @param props.fnDelete Функция удаления файла
 * @returns
 */
const FileComponent = (props: {
  index: number;
  file: string;
  fnDelete: Function;
}) => {
  const { fileActive } = useAppSelector((state) => state.taskReducer);
  const downloadRef = useRef<HTMLAnchorElement>(null);
  const dispatch = useAppDispatch();

  /**
   * Добавление классов для стилизации выбранного файла
   * @returns {string}
   */
  const file_classes = (): string => {
    let classes = "file ";
    fileActive === props.index ? (classes += "active") : (classes += "");
    return classes;
  };

  /**
   * Добавление классов для показа/скрытия контекстного меню
   * @returns {string}
   */
  const select_classes = (): string => {
    let classes = "file-select ";
    fileActive === props.index ? (classes += "active") : (classes += "");
    return classes;
  };

  /**
   * Функция для обрезки строки
   * @param text Строка
   * @returns Обрезанная строка
   */
  const nameTrim = (text: string): string => {
    if (fileActive !== props.index) {
      let trimmed = "";

      for (let i = 0; i < text.length && i < 8; i++) {
        trimmed += text[i];
      }

      return trimmed + "...";
    } else {
      return text;
    }
  };

  /**
   * Обработка файла с вызовом контекстного меню
   */
  const handleFile = () => {
    if (fileActive === props.index) {
      dispatch(taskSlice.actions.setFileActive(null));
    } else {
      dispatch(taskSlice.actions.setFileActive(props.index));
    }
  };

  return (
    <>
      <div className="file-wrap">
        <div className={file_classes()} onClick={handleFile}>
          <div className="file-icon">
            <span className="material-icons">description</span>
          </div>
          <div className="file-name">{nameTrim(props.file)}</div>
        </div>

        <ul className={select_classes()}>
          <li onClick={() => downloadRef.current?.click()}>
            <span className="material-icons">download</span>
            <a
              href={`${API_STATIC}/${props.file}`}
              download
              target="_blank"
              ref={downloadRef}
              className="action"
            >
              Download
            </a>
          </li>
          <li onClick={() => props.fnDelete(props.file)}>
            <span className="material-icons">delete</span>
            <div className="action">Delete</div>
          </li>
        </ul>
      </div>
    </>
  );
};

export default FileComponent;
