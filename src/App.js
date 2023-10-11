import './App.css';
import { useState } from 'react';
import { TextField } from '@mui/material';
import { Button } from '@mui/material';

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, collection, addDoc } from "firebase/firestore" 
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAQuZQxPSgpIHeUO0cUzYVU6Cpu2uakjmg",
  authDomain: "todo-bb2b3.firebaseapp.com",
  projectId: "todo-bb2b3",
  storageBucket: "todo-bb2b3.appspot.com",
  messagingSenderId: "123454079069",
  appId: "1:123454079069:web:e2e8a41f66c2cc39554db4",
  measurementId: "G-9SZ5PQJC38"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

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
  const style = props.todoItem.isFinished ? { textDecoration: 'line-through'} : {};
  return (
    <li>
      <span  
        style = {style}
        onClick={() => {props.onTodoItemClick(props.todoItem)}}
      >
        {props.todoItem.todoItemContent}
      </span>
      <Button variant='outlined' onClick={() => props.onRemoveClick(props.todoItem)}> 삭제 </Button>
    </li>
  );
}

const TodoItemList = (props) => {
  const todoList = props.todoItemList && props.todoItemList.map((todoItem, index) => {
    return <TodoItem 
      key={todoItem.id} 
      todoItem={todoItem} 
      onTodoItemClick={props.onTodoItemClick} 
      onRemoveClick={props.onRemoveClick} 
      />
  });
  
  return (
    <div>
      <ul>{todoList}</ul> 
    </div>
  )
}

function App() { 
  const [todoItemList, setTodoItemList] = useState([]);
  const onSubmit = async (newTodoItem) => {
    const docRef = await addDoc(collection(db, "todoItem"), {
      todoItemContent: newTodoItem,
      isFinished: false,
    });

    setTodoItemList([...todoItemList, {
      id: docRef.id,
      todoItemContent: newTodoItem,
      isFinished: false
    }])
  }

  const onRemoveClick = (removeTodoItem) => {
    setTodoItemList(todoItemList.filter((todoItem) => {
      return todoItem.id !== removeTodoItem.id;
    }));
  }
  
  const onTodoItemClick = (clickedTodoItem) => {
    setTodoItemList(todoItemList.map((todoItem) => {
      if (clickedTodoItem.id === todoItem.id) {
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
      <TodoItemInputField onSubmit={(input) => { onSubmit(input) }}/> 
      <TodoItemList 
        todoItemList ={todoItemList} 
        onTodoItemClick={onTodoItemClick} 
        onRemoveClick={onRemoveClick}
      />
    </div>
  )
}

export default App;
 