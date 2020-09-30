import React from 'react';
import { useState, useEffect } from 'react';
import { TextField, Button, IconButton, Checkbox, Fab } from '@material-ui/core';

import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import RemoveRedEyeIcon from '@material-ui/icons/RemoveRedEye';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';

import './App.css';

const firebaseConfig = {
  apiKey: "AIzaSyCzIvicS1aZNOM0ItpCCP63qpa_9hmqroo",
  authDomain: "portfolio-de182.firebaseapp.com",
  databaseURL: "https://portfolio-de182.firebaseio.com",
  projectId: "portfolio-de182",
  storageBucket: "portfolio-de182.appspot.com",
  messagingSenderId: "318388871042",
  appId: "1:318388871042:web:378f2912eb11a6a8b5f99b"
};
const firebase = require("firebase");
require("firebase/firestore");
firebase.initializeApp(firebaseConfig);
var db = firebase.firestore();

function Header({ title }) {
  return (
    <div className="Header">
      <p className="HeaderTitle">{title}</p>
    </div>
  );
}

function TaskCollectionItem({ setCollections, collections, i, title, setCurrentCollection }) {
  const [edit, setEdit] = useState(false);
  const [newTitle, setNewTitle] = useState('');

  const handleClick = () => {
    console.log(i);
    setCurrentCollection(i);
  }

  const handleEdit = () => {
    console.log("Edit");
    setEdit(true);
  }

  const handleEditConfirm = () => {
    console.log("Confirm edit");
    let collection = collections[i];
    collection.title = newTitle;
    collections[i] = collection;
    setCollections([...collections]);
    setEdit(false);
  }

  if (edit) {
    return (
      <>
        <div className="TaskCollectionButton">
          <TextField value={newTitle} id="standard-basic" label="Enter new name" onChange={(event) => setNewTitle(event.target.value)} />
          <div>

            <IconButton onClick={handleEditConfirm}>
              <CheckCircleOutlineIcon />
            </IconButton>

          </div>
        </div>
        <hr />
      </>
    );
  } else {
    return (
      <>
        <div className="TaskCollectionButton">
          <p>{title}</p>
          <div>
            <IconButton onClick={handleClick}>
              <RemoveRedEyeIcon />
            </IconButton>
            <IconButton onClick={handleEdit}>
              <EditIcon />
            </IconButton>
            <IconButton color="secondary">
              <DeleteIcon />
            </IconButton>
          </div>
        </div>
        <hr />
      </>
    );
  }


}

function TaskCollections({ setCollections, collections, setCurrentCollection }) {

  const handleCollectionCreation = () => {
    let newCollection = {
      title: "New Collection",
      collection: [],
    };

    collections.push(newCollection);
    setCollections([...collections]);
  };

  return (
    <>
      <div className="TaskCollections">
        {
          collections.map((collection, index) => (
            <TaskCollectionItem setCollections={setCollections} collections={collections} setCurrentCollection={setCurrentCollection} i={index} key={index} title={collection.title} />
          ))
        }
        <Button className="TaskCollectionCreationButton" variant="contained" color="primary" disableElevation onClick={handleCollectionCreation}>
          Create Task Collection
</Button>
      </div>
    </>
  );
}

function TaskCreationForm({ collections, setCollections, currentCollection }) {
  const [title, setTitle] = useState('');

  const handleClick = () => {
    let collection = collections[currentCollection];
    collection.collection.push({
      title: title,
    });
    collections[currentCollection] = collection;
    setCollections([...collections]);
    setTitle('');
  };

  return (
    <div className="TaskCreationForm">
      <TextField value={title} onChange={(event) => setTitle(event.target.value)} className="TaskCreationInput" id="filled-basic" label="Create a new Task" variant="filled" />
      <Button className="TaskCreationButton" variant="contained" color="primary" disableElevation onClick={handleClick}>
        Create Task
</Button>
    </div>
  );
}

function Task({ i, task, collections, setCollections, currentCollection }) {

  const handleDelete = () => {
    let collection = collections[currentCollection];
    collection.collection.splice(i, 1);
    collections[currentCollection] = collection;
    setCollections([...collections]);
  }

  return (
    <>
      <div className="TaskContainer">
        <p>{task.title}</p>
        <div className="TaskActions">
          <Checkbox checked={task.checked} />
          <IconButton>
            <EditIcon />
          </IconButton>
          <IconButton color="secondary" onClick={handleDelete}>
            <DeleteIcon />
          </IconButton>
        </div>
      </div>
      <hr />
    </>
  );
}

function TaskList({ collection, collections, setCollections, currentCollection }) {
  return (
    <div className="TaskList">
      {
        collection.map((task, index) => (<Task i={index} key={index} task={task} collections={collections}
          setCollections={setCollections}
          currentCollection={currentCollection} />))
      }
    </div>
  );
}

function TaskCollection({ collections, collection, setCollections, currentCollection }) {
  return (
    <div className="TaskCollection">
      <TaskCreationForm collections={collections} currentCollection={currentCollection} setCollections={setCollections} />
      <TaskList collection={collection.collection} collections={collections}
        setCollections={setCollections}
        currentCollection={currentCollection} />
    </div>
  );
}


function Content({ currentCollection, setCurrentCollection, collections, setCollections }) {
  return (
    <div className="Content">
      <TaskCollections setCollections={setCollections} setCurrentCollection={setCurrentCollection} collections={collections} />
      {
        collections.length>0?(<TaskCollection collections={collections} currentCollection={currentCollection} collection={collections[currentCollection]} setCollections={setCollections} />):(<p>Please create a collection</p>)
      }
      
    </div>
  );
}


function App() {
  

  const [collections, setCollections] = useState([]);
  const [currentCollection, setCurrentCollection] = useState(0);

  useEffect(()=>{
    let collections = [];
    db.collection("collections").get().then(function(querySnapshot){
      querySnapshot.forEach(function(doc){
        console.log(doc.id, " ===> ", doc.data());
        collections.push(doc.data());
      });
      setCollections(collections);
    });
  },[]);

  return (
      <div className="App">
        {
          collections.length>0?( <Header title={collections[currentCollection].title} />):( <Header title="Aucune Collection Disponible" />)
        }
       
        <Content collections={collections} setCollections={setCollections} currentCollection={currentCollection} setCurrentCollection={setCurrentCollection} />
      </div>
  );
}

export default App;
