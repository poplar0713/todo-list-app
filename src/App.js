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

const TodoItem = (props) => {
  // BUG 수정 필요 : 클릭시 줄이 안생김
  const style = props.todoItem.isFinished ? { textDecoration: 'line-through'} : {};
  return (
    <li>
      <span  
        style = {style}
        onClick={() => props.onTodoItemClick(props.todoItem)}
      >
        {props.todoItem.todoItemContent}
      </span>
    </li>
  );
}

const TodoItemList = (props) => {
  const todoList = props.todoItemList && props.todoItemList.map((todoItem, index) => {
    return <TodoItem key={todoItem.id} todoItem={todoItem} onTodoItemClick={props.onTodoItemClick} />
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
  
  const onTodoItemClick = (clickedTodoItem) => {
    setTodoItemList(todoItemList.map((todoItem) => {
      if (clickedTodoItem.id === todoItemId) {
        return {
          id : clickedTodoItem.id,
          todoItemContent : clickedTodoItem.todoItemContent,
          isFinished : !clickedTodoItem.isFinished,
        };
      } else {
        return todoItem;
      }
    }))
  }

  return ( 
    <div className="App"> 
      <TodoItemInputField onSubmit={(input) => {
        onSubmit(input);
        // console.log('submit ' + input);
      }}/> 
      <TodoItemList todoItemList ={todoItemList} onTodoItemClick={onTodoItemClick} />
    </div>
  )
}

export default App;
 