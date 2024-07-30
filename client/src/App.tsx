import { useEffect, useState } from 'react';
import './App.css';
import { getItems, addItem, deleteItem } from './client';
import { TodoItem } from './models';

function App() {
  const [items, setItems] = useState<TodoItem[]>([]);
  const [newItem, setNewItem] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const initialize = async () => {
      setIsLoading(true);
      const response = await getItems();
      setIsLoading(false);
      if (response.ok) {
        const items = await response.json() as TodoItem[];
        setItems(items);
      }
    }

    initialize();
  }, [])

  const addNewItem = async (description: string) => {
    setIsLoading(true);
    const response = await addItem(description);
    setIsLoading(false);

    if (response.ok) {
      const newItem = await response.json() as TodoItem;
      const newItemsList = [...items];
      newItemsList.push(newItem);
      setItems(newItemsList);
      setNewItem('');
    }
  }

  const callDeleteItem = async (id: number) => {
    setIsLoading(true);
    const response = await deleteItem(id);
    setIsLoading(false);
    if (response.ok) {
      let updatedItemsList = [...items];
      const indexToDelete = items.findIndex(i => i.id === id);
      updatedItemsList.splice(indexToDelete, 1);
      setItems(updatedItemsList);
    }
  }

  const buttonText = () => {
    if (isLoading) {
      return <span className="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>;
    }
    return 'Add';
  }

  const listItems = items.map((i) => {
    return <li className='list-group-item' key={i.id}>
      <button className='btn btn-light' onClick={() => callDeleteItem(i.id)}>X</button>
      <div>{i.description} </div>
    </li>
  });

  return (
    <div className="App">
      <header>
        <h1>TODO List</h1>
      </header>
      <div>
        <div className="row align-items-start">
          <div className="col first-col">
            <section className="list-section">
              <ul className='list-group'>
                {listItems}
              </ul>
              <div className='form-section'>
                <input className='form-control'
                  type="text" value={newItem}
                  onChange={e => setNewItem(e.target.value)}></input>
                <button
                  onClick={() => addNewItem(newItem)}
                  className='btn btn-primary'>{buttonText()}</button>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
