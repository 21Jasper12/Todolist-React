import { Footer, Header, TodoCollection, TodoInput } from 'components';
import { useState } from 'react';

const dummyTodos = [
  {
    title: 'Learn react-router',
    isDone: true,
    id: 1,
  },
  {
    title: 'Learn to create custom hooks',
    isDone: false,
    id: 2,
  },
  {
    title: 'Learn to use context',
    isDone: true,
    id: 3,
  },
  {
    title: 'Learn to implement auth',
    isDone: false,
    id: 4,
  },
];

const TodoPage = () => {
  const [inputValue, setInputValue] = useState('')
  const [todos, setTodos] = useState(dummyTodos)

  function handleChange(value) {
    setInputValue(value);
  }

  function handleAddTodo() {
    if (inputValue.trim().length === 0) {
      return;
    }
    setTodos((prevTodos) => {
      return [
        ...prevTodos,
        {
          id: Math.random() * 100,
          title: inputValue,
          isDone: false,
        },
      ];
    });
    setInputValue('');
  };

  function handleKeyDown(){
    if (inputValue.trim().length === 0) {
      return;
    }
    setTodos((prevTodos) => {
      return [
        ...prevTodos,
        {
          id: Math.random() * 100,
          title: inputValue,
          isDone: false,
        },
      ];
    });
    setInputValue('');
  }

  function handleToggleDone(id) {
    setTodos((prevTodos) => {
      return prevTodos.map((todo) => {
        if(todo.id === id){
          return{
            ...todo,
            isDone: !todo.isDone
          }
        }
        else{
          return todo
        }
      })
    })
  }

  function handleDelete(id) {
    setTodos((prevTodos) => {
      return prevTodos.filter((todo) => todo.id !== id)
    })
  }

  function handleChangeMode({ id, isEdit }) {
    setTodos((prevTodos) => {
      return prevTodos.map((todo) => {
        if(todo.id === id){
          return {
            ...todo,
            isEdit,
          }
        }
        else{
          return {
            ...todo,
            isEdit: false
          }
        }
      })
    })
  }

  function handleSave({ id, title }){
    setTodos((prevTodos) => {
      return prevTodos.map((todo) => {
        if(todo.id === id){
          return{
            ...todo,
            title,
            isEdit: false 
          }
        }
        else{
          return todo
        }
      })
    })
  }

  return (
    <div>
      TodoPage
      <Header />
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
      <Footer 
        todos={todos}
      />
    </div>
  );
};

export default TodoPage;
