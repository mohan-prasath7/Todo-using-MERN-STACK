import React from 'react'
import { useState, useEffect } from 'react';

const Todo = () => {

  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [todos, setTodos] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [editId, setEditId] = useState(-1);

  // Edit Item
  const [editTitle, setEditTitle] = useState("");
  const [editDesc, setEditDesc] = useState("");

  const apiUrl = "http://localhost:5000";

  const handleSubmit = () => {
    
    if(title.trim() !== '' && desc.trim() !== ''){
        fetch(apiUrl+"/todos", {
          method: "POST",
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({title, desc}) 
        })
        .then((res) => {
          if (res.ok){
            // Create item to list
            setTodos([...todos,  {title, desc}]);
            setTitle("");
            setDesc("");
            setMessage("Item Added Successfully.");
            setTimeout(() => {
              setMessage("");
            }, 3000);
          }else {
            setError("Unable To Create A New Item.");
          }
        })
        .catch((err) => {
          setError("Unable To Create A New Item.");
          setMessage("");  // Clear success message
          console.error("Error:", err);
        });
    }else {
      setError("Title and Description cannot be empty.");
      setMessage("");  // Clear success message
    }

  }

  useEffect( () => {
    getItems()
  }, [])

  const getItems = () => {
      fetch(apiUrl+"/todos")
      .then((res) => res.json())
      .then((res) => {
          setTodos(res)
      })
  }

  const handleEdit = (item) => {
      setEditId(item._id);
      setEditTitle(item.title);
      setEditDesc(item.desc);
  }

  const handleEditCancel = () => {
      setEditId(-1);
  }

  const handleUpdate = () => {
      if(editTitle.trim() !== '' && editDesc.trim() !== ''){
        fetch(apiUrl+"/todos/"+editId, {
          method: "PUT",
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({title: editTitle, desc: editDesc}) 
        })
        .then((res) => {
          if (res.ok){
            //Update item to list
            const updatedTodos = todos.map( (item) => {
                if(item._id == editId){
                  item.title = editTitle;
                  item.desc = editDesc;
                }
                return item;
            })
            setTodos(updatedTodos);
            setEditTitle("");
            setEditDesc("");
            setMessage("Item Updated Successfully.");
            setError("");
            setTimeout(() => {
              setMessage("");
            }, 3000);
            setEditId(-1);
          }else {
            setError("Unable To Create A New Item.");
          }
        })
        .catch((err) => {
          setError("Unable To Create A New Item.");
          setMessage("");  // Clear success message
          console.error("Error:", err);
        });
      }else {
        setError("Title and Description cannot be empty.");
        setMessage("");  // Clear success message
      }
  }

  const handleDelete = (id) => {
      if(window.confirm("Are you sure want to delete?")){
        fetch(apiUrl+"/todos/"+id, {
          method: "DELETE"
        })
        .then( () => {
            const updatedTodos = todos.filter( (item) => item._id != id );
            setTodos(updatedTodos);
        })
      }
  }

  return (
    <>
      <div>
          <h1 className='text-center p-3 mt-4 mb-4 bg-success text-light fw-bold'>Todo Application Using MERN Stack Development</h1>
      </div>
      <div className='row'>
          <h1>Add Item:</h1>
          {message && <p className='text-success fw-bold fs-5'>{message}</p>}
          <div className='form-group d-flex gap-3 mt-3'>
              <input type="text" placeholder='Title' onChange={ (e) => setTitle(e.target.value)} value={title} className='form-control' />
              <input type="text" placeholder='Description' onChange={ (e) => setDesc(e.target.value)} value={desc} className='form-control' />
              <button className='btn btn-primary' onClick={handleSubmit}>Submit</button>
          </div>
          {error && <p className='text-danger fw-bold fs-5'>{error}</p>}
      </div>
      <div className="row mt-4">
          <h1 className='mb-4'>Tasks:</h1>
          <ul className='list-group mb-5'>
              {
                  todos.map( (item) => <li className='list-group-item bg-info d-flex justify-content-between align-items-center mb-3'>
                  <div className="d-flex flex-column gap-2">
                      {
                        editId == -1 || editId != item._id ?
                        <>
                            <span className='fw-bold fs-3'>{item.title}</span>
                            <span className='fs-4'>{item.desc}</span>
                        </> :
                        <div className='form-group d-flex gap-3 mt-3'>
                            <input type="text" placeholder='Title' onChange={ (e) => setEditTitle(e.target.value)} value={editTitle} className='form-control' />
                            <input type="text" placeholder='Description' onChange={ (e) => setEditDesc(e.target.value)} value={editDesc} className='form-control' />
                        </div>
                      }
                  </div>
                  <div className="d-flex gap-2">
                      { editId == -1 || editId != item._id ? 
                          <button className='btn btn-warning' onClick={ () => handleEdit(item)}>Edit</button>
                          : <button className='btn btn-warning' onClick={handleUpdate}>Update</button>
                      }
                      {
                        editId == -1 || editId != item._id ? <button className='btn btn-danger' onClick={ () => {handleDelete(item._id)}}>Delete</button>
                        : <button className='btn btn-danger' onClick={handleEditCancel}>Cancel</button>
                      }
                      
                  </div>
              </li> )
              }
          </ul>
      </div>
    </>
  )
}

export default Todo;