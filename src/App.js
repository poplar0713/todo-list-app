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
  return (
    <div>

    </div>
  )
}

function App() {
  return (
    <div className="App">
      <TodoItemInputField onSubmit={(input) => {
        console.log('submit ' + input);
      }}/>
      <TodoItemList />
    </div>
  );
}

export default App;
 