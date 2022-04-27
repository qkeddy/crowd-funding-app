const newFormHandler = async (event) => {
  event.preventDefault();

  const name = document.querySelector('#project-name').value.trim();
  const needed_funding = document.querySelector('#project-funding').value.trim();
  const description = document.querySelector('#project-desc').value.trim();

  // If the fields are filled out then proceed
  if (name && needed_funding && description) {
    const response = await fetch(`/api/projects`, {
      method: 'POST',
      // Keys match the values, so they do not need to reference the key:value pairs
      body: JSON.stringify({ name, needed_funding, description }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      
      // if successful, refresh the profile page
      // TODO Question - is this referencing a Handlebars template? 
      document.location.replace('/profile');
    } else {
      alert('Failed to create project');
    }
  }
};

const delButtonHandler = async (event) => {
  if (event.target.hasAttribute('data-id')) {
    
    // Based upon data-id attribute, delete it
    // TODO - what is special about "data-"
    const id = event.target.getAttribute('data-id');

    // Delete via the API route
    const response = await fetch(`/api/projects/${id}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      document.location.replace('/profile');
    } else {
      alert('Failed to delete project');
    }
  }
};

document
  .querySelector('.new-project-form')
  .addEventListener('submit', newFormHandler);

document
  .querySelector('.project-list')
  .addEventListener('click', delButtonHandler);
