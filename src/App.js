// App.js
import React, { useState, useEffect } from "react";
import "./App.css"; // Make sure this file exists with the CSS content below

function App() {
  const [todos, setTodos] = useState([]);
  const [task, setTask] = useState("");
  const [theme, setTheme] = useState("dark");
  const [filter, setFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  const API_URL = "https://todo-api-backend-production.up.railway.app/backend/todo-api.php";
                  
  
  useEffect(() => {
    fetchTodos();
    document.body.className = theme;
  }, [theme]);

  const fetchTodos = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(API_URL);

      const data = await res.json();
      setTodos(data);
    } catch (error) {
      console.error("Failed to fetch todos:", error);
      // For demo purposes, use sample data if API fails
      setTodos([
        { id: 1, task: "Learn React Hooks", completed: true },
        { id: 2, task: "Build a cool Todo app", completed: false },
        { id: 3, task: "Deploy project", completed: false }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const addTodo = async () => {
    if (!task.trim()) return;
    
    const newTodo = { id: Date.now(), task, completed: false };
    setTodos([...todos, newTodo]);
    setTask("");
    
    try {
      await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ task }),
      });
      fetchTodos();
    } catch (error) {
      console.error("Failed to add todo:", error);
    }
  };

  const deleteTodo = async (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
    
    try {
      await fetch(`${API_URL}?id=${id}`, {
        method: "DELETE" 
      });
    } catch (error) {
      console.error("Failed to delete todo:", error);
      fetchTodos();
    }
  };

  const toggleComplete = async (id, task, completed) => {
    setTodos(
      todos.map(todo => 
        todo.id === id ? { ...todo, completed: !completed } : todo
      )
    );
    
    try {
      await fetch(`${API_URL}?id=${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ task, completed: completed ? 0 : 1 }),
      });
    } catch (error) {
      console.error("Failed to update todo:", error);
      fetchTodos();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      addTodo();
    }
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === "active") return !todo.completed;
    if (filter === "completed") return todo.completed;
    return true; // "all" filter
  });

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const completedCount = todos.filter(todo => todo.completed).length;
  const totalCount = todos.length;

  // Simple icons using SVG
  const MoonIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
    </svg>
  );

  const SunIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5"></circle>
      <line x1="12" y1="1" x2="12" y2="3"></line>
      <line x1="12" y1="21" x2="12" y2="23"></line>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
      <line x1="1" y1="12" x2="3" y2="12"></line>
      <line x1="21" y1="12" x2="23" y2="12"></line>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
    </svg>
  );

  const PlusIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19"></line>
      <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
  );

  const CheckCircleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
      <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
  );

  const CircleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"></circle>
    </svg>
  );

  const TrashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6"></polyline>
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
    </svg>
  );

  return (
    <div className={`app-container ${theme}`}>
      <div className="todo-card">
        
        {/* Header */}
        <div className="todo-header">
          <div className="header-content">
            <h1 className="app-title">TaskMaster</h1>
            <button onClick={toggleTheme} className="theme-toggle">
              {theme === "dark" ? <SunIcon /> : <MoonIcon />}
            </button>
          </div>
          
          {/* Progress bar */}
          <div className="progress-text">
            {totalCount > 0 ? `${completedCount}/${totalCount} completed` : "No tasks yet"}
          </div>
          <div className="progress-container">
            <div 
              className="progress-bar" 
              style={{ width: totalCount ? `${(completedCount / totalCount) * 100}%` : "0%" }}
            ></div>
          </div>
        </div>
        
        {/* Input section */}
        <div className="input-container">
          <div className="input-wrapper">
            <input
              value={task}
              onChange={(e) => setTask(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="What needs to be done?"
              className="task-input"
              autoFocus
            />
            <button 
              onClick={addTodo}
              disabled={!task.trim()} 
              className={`add-button ${!task.trim() ? 'disabled' : ''}`}
            >
              <PlusIcon />
            </button>
          </div>
        </div>
        
        {/* Filters */}
        <div className="filters-container">
          <div className="filter-buttons">
            <button 
              onClick={() => setFilter("all")}
              className={`filter-button ${filter === "all" ? 'active' : ''}`}
            >
              All
            </button>
            <button 
              onClick={() => setFilter("active")}
              className={`filter-button ${filter === "active" ? 'active' : ''}`}
            >
              Active
            </button>
            <button 
              onClick={() => setFilter("completed")}
              className={`filter-button ${filter === "completed" ? 'active' : ''}`}
            >
              Completed
            </button>
          </div>
        </div>
        
        {/* Todo list */}
        <div className="todo-list">
          {isLoading ? (
            <div className="empty-state loading">
              <div className="pulse">Loading tasks...</div>
            </div>
          ) : filteredTodos.length === 0 ? (
            <div className="empty-state">
              <div className="empty-title">No tasks found</div>
              <div className="empty-subtitle">
                {filter !== "all" ? `Try changing the filter or add a new task` : `Start by adding a new task above`}
              </div>
            </div>
          ) : (
            filteredTodos.map((todo) => (
              <div key={todo.id} className="todo-item">
                <button 
                  onClick={() => toggleComplete(todo.id, todo.task, todo.completed)}
                  className={`complete-button ${todo.completed ? 'completed' : ''}`}
                >
                  {todo.completed ? <CheckCircleIcon /> : <CircleIcon />}
                </button>
                <span className={`todo-text ${todo.completed ? 'completed' : ''}`}>
                  {todo.task}
                </span>
                <button 
                  onClick={() => deleteTodo(todo.id)}
                  className="delete-button"
                >
                  <TrashIcon />
                </button>
              </div>
            ))
          )}
        </div>
        
        {/* Footer */}
        <div className="todo-footer">
          <p>Made with ❤️ • {new Date().getFullYear()}</p>
        </div>
      </div>
    </div>
  );
}

export default App;