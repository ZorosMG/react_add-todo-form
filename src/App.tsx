import { useState } from 'react';
import './App.scss';
import users from './api/users';
import todosFromServer from './api/todos';

type Todo = {
  id: number;
  title: string;
  completed: boolean;
  userId: number;
  user?: {
    name: string;
    email: string;
  };
};

type Errors = {
  title: string;
  user: string;
};

export const App = () => {
  const [todos, setTodos] = useState<Todo[]>(todosFromServer);
  const [title, setTitle] = useState<string>('');
  const [userId, setUserId] = useState<number>(0);
  const [errors, setErrors] = useState<Errors>({ title: '', user: '' });

  const addTodo = () => {
    if (!title || !userId) {
      if (!title) {
        setErrors(prev => ({ ...prev, title: 'Please enter a title' }));
      }

      if (!userId) {
        setErrors(prev => ({ ...prev, user: 'Please choose a user' }));
      }

      return;
    }

    const newTodo: Todo = {
      id: todos.length > 0 ? Math.max(...todos.map(todo => todo.id)) + 1 : 1,
      title,
      userId,
      completed: false,
      user: users.find(user => user.id === userId),
    };

    setTodos(prevTodos => [...prevTodos, newTodo]);
    setTitle('');
    setUserId(0);
    setErrors({ title: '', user: '' });
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;

    setTitle(newTitle.replace(/[^a-zA-Z0-9а-яА-ЯїЇєЄґҐіїІёЁ ]/g, ''));
  };

  return (
    <div className="App">
      <h1>Add todo form</h1>

      <form
        action="/api/todos"
        method="POST"
        onSubmit={e => {
          e.preventDefault();
          addTodo();
        }}
      >
        <div className="field">
          <input
            type="text"
            data-cy="titleInput"
            value={title}
            onChange={handleTitleChange}
            placeholder="Enter todo title"
          />
          {errors.title && <span className="error">{errors.title}</span>}
        </div>

        <div className="field">
          <select
            data-cy="userSelect"
            value={userId}
            onChange={e => setUserId(Number(e.target.value))}
          >
            <option value="">Choose a user</option>
            {users.map(user => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
          {errors.user && <span className="error">{errors.user}</span>}
        </div>

        <button type="submit" data-cy="submitButton">
          Add
        </button>
      </form>

      <section className="TodoList">
        {todos.map(todo => (
          <article
            key={todo.id}
            data-id={todo.id}
            className={`TodoInfo ${todo.completed ? 'TodoInfo--completed' : ''}`}
          >
            <h2 className="TodoInfo__title">{todo.title}</h2>
            <a className="UserInfo" href={`mailto:${todo.user?.email}`}>
              {todo.user?.name}
            </a>
          </article>
        ))}
      </section>
    </div>
  );
};
