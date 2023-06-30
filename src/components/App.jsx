import React, { useState, useEffect } from 'react';
import { debounce } from 'lodash';
import { nanoid } from 'nanoid';
import ContactForm from './ContactForm';
import Filter from './Filter';
import ContactList from './ContactList';
import css from './App.module.css';

const App = () => {
  const [contacts, setContacts] = useState(() => {
    const savedContacts = localStorage.getItem('contacts');
    return savedContacts ? JSON.parse(savedContacts) : [];
  });
  const [filter, setFilter] = useState('');

  useEffect(() => {
    localStorage.setItem('contacts', JSON.stringify(contacts));
  }, [contacts]);

  const addContact = (inputData) => {
    const { name, number } = inputData;
    if (!isContactPresent(name, number)) {
      const id = nanoid();
      const newContact = { id, ...inputData };
      setContacts((prevContacts) => [...prevContacts, newContact].sort());
    } else {
      alert(`${name} is already in the contacts`);
    }
  };

  const isContactPresent = (name, number) => {
    return contacts.some(
      (contact) =>
        contact.name.toLowerCase() === name.toLowerCase() ||
        contact.number === number
    );
  };

  const deleteContact = (id) => {
    setContacts((prevContacts) =>
      prevContacts.filter((contact) => contact.id !== id)
    );
  };

  const filterContacts = (contacts, filter) => {
    if (filter === '') {
      return contacts;
    }

    return contacts.filter((contact) =>
      contact.name.toLowerCase().includes(filter.toLowerCase())
    );
  };

  const onChangeFilterInput = debounce((event) => {
    setFilter(event.target.value.trim().toLowerCase());
  }, 300);

  const renderingContacts = filterContacts(contacts, filter);
  const noContactsMessage = 'There are no contacts in the contact list';
  const noFilteredContactsMessage = 'No contacts were found for your request';

  return (
    <div className={css.app}>
      <h1>Phonebook</h1>
      <ContactForm onSubmit={addContact} />
      <section className={css.contacts}>
        <h2>Contacts</h2>
        <Filter inputValue={filter} onChange={onChangeFilterInput} />
        {contacts.length === 0 ? (
          <p>{noContactsMessage}</p>
        ) : renderingContacts.length === 0 ? (
          <p>{noFilteredContactsMessage}</p>
        ) : null}
        <ContactList
          contacts={renderingContacts}
          onBtnClick={deleteContact}
        />
      </section>
    </div>
  );
};

export default App;
