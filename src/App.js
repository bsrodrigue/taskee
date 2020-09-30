import React from 'react';
import { useState, useEffect } from 'react';
import { TextField, Button, IconButton, Checkbox, Fab } from '@material-ui/core';

import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import RemoveRedEyeIcon from '@material-ui/icons/RemoveRedEye';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';

import './App.css';

function Header({ title }) {
  return (
    <div className="Header">
      <p className="HeaderTitle">{title}</p>
    </div>
  );
}

function TaskCollectionItem({ currentCollection, setCollections, collections, i, title, setCurrentCollection }) {
  const [edit, setEdit] = useState(false);
  const [newTitle, setNewTitle] = useState('');

  const handleClick = () => {
    
    setCurrentCollection(i);
  }

  const handleEdit = () => {
    
    setEdit(true);
  }

  const handleDelete = () => {
    collections.splice(currentCollection, 1);
    setCollections([...collections]);
  }

  const handleEditConfirm = () => {
    
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
          <TextField value={newTitle} id="standard-basic" label="Enter new name"
          onChange={(event) => setNewTitle(event.target.value)} />
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
            <IconButton color="secondary" onClick={handleDelete}>
              <DeleteIcon />
            </IconButton>
          </div>
        </div>
        <hr />
      </>
    );
  }


}

function TaskCollections({ setCollections, collections, setCurrentCollection, currentCollection }) {

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
            <TaskCollectionItem currentCollection={currentCollection}
            setCollections={setCollections} collections={collections}
            setCurrentCollection={setCurrentCollection}
            i={index} key={index} title={collection.title} />
          ))
        }
        <Button className="TaskCollectionCreationButton" 
          variant="contained" color="primary" disableElevation 
          onClick={handleCollectionCreation}>
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
      <TextField value={title}
        onChange={(event) => setTitle(event.target.value)}
        className="TaskCreationInput" id="filled-basic"
        label="Create a new Task" variant="filled" />
      <Button className="TaskCreationButton"
        variant="contained" color="primary"
        disableElevation onClick={handleClick}>
        Create Task
      </Button>
    </div>
  );
}

function Task({ i, task, collections, setCollections, currentCollection }) {
  const [edit, setEdit] = useState(false);
  const [checked, setChecked] = useState(task.checked);
  const [newTitle, setNewTitle] = useState('');


  const handleEdit = () => {
    setEdit(true);
  }
  const handleEditConfirm = () => {
    let task = collections[currentCollection].collection[i];
    task.title = newTitle;
    collections[currentCollection][i] = task;
    setCollections([...collections]);
    setEdit(false);
  }


  const handleDelete = () => {
    let collection = collections[currentCollection];
    collection.collection.splice(i, 1);
    collections[currentCollection] = collection;
    setCollections([...collections]);
  }

  if (edit) {
    return (
      <>
        <div className="TaskContainer">
          <TextField value={newTitle} id="standard-basic" 
          label="Enter new name" onChange={(event) => setNewTitle(event.target.value)} />
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
        <div className="TaskContainer">
          <p>{task.title}</p>
          <div className="TaskActions">
            <Checkbox checked={checked} onChange={event=>setChecked(!checked)}/>
            <IconButton onClick={handleEdit}>
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
      <TaskCollections currentCollection={currentCollection} 
        setCollections={setCollections} 
        setCurrentCollection={setCurrentCollection} 
        collections={collections} />
        {
          collections.length>0?(<TaskCollection collections={collections} 
            currentCollection={currentCollection} 
            collection={collections[currentCollection]} 
            setCollections={setCollections} />):(<p>Create a collection and add new tasks</p>)
        }
      
    </div>
  );
}


function App() {
  const initalCollections = [
    {
      title: "Anime Watch List",
      collection: [
        {
          title: "Toaru Majutsu no Index III",
          checked: true,
        },
      ],
    },

    {
      title: "Manga Reading List",
      collection: [
        {
          title: "20th Century Boys",
          checked: false,
        },
        {
          title: "Jojo's Bizarre Adventure Part 8",
          checked: false,
        },
        {
          title: "Naruto Shippuden",
          checked: false,
        },
      ],
    },

    {
      title: "Technology STack List",
      collection: [
        {
          title: "Learn React",
          checked: true,
        },
        {
          title: "Learn React Native",
          checked: true,
        },
        {
          title: "Learn Wordpress",
          checked: false,
        },
      ],
    },
  ]
  const [collections, setCollections] = useState(initalCollections);
  const [currentCollection, setCurrentCollection] = useState(0);

  return (
    <div className="App">
      {
        collections.length>0?(<Header title={collections[currentCollection].title} />)
        :(<Header title="Please Create a new Collection" />)
      }
      
      <Content collections={collections} setCollections={setCollections} currentCollection={currentCollection} setCurrentCollection={setCurrentCollection} />
    </div>
  );
}

export default App;
