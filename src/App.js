import './App.css';
import { useState } from 'react';
import { TextField } from '@mui/material';
import { Button } from '@mui/material';

const TodoItemInputField = (props) => {
  const [input, setInput] = useState("");

  const onSubmit = () => {
    props.onSubmit(input);
    setInput("");
  };

  return (
    <div>
      <TextField
        id = "todo-item-input"
        label="TO DO"
        variant='outlined'
        onChange={(e) => setInput(e.target.value)} value={input}
      />
      <Button variant='outlined' onClick={onSubmit}> 등록 </Button>
    </div>
  );
}

const TodoItemList = (props) => {
  const todoList = props.todoItemList && props.todoItemList.map((todoItem, index) => {
    return <li key={index}>{todoItem.todoItemContent}</li>
  });
  
  return (
    <div>
      <ul>{todoList}</ul>
    </div>
  )
}

let todoItemId = 0;

function App() { 
  const [todoItemList, setTodoItemList] = useState([]);
  const onSubmit = (newTodoItem) => {
    setTodoItemList([...todoItemList, {
      id: todoItemId++,
      todoItemContent: newTodoItem,
      isFinished: false
    }])
  }

  return ( 
    <div className="App"> 
      <TodoItemInputField onSubmit={(input) => {
        onSubmit(input);
        console.log('submit ' + input);
      }}/> 
      <TodoItemList />
      <TodoItemList todoItemList ={todoItemList} />
    </div>
  )
}

export default App;
 