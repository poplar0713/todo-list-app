import './App.css';
import { useEffect, useState } from 'react';
import { AppBar, TextField, Toolbar, Typography } from '@mui/material';
import { Button } from '@mui/material';

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, collection, addDoc, doc, setDoc, deleteDoc, getDocs, query, orderBy, where } from "firebase/firestore" 
import { GoogleAuthProvider, getAuth, signInWithRedirect, onAuthStateChanged, signOut } from "firebase/auth"
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
const provider = new GoogleAuthProvider();
const auth = getAuth(app);

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

const TodoListAppBar = (props) => {
  const loginWithGoolgeButton = (
    <Button color="inherit" onClick={() => {
      signInWithRedirect(auth, provider);
    }}>Login with Google</Button>
  )
  const logoutButton = (
    <Button color="inherit" onClick={() => {
      signOut(auth);
    }}>Log Out</Button>
  )

  const button = props.currentUser === null ? loginWithGoolgeButton : logoutButton;

  return (
    <AppBar position='static'>
      <Toolbar>
        <Typography variant='h6' component="div" sx={{flexGrow: 1}}>
          Toda List App
        </Typography>
        {button}
      </Toolbar>
    </AppBar>
  )
}

function App() { 
  const [todoItemList, setTodoItemList] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  onAuthStateChanged(auth, (user) => {
    if(user) {
      setCurrentUser(user.uid);
    } else {
      setCurrentUser(null);
    }
  });

  const syncTodoItemListStateWithFirestore = () => {
    const q = query(collection(db, "todoItem"), where("userId", "==", currentUser), orderBy("createdTime", "desc"))
    getDocs(q).then((querySnapshot) => {
      const firestoreTodoItemList = [];
      querySnapshot.forEach((doc) => {
        firestoreTodoItemList.push({
          id: doc.id,
          todoItemContent: doc.data().todoItemContent,
          isFinished: doc.data().isFinished,
          createdTime: doc.data().createdTime ?? 0,
          userId: doc.data().userId, 
        });
      });
      setTodoItemList(firestoreTodoItemList);
    })
  }

  useEffect(() => {
    syncTodoItemListStateWithFirestore();
  }, []);

  useEffect(() => {
    syncTodoItemListStateWithFirestore();
  }, [currentUser]);

  const onSubmit = async (newTodoItem) => {
    await addDoc(collection(db, "todoItem"), {
      todoItemContent: newTodoItem,
      isFinished: false,
      createdTime : Math.floor(Date.now() / 1000),
      userId: currentUser
    });
    syncTodoItemListStateWithFirestore();  
  };

  const onRemoveClick = async (removeTodoItem) => {
    const todoItemRef = doc (db, "todoItem", removeTodoItem.id);
    await deleteDoc(todoItemRef);
    syncTodoItemListStateWithFirestore();
  };
  
  const onTodoItemClick = async (clickedTodoItem) => {
    const todoItemRef = doc(db, "todoItem", clickedTodoItem.id);
    await setDoc(todoItemRef, { isFinished: !clickedTodoItem.isFinished }, { merge: true });
    syncTodoItemListStateWithFirestore();
  };

  return ( 
    <div className="App">
      <TodoListAppBar currentUser={currentUser}/>
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
 