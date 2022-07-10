import React, { useState } from 'react';
import { useFilePicker } from 'use-file-picker';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { EditText } from 'react-edit-text';
import 'react-edit-text/dist/index.css';
import './App.css';

const downloadFile = ({ data, fileName, fileType }) => {
  // Create a blob with the data we want to download as a file
  const blob = new Blob([data], { type: fileType })
  // Create an anchor element and dispatch a click event on it
  // to trigger a download
  const a = document.createElement('a')
  a.download = fileName
  a.href = window.URL.createObjectURL(blob)
  const clickEvt = new MouseEvent('click', {
    view: window,
    bubbles: true,
    cancelable: true,
  })
  a.dispatchEvent(clickEvt)
  a.remove()
}


function App() {
  const [todoList, setTodoList] = useState({0: "test"});
  const [openFileSelector, { filesContent, loading, clear }] = useFilePicker({
    accept: '.json',
  });

  if (loading) {
    return <div>Loading...</div>;
  } else if (filesContent[0]) {
    // console.log(filesContent[0].content);
    const savedList = JSON.parse(filesContent[0].content);
    setTodoList(savedList);
    clear();
  }

  const exportToJson = e => {
    e.preventDefault();
    downloadFile({
      data: JSON.stringify(todoList),
      fileName: 'todo.json',
      fileType: 'text/json',
    })
  }

  const updateTodo = e => {
    console.log(e);
    setTodoList({
      ...todoList,
      [e.name]: e.value
    });
    console.log(todoList);
  }

  const addTodo = e => {
    console.log(e);
    const key = Math.floor(Math.random() * 10000)
    setTodoList({
      ...todoList,
      [key]: 'click to edit'
    });
    console.log(todoList);
  }

  const delTodo = key => {
    console.log(key);
    const newTodoList= {...todoList};
    delete newTodoList[key]
    setTodoList(newTodoList);
    console.log(todoList);
  }


  const printTodoList = () => {
    var toPrint = [];
    for (const [id, todo] of Object.entries(todoList)) {
      console.log(id, todo);
      toPrint.push(
        <Row key={id}>
          <Col><
            EditText
            defaultValue={todo}
            onSave={updateTodo}
            name={id}
          /></Col>
          <Col><
            Button
            variant="outline-danger"
            onClick={() => delTodo(id)}
          >X</Button></Col>
        </Row>
      )
    }
    return toPrint;
  }

  return (
    <div className="App">
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand href="#home">Godo</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link onClick={exportToJson}>Save</Nav.Link>
              <Nav.Link onClick={openFileSelector}>Open</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <header className="App-header">
        {printTodoList()}
        <Button onClick={addTodo} variant="secondary" size="lg">+</Button>
      </header>
    </div>
  );
}

export default App;
