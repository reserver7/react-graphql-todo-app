import { useMutation, useQuery } from "@apollo/client";
import "./App.css";
import { ADD_TODO, GET_TODOS, REMOVE_TODO, UPDATE_TODO } from "./apollo/todos";
import TodoItem from "./components/TodoItem";
import { AllTodosCache, IList } from "./types";
import React, { useState } from "react";

function App() {
  const { loading, error, data } = useQuery(GET_TODOS);
  const [input, setInput] = useState("");

  const [addTodo] = useMutation(ADD_TODO, {
    update(cache, { data: { createTodo } }) {
      const prevTodos = cache.readQuery<AllTodosCache>({
        query: GET_TODOS,
      })?.allTodos;
      cache.writeQuery({
        query: GET_TODOS,
        data: {
          allTodos: [createTodo, ...(prevTodos as IList[])],
        },
      });
    },
  });

  const [removeTodo] = useMutation(REMOVE_TODO, {
    update(cache, { data: { removeTodo } }) {
      cache.modify({
        fields: {
          allTodos(existingTodos, { readField }) {
            if (!existingTodos) return [];

            return existingTodos.filter(
              (todoRef: any) => readField("id", todoRef) !== removeTodo.id
            );
          },
        },
      });
    },
  });

  const [updataTodo] = useMutation(UPDATE_TODO);

  const sort = (list: IList[]): IList[] => {
    const newList = [...list];
    return newList.sort((a, b) => +a.checked - +b.checked);
  };

  const counter = (): string => {
    if (data?.allTodos as IList[]) {
      const completed = (data.allTodos as IList[]).filter(
        (todo) => todo.checked
      );
      return `${completed.length}/${(data.allTodos as IList[]).length}`;
    }
    return "0/0";
  };

  const handelSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (input.trim() === "") return;

    addTodo({
      variables: {
        text: input,
        checked: false,
      },
    });

    setInput("");
  };

  console.log(loading, error, data);

  if (error) return <div>Network error</div>;
  return (
    <div className="flex flex-col items-center">
      <div className="mt-5 text-3xl">
        Todo App <span className="text-sm">({counter()})</span>
      </div>
      <div className="w-5/6 md:w-1/2 lg:w-3/5">
        <form
          onSubmit={handelSubmit}
          className="flex justify-between p-5 my-5 text-4xl border-2 rounded-md shadow-md"
        >
          <input
            placeholder="할 일을 작성해주세요."
            type="text"
            onChange={(e) => setInput(e.target.value)}
            className="outline-none border-b-[1px] text-xl w-10/12 focus:border-b-[3px]"
            value={input}
          />
          <div>
            <button type="submit" className="hover:scale-105">
              +
            </button>
          </div>
        </form>
        {loading ? (
          <div>loading...</div>
        ) : (
          <ul>
            {data &&
              sort(data.allTodos).map((item: IList) => (
                <TodoItem
                  key={item.id}
                  item={item}
                  handelRemove={removeTodo}
                  handleUpdate={updataTodo}
                />
              ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default App;
