import React from "react";

interface IModal {
  title: string;
  children: React.ReactNode;
  fnClose: Function;
}

/**
 * Переиспользуемое модальное окно
 */
const AppModal = (props: IModal) => {
  return (
    <div className="modal-overlay" onClick={(e) => props.fnClose(e)}>
      <div className="modal_wrap">
        <div className="modal" onClick={(e) => e.stopPropagation()}>
          <div className="modal_header">
            <div className="modal_header-content">
              <h2>{props.title}</h2>
              <span
                className="material-icons"
                onClick={(e) => props.fnClose(e)}
              >
                close
              </span>
            </div>
          </div>

          <div className="modal_content">{props.children}</div>
        </div>
      </div>
    </div>
  );
};

export default AppModal;
