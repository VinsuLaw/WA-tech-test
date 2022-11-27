import { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

export interface ITaskObj {
  title: string;
  description: any;
  deadline: any;
  attachments: any;
  completed: any;
  id: any;
}

export interface ITaskSlice {
  active: number | null;
  fileActive: number | null;
  task: ITaskObj;
}

export interface ITaskProp {
  prop: string,
  value: any
}

const initialState: ITaskSlice = {
  active: null,
  fileActive: null,
  task: {
    title: "",
    description: "",
    deadline: null,
    attachments: [],
    completed: false,
    id: null,
  },
};

export const taskSlice = createSlice({
  name: "task",
  initialState,
  reducers: {
    setActive(state, action: PayloadAction<number | null>) {
      state.active = action.payload;
    },

    setFileActive(state, action: PayloadAction<number | null>) {
      state.fileActive = action.payload;
    },

    setTask(state, action: PayloadAction<ITaskObj>) {
      if (JSON.stringify(state.task) !== JSON.stringify(action.payload)) {
        state.task = action.payload;
      }
    },

    setTaskProp(state, action: PayloadAction<ITaskProp>) {
      state.task = { ...state.task, [action.payload.prop]: action.payload.value }
    }
  },
});

export default taskSlice.reducer;
