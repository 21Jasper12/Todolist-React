import { Footer, Header, TodoCollection, TodoInput } from 'components';
import { useState, useEffect } from 'react';
import { getTodos, createTodo, patchTodo, deleteTodo } from './../api/todos';
import { useNavigate } from 'react-router-dom';
import { useAuth } from 'contexts/AuthContext';
import Swal from 'sweetalert2';

// 串接後端API就可以把這段刪除
// const dummyTodos = [
//   {
//     title: 'Learn react-router',
//     isDone: true,
//     id: 1,
//   },
//   {
//     title: 'Learn to create custom hooks',
//     isDone: false,
//     id: 2,
//   },
//   {
//     title: 'Learn to use context',
//     isDone: true,
//     id: 3,
//   },
//   {
//     title: 'Learn to implement auth',
//     isDone: false,
//     id: 4,
//   },
// ];

const TodoPage = () => {
  const [inputValue, setInputValue] = useState('');
  const [todos, setTodos] = useState([]);
  const navigate = useNavigate();

  const { isAuthenticated, currentMember } = useAuth(); // 取出需要的狀態與方法

  function handleChange(value) {
    setInputValue(value);
  }

  async function handleAddTodo() {
    try {
      if (inputValue.trim().length === 0) {
        Swal.fire({
          position: 'top',
          title: '請勿空白！',
          timer: 1000,
          icon: 'warning',
          showConfirmButton: false,
        });

        setInputValue('');
        return;
      }

      const data = await createTodo({
        title: inputValue.trim(),
        isDone: false,
      });
      setTodos((prevTodos) => {
        return [
          ...prevTodos,
          {
            id: data.id,
            title: data.title,
            isDone: data.isDone,
            isEdit: false,
          },
        ];
      });

      setInputValue('');
    } catch (error) {
      console.error(error);
    }
  }

  async function handleKeyDown() {
    if (inputValue.trim().length === 0) {
      Swal.fire({
        position: 'top',
        title: '請勿空白！',
        timer: 1000,
        icon: 'warning',
        showConfirmButton: false,
      });

      setInputValue('')
      return;
    }

    const data = await createTodo({
      title: inputValue.trim(),
      isDone: false,
    });
    setTodos((prevTodos) => {
      return [
        ...prevTodos,
        {
          id: data.id,
          title: data.title,
          isDone: data.isDone,
          isEdit: false,
        },
      ];
    });

    setInputValue('');
  }

  async function handleToggleDone(id) {
    const currentTodo = todos.find((todo) => todo.id === id);

    await patchTodo({
      id,
      isDone: !currentTodo.isDone,
    });

    setTodos((prevTodos) => {
      return prevTodos.map((todo) => {
        if (todo.id === id) {
          return {
            ...todo,
            isDone: !todo.isDone,
          };
        } else {
          return todo;
        }
      });
    });
  }

  async function handleDelete(id) {
    await deleteTodo(id);

    setTodos((prevTodos) => {
      return prevTodos.filter((todo) => todo.id !== id);
    });
  }

  function handleChangeMode({ id, isEdit }) {
    setTodos((prevTodos) => {
      return prevTodos.map((todo) => {
        if (todo.id === id) {
          return {
            ...todo,
            isEdit,
          };
        } else {
          return {
            ...todo,
            isEdit: false,
          };
        }
      });
    });
  }

  async function handleSave({ id, title }) {
    await patchTodo({
      id,
      title,
    });

    setTodos((prevTodos) => {
      return prevTodos.map((todo) => {
        if (todo.id === id) {
          return {
            ...todo,
            title,
            isEdit: false,
          };
        } else {
          return todo;
        }
      });
    });
  }

  // 用useEffect串接API拿todos資料
  useEffect(() => {
    async function getTodosAsync() {
      const todos = await getTodos();

      setTodos(
        todos.map((todo) => {
          return {
            ...todo,
            isEdit: false,
          };
        }),
      );
    }

    getTodosAsync();
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [navigate, isAuthenticated]);

  return (
    <div>
      <div
        onClick={() => console.log('test')}
      >
        <h1>TodoPage</h1>
      </div>

      <Header userName={currentMember?.name} />
      <TodoInput
        inputValue={inputValue}
        onChange={handleChange}
        onAddTodo={handleAddTodo}
        onKeyDown={handleKeyDown}
      />
      <TodoCollection
        todos={todos}
        onToggleDone={handleToggleDone}
        onChangeMode={handleChangeMode}
        onSave={handleSave}
        onDelete={handleDelete}
      />
      <Footer todos={todos} />
    </div>
  );
};

export default TodoPage;
